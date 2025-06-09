// путь: app-front/src/app/api/check-auth/route.tsx

import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(request: NextRequest) {
  try {
    // забираем заголовок с куками из входящего запроса
    const cookieHeader = request.headers.get("cookie") || "";

    // проксируем GET /htoya/
    const apiRes = await fetch(`${API}/htoya/`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
    });

    if (apiRes.ok) {
      const user = await apiRes.json();
      return NextResponse.json({ authenticated: true, user });
    } else {
      return NextResponse.json({ authenticated: false }, { status: apiRes.status });
    }
  } catch (e) {
    console.error("[/api/check-auth] proxy error:", e);
    return NextResponse.json({ authenticated: false, error: "proxy error" }, { status: 500 });
  }
}
