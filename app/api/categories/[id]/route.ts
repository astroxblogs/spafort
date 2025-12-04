import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5002").replace(/\/+$/, "");

// auth helpers (same as your other proxies)
function getBearerFromReq(req: NextRequest): string | null {
  const h = req.headers.get("authorization");
  if (h && h.trim()) return h.trim();
  const CANDIDATES = ["auth_token","cms_token","token","access_token","jwt","admin_token","adminToken"];
  for (const k of CANDIDATES) {
    const v = req.cookies.get(k)?.value?.trim();
    if (v) return /^Bearer\s+/i.test(v) ? v : `Bearer ${v}`;
  }
  return null;
}
function jsonHeaders(req: NextRequest): Headers {
  const h = new Headers();
  h.set("content-type", "application/json");
  const b = getBearerFromReq(req);
  if (b) h.set("authorization", b);
  return h;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const r = await fetch(`${BACKEND_URL}/api/categories/${id}`, { method: "GET" });
  const t = await r.text();
  return new NextResponse(t, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json" } });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.text();
  const r = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: jsonHeaders(req),
    body,
  });
  const t = await r.text();
  return new NextResponse(t, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json" } });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const r = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
    method: "DELETE",
    headers: jsonHeaders(req),
  });
  const t = await r.text();
  return new NextResponse(t, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json" } });
}
