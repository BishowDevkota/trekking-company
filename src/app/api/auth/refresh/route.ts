import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";

interface RefreshPayload {
  id: string;
}

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const refreshToken = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("refreshToken="))
      ?.split("=")[1];

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    try {
      const decoded = verifyRefreshToken(refreshToken) as RefreshPayload;
      const newAccessToken = generateAccessToken({ id: decoded.id, role: "admin" });

      return NextResponse.json({ accessToken: newAccessToken });
    } catch {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 403 });
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error }, { status: 500 });
  }
}
