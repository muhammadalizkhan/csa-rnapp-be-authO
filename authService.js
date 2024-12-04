const axios = require('axios');
const { getAccessToken } = require('./authService');

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_API_TOKEN = process.env.AUTH0_API_TOKEN;

let verificationCodes = {}; // In-memory storage for verification codes (For demo purposes, use a DB in production)

// Generate a verification code
const generateVerificationCode = (email) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[email] = code;
  console.log(`Generated code for ${email}: ${code}`);
  return code;
};

// Verify the code
const verifyCode = (email, code) => {
  if (verificationCodes[email] && verificationCodes[email] === code) {
    console.log('Code verification successful for', email);
    return true;
  } else {
    console.log('Code verification failed for', email);
    return false;
  }
};

// Reset password function that uses Auth0 API
const resetPasswordWithAuth0 = async (email) => {
  const accessToken = await getAccessToken();

  try {
    const response = await axios.post(
      `https://${AUTH0_DOMAIN}/api/v2/jobs/verification-email`, 
      {
        user_id: email,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Password reset email sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw new Error('Unable to send password reset email.');
  }
};

module.exports = { resetPasswordWithAuth0, generateVerificationCode, verifyCode };
