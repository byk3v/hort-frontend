import type { StudentAuthorizationKind, Weekday } from "./PermissionViewDto";

export type NewPermissionRequest = {
    studentId: string;
    kind: StudentAuthorizationKind;
    duration: "DAILY" | "PERMANENT";
    validFrom: string;
    validUntil?: string | null;
    allowedFromTime?: string | null;
    collector?: {
        source: "NEW" | "EXISTING";
        existingCollectorId?: string;
        newCollector?: { firstName: string; lastName: string; address?: string; phone?: string };
    };
    weeklyRules?: { dayOfWeek: Weekday; allowedFromTime: string }[];
};
