import { NextResponse } from "next/server";
import { authHeaders } from "../_lib/authHeaders";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:4000";

export async function GET(req: Request) {
    const upstream = await fetch(`${BASE}/api/groups`, {
        headers: authHeaders(req),
        cache: "no-store",
    });

    if (!upstream.ok) {
        return NextResponse.json({ message: "Upstream error" }, { status: upstream.status });
    }
    return NextResponse.json(await upstream.json());
}
