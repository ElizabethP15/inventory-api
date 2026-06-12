# Inventory Management API

RESTful API para gestión de inventario de pequeños negocios.

## 🚀 Demo en vivo

|                                 | URL                                              |
| ------------------------------- | ------------------------------------------------ |
| **API**                         | https://inventory-api-k1cl.onrender.com          |
| **Swagger (docs interactivas)** | https://inventory-api-k1cl.onrender.com/api-docs |
| **Health check**                | https://inventory-api-k1cl.onrender.com/health   |

## Stack

- **Runtime:** Node.js v20 + Express
- **Base de datos:** PostgreSQL (Render) + Sequelize ORM
- **Auth:** JWT con roles (admin / user)
- **Docs:** Swagger / OpenAPI 3.0 — interactivo desde el navegador
- **Containerización:** Docker
- **Deploy:** Render (100% cloud, sin on-premise)
- **Sintaxis:** ES6+ modules (`import`/`export`)

## Endpoints

| Método | Ruta                      | Descripción                     | Auth  |
| ------ | ------------------------- | ------------------------------- | ----- |
| POST   | /api/auth/register        | Registrar usuario               | —     |
| POST   | /api/auth/login           | Login → JWT                     | —     |
| GET    | /api/auth/me              | Perfil propio                   | ✓     |
| GET    | /api/products             | Listar con filtros y paginación | ✓     |
| GET    | /api/products/:id         | Detalle de producto             | ✓     |
| POST   | /api/products             | Crear producto                  | Admin |
| PUT    | /api/products/:id         | Actualizar producto             | Admin |
| DELETE | /api/products/:id         | Desactivar (soft delete)        | Admin |
| GET    | /api/categories           | Listar categorías               | ✓     |
| POST   | /api/categories           | Crear categoría                 | Admin |
| PUT    | /api/categories/:id       | Actualizar categoría            | Admin |
| DELETE | /api/categories/:id       | Eliminar categoría              | Admin |
| GET    | /api/users                | Listar usuarios                 | Admin |
| PATCH  | /api/users/:id/role       | Cambiar rol                     | Admin |
| PATCH  | /api/users/:id/deactivate | Desactivar usuario              | Admin |

## Correr localmente

```bash
git clone https://github.com/TU_USUARIO/inventory-api.git
cd inventory-api
cp .env.example .env    # Completar con credenciales de Supabase
docker compose up --build
# Swagger disponible en http://localhost:3000/api-docs
```
