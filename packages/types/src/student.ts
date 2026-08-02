export interface CollectorDTO {
    id: string;
    firstName: string;
    lastName: string;
    address?: string;
    phone?: string;
    collectorType?: "COLLECTOR" | "STUDENT";
}

export interface StudentCollectorDTO extends CollectorDTO {
    collectorType: "COLLECTOR" | "STUDENT";
    pickupRightId: string;
    mainCollector: boolean;
}

export interface StudentDTO {
    id: string;
    firstName: string;
    lastName: string;
    address?: string;
    phone?: string;
    group: {
        id: string;
        name: string;
    };
    canLeaveAlone: boolean;
    collectors: StudentCollectorDTO[];
}

export interface PageResponse<T> {
    items: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
