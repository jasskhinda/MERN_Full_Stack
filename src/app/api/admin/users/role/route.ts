import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, newRole } = await req.json();

  if (!["admin", "user"].includes(newRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Prevent self-demotion
  if ((session.user as any).id === userId && newRole !== "admin") {
    return NextResponse.json(
      { error: "Admins cannot demote themselves" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db();

  // Check if this would remove the last admin
  const adminCount = await db
    .collection("users")
    .countDocuments({ role: "admin" });

  const targetUser = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  if (targetUser?.role === "admin" && newRole !== "admin" && adminCount === 1) {
    return NextResponse.json(
      { error: "Cannot demote the last remaining admin" },
      { status: 400 }
    );
  }

  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: newRole } }
  );

  // Log the audit event
  const { logAuditEvent } = await import("@/lib/audit");
  await logAuditEvent({
    actorId: (session.user as any).id,
    action: "UPDATE_ROLE",
    targetUserId: userId,
    details: {
      previousRole: targetUser?.role,
      newRole,
    },
  });

  return NextResponse.json({ success: true, role: newRole });
}