# Permissions

## Estado

Consulta y alta inicial en web. No implementada en mobile.

## Objetivo

Administrar autorizaciones para recogida por un collector o salida autónoma.

## Actores

- Usuario autenticado que administra autorizaciones.
- Estudiante.
- Collector, cuando aplica.

## Flujo de consulta

1. Por defecto se solicitan permisos `ACTIVE`; se puede cambiar a `ALL`.
2. La tabla muestra estudiante, collector o salida autónoma, vigencia, estado y tipo.
3. Existen filtros locales adicionales por estado y tipo.

## Flujo de alta

1. Se busca y selecciona un estudiante.
2. Se elige autorización diaria (`TAGES`) o permanente (`DAUER`).
3. Se indica salida autónoma o recogida por collector.
4. Se configuran horario diario/semanal o datos del collector.
5. Se crea el permiso y se recarga la lista.

## Reglas observadas

- La búsqueda comienza con dos caracteres y debounce de 300 ms.
- Una autorización diaria requiere fecha y termina a las 23:59:59.
- Sin hora diaria, la UI utiliza la hora actual.
- Una autorización permanente puede omitir inicio y fin; el backend decide el
  inicio por defecto y `validUntil` se envía como `null`.
- Un permiso de collector requiere nombre, apellido y dirección.
- La salida autónoma permanente admite horarios de lunes a viernes.

## Integraciones

- `GET /api/permissions?status=ACTIVE|ALL` y `POST /api/permissions`.
- Reutiliza `GET /api/checkout/search` para seleccionar estudiantes.
- `PermissionViewDto` y `NewPermissionRequest`.

## Implementación

- Página: `apps/web/src/app/(protected)/permissions/page.tsx`.
- Feature: `apps/web/src/features/permissions/`.
- Proxy: `apps/web/src/app/api/permissions/route.ts`.
- Tipos: `packages/types/src/PermissionViewDto.ts` y `NewPermissionRequest.ts`.

## Pendiente

- Confirmar la semántica de `TAGES` y `DAUER`.
- Definir edición, revocación y eliminación.
- Validar rangos también en backend.
- Desacoplar la selección de estudiantes del endpoint de checkout.
- Implementación mobile.
