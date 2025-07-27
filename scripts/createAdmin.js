const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');

async function createAdminAccount() {
  // Try to read MONGODB_URI from .env.local
  let uri;
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const uriMatch = envFile.match(/MONGODB_URI=(.+)/);
    uri = uriMatch ? uriMatch[1] : null;
  } catch (error) {
    console.error('Could not read .env.local file');
  }

  if (!uri) {
    console.error('Please set MONGODB_URI in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin account already exists!');
      console.log('Email:', existingAdmin.email);
      return;
    }

    // Create admin account
    const hashedPassword = await bcrypt.hash('Admin@123!', 12);
    const adminUser = {
      email: 'admin@mernstack.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(adminUser);
    
    console.log('✅ Admin account created successfully!');
    console.log('📧 Email: admin@mernstack.com');
    console.log('🔑 Password: Admin@123!');
    console.log('🆔 User ID:', result.insertedId);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');

  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    await client.close();
  }
}

createAdminAccount();