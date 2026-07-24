# Autenticación

La web usa `keycloak-js` con `login-required` y PKCE S256.

## Flujo

1. El layout protegido monta `AuthProvider`.
2. El provider inicializa Keycloak.
3. Registra en `@kubuci-hort/http` una función que entrega el access token.
4. Renueva el token si expira en menos de 30 segundos.
5. El cliente envía el bearer token al Route Handler de Next.js.
6. El handler conserva el header al reenviar la petición al backend.

El provider expone nombre de usuario y logout. Mientras se inicializa, el árbol
protegido no se renderiza.

## Configuración

```text
NEXT_PUBLIC_KEYCLOAK_URL
NEXT_PUBLIC_KEYCLOAK_REALM
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
```

## Pendientes observados

- Mobile necesitará un flujo compatible con navegación nativa.
- No existe una vista específica de recuperación ante fallos de inicio.
- `checkLoginIframe` está desactivado.
- La navegación actual no expresa autorización por roles.

Véase [`ADR-005`](../decisions/adr-005-use-keycloak-for-web-authentication.md).
