import {api} from "@kubuci-hort/http";
import type {
    AttendanceCheckout, AttendanceSession, AttendanceStudent, CheckoutCollectorInfo,
    CheckoutStudentInfo, PageResponse,
} from "@kubuci-hort/types";

export function getCheckInCandidates(q = "", page = 0, size = 20) {
    return api.get<PageResponse<AttendanceStudent>>("/api/v1/attendance/check-in-candidates", {q, page, size});
}

export function registerCheckIn(studentId: string, comment?: string) {
    return api.post<AttendanceSession>("/api/v1/attendance/check-ins", {studentId, comment: comment || null});
}

export function getPresentStudents(q = "", page = 0, size = 20) {
    return api.get<PageResponse<CheckoutStudentInfo>>("/api/v1/attendance/present-students", {q, page, size});
}

export function confirmCheckoutWithCollector(attendanceId: string, collector: CheckoutCollectorInfo) {
    return api.post<AttendanceCheckout>("/api/v1/attendance/check-outs", {
        attendanceId, method: "PICKUP", collectorId: collector.collectorId,
        pickupRightId: collector.pickupRightId, selfDismissalId: null, comment: null,
    });
}

export function confirmSelfDismissal(attendanceId: string, selfDismissalId: string) {
    return api.post<AttendanceCheckout>("/api/v1/attendance/check-outs", {
        attendanceId, method: "SELF_DISMISSAL", collectorId: null,
        pickupRightId: null, selfDismissalId, comment: null,
    });
}
