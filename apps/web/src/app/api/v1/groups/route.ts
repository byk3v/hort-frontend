import { authHeaders } from "../../_lib/authHeaders";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:4000";

export async function GET(req: Request) {
    const upstream = await fetch(`${BASE}/api/v1/groups`, {
        headers: authHeaders(req),
        cache: "no-store",
    });

    const body = await upstream.arrayBuffer();

    return new Response(body, {
        status: upstream.status,
        headers: {
            "content-type": upstream.headers.get("content-type") ?? "application/json",
        },
    });
}
