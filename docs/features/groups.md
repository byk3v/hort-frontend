# Groups

## Estado

Consulta inicial en web. No implementada en mobile.

## Objetivo

Permitir consultar y buscar los grupos disponibles.

## Actores

- Usuario autenticado.

## Flujo principal

1. El usuario abre Groups y la aplicación solicita todos los grupos.
2. Puede introducir un nombre y ejecutar la búsqueda.
3. La aplicación muestra ID y nombre en una tabla paginada y ordenable.

## Reglas observadas

- La búsqueda compara únicamente con el nombre e ignora mayúsculas/minúsculas.
- El filtrado se realiza en el navegador sobre la respuesta completa.
- La recarga limpia el filtro y vuelve a consultar.

## Integraciones

- `GET /api/groups`.
- `GroupDTO` de `@kubuci-hort/types`.
- Bearer token proporcionado por Keycloak.

## Implementación

- Página: `apps/web/src/app/(protected)/groups/page.tsx`.
- Feature: `apps/web/src/features/groups/`.
- Proxy: `apps/web/src/app/api/groups/route.ts`.
- Tipo: `packages/types/src/group.ts`.

## Pendiente

- Confirmar acceso por rol y operaciones de escritura.
- Llevar búsqueda/paginación al backend si crece el volumen.
- Implementación mobile.
