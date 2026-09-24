type QueryParams = Record<string, string | number | boolean | undefined>;
type HeaderMap = Record<string, string>;

export class HttpError extends Error {
    constructor(public readonly status: number, public readonly code?: string, public readonly detail?: string) {
        super(detail ?? `HTTP error ${status}`);
        this.name = "HttpError";
    }
}

let accessTokenProvider: (() => Promise<string | undefined>) | undefined;
const pendingGetRequests = new Map<string, Promise<unknown>>();

export function setAccessTokenProvider(provider: () => Promise<string | undefined>) {
    accessTokenProvider = provider;
}

function buildQueryString(params?: QueryParams) {
    if (!params) return "";

    const qs = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            qs.set(key, String(value));
        }
    });

    const query = qs.toString();
    return query ? `?${query}` : "";
}

async function buildHeaders(extra: HeaderMap = {}): Promise<HeaderMap> {
    const token = await accessTokenProvider?.();

    return {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

function getRequestKey(url: string, headers: HeaderMap) {
    return `${url}|${headers.Authorization ?? ""}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        const problem = contentType.includes("json")
            ? await res.json().catch(() => undefined) as {code?: string; detail?: string} | undefined
            : undefined;
        throw new HttpError(res.status, problem?.code, problem?.detail);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

export const api = {
    async get<T>(url: string, params?: QueryParams): Promise<T> {
        const fullUrl = `${url}${buildQueryString(params)}`;
        const headers = await buildHeaders();
        const key = getRequestKey(fullUrl, headers);
        const pending = pendingGetRequests.get(key);
        if (pending) return pending as Promise<T>;

        const request = fetch(fullUrl, {
            method: "GET",
            headers,
            cache: "no-store",
        })
            .then((res) => handleResponse<T>(res))
            .finally(() => pendingGetRequests.delete(key));

        pendingGetRequests.set(key, request);
        return request;
    },

    async post<T>(url: string, body?: unknown): Promise<T> {
        const res = await fetch(url, {
            method: "POST",
            headers: await buildHeaders({
                "content-type": "application/json",
            }),
            body: JSON.stringify(body),
        });

        return handleResponse<T>(res);
    },

    async put<T>(url: string, body?: unknown): Promise<T> {
        const res = await fetch(url, {
            method: "PUT",
            headers: await buildHeaders({ "content-type": "application/json" }),
            body: body === undefined ? undefined : JSON.stringify(body),
        });
        return handleResponse<T>(res);
    },
};
