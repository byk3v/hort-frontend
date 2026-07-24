# Architecture Decision Records

Los ADR registran decisiones técnicas relevantes. Esta primera serie documenta
retrospectivamente decisiones ya visibles en el repositorio.

| ADR | Estado | Decisión |
| --- | --- | --- |
| [ADR-001](adr-001-use-pnpm-workspaces-and-turborepo.md) | Aceptada | pnpm y Turborepo |
| [ADR-002](adr-002-separate-applications-and-shared-packages.md) | Aceptada | Apps y paquetes compartidos |
| [ADR-003](adr-003-use-nextjs-and-expo-router.md) | Aceptada | Next.js y Expo Router |
| [ADR-004](adr-004-organize-web-code-by-feature.md) | Aceptada | Web organizada por feature |
| [ADR-005](adr-005-use-keycloak-for-web-authentication.md) | Aceptada | Keycloak para autenticación web |
| [ADR-006](adr-006-use-next-route-handlers-as-backend-proxy.md) | Aceptada | Route Handlers como proxy |

## Estados y convenciones

- Estados: Propuesta, Aceptada, Rechazada, Obsoleta o Sustituida.
- Nombre: `adr-NNN-resumen-en-kebab-case.md`; los números no se reutilizan.
- En ADR retrospectivos, la fecha indica cuándo se documentaron.
- Una decisión nueva genera otro ADR y enlaza al anterior como sustituido.

## Plantilla

```md
# ADR-NNN: Título

- Estado: Propuesta
- Fecha: AAAA-MM-DD
- Tipo: Nueva | Retrospectiva

## Contexto
## Decisión
## Alternativas consideradas
## Consecuencias
### Positivas
### Negativas
## Referencias
```
