# Essence Radio

A full-stack radio streaming platform with real-time audio streaming, chat functionality, and station management. Built with NestJS, React, and React Native.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system
- **Radio Stations**: Create, manage, and browse radio stations
- **Real-time Audio Streaming**: WebSocket-based audio streaming
- **Live Chat**: Real-time chat functionality for each station
- **Admin Dashboard**: Administrative panel for managing users and stations
- **Multi-platform**: Web and mobile (iOS/Android) support
- **User Stations**: Users can create and manage their own stations

## 📁 Project Structure

```
essense/
├── backend/          # NestJS backend API
├── web/              # React web application
└── mobile/          # React Native mobile application
```

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: MySQL with TypeORM
- **Authentication**: JWT (Passport.js)
- **WebSockets**: Socket.io for real-time communication
- **Language**: TypeScript

### Web Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **WebSockets**: Socket.io Client
- **Language**: TypeScript

### Mobile
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **WebSockets**: Socket.io Client
- **Storage**: AsyncStorage
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL (v8.0 or higher)
- For mobile development: Expo CLI

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd essense
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=essence_radio
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Create the MySQL database:

```sql
CREATE DATABASE essence_radio;
```

### 3. Web Setup

```bash
cd web
npm install
```

### 4. Mobile Setup

```bash
cd mobile
npm install
```

## 🚀 Running the Application

### Backend

```bash
cd backend
npm run start:dev
```

The backend server will start on `http://localhost:3000`

### Web Application

```bash
cd web
npm run dev
```

The web application will start on `http://localhost:5173`

### Mobile Application

```bash
cd mobile
npm start
```

This will start the Expo development server. You can then:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan the QR code with Expo Go app on your device

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (protected)

### Stations
- `GET /stations` - Get all stations
- `GET /stations/:id` - Get station by ID
- `POST /stations` - Create a new station (protected)
- `PUT /stations/:id` - Update station (protected)
- `DELETE /stations/:id` - Delete station (protected)

### Admin
- `GET /admin/users` - Get all users (admin only)
- `GET /admin/stations` - Get all stations (admin only)
- `DELETE /admin/users/:id` - Delete user (admin only)

### WebSocket Events

#### Streaming
- `join-stream` - Join a station's audio stream
- `leave-stream` - Leave a station's audio stream
- `audio-data` - Receive audio data

#### Chat
- `join-room` - Join a station's chat room
- `leave-room` - Leave a station's chat room
- `message` - Send a chat message
- `new-message` - Receive a new chat message

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. After logging in, include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🌐 Environment Variables

### Backend
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port
- `DB_USERNAME` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_DATABASE` - MySQL database name
- `JWT_SECRET` - Secret key for JWT tokens
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins

## 🧪 Development

### Backend Scripts
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Web Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Mobile Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web

## 📝 Database Schema

### Users
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password
- `role` - User role (user/admin)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### Stations
- `id` - Primary key
- `name` - Station name
- `description` - Station description
- `streamUrl` - Stream URL
- `ownerId` - Foreign key to User
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### Chat Messages
- `id` - Primary key
- `content` - Message content
- `userId` - Foreign key to User
- `stationId` - Foreign key to Station
- `createdAt` - Creation timestamp

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- React and React Native communities
- Expo for mobile development tools

