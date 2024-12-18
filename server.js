require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();

// Allow CORS from your domain
app.use(cors({
    origin: ['https://matanch2020.github.io', 'http://localhost:3000'],
    methods: ['POST', 'GET'],
    credentials: true
}));

app.use(express.json());

// הגדרות אימייל
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// הגדרות גוגל שיטס
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

// פונקציה להוספת שורה לגוגל שיטס
async function addToSheet(formData) {
    try {
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        
        await sheet.addRow({
            תאריך: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
            שם: formData.name,
            טלפון: formData.phone,
            אימייל: formData.email,
            הודעה: formData.message
        });
    } catch (error) {
        console.error('Google Sheets error:', error);
        throw error;
    }
}

// פונקציה לשליחת אימייל אישור
async function sendConfirmationEmail(formData) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: formData.email,
        subject: 'תודה על פנייתך - אורי הירט, מטפל בריברסינג',
        html: `
            <div dir="rtl">
                <h2>תודה על פנייתך!</h2>
                <p>שלום ${formData.name},</p>
                <p>קיבלתי את הודעתך ואחזור אליך בהקדם.</p>
                <p>בברכה,<br>אורי הירט<br>מטפל בריברסינג</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
}

// Basic health check endpoint
app.get('/', (req, res) => {
    res.send('Server is running');
});

// נקודת קצה לטיפול בטופס
app.post('/api/submit-form', async (req, res) => {
    try {
        const formData = req.body;
        console.log('Received form data:', formData);

        // הוספה לגיליון
        await addToSheet(formData);
        console.log('Added to sheet successfully');

        // שליחת אימייל
        await sendConfirmationEmail(formData);
        console.log('Sent confirmation email');

        // יצירת הודעת וואטסאפ
        const whatsappMessage = `*פנייה חדשה מדף הנחיתה*%0A%0A` +
            `*שם:* ${formData.name}%0A` +
            `*טלפון:* ${formData.phone}%0A` +
            `*אימייל:* ${formData.email}%0A` +
            `*הודעה:* ${formData.message}`;
        
        const phoneNumber = '972524517021';
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${whatsappMessage}`;

        res.json({ 
            success: true, 
            whatsappUrl: whatsappUrl 
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.' 
        });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
