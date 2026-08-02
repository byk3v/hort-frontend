import { api } from "@kubuci-hort/http";
import type { PageResponse, StudentDTO, StudentOnboardingRequest } from "@kubuci-hort/types";

export type GetStudentsParams = {
    name?: string;
    groupId?: string;
    page?: number;
    size?: number;
    sort?: "lastName,asc" | "lastName,desc" | "firstName,asc" | "firstName,desc";
};

export async function getStudents(params: GetStudentsParams = {}) {
    return api.get<PageResponse<StudentDTO>>("/api/v1/students", params);
}

export async function createStudentOnboarding(req: StudentOnboardingRequest) {
    return api.post<StudentDTO>("/api/v1/students", req);
}
