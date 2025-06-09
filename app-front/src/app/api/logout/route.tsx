// /app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_URL;
export async function POST(req: NextRequest) {
  const response = await fetch(`${API}/auth/jwt/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();
  const res = NextResponse.json(data, { status: response.status });

  // Clear the cookie
  res.cookies.set("access_token", "", { maxAge: 0 });

  return res;
}
