const axios = require('axios');
const { getAccessToken } = require('./authService');

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_API_TOKEN = process.env.AUTH0_API_TOKEN;

let verificationCodes = {};

const generateVerificationCode = (email) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expirationTime = Date.now() + 10 * 60 * 1000;
  verificationCodes[email] = { code, expirationTime };
  console.log(`Generated code for ${email}: ${code}`);
  return code;
};

const verifyCode = (email, code) => {
  const storedCode = verificationCodes[email];
  if (storedCode && storedCode.code === code && Date.now() < storedCode.expirationTime) {
    console.log('Code verification successful for', email);
    return true;
  } else {
    console.log('Code verification failed for', email);
    return false;
  }
};

const getUserIdByEmail = async (email) => {
  const accessToken = await getAccessToken();
  try {
    const response = await axios.get(
      `https://${AUTH0_DOMAIN}/api/v2/users-by-email`,
      {
        params: { email },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data[0]?.user_id;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Unable to fetch user details');
  }
};

const resetPasswordWithAuth0 = async (email) => {
  const userId = await getUserIdByEmail(email);
  const accessToken = await getAccessToken();

  try {
    const response = await axios.post(
      `https://${AUTH0_DOMAIN}/api/v2/tickets/password-change`,
      {
        user_id: userId,
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
