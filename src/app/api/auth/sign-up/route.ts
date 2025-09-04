import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

interface Admin {
  fullName: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export async function POST(req: NextRequest) {
  try {
    const { fullName, username, email, password }: Admin = await req.json();

    if (!fullName || !username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("trekdb");

    const adminCount = await db.collection("admins").countDocuments();
    if (adminCount >= 2) return NextResponse.json({ error: "There are already two admins" }, { status: 403 });

    if (await db.collection("admins").findOne({ username })) return NextResponse.json({ error: "Username is taken" }, { status: 409 });
    if (await db.collection("admins").findOne({ email })) return NextResponse.json({ error: "Email is registered" }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("admins").insertOne({ fullName, username, email, password: hashedPassword, createdAt: new Date() });

    return NextResponse.json({ message: "Admin registered successfully" }, { status: 201 });
  } catch (err) {
    console.error("❌ Sign-up error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
