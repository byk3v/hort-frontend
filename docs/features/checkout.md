# Checkout

## Estado

Check-in y checkout funcionales en web sobre `/api/v1/attendance`. Mobile
permanece como template.

## Objetivo

Registrar presencia diaria y salida de un estudiante acompañado por una persona
autorizada o mediante autorización para salir solo.

## Actores

- Usuario autenticado con rol `HORT_ADMIN` o `ASSISTANT`.
- Estudiante.
- Collector autorizado, cuando aplica.

## Flujo de check-in

1. El usuario abre Anmeldung.
2. La aplicación consulta candidatos que todavía no tienen sesión diaria.
3. El usuario registra el check-in del estudiante.

## Flujo de checkout

1. El usuario abre Abmeldung.
2. La aplicación consulta estudiantes presentes hoy.
3. Se muestran grupo, autorización de salida autónoma efectiva y collectors
   permitidos para la hora actual.
4. El usuario confirma salida con collector o salida autónoma.
5. El backend cierra la sesión diaria y registra el checkout en una transacción.

## Reglas observadas

- Solo se listan estudiantes con sesión abierta para checkout.
- No se permite checkout sin check-in previo.
- No se permite checkout duplicado para la misma sesión.
- La salida autónoma se deriva de `self_dismissal` y sus reglas efectivas.
- La confirmación envía `comment: null` desde la UI actual.

## Integraciones

- `GET /api/v1/attendance/check-in-candidates`.
- `POST /api/v1/attendance/check-ins`.
- `GET /api/v1/attendance/present-students`.
- `POST /api/v1/attendance/check-outs`.
- Tipos manuales de attendance/checkout en `@kubuci-hort/types`.

## Implementación

- Check-in page: `apps/web/src/app/(protected)/checkin/page.tsx`.
- Checkout page: `apps/web/src/app/(protected)/checkout/page.tsx`.
- Feature: `apps/web/src/features/checkin/` y `apps/web/src/features/checkout/`.
- Proxies: `apps/web/src/app/api/v1/attendance/`.

## Pendiente

- Definir comentarios, reversión y experiencia de confirmación.
- Implementación mobile.
- Sustituir DTOs manuales cuando exista el cliente generado.
