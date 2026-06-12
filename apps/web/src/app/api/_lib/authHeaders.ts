export function authHeaders(req: Request, extra?: HeadersInit): HeadersInit {
    const authorization = req.headers.get("authorization");

    return {
        Accept: "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
        ...extra,
    };
}
