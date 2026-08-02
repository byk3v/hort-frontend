import { api } from "@kubuci-hort/http";
import type { CollectorDTO } from "@kubuci-hort/types";

export async function getCollectors() {
    return api.get<CollectorDTO[]>("/api/collectors");
}
