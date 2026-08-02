import {api} from"@kubuci-hort/http";
import {PermissionViewDto, NewPermissionRequest, PageResponse, StudentAuthorizationKind, StudentAuthorizationStatus} from "@kubuci-hort/types";

export async function fetchPermissions(status: StudentAuthorizationStatus | "ALL", page: number, size: number) {
    return api.get<PageResponse<PermissionViewDto>>("/api/v1/student-authorizations", {status, page, size});
}

export async function createNewPermission(req: NewPermissionRequest) {
    return api.post<PermissionViewDto>("/api/v1/student-authorizations", req);
}

export async function revokePermission(kind: StudentAuthorizationKind, id: string) {
    return api.put<void>(`/api/v1/student-authorizations/${kind}/${id}/revoke`);
}
