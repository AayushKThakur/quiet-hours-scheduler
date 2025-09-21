Quiet Hours Scheduler

A Next.js 13 application to schedule silent study blocks with email reminders.

🔗 Live Demo: Quiet Hours Scheduler

✨ Features

🔐 User Authentication – Secure login and session management

📅 Add & View Silent Study Blocks – Plan distraction-free sessions

📧 Email Reminders – Sent 10 minutes before study blocks using SendGrid

🗄 Persistent Storage – Powered by MongoDB

⚙️ Setup

Clone the repo

git clone <repo_url>
cd quiet-hours-scheduler


Install dependencies

npm install


Create .env.local file with the following variables:

MONGODB_URI=<your_mongodb_uri>
SENDGRID_API_KEY=<your_sendgrid_api_key>
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>


Run locally

npm run dev


Open 👉 http://localhost:3000

🧪 Testing Email Reminders

Add a study block starting in ~8–10 minutes

Call the reminder API manually:

curl http://localhost:3000/api/sendReminderEmails


(or use Postman)

Check:

Server logs → confirmation of email send

Your inbox → reminder email

🚀 Deployment

Recommended: Vercel (or any Next.js-compatible platform)

Configure environment variables in platform settings

Schedule /api/sendReminderEmails via CRON job for automated reminders

📬 Contact

For questions or feedback, reach out: connecttoakt@gmail.com