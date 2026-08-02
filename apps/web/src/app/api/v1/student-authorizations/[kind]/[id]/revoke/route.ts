import { authHeaders } from "../../../../../_lib/authHeaders";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:4000";

export async function PUT(req: Request, context: { params: Promise<{ kind: string; id: string }> }) {
    const { kind, id } = await context.params;
    const upstream = await fetch(
        `${BASE}/api/v1/student-authorizations/${encodeURIComponent(kind)}/${encodeURIComponent(id)}/revoke`,
        { method: "PUT", headers: authHeaders(req) },
    );
    return new Response(await upstream.arrayBuffer(), {
        status: upstream.status,
        headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
}
