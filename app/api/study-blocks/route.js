import clientPromise from "@/utils/mongodb";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cookieConfig = {
      getAll: () => cookieStore.getAll().map((cookie) => cookie.value),
      setAll: (cookiesToSet) => {},
      get: (name) => {
        const cookie = cookieStore.get(name);
        return cookie?.value;
      },
      set: (name, value) => {},
      remove: (name) => {},
    };

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { cookies: cookieConfig }
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
    console.error("GET /api/study-blocks error:", e);
    return new Response(
      JSON.stringify({ error: "Failed to fetch blocks: " + (e.message || "") }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const cookieConfig = {
      getAll: () => cookieStore.getAll().map((cookie) => cookie.value),
      setAll: (cookiesToSet) => {},
      get: (name) => {
        const cookie = cookieStore.get(name);
        return cookie?.value;
      },
      set: (name, value) => {},
      remove: (name) => {},
    };

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { cookies: cookieConfig }
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

    const newBlock = {
      user_id: user.id,
      user_email: user.email,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      emailed: false,
    };

    await collection.insertOne(newBlock);

    return new Response(JSON.stringify(newBlock), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("POST /api/study-blocks error:", e);
    return new Response(
      JSON.stringify({ error: "Failed to create block: " + (e.message || "") }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
