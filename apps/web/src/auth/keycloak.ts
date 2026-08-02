import Keycloak from "keycloak-js";
import type { KeycloakInitOptions } from "keycloak-js";

export const keycloak = new Keycloak({
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!,
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!,
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
});

let initialization: Promise<boolean> | undefined;

export function initializeKeycloak(options: KeycloakInitOptions) {
    initialization ??= keycloak.init(options);
    return initialization;
}

export default keycloak;
