import { NextRequest, NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  // получаем JSON из тела
  const { email, password } = await request.json();

  // проксируем запрос к FastAPI
  const apiRes = await fetch(`${API}/auth/jwt/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",
    body: new URLSearchParams({ username: email, password }).toString(),
  });

  // Собираем ответ для клиента
  const nextRes = NextResponse.next({ status: apiRes.status });
  // перенаправляем Set-Cookie, если он есть
  const setCookie = apiRes.headers.get("set-cookie");
  if (setCookie) nextRes.headers.set("set-cookie", setCookie);

  return nextRes;
}
