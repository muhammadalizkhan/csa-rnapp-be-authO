const express = require('express');
const { getAccessToken } = require('./authService');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/token', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get access token' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});