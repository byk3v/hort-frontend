"use client";

import { Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import type Keycloak from "keycloak-js";

let keycloakInitPromise: Promise<boolean> | undefined;

async function getInitializedKeycloak(): Promise<Keycloak> {
    const { default: keycloak } = await import("@/src/auth/keycloak");

    keycloakInitPromise ??= keycloak.init({
        checkLoginIframe: false,
        pkceMethod: "S256",
    });

    await keycloakInitPromise;

    return keycloak;
}

async function login() {
    const keycloak = await getInitializedKeycloak();

    await keycloak.login({
        redirectUri: `${window.location.origin}/dashboard`,
    });
}

export default function PublicHome() {
    return (
        <main className="public-home">
            <header className="public-home__nav">
                <div className="public-home__brand">HortApp</div>
                <Button type="primary" icon={<LoginOutlined />} onClick={login}>
                    Anmelden
                </Button>
            </header>

            <section className="public-home__hero">
                <div className="public-home__content">
                    <p className="public-home__eyebrow">Hort Verwaltung</p>
                    <h1>Ein ruhiger Einstieg fuer Familien und Betreuungsteams.</h1>
                    <p>
                        Informationen, Tagesablauf und wichtige Hinweise an einem Ort.
                        Der interne Verwaltungsbereich bleibt geschuetzt und ist nach dem
                        Login erreichbar.
                    </p>
                    <div className="public-home__actions">
                        <Button type="primary" size="large" icon={<LoginOutlined />} onClick={login}>
                            Zum Login
                        </Button>
                    </div>
                </div>

                <div className="public-home__panel" aria-label="Aktuelle Informationen">
                    <div>
                        <span>Heute</span>
                        <strong>Informationen fuer Eltern</strong>
                    </div>
                    <div>
                        <span>Betreuung</span>
                        <strong>Abholung, Gruppen und Berechtigungen</strong>
                    </div>
                    <div>
                        <span>Kontakt</span>
                        <strong>Schneller Zugriff auf wichtige Hinweise</strong>
                    </div>
                </div>
            </section>
        </main>
    );
}
