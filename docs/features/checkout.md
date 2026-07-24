# Checkout

## Estado

Búsqueda y confirmación iniciales en web. No implementada en mobile.

## Objetivo

Registrar que un estudiante abandona el centro acompañado por una persona
autorizada o mediante permiso para salir solo.

## Actores

- Usuario autenticado que gestiona la salida.
- Estudiante.
- Collector autorizado.

## Flujo principal

1. El usuario escribe al menos dos caracteres del nombre o grupo.
2. Tras 300 ms, se consultan coincidencias.
3. Se muestran grupo, estado, permiso de salida autónoma y collectors del día.
4. El usuario confirma la salida con un collector o, cuando está permitido, la
   salida autónoma.
5. La fila se marca como retirada y se refresca en segundo plano.

## Reglas observadas

- No se consulta con menos de dos caracteres.
- `checkedOutToday` desactiva nuevas acciones de salida.
- La salida autónoma solo aparece con `canLeaveAloneToday` y muestra su hora.
- La confirmación siempre envía `comment: null`.
- La salida con collector envía `collectorId` y `pickupRightId`.

## Integraciones

- `GET /api/checkout/search?q=...`.
- `POST /api/checkout/confirm`.
- `CheckoutSearchResponse`, `CheckoutStudentInfo` y `CheckoutCollectorInfo`.

## Implementación

- Página: `apps/web/src/app/(protected)/checkout/page.tsx`.
- Feature: `apps/web/src/features/checkout/`.
- Proxy: `apps/web/src/app/api/checkout/`.
- Tipos: `packages/types/src/CheckoutSearchResponse.ts`.

## Pendiente

- Confirmar en servidor las reglas horarias y prevenir doble envío.
- Mostrar errores específicos de búsqueda.
- Definir comentarios, reversión y experiencia de confirmación.
- Implementación mobile.
