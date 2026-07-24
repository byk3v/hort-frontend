# hort-frontend

Frontend monorepo para las aplicaciones web y mobile de HORT.

## Documentacion

La documentacion funcional, arquitectonica y las decisiones tecnicas se
encuentran en [`docs/`](docs/README.md).

## Requisitos

- Node.js
- pnpm `10.6.0`

Si no tienes pnpm instalado:

```bash
corepack enable
corepack prepare pnpm@10.6.0 --activate
```

## Instalacion

Desde la raiz del proyecto:

```bash
pnpm install
```

## Levantar el proyecto en desarrollo

Levantar todas las apps en paralelo:

```bash
pnpm dev
```

Levantar solo la app web:

```bash
pnpm dev:web
```

Levantar solo la app mobile:

```bash
pnpm dev:mobile
```

## Comandos utiles

Compilar todas las apps y paquetes:

```bash
pnpm build
```

Ejecutar lint:

```bash
pnpm lint
```

Ejecutar typecheck:

```bash
pnpm typecheck
```

Limpiar artefactos generados y `node_modules`:

```bash
pnpm clean
```

## Comandos por app

Web, desde la raiz:

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web start
pnpm --filter web lint
pnpm --filter web typecheck
```

Mobile, desde la raiz:

```bash
pnpm --filter mobile start
pnpm --filter mobile android
pnpm --filter mobile ios
pnpm --filter mobile web
pnpm --filter mobile lint
```

## Variables de entorno

La app web usa `apps/web/.env.local`. Variables esperadas:

```bash
NEXT_PUBLIC_KEYCLOAK_URL=
NEXT_PUBLIC_KEYCLOAK_REALM=
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=
BACKEND_API_URL=
```
