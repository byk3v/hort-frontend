# ADR-001: Usar pnpm workspaces y Turborepo

- Estado: Aceptada
- Fecha: 2026-07-22
- Tipo: Retrospectiva

## Contexto

El repositorio contiene aplicaciones web y mobile y paquetes TypeScript que se
desarrollan y validan conjuntamente.

## Decisión

Usar pnpm para dependencias y workspaces, y Turborepo para coordinar tareas. La
versión de pnpm se fija en el `packageManager` raíz.

## Alternativas consideradas

- Repositorios independientes.
- npm o Yarn workspaces sin coordinador de tareas.
- Nx como plataforma integral.

No consta una evaluación histórica detallada de alternativas.

## Consecuencias

### Positivas

- Dependencias internas con `workspace:*` y comandos uniformes desde la raíz.
- Orden de build y caché coordinados por Turborepo.

### Negativas

- El equipo mantiene pnpm, Turbo y contratos comunes de scripts.
- Otros gestores pueden introducir lockfiles inconsistentes.

## Referencias

- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
