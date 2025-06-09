import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiRoot = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  // Берём куки из пришедшего запроса
  const cookie = request.headers.get("cookie") || "";

  // Проксируем на свой бэкенд-эндоинт, где вы возвращаете current_user
  const res = await fetch(`${apiRoot}/htoya/`, {
    method: "GET",
    headers: { cookie },
    credentials: "include",
  });

  if (res.ok) {
    const user = await res.json();
    return NextResponse.json({ authenticated: true, user });
  } else {
    return NextResponse.json({ authenticated: false }, { status: res.status });
  }
}
