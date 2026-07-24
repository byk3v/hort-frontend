# Comunicación con APIs

```text
Componente -> feature/api.ts -> @kubuci-hort/http
           -> Next.js /api/* -> BACKEND_API_URL/api/*
```

Los componentes llaman a una URL relativa del mismo origen. Los Route Handlers
construyen la URL del backend, preservan la autorización y devuelven la respuesta.
Si `BACKEND_API_URL` no está definida usan `http://localhost:4000`.

| Feature | Método y ruta web |
| --- | --- |
| Checkout | `GET /api/checkout/search`, `POST /api/checkout/confirm` |
| Collectors | `GET /api/collectors` |
| Groups | `GET /api/groups` |
| Permissions | `GET`, `POST /api/permissions` |
| Students | `GET`, `POST /api/students` |

Las consultas usan `no-store`. El tratamiento de errores no es todavía uniforme:
algunos handlers producen `Upstream error` y otros preservan cuerpo y estado.
Los tipos TypeScript tampoco validan respuestas en runtime.
