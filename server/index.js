const express = require('express');
const dotenv = require('dotenv');
const { v4: uuid } = require('uuid');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Enable CORS
app.use(cors());

const TOKENS_PATH = path.join(__dirname, 'tokens.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

const scopes = ['https://www.googleapis.com/auth/calendar'];

const { google } = require('googleapis');

// Load client secrets from a local file.
async function loadCredentials() {
    try {
        const content = await fs.readFile(CREDENTIALS_PATH);
        return JSON.parse(content);
    } catch (err) {
        console.error('Error loading client secret file:', err);
        throw err;
    }
}

let oauth2Client;

(async () => {
    const credentials = await loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.web;
    oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Load tokens if they exist
    const tokens = await loadTokens();
    if (tokens) {
        oauth2Client.setCredentials(tokens);
    }
})();

// Function to save tokens
async function saveTokens(tokens) {
    try {
        await fs.writeFile(TOKENS_PATH, JSON.stringify(tokens));
        console.log('Tokens stored to', TOKENS_PATH);
    } catch (err) {
        console.error('Error saving tokens:', err);
    }
}

// Function to load tokens
async function loadTokens() {
    try {
        const tokens = await fs.readFile(TOKENS_PATH);
        return JSON.parse(tokens);
    } catch (err) {
        console.error('Error loading tokens:', err);
        return null;
    }
}

// Function to check and refresh tokens if needed
async function ensureValidToken() {
    try {
        const tokens = await loadTokens();
        if (!tokens) {
            throw new Error('No tokens found');
        }

        oauth2Client.setCredentials(tokens);

        // Check if token is expired or will expire soon
        if (oauth2Client.isTokenExpiring()) {
            const { credentials } = await oauth2Client.refreshToken(tokens.refresh_token);
            await saveTokens(credentials);
            oauth2Client.setCredentials(credentials);
        }
    } catch (err) {
        console.error('Error ensuring valid token:', err);
        throw err;
    }
}

const calendar = google.calendar({ version: 'v3', auth: oauth2Client, debug: true });

app.get('/auth', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent' // Force to get refresh_token
    });
    res.redirect(url);
});


app.get("/auth/redirect", async (req, res) => {
    try {
        const { tokens } = await oauth2Client.getToken(req.query.code);
        oauth2Client.setCredentials(tokens);
        await saveTokens(tokens); // Make sure to save the tokens

        // Send HTML with auto-redirect
        res.send(`
            <html>
                <body>
                    <script>
                        setTimeout(() => {
                            window.location.href = 'http://localhost:5173/';
                        }, 2000); // Redirect after 2 seconds
                    </script>
                    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                        <div style="text-align: center;">
                            <h2>Authentication successful!</h2>
                            <p>Redirecting to calendar form...</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error in auth redirect:', error);
        res.status(500).send('Authentication failed');
    }
});