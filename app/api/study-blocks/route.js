import clientPromise from "@/utils/mongodb";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { cookies }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const client = await clientPromise;
    const db = client.db("quiet-hours");
    const collection = db.collection("study_blocks");

    const blocks = await collection.find({ user_id: user.id }).toArray();
    return new Response(JSON.stringify(blocks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch blocks" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { cookies }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await request.json();
    const { start_time, end_time } = body;

    if (!start_time || !end_time) {
      return new Response(
        JSON.stringify({ error: "Missing start or end time" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("quiet-hours");
    const collection = db.collection("study_blocks");

    // Check for overlap - optional for now or implement later

    const newBlock = {
      user_id: user.id,
      start_time,
      end_time,
    };

    await collection.insertOne(newBlock);

    return new Response(JSON.stringify(newBlock), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to create block" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
