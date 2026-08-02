export type StudentAuthorizationStatus = "ACTIVE" | "SCHEDULED" | "EXPIRED" | "REVOKED";
export type StudentAuthorizationKind = "PICKUP_RIGHT" | "SELF_DISMISSAL";

export type PermissionViewDto = {
    id: string;
    kind: StudentAuthorizationKind;
    student: { id: string; firstName: string; lastName: string; groupName: string | null };
    collector: { id: string; firstName: string; lastName: string; phone: string | null } | null;
    duration: "DAILY" | "PERMANENT";
    validFrom: string;
    validUntil: string | null;
    allowedFromTime: string | null;
    weeklyRules: { dayOfWeek: Weekday; allowedFromTime: string }[];
    status: StudentAuthorizationStatus;
};

export type Weekday = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";
