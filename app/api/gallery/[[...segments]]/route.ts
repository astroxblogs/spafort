import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5002").replace(/\/+$/, "");

// ---- auth helpers ----
function getBearerFromReq(req: NextRequest): string | null {
  const h = req.headers.get("authorization");
  if (h && h.trim()) return h.trim();

  const CANDIDATES = [
    "token",
    "auth_token",
    "access_token",
    "jwt",
    "admin_token",
    "adminToken",
    "cms_token",
    "cmsToken",
    "bbps_token",
  ];
  for (const k of CANDIDATES) {
    const v = req.cookies.get(k)?.value?.trim();
    if (v) return /^Bearer\s+/i.test(v) ? v : `Bearer ${v}`;
  }
  return null;
}

function forwardAuth(req: NextRequest): Headers {
  const h = new Headers();
  const bearer = getBearerFromReq(req);
  if (bearer) h.set("authorization", bearer);
  return h;
}

function jsonHeaders(req: NextRequest): Headers {
  const h = forwardAuth(req);
  h.set("content-type", "application/json");
  return h;
}

// ------------------ GET ------------------
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ segments?: string[] }> }   // <-- params is a Promise
) {
  const { segments = [] } = await ctx.params;         // <-- await it
  const url = new URL(req.url);
  const query = url.search;

  try {
    if (segments[0] === "admin") {
      const target = `${BACKEND_URL}/api/gallery/admin${query}`;
      const res = await fetch(target, {
        method: "GET",
        headers: forwardAuth(req),
        cache: "no-store",
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    if (segments[0] === "public") {
      const target = `${BACKEND_URL}/api/gallery/public${query}`;
      const res = await fetch(target, { method: "GET", cache: "no-store" });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    if (segments.length === 0) {
      const target = `${BACKEND_URL}/api/gallery${query}`;
      const res = await fetch(target, { method: "GET", cache: "no-store" });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("Gallery API GET proxy error:", err);
    return NextResponse.json({ success: false, message: "Proxy error" }, { status: 500 });
  }
}

// ------------------ POST ------------------
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ segments?: string[] }> }
) {
  const { segments = [] } = await ctx.params;

  try {
    if (segments.length === 0) {
      const body = await req.json();
      const target = `${BACKEND_URL}/api/gallery`;
      const res = await fetch(target, {
        method: "POST",
        headers: jsonHeaders(req),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("Gallery API POST proxy error:", err);
    return NextResponse.json({ success: false, message: "Proxy error" }, { status: 500 });
  }
}

// ------------------ PATCH ------------------
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ segments?: string[] }> }
) {
  const { segments = [] } = await ctx.params;

  try {
    if (segments[0] === "reorder") {
      const body = await req.json();
      const target = `${BACKEND_URL}/api/gallery/reorder`;
      const res = await fetch(target, {
        method: "PATCH",
        headers: jsonHeaders(req),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    if (segments.length === 1) {
      const id = segments[0]!;
      const body = await req.json();
      const target = `${BACKEND_URL}/api/gallery/${id}`;
      const res = await fetch(target, {
        method: "PATCH",
        headers: jsonHeaders(req),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("Gallery API PATCH proxy error:", err);
    return NextResponse.json({ success: false, message: "Proxy error" }, { status: 500 });
  }
}

// ------------------ DELETE ------------------
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ segments?: string[] }> }
) {
  const { segments = [] } = await ctx.params;

  try {
    if (segments.length === 1) {
      const id = segments[0]!;
      const target = `${BACKEND_URL}/api/gallery/${id}`;
      const res = await fetch(target, {
        method: "DELETE",
        headers: forwardAuth(req),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("Gallery API DELETE proxy error:", err);
    return NextResponse.json({ success: false, message: "Proxy error" }, { status: 500 });
  }
}
