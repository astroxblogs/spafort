import { NextRequest, NextResponse } from 'next/server';


export const dynamic = "force-dynamic";

function getBearerFromReq(req: NextRequest): string | null {
  const explicit = req.headers.get("authorization");
  if (explicit && explicit.trim()) return explicit.trim();

  // common cookie names you already use elsewhere
  const candidates = [
    "token",
    "auth_token",
    "access_token",
    "jwt",
    "admin_token",
    "adminToken",
    "cms_token",
    "cmsToken",
  ];
  for (const k of candidates) {
    const v = req.cookies.get(k)?.value?.trim();
    if (v) return /^Bearer\s+/i.test(v) ? v : `Bearer ${v}`;
  }
  return null;
}

function authHeaders(req: NextRequest): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  const bearer = getBearerFromReq(req);
  if (bearer) h.Authorization = bearer;
  // if your backend reads cookies too (session), forward them
  const ck = req.headers.get("cookie");
  if (ck) h.Cookie = ck;
  return h;
}



const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/article-categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/article-categories/${body._id}`, {
      method: 'PUT',
      headers: authHeaders(request),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // keep your current convention
    const response = await fetch(`${BACKEND_URL}/api/article-categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders(request),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/article-categories`, {
      method: 'POST',
      headers: authHeaders(request),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}