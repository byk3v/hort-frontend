"use client";

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { setAccessTokenProvider } from "@kubuci-hort/http";
import type Keycloak from "keycloak-js";

type Props = {
    children: ReactNode;
};

type TokenParsed = {
    name?: string;
    given_name?: string;
    family_name?: string;
    preferred_username?: string;
    email?: string;
};

type AuthContextValue = {
    userName: string;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getUserName(tokenParsed?: TokenParsed) {
    if (!tokenParsed) return "Benutzer";

    const fullName = [tokenParsed.given_name, tokenParsed.family_name]
        .filter(Boolean)
        .join(" ");

    return tokenParsed.name
        || fullName
        || tokenParsed.preferred_username
        || tokenParsed.email
        || "Benutzer";
}

export function AuthProvider({ children }: Props) {
    const [ready, setReady] = useState(false);
    const [userName, setUserName] = useState("Benutzer");
    const initialized = useRef(false);
    const keycloakRef = useRef<Keycloak | null>(null);

    async function logout() {
        await keycloakRef.current?.logout({
            redirectUri: window.location.origin,
        });
    }

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        import("./keycloak").then(({ keycloak }) => {
            keycloakRef.current = keycloak;

            keycloak
                .init({
                    onLoad: "login-required",
                    checkLoginIframe: false,
                    pkceMethod: "S256",
                })
                .then((authenticated) => {
                    console.log("KEYCLOAK AUTHENTICATED:", authenticated);
                    console.log("TOKEN PARSED:", keycloak.tokenParsed);
                    setUserName(getUserName(keycloak.tokenParsed));

                    setAccessTokenProvider(async () => {
                        if (keycloak.isTokenExpired(30)) {
                            await keycloak.updateToken(30);
                        }

                        return keycloak.token;
                    });

                    setReady(true);
                })
                .catch((err) => {
                    console.error("KEYCLOAK INIT ERROR:", err);
                });
        });
    }, []);

    if (!ready) {
        return <div style={{ padding: 40, fontSize: 24 }}>Auth loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ userName, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
