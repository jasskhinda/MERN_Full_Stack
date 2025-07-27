import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin account already exists',
        email: existingAdmin.email 
      });
    }

    // Create admin account
    const hashedPassword = await hash('Admin@123!', 12);
    const adminUser = {
      email: 'admin@mernstack.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(adminUser);
    
    return NextResponse.json({ 
      success: true,
      message: 'Admin account created successfully',
      email: 'admin@mernstack.com',
      password: 'Admin@123!',
      userId: result.insertedId
    });

  } catch (error) {
    console.error('Error creating admin account:', error);
    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    );
  }
}