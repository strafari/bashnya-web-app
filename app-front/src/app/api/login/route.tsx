import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    // Вытягиваем все входящие куки из запроса клиента
    const incomingCookies = request.headers.get("cookie") || "";

    // Проксируем запрос к FastAPI, передавая туда те же куки
    const apiRes = await fetch(`${API}/htoya/`, {
      method: "GET",
      headers: {
        cookie: incomingCookies,
      },
    });

    // Если бэк говорит 200 — возвращаем authenticated: true вместе с телом user
    if (apiRes.ok) {
      const user = await apiRes.json();
      return NextResponse.json(
        { authenticated: true, user },
        { status: 200 }
      );
    }

    // Во всех остальных случаях — unauthenticated
    return NextResponse.json(
      { authenticated: false },
      { status: apiRes.status }
    );
  } catch (err) {
    console.error(" [check-auth] proxy error:", err);
    return NextResponse.json(
      { authenticated: false, error: "Proxy internal error" },
      { status: 500 }
    );
  }
}