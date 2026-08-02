import { authHeaders } from "../../../_lib/authHeaders";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:4000";

export async function GET(req: Request) {
    const upstream = await fetch(`${BASE}/api/v1/attendance/present-students${new URL(req.url).search}`, {
        headers: authHeaders(req), cache: "no-store",
    });
    return new Response(await upstream.arrayBuffer(), {status: upstream.status,
        headers: {"content-type": upstream.headers.get("content-type") ?? "application/json"}});
}
