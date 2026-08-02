export type AttendanceStudent = {
    id: string;
    firstName: string;
    lastName: string;
    groupName: string | null;
};

export type AttendanceSession = {
    id: string;
    student: AttendanceStudent;
    attendanceDate: string;
    checkedInAt: string;
    checkedInByUserId: string;
    checkInComment: string | null;
    checkedOutAt: string | null;
    status: "PRESENT" | "CHECKED_OUT";
};

export type CheckoutCollectorInfo = {
    collectorId: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    mainCollector: boolean;
    allowedFromTime: string | null;
    pickupRightId: string;
};

export type CheckoutStudentInfo = {
    attendanceId: string;
    student: AttendanceStudent;
    checkedInAt: string;
    canLeaveAloneNow: boolean;
    allowedToLeaveFromTime: string | null;
    selfDismissalId: string | null;
    allowedCollectors: CheckoutCollectorInfo[];
};

export type AttendanceCheckout = {
    id: string;
    attendanceId: string;
    studentId: string;
    method: "PICKUP" | "SELF_DISMISSAL";
    occurredAt: string;
    collectorId: string | null;
    pickupRightId: string | null;
    selfDismissalId: string | null;
    recordedByUserId: string;
    comment: string | null;
};
