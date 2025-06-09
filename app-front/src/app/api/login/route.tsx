import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    // читаем email/password из тела
    const { email, password } = await request.json();

    // проксируем запрос к FastAPI
    const apiRes = await fetch(`${API}/auth/jwt/login`, {
      method: "POST",
      headers: {
        // FastAPI Users ждёт form-urlencoded
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password,
      }).toString(),
    });

    // вытаскиваем Set-Cookie, если он есть
    const setCookieHeader = apiRes.headers.get("set-cookie") ?? "";

    // Если бэк вернул 204 — отвечаем 204 без тела, с cookie
    if (apiRes.status === 204) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          // пробрасываем куку на клиент
          "set-cookie": setCookieHeader,
        },
      });
    }

    // Во всех остальных случаях бэк отдаёт JSON с ошибкой — пробрасываем его дальше
    const errorPayload = await apiRes.json();
    return NextResponse.json(errorPayload, {
      status: apiRes.status,
      headers: {
        "set-cookie": setCookieHeader,
      },
    });
  } catch (err) {
    console.error("🚨 [route.tsx] /api/login error:", err);
    return NextResponse.json(
      { error: "Login proxy internal error" },
      { status: 500 }
    );
  }
}