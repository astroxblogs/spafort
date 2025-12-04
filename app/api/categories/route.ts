import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5002").replace(/\/+$/, "");

// ----- helpers -----
function getBearerFromReq(req: NextRequest): string | null {
  // If the client already sent Authorization, respect it
  const h = req.headers.get("authorization");
  if (h && h.trim()) return h.trim();

  // Otherwise synthesize from cookies
  const CANDIDATES = [
    "auth_token",
    "cms_token",
    "token",
    "access_token",
    "jwt",
    "admin_token",
    "adminToken",
  ];
  for (const k of CANDIDATES) {
    const v = req.cookies.get(k)?.value?.trim();
    if (v) return /^Bearer\s+/i.test(v) ? v : `Bearer ${v}`;
  }
  return null;
}

function jsonHeaders(req: NextRequest): Headers {
  const h = new Headers();
  h.set("content-type", "application/json");
  const bearer = getBearerFromReq(req);
  if (bearer) h.set("authorization", bearer);
  return h;
}

function getIdFromRequest(req: NextRequest): string | null {
  const url = new URL(req.url);
  // prefer ?id=...
  const qid = url.searchParams.get("id");
  if (qid && qid !== "categories") return qid.trim();

  // fallback: /api/categories/<id>
  const last = url.pathname.split("/").filter(Boolean).pop();
  if (last && last !== "categories") return last.trim();

  return null;
}

// ----- routes -----
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/categories`, {
      method: "GET",
      headers: { "content-type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("API proxy GET /categories error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/api/categories`, {
      method: "POST",
      headers: jsonHeaders(request), // <-- inject Authorization
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("API proxy POST /categories error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body?._id || getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ success: false, message: "Category id is required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
      method: "PUT",
      headers: jsonHeaders(request), // <-- inject Authorization
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("API proxy PUT /categories error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ success: false, message: "Category id is required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
      method: "DELETE",
      headers: jsonHeaders(request), // <-- inject Authorization
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("API proxy DELETE /categories error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
