import { api } from "@kubuci-hort/http";
import type { CollectorDTO, PageResponse } from "@kubuci-hort/types";

export async function getCollectorPage(page = 0, size = 20, name?: string) {
    return api.get<PageResponse<CollectorDTO>>("/api/v1/collectors", {page, size, name});
}

export async function getCollectors() {
    return (await getCollectorPage(0, 100)).items;
}
