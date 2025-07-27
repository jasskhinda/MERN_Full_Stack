# MERN Full-Stack Application

A comprehensive full-stack web application built with MongoDB, Express.js (replaced by Next.js), React, and Node.js. This project demonstrates modern web development practices including authentication, authorization, and admin functionality.

## Team Members
- Jaspal Singh
- Paramjit Singh

## Features

- **User Authentication**: Email/password registration and login
- **OAuth Integration**: Google Sign-In support
- **Session Management**: Secure JWT-based sessions with NextAuth.js
- **Password Security**: bcrypt hashing for password storage
- **Password Recovery**: Token-based password reset functionality
- **Role-Based Access Control**: User and Admin roles with middleware protection
- **Admin Dashboard**: User management interface for administrators
- **Audit Logging**: Track administrative actions for security and compliance
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **TypeScript**: Full type safety across the application
- **AI Stock Predictor**: Neural network-based stock price prediction using Brain.js (Assignment 4 Integration)

## Tech Stack

- **Frontend**: React 18, Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (replacing Express.js)
- **Database**: MongoDB with native driver
- **Authentication**: NextAuth.js with Credentials and Google providers
- **AI/ML**: Brain.js for neural network predictions
- **Data Visualization**: Chart.js with react-chartjs-2
- **Deployment**: Ready for Vercel or similar platforms

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB instance
- Google OAuth credentials (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env.local`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── dashboard/         # Protected user dashboard
│   ├── login/             # Authentication pages
│   └── register/
├── components/            # Reusable React components
├── lib/                   # Utility functions and database connection
└── middleware.ts          # Authentication middleware
```

## Key Features Implementation

### Authentication Flow
- Users can register with email and password
- Passwords are hashed using bcrypt before storage
- Login supports both credentials and Google OAuth
- Sessions are managed with JWT tokens

### Authorization
- Middleware protects routes based on authentication status
- Admin routes require admin role verification
- Role changes are logged in audit trail

### Admin Features
- View all registered users
- Promote/demote user roles
- View audit logs of administrative actions
- Protection against removing last admin

### Stock Predictor (Assignment 4)
- AI-powered stock price predictions using Brain.js neural network
- Interactive data visualization with Chart.js
- Customizable training parameters
- Support for custom stock data upload (JSON format)
- 10-day price forecast with trend analysis
- Real-time training progress visualization

## Security Features

- Password hashing with bcrypt (12 rounds)
- Environment variable protection
- CSRF protection via NextAuth
- Secure session cookies
- Role-based middleware protection
- Audit logging for accountability

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  role: "user" | "admin",
  oauthProvider?: string,
  createdAt: Date
}
```

### Audit Logs Collection
```javascript
{
  _id: ObjectId,
  timestamp: Date,
  actorId: ObjectId,
  targetUserId: ObjectId,
  action: string,
  details: object
}
```

## Development Notes

This application was developed as part of an in-class assignment to demonstrate proficiency in full-stack JavaScript development. The implementation follows industry best practices and modern architectural patterns.

### Deployment Fixed
All TypeScript and ESLint errors have been resolved for successful Vercel deployment.