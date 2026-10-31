require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const RECIPIENT = process.env.CV_RECEIVER_EMAIL || 'mathibalu2006@gmail.com';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Dheehire Careers <onboarding@resend.dev>';

app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
app.use(express.static(__dirname, { index: 'index.html' }));
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtension = /\.(pdf|doc|docx)$/i.test(file.originalname);
    if (allowedTypes.includes(file.mimetype) && allowedExtension) return cb(null, true);
    cb(new Error('Please upload a PDF, DOC or DOCX CV.'));
  }
});

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

app.post('/api/apply', (req, res) => {
  upload.single('cv')(req, res, async (uploadError) => {
    if (uploadError) {
      const message = uploadError.code === 'LIMIT_FILE_SIZE'
        ? 'CV must be 5 MB or smaller.'
        : uploadError.message;
      return res.status(400).json({ message });
    }

    try {
      const fullName = clean(req.body.fullName, 100);
      const email = clean(req.body.email, 150);
      const phone = clean(req.body.phone, 20);
      const position = clean(req.body.position, 120);
      const message = clean(req.body.message, 1500);

      if (!fullName || !email || !phone || !position || !req.file) {
        return res.status(400).json({ message: 'Please complete all required fields and attach your CV.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
      }
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing.');
        return res.status(503).json({ message: 'The application service is not configured yet. Please try again later.' });
      }

      const safeFilename = path.basename(req.file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
      const emailPayload = {
        from: EMAIL_FROM,
        to: [RECIPIENT],
        reply_to: email,
        subject: `Job Application - ${position} - ${fullName}`,
        text: [
          'New job application received through the Dheehire website.',
          '',
          `Name: ${fullName}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          `Position: ${position}`,
          '',
          'Message:',
          message || 'Not provided',
          '',
          'Candidate CV is attached.'
        ].join('\n'),
        attachments: [{
          filename: safeFilename,
          content: req.file.buffer.toString('base64')
        }]
      };

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      const resendResult = await resendResponse.json().catch(() => ({}));
      if (!resendResponse.ok) {
        console.error('Resend email error:', resendResult);
        return res.status(502).json({
          message: 'Email delivery failed. Please check the email service setup and try again.'
        });
      }

      return res.status(200).json({ message: 'Application sent successfully.' });
    } catch (error) {
      console.error('Application email failed:', error.message);
      return res.status(500).json({ message: 'We could not send your application. Please try again later.' });
    }
  });
});

app.listen(PORT, () => console.log(`Dheehire website running on port ${PORT}`));
