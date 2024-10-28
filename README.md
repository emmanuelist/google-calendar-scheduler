# Calendar Event Scheduler

A full-stack application that enables users to create and schedule Google Calendar events with Google Meet integration. Built with React, Express.js, and the Google Calendar API.

![Calendar_Event_Form](https://github.com/user-attachments/assets/b680fc07-37b0-4a58-8856-5eef529ceee0)

## Features

- 🗓️ Create calendar events with detailed information
- 🤝 Automatically generate Google Meet links for events
- 👥 Add multiple attendees with email notifications
- 🌍 Support for multiple timezones
- 🔄 Real-time form validation
- 📱 Responsive design with Tailwind CSS
- 🔐 Secure OAuth2 authentication with Google

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Lucide React (for icons)
- ShadcnUI components

### Backend

- Node.js
- Express.js
- Google Calendar API
- OAuth2 authentication

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or higher)
- npm or yarn
- Google Cloud Console account with Calendar API enabled

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Configure the OAuth consent screen
5. Create OAuth 2.0 credentials (Web application)
6. Add authorized redirect URIs:
   - `http://localhost:8000/auth/redirect`
   - `http://localhost:5173` (for Vite development server)
7. Download the credentials JSON file

### 2. Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/emmanuelist/google-calendar-scheduler.git
cd google-calendar-scheduler
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Create a `.env` file in the server directory:

```env
PORT=8000
```

4. Place your Google credentials:

- Rename your downloaded credentials file to `credentials.json`
- Place it in the server root directory

### 3. Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install required shadcn/ui components:

```bash
npx shadcn-ui@latest add alert
```

## Running the Application

1. Start the backend server:

```bash
cd server
npm start
```

2. In a new terminal, start the frontend development server:

```bash
cd frontend
npm run dev
```

3. Access the application at `http://localhost:5173`

## Usage

1. Open the application in your browser
2. Click the authentication button to connect with Google Calendar
3. Fill in the event details:
   - Event title
   - Location
   - Description
   - Start date and time
   - End date and time
   - Timezone
   - Attendee email addresses
4. Submit the form to create the event
5. A Google Meet link will be automatically generated and included in the event

## API Endpoints

### Authentication

- `GET /auth` - Initiates Google OAuth2 authentication
- `GET /auth/redirect` - OAuth2 callback URL
- `GET /auth/status` - Check authentication status

### Events

- `GET /create-event` - Create a new calendar event
  - Query Parameters:
    - `summary` - Event title
    - `location` - Event location
    - `description` - Event description
    - `startDateTime` - Start time (ISO format)
    - `endDateTime` - End time (ISO format)
    - `timeZone` - Timezone string
    - `attendees` - JSON string of email addresses

## Security Considerations

- OAuth2 authentication with refresh token support
- Automatic token refresh handling
- Secure storage of credentials
- CORS enabled for development
- Input validation on both frontend and backend

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Calendar API documentation
- Tailwind CSS team
- Shadcn UI component library
- Lucide React icons

## Support

For support, please open an issue in the repository or contact the maintainers.

## Roadmap

- [ ] Add recurring event support
- [ ] Implement event modification
- [ ] Add calendar view
- [ ] Support for multiple calendar selection
- [ ] Enhanced notification options
- [ ] Calendar availability checking
