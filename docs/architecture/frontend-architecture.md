# Arquitectura de frontend

## Web

La aplicación web usa Next.js App Router:

```text
apps/web/src/
├── app/
│   ├── (protected)/   Rutas y layout autenticados
│   └── api/           Proxy hacia el backend
├── auth/              Contexto y configuración de Keycloak
├── features/          UI y acceso a API agrupados por dominio
└── styles/            Estilos globales
```

Las páginas protegidas son puntos de entrada finos que montan el componente de
su feature. Cada feature mantiene sus componentes y un módulo `api.ts`. El
layout protegido combina `AuthProvider` y `AppShell`.

Los dominios implementados son checkout, collectors, groups, permissions y
students. `layout` y `public` son capacidades de interfaz, no dominios de negocio.

## Mobile

Mobile utiliza Expo Router y navegación por tabs. Todavía no replica la
organización por features. Cuando incorpore dominios conviene conservar nombres
funcionales comunes, sin obligar a compartir componentes visuales.

## Código compartido

Los contratos y la infraestructura HTTP viven en paquetes del workspace. UI,
navegación e integraciones de plataforma permanecen dentro de cada aplicación.
Web usa Ant Design; mobile usa el ecosistema Expo/React Native.
