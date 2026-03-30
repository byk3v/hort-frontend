import { api } from "@kubuci-hort/http";
import {CollectorDTO} from "@kubuci-hort/types";

export async function getCollectors() {
    return await api.get<CollectorDTO[]>("/api/collectors");
}