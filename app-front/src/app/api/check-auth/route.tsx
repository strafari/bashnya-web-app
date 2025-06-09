import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';  // чтобы за каждый запрос бралось свежее request.headers

export async function GET(request: NextRequest) {
  // 1) читаем переменную и чистим хвостовой /
  const raw = process.env.NEXT_PUBLIC_API_URL || '';
  const API = raw.replace(/\/$/, '');
  
  // 2) храним куки из запроса браузера
  const cookie = request.headers.get('cookie') || '';

  // 3) проксируем запрос на реальный бэк-энд
  const res = await fetch(`${API}/htoya/`, {
    method: 'GET',
    headers: { cookie },
    credentials: 'include',  // не помешает, хотя для серверных fetch это не так важно
  });

  if (res.ok) {
    const user = await res.json();
    return NextResponse.json({ authenticated: true, user });
  } else {
    return NextResponse.json({ authenticated: false }, { status: res.status });
  }
}
