type CollectorPermission = {
    permissionType: "PERMANENT" | "DAILY";
    validFrom: string | null;
    validUntil: string | null;
    mainCollector: boolean;
};

export type CollectorForOnboarding = CollectorPermission & (
    | {
        source: "EXISTING";
        existingCollectorId: string;
        newCollector?: never;
    }
    | {
        source: "NEW";
        existingCollectorId?: never;
        newCollector: {
            firstName: string;
            lastName: string;
            address?: string;
            phone?: string;
        };
    }
);

export interface StudentOnboardingRequest {
    student: {
        firstName: string;
        lastName: string;
        address?: string;
        phone?: string;
    };
    groupId: string;
    collectors: CollectorForOnboarding[];
}
