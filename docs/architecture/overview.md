# Visión general de arquitectura

HORT Frontend es un monorepo TypeScript con dos aplicaciones cliente y dos
paquetes compartidos. Web contiene actualmente las features de producto;
mobile conserva principalmente la base inicial de Expo.

```text
apps/
├── web/       Next.js y React
└── mobile/    Expo y React Native
packages/
├── http/      Cliente HTTP y proveedor de access token
└── types/     Contratos TypeScript compartidos
docs/          Documentación transversal
```

## Responsabilidades

- `apps/web`: interfaz web, Keycloak y Route Handlers `/api/*`.
- `apps/mobile`: aplicación Expo Router; aún sin las features documentadas.
- `packages/http`: query strings, bearer token y operaciones `GET`/`POST` JSON.
- `packages/types`: DTO y payloads compartidos, sin comportamiento de negocio.

pnpm administra los workspaces y Turborepo coordina `dev`, `build`, `lint`,
`typecheck` y `clean`.

## Limitaciones observadas

- La implementación funcional se concentra en web.
- El cliente HTTP solo contempla actualmente `GET` y `POST` JSON.
- Los errores HTTP se reducen a un mensaje genérico con el código de estado.
- No se observan tests automatizados en el repositorio.
