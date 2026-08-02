import { authHeaders } from "../../_lib/authHeaders";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:4000";

function response(upstream: Response, body: ArrayBuffer) {
    return new Response(body, {
        status: upstream.status,
        headers: {
            "content-type": upstream.headers.get("content-type") ?? "application/json",
            ...(upstream.headers.get("location") ? { location: upstream.headers.get("location")! } : {}),
        },
    });
}

export async function GET(req: Request) {
    const upstream = await fetch(`${BASE}/api/v1/student-authorizations${new URL(req.url).search}`, {
        headers: authHeaders(req), cache: "no-store",
    });
    return response(upstream, await upstream.arrayBuffer());
}

export async function POST(req: Request) {
    const upstream = await fetch(`${BASE}/api/v1/student-authorizations`, {
        method: "POST", headers: authHeaders(req, { "content-type": "application/json" }), body: await req.text(),
    });
    return response(upstream, await upstream.arrayBuffer());
}
