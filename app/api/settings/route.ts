import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5002").replace(/\/+$/, "");

// Reuse the same pattern you used in other proxies
function getBearerFromReq(req: NextRequest): string | null {
  // if a header is already present, use it
  const h = req.headers.get("authorization");
  if (h && h.trim()) return h.trim();

  // else synthesize from cookies
  const CANDIDATES = [
    "auth_token",
    "cms_token",
    "token",
    "admin_token",
    "adminToken",
    "access_token",
    "jwt",
  ];
  for (const k of CANDIDATES) {
    const v = req.cookies.get(k)?.value?.trim();
    if (v) return /^Bearer\s+/i.test(v) ? v : `Bearer ${v}`;
  }
  return null;
}

export async function GET() {
  try {
    const r = await fetch(`${BACKEND_URL}/api/settings`, {
      method: "GET",
      cache: "no-store",
      headers: { "content-type": "application/json" },
    });
    const text = await r.text();
    return new NextResponse(text, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (error) {
    console.error("API proxy /api/settings GET error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const bodyText = await req.text(); // keep as text to avoid double-parse
    const bearer = getBearerFromReq(req);

    const r = await fetch(`${BACKEND_URL}/api/settings`, {
      method: "PUT",
      // Backend expects Authorization, not cookies
      headers: {
        "content-type": "application/json",
        ...(bearer ? { authorization: bearer } : {}),
      },
      body: bodyText,
    });

    const text = await r.text();
    return new NextResponse(text, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (error) {
    console.error("API proxy /api/settings PUT error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
