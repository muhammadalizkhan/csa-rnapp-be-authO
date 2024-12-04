const axios = require('axios');

const getAccessToken = async () => {
  try {
    console.log("Sending request to Auth0...");
    const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    });

    console.log("Response from Auth0:", response.data);
    const accessToken = response.data.access_token;
    console.log('Access Token:', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error obtaining access token:', error);
    throw new Error('Unable to get access token');
  }
};

module.exports = { getAccessToken };