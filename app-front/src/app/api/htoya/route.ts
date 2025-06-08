import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch("https://bashnya-web-app-production.up.railway.app/htoya/", {
      headers: {
        // Передаём cookie из запроса
        Cookie: req.headers.get("Cookie") || "",
      },
      credentials: "include",
    });

    if (!response.ok) throw new Error("Unauthorized");

    const userData = await response.json();
    return NextResponse.json(userData);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Authentication failed", error: error.message },
      { status: 401 }
    );
  }
}
