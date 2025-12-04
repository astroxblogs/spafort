import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // ensure route is built in dev/prod

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '') || 'http://localhost:5002'

// Build Authorization from header if present, else from cookies
function getBearer(req: NextRequest): string | null {
  // 1) Already provided as a header?
  const h = req.headers.get('authorization')
  if (h && h.trim()) return h.trim()

  // 2) Otherwise synthesize from cookies (auth_token at Path=/, cms_token at /cms)
  const names = [
    'auth_token',   // root cookie we added on login
    'cms_token',
    'token',
    'admin_token',
    'adminToken',
    'access_token',
    'jwt',
  ]
  for (const n of names) {
    const v = req.cookies.get(n)?.value?.trim()
    if (v) return /^Bearer\s+/i.test(v) ? v : `Bearer ${v}`
  }
  return null
}

// Optional health check
export async function GET() {
  return NextResponse.json({ ok: true, route: '/api/upload' })
}

export async function POST(request: NextRequest) {
  try {
    // Read the incoming multipart form. Let fetch set the boundary automatically.
    const form = await request.formData()

    // Build Authorization header (from header or cookies)
    const bearer = getBearer(request)

    const resp = await fetch(`${BACKEND_URL}/api/upload/image`, {
      method: 'POST',
      headers: bearer ? { authorization: bearer } : undefined,
      body: form,
      // @ts-expect-error node streaming flag
      duplex: 'half',
    })

    const contentType = resp.headers.get('content-type') ?? 'application/json'
    const text = await resp.text()

    return new NextResponse(text, {
      status: resp.status,
      headers: { 'content-type': contentType },
    })
  } catch (err) {
    console.error('Proxy /api/upload error:', err)
    return NextResponse.json(
      { message: 'Gateway error while forwarding upload' },
      { status: 502 }
    )
  }
}
