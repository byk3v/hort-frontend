"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { setAccessTokenProvider } from "@kubuci-hort/http";

type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Props) {
    const [ready, setReady] = useState(false);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        import("./keycloak").then(({ keycloak }) => {
            keycloak
                .init({
                    onLoad: "login-required",
                    checkLoginIframe: false,
                    pkceMethod: "S256",
                })
                .then((authenticated) => {
                    console.log("KEYCLOAK AUTHENTICATED:", authenticated);
                    console.log("TOKEN PARSED:", keycloak.tokenParsed);

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

    return <>{children}</>;
}