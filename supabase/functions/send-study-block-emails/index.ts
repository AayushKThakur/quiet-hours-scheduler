import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { MongoClient } from "https://esm.sh/mongodb@5.4.0";

const mongoUri = Deno.env.get("MONGODB_URI") || "";
const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY") || "";
const fromEmail = "yourverifiedemail@example.com";

const mongoClient = new MongoClient();
await mongoClient.connect(mongoUri);

Deno.serve(async (req) => {
  try {
    const db = mongoClient.database("quiet-hours");
    const collection = db.collection("study_blocks");

    const now = new Date();
    const targetTime = new Date(now.getTime() + 10 * 60 * 1000);

    const blocks = await collection
      .find({
        start_time: { $gte: now.toISOString(), $lte: targetTime.toISOString() },
        emailed: { $ne: true },
      })
      .toArray();

    for (const block of blocks) {
      const emailSent = await sendEmail(block);
      if (emailSent) {
        await collection.updateOne(
          { _id: block._id },
          { $set: { emailed: true } }
        );
      }
    }
    return new Response("Emails processed", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to process emails", { status: 500 });
  }
});

async function sendEmail(block: any) {
  try {
    const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: block.user_email }],
            subject: "Reminder: Your Silent Study Block is starting soon",
          },
        ],
        from: { email: fromEmail },
        content: [
          {
            type: "text/plain",
            value: `Hello! Your silent study time block starts at ${block.start_time}. Get ready to focus!`,
          },
        ],
      }),
    });
    return resp.ok;
  } catch {
    return false;
  }
}
