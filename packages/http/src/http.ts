type QueryParams = Record<string, string | number | boolean | undefined>;

let accessTokenProvider: (() => Promise<string | undefined>) | undefined;

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

async function buildHeaders(extra?: HeadersInit): Promise<HeadersInit> {
    const token = await accessTokenProvider?.();

    return {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

export const api = {
    async get<T>(url: string, params?: QueryParams): Promise<T> {
        const res = await fetch(`${url}${buildQueryString(params)}`, {
            method: "GET",
            headers: await buildHeaders(),
            cache: "no-store",
        });

        return handleResponse<T>(res);
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
