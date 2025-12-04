// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5002';

export async function GET() {
  return NextResponse.json({ ok: true, route: '/api/auth/login' });
}

export async function POST(req: NextRequest) {
  // Forward the body to backend
  const body = await req.json();

  const res = await fetch(`${BACKEND}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    // no credentials needed here; this is server→server
  });

  const contentType = res.headers.get('content-type') || '';

  // If backend failed, bubble it up
  if (!res.ok) {
    const err = contentType.includes('application/json')
      ? await res.json()
      : { message: await res.text() };
    return NextResponse.json(err, { status: res.status });
  }

  // Expect backend to return { success, data: { token, admin } }
  const json = await res.json();

  // If backend already sets cookies via Set-Cookie, we *could* forward them,
  // but simpler & reliable: set cookies here for the frontend origin (3000)
  const token = json?.data?.token as string | undefined;
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Login response missing token' },
      { status: 500 }
    );
  }

  const isProd = process.env.NODE_ENV === 'production';
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined; // optional for prod

  const response = NextResponse.json(json, { status: 200 });

  // Same token in two cookies: one for /cms, one for /
  response.cookies.set('cms_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/cms',
    domain: cookieDomain,
    maxAge: 24 * 60 * 60, // seconds
  });

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    domain: cookieDomain,
    maxAge: 24 * 60 * 60,
  });

  return response;
}
