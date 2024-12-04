const axios = require('axios');

// Read the environment variables (make sure they are in .env file)
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

module.exports = async (req, res) => {
    try {
        // Make a POST request to Auth0 to get an access token
        const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
            client_id: AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            audience: `https://${AUTH0_DOMAIN}/api/v2/`,
            grant_type: 'client_credentials',
        });

        const accessToken = response.data.access_token;
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(500).json({ error: 'Unable to get access token' });
    }
};
