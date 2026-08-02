import { authHeaders } from "../../../_lib/authHeaders";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:4000";

export async function POST(req: Request) {
    const upstream = await fetch(`${BASE}/api/v1/attendance/check-outs`, {
        method: "POST", headers: authHeaders(req, {"content-type": "application/json"}), body: await req.text(),
    });
    return new Response(await upstream.arrayBuffer(), {status: upstream.status,
        headers: {"content-type": upstream.headers.get("content-type") ?? "application/json"}});
}
