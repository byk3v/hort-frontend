# ADR-003: Usar Next.js App Router y Expo Router

- Estado: Aceptada
- Fecha: 2026-07-22
- Tipo: Retrospectiva

## Contexto

HORT necesita aplicaciones React web y React Native con navegación adaptada a
cada plataforma.

## Decisión

Usar Next.js App Router para web y Expo Router para mobile, ambos con routing
basado en archivos.

## Alternativas consideradas

- React SPA con React Router.
- React Navigation configurado manualmente.
- Una única aplicación web empaquetada también como mobile.

## Consecuencias

### Positivas

- Convenciones de routing basadas en archivos y toolchain de cada plataforma.
- Next.js aporta layouts, Route Handlers y separación cliente/servidor.

### Negativas

- No se comparten directamente rutas ni UI.
- Se mantienen dos toolchains y estrategias de despliegue.

## Referencias

- `apps/web/src/app/`
- `apps/mobile/app/`
- `apps/web/package.json`
- `apps/mobile/package.json`
