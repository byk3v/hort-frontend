export interface CollectorForOnboarding {
    firstName: string;
    lastName: string;
    address: string;
    phone?: string;
    validFrom: string | null;
    validUntil: string | null;
    type: "COLLECTOR";
    permissionType: "PERMANENT";
    mainCollector: boolean;
}

export interface StudentOnboardingRequest {
    student: {
        firstName: string;
        lastName: string;
        address: string;
        phone?: string;
    };
    groupId: number;
    collectors: CollectorForOnboarding[];
}