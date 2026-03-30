type QueryParams = Record<string, string | number | boolean | undefined>;

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

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
    }

    // @ts-ignore
    return res.json();
}

export const api = {
    async get<T>(url: string, params?: QueryParams): Promise<T> {
        const res = await fetch(`${url}${buildQueryString(params)}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        });

        return handleResponse<T>(res);
    },

    async post<T>(url: string, body?: unknown): Promise<T> {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "content-type": "application/json",
            },
            body: JSON.stringify(body),
        });

        return handleResponse<T>(res);
    },
};