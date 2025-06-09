import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Проксируем запрос к FastAPI
    const apiRes = await fetch(`${API}/auth/jwt/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password }).toString(),
    });

    // Вытаскиваем из ответа только "name=value"
    const setCookieHeader = apiRes.headers.get("set-cookie") || "";
    const [pair] = setCookieHeader.split(";");
    const [cookieName, cookieValue] = pair.split("=");

    // Формируем свой ответ
    let res;
    if (apiRes.status === 204) {
      // Успешный логин — без тела
      res = NextResponse.json(null, { status: 204 });
    } else {
      // Ошибка логина — пробрасываем JSON-ответ FastAPI
      const errorPayload = await apiRes.json();
      res = NextResponse.json(errorPayload, { status: apiRes.status });
    }

    // Ставим куку уже на фронт-домен
    if (cookieName && cookieValue) {
      res.cookies.set({
        name: cookieName,
        value: cookieValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
      });
    }

    return res;
  } catch (err) {
    console.error("[route.tsx] /api/login error:", err);
    return NextResponse.json(
      { error: "Login proxy internal error" },
      { status: 500 }
    );
  }
}