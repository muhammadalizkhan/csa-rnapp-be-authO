const axios = require('axios');

const AUTH0_DOMAIN = 'dev-76hncaire75fhgh0.us.auth0.com';
const AUTH0_CLIENT_ID = 'Jrwq4h6pZbpWtXTjf6cxKpjAbhKSWZNk';
const AUTH0_CLIENT_SECRET = 'gKYEekmZaEaFyojy3yjEun2t8nuE9CZ_HDooo8vxEPjxj6yI7SLDVEre48ZAUh4R';

const getAccessToken = async () => {
    try {
        const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
            client_id: AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            audience: `https://${AUTH0_DOMAIN}/api/v2/`,
            grant_type: 'client_credentials',
        });

        const accessToken = response.data.access_token;
        console.log('Access Token:', accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error obtaining access token:', error);
        throw new Error('Unable to get access token');
    }
};

module.exports = { getAccessToken };
