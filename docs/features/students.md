# Students

## Estado

Consulta y onboarding funcionales en web sobre `/api/v1/students`. Mobile
permanece como template.

## Objetivo

Consultar estudiantes y dar de alta un estudiante con sus collectors iniciales.

## Actores

- `HORT_ADMIN` consulta y registra estudiantes.
- `ASSISTANT` consulta estudiantes.

## Flujo de consulta

1. Se solicita la lista, opcionalmente filtrada por nombre e ID de grupo.
2. La tabla muestra nombre, grupo, dirección, teléfono y collectors.
3. La fila puede expandirse para mostrar los datos de sus collectors.

## Flujo de alta

1. Se introducen nombre, apellido, grupo, dirección y teléfono opcional.
2. Se registra al menos un collector nuevo o existente.
3. Exactamente un collector queda marcado como principal.
4. Se crea el onboarding y se refresca la tabla.

## Reglas observadas

- Los filtros, paginación y orden se envían al backend.
- El alta exige al menos un collector.
- La UI selecciona un grupo real mediante UUID.
- Los collectors iniciales crean autorizaciones `PERMANENT` por defecto.
- `validFrom` y `validUntil` se envían como `null` cuando no se especifican.

## Integraciones

- `GET /api/v1/students?name=...&groupId=...&page=...&size=...&sort=...`.
- `POST /api/v1/students`.
- `GET /api/v1/groups` para selección de grupo.
- `GET /api/v1/collectors` para selección de collector existente.
- `StudentDTO`, `CollectorDTO`, `GroupDTO` y `StudentOnboardingRequest`.

## Implementación

- Página: `apps/web/src/app/(protected)/students/page.tsx`.
- Feature: `apps/web/src/features/students/`.
- Proxy: `apps/web/src/app/api/v1/students/route.ts`.
- Tipos: `packages/types/src/student.ts` y `StudentOnboardingRequest.ts`.

## Pendiente

- Definir edición, baja y gestión posterior de collectors.
- Implementación mobile.
- Sustituir DTOs manuales cuando exista el cliente generado.
