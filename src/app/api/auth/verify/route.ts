import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

interface VerifyPayload {
  id: string;
  username: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    const { accessToken }: { accessToken?: string } = await req.json();

    if (!accessToken) return NextResponse.json({ valid: false, error: "No access token" }, { status: 401 });

    try {
      const decoded = verifyAccessToken(accessToken) as VerifyPayload;
      return NextResponse.json({ valid: true, user: decoded }, { status: 200 });
    } catch {
      return NextResponse.json({ valid: false, error: "Invalid or expired token" }, { status: 401 });
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ valid: false, error }, { status: 500 });
  }
}
