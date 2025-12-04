import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002';

function getBearerFromReq(req: NextRequest): string | null {
  const h = req.headers.get("authorization");
  if (h && h.trim()) return h.trim();
  const keys = ["token","auth_token","access_token","jwt","admin_token","adminToken","cms_token","cmsToken"];
  for (const k of keys) {
    const v = req.cookies.get(k)?.value?.trim();
    if (v) return /^Bearer\s+/i.test(v) ? v : `Bearer ${v}`;
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const bearer = getBearerFromReq(request);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (bearer) headers.Authorization = bearer;
    const ck = request.headers.get('cookie');
    if (ck) headers.Cookie = ck;

    const response = await fetch(`${BACKEND_URL}/api/article-categories/admin`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });


    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}