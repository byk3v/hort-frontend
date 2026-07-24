# Students

## Estado

Consulta y onboarding inicial en web. No implementada en mobile.

## Objetivo

Consultar estudiantes y dar de alta un estudiante con sus collectors iniciales.

## Actores

- Usuario autenticado que consulta o registra estudiantes.

## Flujo de consulta

1. Se solicita la lista, opcionalmente filtrada por nombre e ID de grupo.
2. La tabla muestra nombre, grupo, dirección, salida autónoma y número de collectors.
3. La fila puede expandirse para mostrar los datos de sus collectors.

## Flujo de alta

1. Se introducen nombre, apellido, dirección y teléfono opcional.
2. Se registra al menos un collector con sus datos y condición de principal.
3. Se crea el onboarding y se refresca la tabla.

## Reglas observadas

- Los filtros se envían al backend.
- El alta exige al menos un collector.
- Los collectors se envían como `COLLECTOR` y permiso `PERMANENT`.
- El primero aparece marcado como principal por defecto.
- El `groupId` está temporalmente fijado a `1`.
- `validFrom` y `validUntil` se envían como cadenas vacías, aunque el contrato
  declara `string | null`.

## Integraciones

- `GET /api/students?name=...&groupId=...` y `POST /api/students`.
- `StudentDTO`, `CollectorDTO` y `StudentOnboardingRequest`.

## Implementación

- Página: `apps/web/src/app/(protected)/students/page.tsx`.
- Feature: `apps/web/src/features/students/`.
- Proxy: `apps/web/src/app/api/students/route.ts`.
- Tipos: `packages/types/src/student.ts` y `StudentOnboardingRequest.ts`.

## Pendiente

- Sustituir `groupId: 1` por selección real.
- Alinear las vigencias con el contrato y el backend.
- Confirmar si todo estudiante requiere un collector.
- Definir edición, baja y gestión posterior de collectors.
- Implementación mobile.
