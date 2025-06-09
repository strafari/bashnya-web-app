import { NextRequest, NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const apiRes = await fetch(`${API}/auth/jwt/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include",
      body: new URLSearchParams({ username: email, password }).toString(),
    });

    const nextRes = NextResponse.next({ status: apiRes.status });
    const setCookie = apiRes.headers.get("set-cookie");
    if (setCookie) nextRes.headers.set("set-cookie", setCookie);

    return nextRes;
  } catch (err) {
    console.error("🚨 /api/login error:", err);
    return NextResponse.json(
      { error: "Login proxy internal error" },
      { status: 500 }
    );
  }
}
