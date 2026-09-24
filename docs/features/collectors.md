# Collectors

## Estado

Consulta funcional en web sobre `/api/v1/collectors`. Mobile permanece como
template.

## Objetivo

Consultar las personas autorizadas para recoger estudiantes.

## Actores

- `HORT_ADMIN` y `ASSISTANT` consultan collectors.
- `HORT_ADMIN` mantiene collectors cuando la UI exponga mutaciones.

## Flujo principal

1. El usuario abre Collectors y se solicita una página de registros.
2. Puede buscar por nombre.
3. La tabla muestra nombre completo, dirección y teléfono.

## Reglas observadas

- El filtro se envía al backend.
- La lista está paginada en backend.
- El cliente HTTP deduplica `GET` idénticos en vuelo, por lo que los remounts de
  desarrollo no deberían duplicar llamadas backend.

## Integraciones

- `GET /api/v1/collectors?page=...&size=...&name=...`.
- `CollectorDTO` de `@kubuci-hort/types`.
- Bearer token proporcionado por Keycloak.

## Implementación

- Página: `apps/web/src/app/(protected)/collectors/page.tsx`.
- Feature: `apps/web/src/features/collectors/`.
- Proxy: `apps/web/src/app/api/v1/collectors/route.ts`.
- Tipo: `packages/types/src/student.ts`.

## Pendiente

- Exponer altas, modificaciones y bajas en web cuando el producto lo requiera.
- Implementación mobile.
- Sustituir DTOs manuales cuando exista el cliente generado.
