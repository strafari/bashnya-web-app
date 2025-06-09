import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
const RAW = process.env.NEXT_PUBLIC_API_URL || "";
const API = RAW.endsWith("/") ? RAW.slice(0, -1) : RAW;

// Если ваш бэкенд-чек лежит именно на /htoya/, забиваем этот путь
const BACKEND_CHECK_PATH = "/htoya/";

export async function GET(request: NextRequest) {
  try {
    // Берём куки, которые пришли из браузера на фронт-домен
    const cookie = request.headers.get("cookie") || "";

    // Собираем точный URL, без двойных слэшей
    const url = API + BACKEND_CHECK_PATH;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        // прокидываем тот же cookie-заголовок
        cookie,
      },
    });

    if (res.ok) {
      const user = await res.json();
      return NextResponse.json({ authenticated: true, user });
    } else {
      return NextResponse.json({ authenticated: false }, { status: res.status });
    }
  } catch (err) {
    console.error("check-auth proxy error:", err);
    return NextResponse.json(
      { authenticated: false, error: "proxy failure" },
      { status: 500 }
    );
  }
}
