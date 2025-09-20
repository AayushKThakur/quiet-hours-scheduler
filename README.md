# Quiet Hours Scheduler

A Next.js 13 app to schedule silent study blocks with email reminders.

Features:

- User authentication
- Add/view silent study blocks
- Email reminders 10 minutes before start using SendGrid
- MongoDB for data persistence

Setup:

1. Install dependencies: npm install
2. Add .env.local with the following vars:
   - MONGODB_URI
   - SENDGRID_API_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Run app locally: npm run dev
4. Open http://localhost:3000 in browser

Testing email:

- Add study block starting ~8-10 minutes ahead
- Call GET /api/sendReminderEmails endpoint manually (Postman/curl)
- Check server logs for sending status
- Check your email inbox for reminder

Deployment:

- Deploy on Vercel or similar platform
- Setup environment vars on platform
- Schedule /api/sendReminderEmails runs via CRON for automated reminders

Contact:
For questions, email connecttoakt@gmail.com
