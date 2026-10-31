DHEEHIRE CONSULTANCY SERVICES WEBSITE
5-page website with CV upload and email delivery using Resend API.

WEBSITE PAGES
- index.html       Home
- about.html       About Us
- services.html    Services and recruitment search process
- expertise.html  Industries and domain expertise
- careers.html     CV application form and contact details

TECHNOLOGY
- HTML, CSS and browser JavaScript
- Node.js + Express backend
- Multer for receiving CV files in memory
- Resend API over HTTPS for sending CV email attachments

RUN LOCALLY
1. Install Node.js 18 or newer.
2. Extract this ZIP and open the folder in VS Code.
3. Open VS Code Terminal in this folder.
4. Run: npm install
5. Copy .env.example and rename the copy to .env.
6. Create a Resend account at https://resend.com and get an API key.
7. Put the API key in .env after RESEND_API_KEY= (do not share it).
8. Keep CV_RECEIVER_EMAIL=mathibalu2006@gmail.com unless you want another recipient.
9. Run: npm start
10. Open http://localhost:3000

IMPORTANT RESEND EMAIL SETUP
- This project defaults to Resend's onboarding sender:
  Dheehire Careers <onboarding@resend.dev>
- Resend's test sender is restricted: it can only send to the email address verified in your Resend account.
- To deliver applications to mathibalu2006@gmail.com, that recipient must be eligible/verified for Resend testing.
- For a public production website that accepts applications from anyone, add and verify a domain you own in Resend, then change EMAIL_FROM to an address on that verified domain, for example:
  EMAIL_FROM=Dheehire Careers <careers@your-verified-domain.com>
- Do not use a domain you do not own. Do not publish your API key or commit .env to GitHub.

DEPLOYMENT WITH GITHUB + RENDER
1. Create a GitHub repository.
2. Extract this ZIP and upload all files/folders inside it to the repository.
3. Confirm .env is NOT uploaded. The .gitignore file excludes it.
4. In Render, create a new Web Service and connect the GitHub repository.
5. Use these settings:
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
6. In Render > Environment, add:
   RESEND_API_KEY = your Resend API key
   CV_RECEIVER_EMAIL = mathibalu2006@gmail.com
   EMAIL_FROM = Dheehire Careers <onboarding@resend.dev>
7. For production delivery to arbitrary candidate/recruiter addresses, use a verified domain sender instead of onboarding@resend.dev.
8. Deploy. Open the Render URL and test with a small test CV. Check the recipient Inbox and Spam.

CV FORM
- Required: full name, email, phone, position and CV file.
- Accepted files: PDF, DOC, DOCX.
- Maximum file size: 5 MB.
- CV is attached to an email sent to CV_RECEIVER_EMAIL.
- Candidate email is used as Reply-To.
- Requests are rate-limited. Files are held in server memory for sending and are not saved to a public uploads folder or database.

SECURITY / PRIVACY
- Keep RESEND_API_KEY private.
- Never upload .env to GitHub.
- The CV is temporarily held in server memory for email delivery.
- Add a suitable privacy notice and retention policy before public launch.

TROUBLESHOOTING
- Do not open index.html directly and do not use Live Server for CV submission.
- Run npm start and open http://localhost:3000.
- If the form says the service is not configured, check RESEND_API_KEY in the hosting environment.
- If Resend rejects the recipient or sender, complete the recipient/domain verification steps in Resend.
