import { NextResponse } from "next/server";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:4000";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const authorization = req.headers.get("authorization");

    console.log("NEXT ROUTE AUTH:", authorization ? "TOKEN PRESENT" : "NO TOKEN");

    const qs = new URLSearchParams();

    const name = searchParams.get("name");
    const groupId = searchParams.get("groupId");

    if (name) qs.set("name", name);
    if (groupId) qs.set("groupId", groupId);

    const url = `${BASE}/api/students${qs.toString() ? `?${qs.toString()}` : ""}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
        cache: "no-store",
    });

    const text = await res.text();

    console.log("BACKEND STATUS:", res.status);
    console.log("BACKEND BODY:", text);

    return new NextResponse(text, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") ?? "application/json",
        },
    });
}