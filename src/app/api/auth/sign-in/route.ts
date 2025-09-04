import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

interface AdminUser {
  _id: string;
  username: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password }: { username: string; password: string } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("trekdb");

    const user = (await db.collection<AdminUser>("admins").findOne({ username })) ?? null;

    if (!user) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

    const accessToken = generateAccessToken({ id: user._id, username: user.username, role: "admin" });
    const refreshToken = generateRefreshToken({ id: user._id });

    const res = NextResponse.json({ message: "Signed in successfully", accessToken });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error("❌ Sign-in error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
