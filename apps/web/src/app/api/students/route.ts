import { NextResponse } from "next/server";
import { authHeaders } from "../_lib/authHeaders";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:4000";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const qs = new URLSearchParams();

    const name = searchParams.get("name");
    const groupId = searchParams.get("groupId");

    if (name) qs.set("name", name);
    if (groupId) qs.set("groupId", groupId);

    const url = `${BASE}/api/students${qs.toString() ? `?${qs.toString()}` : ""}`;

    const res = await fetch(url, {
        method: "GET",
        headers: authHeaders(req),
        cache: "no-store",
    });

    const text = await res.text();

    if (!text) {
        return NextResponse.json({}, { status: res.status });
    }

    return new NextResponse(text, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") ?? "application/json",
        },
    });
}

export async function POST(req: Request) {
    const body = await req.json();

    const res = await fetch(`${BASE}/api/students`, {
        method: "POST",
        headers: authHeaders(req, {
            "content-type": "application/json",
        }),
        body: JSON.stringify(body),
    });

    const text = await res.text();

    if (!text) {
        return NextResponse.json({}, { status: res.status });
    }

    return new NextResponse(text, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") ?? "application/json",
        },
    });
}
