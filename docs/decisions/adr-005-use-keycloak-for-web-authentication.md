# ADR-005: Usar Keycloak para autenticación web

- Estado: Aceptada
- Fecha: 2026-07-22
- Tipo: Retrospectiva

## Contexto

Las rutas protegidas necesitan autenticar usuarios y el backend necesita un
access token renovable.

## Decisión

Usar `keycloak-js` con `login-required`, PKCE S256 y comprobación de iframe
desactivada. Renovar el token cuando queden menos de 30 segundos y entregarlo al
cliente HTTP mediante un proveedor configurable.

## Alternativas consideradas

- Autenticación y sesiones propias.
- Sesión gestionada solo en el servidor de Next.js.
- Otro proveedor OpenID Connect.

No consta una evaluación histórica detallada de alternativas.

## Consecuencias

### Positivas

- Identidad centralizada, estándares OIDC/OAuth y renovación transparente.
- PKCE protege el intercambio del código para el cliente público.

### Negativas

- El render protegido depende de inicialización cliente.
- Mobile necesita integración específica.
- Un fallo de Keycloak bloquea la app y aún no tiene recuperación dedicada.

## Referencias

- `apps/web/src/auth/keycloak.ts`
- `apps/web/src/auth/AuthProvider.tsx`
- `packages/http/src/http.ts`
- [`../architecture/authentication.md`](../architecture/authentication.md)
