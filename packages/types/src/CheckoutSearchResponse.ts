export type CheckoutCollectorInfo = {
    collectorId: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    mainCollector: boolean;
    allowedFromTime: string | null; // "15:00:00"
    pickupRightId: string;
};

export type CheckoutStudentInfo = {
    studentId: string;
    firstName: string;
    lastName: string;
    groupName: string | null;
    canLeaveAloneToday: boolean;
    allowedToLeaveFromTime: string | null;
    selfDismissalId: string | null;
    checkedOutToday: boolean;
    allowedCollectors: CheckoutCollectorInfo[];
};

export type CheckoutSearchResponse = {
    students: CheckoutStudentInfo[];
};
