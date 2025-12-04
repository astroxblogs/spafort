import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002';

function authHeaders(req: NextRequest) {
  const h = new Headers();
  const auth = req.headers.get('authorization');
  if (auth) h.set('authorization', auth);
  const cookie = req.headers.get('cookie');
  if (cookie) h.set('cookie', cookie);
  h.set('content-type', 'application/json');
  return h;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    const res = await fetch(`${BACKEND_URL}/api/article-categories/${id}`, {
      method: 'GET',
      headers: authHeaders(req),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('ArticleCat [id] GET error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/article-categories/${id}`, {
      method: 'PUT',
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('ArticleCat [id] PUT error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    const res = await fetch(`${BACKEND_URL}/api/article-categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders(req),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('ArticleCat [id] DELETE error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
