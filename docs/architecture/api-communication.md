# Comunicación con APIs

```text
Componente -> feature/api.ts -> @kubuci-hort/http
           -> Next.js /api/v1/* -> BACKEND_API_URL/api/v1/*
```

Los componentes web llaman a una URL relativa del mismo origen. Los Route
Handlers de Next.js construyen la URL del backend, preservan la autorización y
devuelven la respuesta. Si `BACKEND_API_URL` no está definida usan
`http://localhost:4000`.

Los endpoints web legacy `/api/groups`, `/api/students`, `/api/collectors`,
`/api/checkout`, `/api/permissions`, `/api/pickup-rights`, `/api/self-dismissals`
y `/api/persons` ya no forman parte del consumidor funcional.

| Feature | Método y ruta web |
| --- | --- |
| Check-in | `GET /api/v1/attendance/check-in-candidates`, `POST /api/v1/attendance/check-ins` |
| Checkout | `GET /api/v1/attendance/present-students`, `POST /api/v1/attendance/check-outs` |
| Collectors | `GET`, `POST`, `PUT`, `DELETE /api/v1/collectors` |
| Groups | `GET /api/v1/groups` |
| Current user | `GET /api/v1/me` |
| Permissions | `GET`, `POST /api/v1/student-authorizations`; `PUT /api/v1/student-authorizations/{kind}/{id}/revoke` |
| Students | `GET`, `POST /api/v1/students` |

Las consultas usan `no-store`. El cliente compartido `@kubuci-hort/http`
deduplica `GET` idénticos mientras están en vuelo para evitar llamadas dobles en
desarrollo cuando React remonta componentes.

Los tipos TypeScript siguen siendo manuales bajo `packages/types` hasta que las
Fases 2 y 3 introduzcan OpenAPI reproducible y el paquete generado.
