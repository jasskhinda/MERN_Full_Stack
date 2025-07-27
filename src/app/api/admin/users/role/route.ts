import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Role changes are disabled - system maintains a single administrator
  return NextResponse.json(
    { error: "Role changes are not allowed. System maintains a single administrator." },
    { status: 403 }
  );
}