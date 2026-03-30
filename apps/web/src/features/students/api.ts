import { api} from "@kubuci-hort/http";
import {StudentDTO, StudentOnboardingRequest} from "@kubuci-hort/types";

export type GetStudentsParams = { name?: string; groupId?: number };

export async function getStudents(params: GetStudentsParams = {}) {
    return await api.get<StudentDTO[]>("/api/students", params);
}

export async function createStudentOnboarding(req: StudentOnboardingRequest) {
    return await api.post("/api/students", req);
}