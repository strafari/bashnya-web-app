// путь: app-front/src/app/api/login/route.tsx

import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // проксируем запрос к FastAPI
    const apiRes = await fetch(`${API}/auth/jwt/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password,
      }).toString(),
    });

    // вытаскиваем из Set-Cookie только пару name=value
      const raw = apiRes.headers.get("set-cookie") || "";
      const [pair] = raw.split(";");
      let [name, value] = pair.split("=");
    // если значение в кавычках — убираем их
      if (value.startsWith('"') && value.endsWith('"')) {
       value = value.slice(1, -1);
      }

    // собираем ответ Next.js
    let res: NextResponse;
    if (apiRes.status === 204) {
      // успешный логин — просто 204
      res = new NextResponse(null, { status: 204 });
    } else {
      const err = await apiRes.json();
      res = NextResponse.json(err, { status: apiRes.status });
    }

    // теперь ставим свою куку на домен фронта
    if (name && value) {
      res.cookies.set({
        name,
        value,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
      });
    }

    return res;
  } catch (e) {
    console.error("[/api/login] proxy error:", e);
    return NextResponse.json({ error: "proxy error" }, { status: 500 });
  }
}
