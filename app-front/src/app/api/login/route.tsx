import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 1) Убираем слэш на конце, если есть
  const apiRoot = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  // 2) Берём тело из запроса фронта
  const body = await request.json();

  // 3) Проксируем запрос на FastAPI /auth/jwt/login
  const res = await fetch(`${apiRoot}/auth/jwt/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  // 4) Считываем JSON и Set-Cookie из бэка
  const data = await res.json();
  const cookie = res.headers.get("set-cookie");

  // 5) Формируем ответ фронту, форвардим Set-Cookie
  const response = NextResponse.json(data, { status: res.status });
  if (cookie) response.headers.set("set-cookie", cookie);
  return response;
}
