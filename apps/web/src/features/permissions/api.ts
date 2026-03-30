import {api} from"@kubuci-hort/http";
import {PermissionViewDto, NewPermissionRequest} from "@kubuci-hort/types";

export async function fetchPermissions(status: "ACTIVE" | "ALL" = "ACTIVE") {
    return await api.get<PermissionViewDto[]>("/api/permissions", {
        status,
    });
}

export async function createNewPermission(req: NewPermissionRequest) {
    return await api.post("/api/permissions", req);
}