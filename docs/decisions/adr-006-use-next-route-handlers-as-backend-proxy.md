# ADR-006: Usar Route Handlers de Next.js como proxy del backend

- Estado: Aceptada
- Fecha: 2026-07-22
- Tipo: Retrospectiva

## Contexto

Web consume una API configurada con `BACKEND_API_URL`. Las features necesitan
una interfaz estable del mismo origen y propagar el bearer token.

## Decisión

Las features llaman a `/api/*` en web. Los Route Handlers reenvían método,
parámetros, cuerpo y autorización al backend.

## Alternativas consideradas

- Llamar directamente al backend desde el navegador.
- Usar Server Actions para todas las operaciones.
- Generar un SDK dirigido a la API externa.

## Consecuencias

### Positivas

- Endpoints del mismo origen y ubicación del backend oculta por configuración.
- Punto central posible para adaptar respuestas y políticas.

### Negativas

- Código de proxy por endpoint y un salto de red adicional.
- Riesgo de divergencia; los errores ya se tratan de forma no uniforme.
- El token sigue llegando al navegador por la integración cliente de Keycloak.

## Referencias

- `apps/web/src/app/api/`
- `apps/web/src/app/api/_lib/authHeaders.ts`
- `apps/web/src/features/*/api.ts`
- [`../architecture/api-communication.md`](../architecture/api-communication.md)
