# Documentación de HORT Frontend

Este directorio concentra la documentación que afecta al monorepo completo.
Los README de cada aplicación o paquete se reservan para instrucciones locales.

## Contenido

- [`architecture/`](architecture/README.md): estructura, límites y flujos técnicos.
- [`features/`](features/README.md): comportamiento funcional por dominio.
- [`decisions/`](decisions/README.md): Architecture Decision Records (ADR).

## Mantenimiento

- Actualizar una feature cuando cambien su flujo, reglas o contratos.
- Actualizar arquitectura cuando cambien responsabilidades o dependencias.
- No reescribir un ADR aceptado: crear otro y marcar el anterior como sustituido.
- Enlazar la documentación con el código sin copiar detalles innecesarios.

Esta primera versión describe el estado observado en el código, incluidos los
comportamientos temporales, y deberá refinarse junto con el producto.
