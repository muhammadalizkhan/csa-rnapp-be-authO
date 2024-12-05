const express = require('express');
const bodyParser = require('body-parser');
const { resetPasswordWithAuth0 } = require('./authService');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://139.135.46.150',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const port = process.env.PORT || 3000;

let verificationCodes = {};

const generateVerificationCode = (email) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = code;
    console.log(`Generated code for ${email}: ${code}`);
    return code;
};

app.post('/api/request-verification', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const code = generateVerificationCode(email);
    return res.json({ success: true, message: `Verification code sent to ${email}` });
});

app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'Email and code are required' });
    }
    if (verificationCodes[email] && verificationCodes[email] === code) {
        return res.json({ success: true });
    } else {
        return res.status(400).json({ success: false, error: 'Invalid verification code' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        const response = await resetPasswordWithAuth0(email);
        res.json({ message: 'Password reset email sent successfully', data: response });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send password reset email' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
