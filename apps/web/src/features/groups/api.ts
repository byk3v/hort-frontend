import { api } from "@kubuci-hort/http";
import type { GroupDTO } from "@kubuci-hort/types";

export async function getGroups() {
    return api.get<GroupDTO[]>("/api/v1/groups");
}
