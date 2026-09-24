# Permissions

## Estado

Consulta, alta y revocación funcionales en web sobre
`/api/v1/student-authorizations`. Mobile permanece como template.

## Objetivo

Administrar autorizaciones para recogida por un collector o salida autónoma.

## Actores

- Usuario autenticado con rol `HORT_ADMIN` o `ASSISTANT`.
- Estudiante.
- Collector, cuando aplica.

## Flujo de consulta

1. Por defecto se solicitan autorizaciones `ACTIVE`; se puede cambiar a `ALL` u
   otros estados soportados.
2. La tabla muestra estudiante, collector o salida autónoma, vigencia, estado y
   tipo.
3. Se puede revocar una autorización no revocada.

## Flujo de alta

1. Se busca y selecciona un estudiante mediante `/api/v1/students`.
2. Se elige autorización diaria (`DAILY`) o permanente (`PERMANENT`).
3. Se indica salida autónoma o recogida por collector.
4. Se configuran horario diario/semanal o datos del collector.
5. Se crea la autorización y se recarga la lista.

## Reglas observadas

- La búsqueda de estudiantes comienza con dos caracteres.
- Una autorización permanente de salida autónoma admite reglas semanales.
- Un pickup right puede usar un collector existente o crear uno inline.
- Los estados visibles son `ACTIVE`, `SCHEDULED`, `EXPIRED` y `REVOKED`.

## Integraciones

- `GET /api/v1/student-authorizations?status=...&page=...&size=...`.
- `POST /api/v1/student-authorizations`.
- `PUT /api/v1/student-authorizations/{kind}/{id}/revoke`.
- `GET /api/v1/students` para seleccionar estudiantes.
- `GET /api/v1/collectors` para seleccionar collectors existentes.
- `PermissionViewDto` y `NewPermissionRequest` son tipos manuales de migración
  en `@kubuci-hort/types`.

## Implementación

- Página: `apps/web/src/app/(protected)/permissions/page.tsx`.
- Feature: `apps/web/src/features/permissions/`.
- Proxy: `apps/web/src/app/api/v1/student-authorizations/`.
- Tipos: `packages/types/src/PermissionViewDto.ts` y `NewPermissionRequest.ts`.

## Pendiente

- Definir edición y eliminación si el producto las necesita; revocación ya está
  implementada.
- Implementación mobile.
- Sustituir DTOs manuales cuando exista el cliente generado.
