# ADR-002: Separar aplicaciones y paquetes compartidos

- Estado: Aceptada
- Fecha: 2026-07-22
- Tipo: Retrospectiva

## Contexto

Web y mobile tienen UI y navegación diferentes, pero comparten contratos de
datos e infraestructura HTTP.

## Decisión

Mantener ejecutables en `apps/*` y reutilización en `packages/*`. Compartir
contratos mediante `@kubuci-hort/types` e HTTP mediante `@kubuci-hort/http`.

## Alternativas consideradas

- Duplicar tipos y cliente HTTP en cada app.
- Compartir también todos los componentes visuales.
- Separar web y mobile en repositorios.

## Consecuencias

### Positivas

- Contratos únicos y menos duplicación de infraestructura.
- Las interfaces específicas de plataforma permanecen aisladas.

### Negativas

- Cambios incompatibles afectan a varios consumidores.
- HTTP compartido debe evitar supuestos exclusivos del navegador.
- TypeScript no valida los datos en runtime.

## Referencias

- `apps/web/package.json`
- `apps/mobile/package.json`
- `packages/http/`
- `packages/types/`
