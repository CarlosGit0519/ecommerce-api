# E-commerce API

A REST API for an e-commerce platform, built as a backend portfolio project.

It models a complete purchase flow: authentication, catalog management, carts, stock validation, checkout and simulated payment confirmation.

## Stack

- Node.js, TypeScript and Express
- PostgreSQL and Prisma ORM
- JWT and bcrypt
- Zod validation
- Swagger / OpenAPI
- Docker and Docker Compose
- Vitest and GitHub Actions

## Features

- JWT authentication with `ADMIN` and `CUSTOMER` roles
- First registered user automatically becomes an administrator
- Admin-only category and product creation
- Public product catalog with filtering and pagination
- Authenticated shopping cart
- Atomic checkout with stock validation and stock deduction
- Order history and simulated payment confirmation
- Interactive API documentation at `/docs`
- Automated tests and CI on every push

## Run locally with Docker

```bash
docker compose up --build
```

The API will be available at `http://localhost:3003`.

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Health check |
| `GET /docs` | Swagger UI |
| `POST /api/v1/auth/register` | Register an account |
| `POST /api/v1/auth/login` | Log in and receive a JWT |
| `GET /api/v1/products` | Browse the catalog |
| `POST /api/v1/cart/items` | Add an item to the cart |
| `POST /api/v1/orders/checkout` | Create an order |

## Local development

1. Copy the environment example: `Copy-Item .env.example .env`
2. Start PostgreSQL: `docker compose up -d postgres`
3. Apply migrations: `npm run prisma:migrate -- --name init`
4. Start the API: `npm run dev`

## Quality checks

```bash
npm run typecheck
npm test
npm run build
```

## Documentation

See [the project specification](docs/project-specification.md) for the initial scope and development roadmap.
