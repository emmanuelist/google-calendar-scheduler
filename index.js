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

app.get('/create-event', async (req, res) => {
    const { startDateTime, endDateTime, timeZone } = req.query;

    if (!startDateTime || !endDateTime || !timeZone) {
        return res.status(400).send({
            status: 400,
            message: 'Missing required query parameters: startDateTime, endDateTime, timeZone'
        });
    }

    const event = {
        summary: 'Tech Talk with Emmanuel',
        location: 'Google Meet',
        description: "Demo event for Emmanuel's Blog Post.",
        start: {
            dateTime: startDateTime,
            timeZone: timeZone
        },
        end: {
            dateTime: endDateTime,
            timeZone: timeZone
        },
        colorId: 1,
        conferenceData: {
            createRequest: {
                requestId: uuid(),
            }
        },
        attendees: [
            { email: 'tweetsonly7@gmail.com' },
        ]
    };

    try {
        const result = await calendar.events.insert({
            calendarId: 'primary',
            auth: oauth2Client,
            conferenceDataVersion: 1,
            sendUpdates: 'all',
            resource: event
        });

        res.send({
            status: 200,
            message: 'Event created',
            link: result.data.hangoutLink
        });
    } catch (err) {
		console.log(err);
        res.status(500).send(err);
    }
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
