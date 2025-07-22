# MongoDB Setup Guide

## Local Development Setup

This application requires MongoDB to be running locally for signup/login functionality to work.

### macOS (Homebrew)

1. Install MongoDB Community Edition:
```bash
brew tap mongodb/brew
brew install mongodb-community
```

2. Start MongoDB service:
```bash
brew services start mongodb/brew/mongodb-community
```

3. Create your `.env.local` file with:
```
MONGODB_URI=mongodb://localhost:27017/fullstack-app
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production  
NEXTAUTH_URL=http://localhost:3000
```

### Alternative: MongoDB Atlas (Cloud)

If you prefer using a cloud database:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Get your connection string
4. Update `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fullstack-app?retryWrites=true&w=majority
```

## Verification

Test that MongoDB is working:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Should return: `{"success":true,"userId":"..."}`