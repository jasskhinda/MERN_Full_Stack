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

## Production Deployment (Vercel)

For your Vercel deployment to work, you **MUST** use MongoDB Atlas:

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a free cluster
   - Get your connection string

2. **Configure Vercel Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add these variables:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/fullstack-app
   NEXTAUTH_SECRET = your-secure-random-string-here
   NEXTAUTH_URL = https://mern-full-stack-puce.vercel.app
   ```

3. **Redeploy your application** after adding environment variables

## Verification

Test that MongoDB is working:

**Local:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Production:**
```bash
curl -X POST https://mern-full-stack-puce.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Should return: `{"success":true,"userId":"..."}`