import { authHeaders } from "../../_lib/authHeaders";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:4000";

function upstreamResponse(upstream: Response, body: ArrayBuffer) {
    return new Response(body, {
        status: upstream.status,
        headers: {
            "content-type": upstream.headers.get("content-type") ?? "application/json",
            ...(upstream.headers.get("location") ? { location: upstream.headers.get("location")! } : {}),
        },
    });
}

export async function GET(req: Request) {
    const query = new URL(req.url).search;
    const upstream = await fetch(`${BASE}/api/v1/students${query}`, {
        headers: authHeaders(req),
        cache: "no-store",
    });
    return upstreamResponse(upstream, await upstream.arrayBuffer());
}

export async function POST(req: Request) {
    const upstream = await fetch(`${BASE}/api/v1/students`, {
        method: "POST",
        headers: authHeaders(req, { "content-type": "application/json" }),
        body: await req.text(),
    });
    return upstreamResponse(upstream, await upstream.arrayBuffer());
}
