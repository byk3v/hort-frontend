import { api } from "@kubuci-hort/http";
import {GroupDTO} from "@kubuci-hort/types";

export async function getGroups() {
    return await api.get<GroupDTO[]>("/api/groups");
}