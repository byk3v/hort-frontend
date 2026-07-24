# ADR-004: Organizar el código web por feature

- Estado: Aceptada
- Fecha: 2026-07-22
- Tipo: Retrospectiva

## Contexto

Web implementa varios dominios con UI y funciones de acceso a API asociadas.

## Decisión

Agrupar componentes y API de cada dominio en `src/features/<feature>`, mantener
las páginas como entradas finas y separar autenticación, layout y estilos.

## Alternativas consideradas

- Agrupar globalmente por tipo técnico.
- Colocar toda la implementación dentro de cada ruta.
- Extraer cada feature como paquete del workspace.

## Consecuencias

### Positivas

- El código del dominio queda localizado y las rutas permanecen pequeñas.
- Facilita ownership y documentación funcional.

### Negativas

- Las dependencias entre features requieren control explícito.
- El código compartido puede acabar duplicado o ubicado arbitrariamente.
- `layout` y `public` bajo `features` no son dominios de negocio puros.

## Referencias

- `apps/web/src/features/`
- `apps/web/src/app/(protected)/`
- [`../features/README.md`](../features/README.md)
