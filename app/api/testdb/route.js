import clientPromise from "@/utils/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("quiet-hours");
    const collection = db.collection("study_blocks");
    const blocks = await collection.find({}).toArray();
    return new Response(JSON.stringify(blocks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Database connection failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
