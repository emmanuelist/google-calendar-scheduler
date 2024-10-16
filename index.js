const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const scopes = ['https://www.googleapis.com/auth/calendar'];

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URL
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

app.get('/auth', (req, res) => {
	const url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes
	});
	res.redirect(url);
});

app.get("/auth/redirect", async (req, res) => {
	const { tokens } = await oauth2Client.getToken(req.query.code);
	oauth2Client.setCredentials(tokens);
	res.send('Authentication successful! Please return to the console.');
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
