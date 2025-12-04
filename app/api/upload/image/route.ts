import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// e.g. http://localhost:5002
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "http://localhost:5002";

// Build Authorization from header if present, else from cookies
function getBearer(req: NextRequest): string | null {
  // 1) Already provided as a header?
  const h = req.headers.get("authorization");
  if (h && h.trim()) return h.trim();

  // 2) Otherwise synthesize from cookies (we set auth_token at Path=/)
  const names = [
    "auth_token",   // <— root-scoped cookie we just added on login
    "cms_token",
    "token",
    "admin_token",
    "adminToken",
    "access_token",
    "jwt",
  ];
  for (const n of names) {
    const v = req.cookies.get(n)?.value?.trim();
    if (v) return /^Bearer\s+/i.test(v) ? v : `Bearer ${v}`;
  }
  return null;
}

// Optional health check (so GET /api/upload/image gives a simple JSON)
export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/upload/image" });
}

export async function POST(req: NextRequest) {
  try {
    // Read multipart form from incoming request
    const form = await req.formData();

    // Build Authorization header
    const bearer = getBearer(req);

    const res = await fetch(`${BACKEND_URL}/api/upload/image`, {
      method: "POST",
      headers: bearer ? { authorization: bearer } : undefined,
      body: form, // DO NOT set content-type; let fetch set the boundary
      // @ts-expect-error Node streaming flag
      duplex: "half",
    });

    const contentType = res.headers.get("content-type") ?? "application/json";
    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    console.error("Proxy /api/upload/image error:", err);
    return NextResponse.json(
      { message: "Gateway error while forwarding upload" },
      { status: 502 }
    );
  }
}
