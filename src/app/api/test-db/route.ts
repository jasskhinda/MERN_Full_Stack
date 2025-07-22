import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("Testing MongoDB connection...");
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.log("MONGODB_URI preview:", process.env.MONGODB_URI?.substring(0, 50) + "...");
    
    const client = await clientPromise;
    console.log("MongoDB client created successfully");
    
    const db = client.db();
    console.log("Database reference obtained");
    
    // Test basic connection
    const adminDb = client.db().admin();
    const pingResult = await adminDb.ping();
    console.log("Ping successful:", pingResult);
    
    const collections = await db.listCollections().toArray();
    console.log("Collections found:", collections.length);
    
    return NextResponse.json({ 
      success: true,
      collections: collections.map(c => c.name),
      connectionString: process.env.MONGODB_URI?.substring(0, 50) + "...",
      ping: pingResult
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      mongoUriExists: !!process.env.MONGODB_URI,
      mongoUriPreview: process.env.MONGODB_URI?.substring(0, 30) + "..."
    }, { status: 500 });
  }
}