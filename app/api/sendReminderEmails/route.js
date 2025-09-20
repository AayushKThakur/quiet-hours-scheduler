export const runtime = "nodejs";

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = "connecttoakt@gmail.com"; // Your verified SendGrid sender email

const client = new MongoClient(uri);

async function sendEmail(to, startTime) {
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sendgridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: fromEmail },
      subject: "Reminder: Your Silent Study Block is starting soon",
      content: [
        {
          type: "text/plain",
          value: `Your silent study block starts at ${startTime}. Stay focused!`,
        },
      ],
    }),
  });

  const responseText = await res.text();
  console.log(`SendGrid response status: ${res.status}`);
  console.log(`SendGrid response body: ${responseText}`);

  return res.ok;
}

export async function GET() {
  try {
    await client.connect();
    const db = client.db("quiet-hours");
    const collection = db.collection("study_blocks");

    const now = new Date();
    const target = new Date(now.getTime() + 10 * 60 * 1000);

    const blocks = await collection
      .find({
        start_time: { $gte: now.toISOString(), $lte: target.toISOString() },
        emailed: false,
      })
      .toArray();

    console.log(`Found ${blocks.length} blocks to email.`);

    for (const block of blocks) {
      console.log(
        `Sending email for block ID: ${block._id} to ${block.user_email}`
      );
      const sent = await sendEmail(block.user_email, block.start_time);
      if (sent) {
        await collection.updateOne(
          { _id: block._id },
          { $set: { emailed: true } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        message: "Emails processed",
        emailsSent: blocks.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to send emails" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}
