# Collectors

## Estado

Consulta inicial en web. No implementada en mobile.

## Objetivo

Consultar las personas autorizadas para recoger estudiantes.

## Actores

- Usuario autenticado.

## Flujo principal

1. El usuario abre Collectors y se solicitan todos los registros.
2. Puede buscar por nombre.
3. La tabla muestra ID, nombre completo, dirección y teléfono.

## Reglas observadas

- El filtro solo compara con `firstName` e ignora mayúsculas/minúsculas.
- El filtrado se ejecuta en el cliente.
- La tabla permite ordenar por ID y nombre completo.

## Integraciones

- `GET /api/collectors`.
- `CollectorDTO` de `@kubuci-hort/types`.
- Bearer token proporcionado por Keycloak.

## Implementación

- Página: `apps/web/src/app/(protected)/collectors/page.tsx`.
- Feature: `apps/web/src/features/collectors/`.
- Proxy: `apps/web/src/app/api/collectors/route.ts`.
- Tipo: `packages/types/src/student.ts`.

## Pendiente

- Aclarar si la búsqueda incluye apellido, dirección o teléfono.
- Definir altas, modificaciones, bajas y paginación de backend.
- Implementación mobile.
