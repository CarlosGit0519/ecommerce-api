# E-commerce API — Project Specification

## 1. Purpose

Build the backend of a small e-commerce platform. Customers can browse products, manage a cart and place orders. Administrators manage the catalog and stock.

The goal is to demonstrate backend practices that resemble a real product: authorization, relational data modelling, stock rules, transactions, tests, documentation and deployment readiness.

## 2. Users and permissions

| Role | Permissions |
| --- | --- |
| `CUSTOMER` | Register, log in, manage their cart, create and view their orders. |
| `ADMIN` | All customer capabilities plus category, product and stock management. |

## 3. First version scope

### Authentication

- Register and log in with email and password.
- Hash passwords with bcrypt.
- Protect private routes with JWT.
- Restrict administrative routes by role.

### Catalog

- Create and list categories.
- Create, update, list and deactivate products.
- Use a SKU, name, price, description and stock quantity per product.

### Cart and orders

- Add, update and remove cart items.
- Validate available stock before checkout.
- Create an order from the authenticated customer's cart.
- Simulate payment confirmation; no real payment provider in version 1.
- Deduct stock atomically when an order is placed.

## 4. Initial entities

```text
User
Category
Product
Cart
CartItem
Order
OrderItem
```

## 5. Development milestones

1. Project setup: TypeScript, Express, PostgreSQL, Prisma and Docker.
2. Authentication and roles.
3. Category and product catalog.
4. Cart workflow.
5. Checkout, orders and stock transaction.
6. Swagger documentation, tests and CI.
7. README polish and deployment.

## 6. Definition of done

The project is complete when it runs locally using Docker, has documented endpoints, validates the essential business rules with tests, passes CI and has a clear README.
