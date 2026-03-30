import { api } from "@kubuci-hort/http";
import {CheckoutCollectorInfo, CheckoutSearchResponse} from "@kubuci-hort/types";

export async function searchStudentForCheckout(q: string) {
    return await api.get<CheckoutSearchResponse>("/api/checkout/search", {
        q,
    });
}

export async function confirmCheckoutWithCollector(
    studentId: number,
    collector: CheckoutCollectorInfo
) {
    await api.post("/api/checkout/confirm", {
        studentId,
        collectorId: collector.collectorId,
        pickupRightId: collector.pickupRightId,
        selfDismissal: false,
        comment: null,
    });
}

export async function confirmSelfDismissal(
    studentId: number
) {
    await api.post("/api/checkout/confirm", {
        studentId,
        collectorId: null,
        pickupRightId: null,
        selfDismissal: true,
        comment: null,
    });
}