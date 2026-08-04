import { api } from "@kubuci-hort/http";

export type CurrentUserDisplay = {
    userName: string;
    hortName: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export async function getCurrentUserDisplay(): Promise<CurrentUserDisplay> {
    const response = await api.get<unknown>("/api/v1/me");
    if (!isRecord(response) || typeof response.username !== "string"
        || !isRecord(response.hort) || typeof response.hort.name !== "string") {
        throw new Error("Invalid current-user response");
    }
    return {
        userName: response.username,
        hortName: response.hort.name,
    };
}
