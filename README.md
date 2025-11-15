# Social Chat App

A modern social messaging application built with **Flask (Python)** and **React**.

## Features

- **User Authentication**
  - Manual Sign Up & Login
  - Google OAuth
  - Facebook OAuth
  - Forgot Password Recovery

- **Home Screen**
  - Follow Section
  - Live Section
  - For You Section
  - Search Functionality

- **Messaging**
  - Direct Messages
  - Chat Rooms
  - Voice & Video Calls

- **User Profiles**
  - Profile Customization
  - User Statistics
  - Bio & Information

## Project Structure

```
social_chat_app/
├── backend/                 # Flask Python Backend
│   ├── app.py              # Main Flask Application
│   ├── firebase_config.py  # Firebase Configuration
│   ├── requirements.txt    # Python Dependencies
│   └── .env.example        # Environment Variables Template
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── pages/          # React Pages
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── ForgotPasswordPage.js
│   │   │   └── HomePage.js
│   │   ├── services/       # API Services
│   │   │   └── authService.js
│   │   ├── config/         # Configuration
│   │   │   └── firebase.js
│   │   └── App.js          # Main App Component
│   ├── package.json        # NPM Dependencies
│   └── public/
│       └── index.html      # HTML Entry Point
│
└── README.md               # This File
```

## Setup Instructions

### 1. Backend Setup (Flask)

#### Prerequisites
- Python 3.8+
- pip (Python Package Manager)

#### Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env with your Firebase credentials

# Run Flask server
python app.py
```

The backend will be available at: `http://localhost:5000`

### 2. Frontend Setup (React)

#### Prerequisites
- Node.js 14+
- npm (Node Package Manager)

#### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo REACT_APP_API_BASE_URL=http://localhost:5000/api > .env
echo REACT_APP_FIREBASE_API_KEY=your_key >> .env
echo REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain >> .env
echo REACT_APP_FIREBASE_PROJECT_ID=your_project >> .env
echo REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket >> .env
echo REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id >> .env
echo REACT_APP_FIREBASE_APP_ID=your_app_id >> .env

# Start development server
npm start
```

The frontend will be available at: `http://localhost:3000`

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password, Google, Facebook)
4. Download Service Account JSON from Project Settings
5. Add credentials to backend `.env` file
6. Add Web SDK config to frontend `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Reset password
- `POST /api/auth/google` - Google authentication
- `POST /api/auth/facebook` - Facebook authentication

## Environment Variables

### Backend (.env)
```
FLASK_ENV=development
FLASK_DEBUG=True
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project
FIREBASE_STORAGE_BUCKET=your_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
SERVER_HOST=0.0.0.0
SERVER_PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

## Technologies Used

### Backend
- **Flask** - Python Web Framework
- **Firebase Admin SDK** - Backend authentication & database
- **Flask-CORS** - Cross-Origin Resource Sharing
- **Python-dotenv** - Environment variables
- **Werkzeug** - WSGI utilities

### Frontend
- **React 18** - UI Library
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Firebase SDK** - Frontend authentication
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **React Icons** - Icon Library

## Features to Implement

- [ ] Complete Firebase integration
- [ ] Database schema for users, messages, rooms
- [ ] Real-time messaging with WebSockets
- [ ] Video/Audio call functionality
- [ ] File upload support
- [ ] User search & discovery
- [ ] Follow/Unfollow system
- [ ] Live streaming feature
- [ ] Payment integration
- [ ] Admin dashboard

## Contributing

Feel free to fork, modify, and use this project as a base for your own social application!

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository.

---

**Happy Coding! 🚀**
