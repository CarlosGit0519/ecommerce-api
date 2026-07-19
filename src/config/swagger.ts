import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "REST API for catalog, cart and order management.",
    },
    servers: [{ url: "http://localhost:3003", description: "Local development server" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Carlos" },
            email: { type: "string", format: "email", example: "carlos@example.com" },
            password: { type: "string", format: "password", example: "UmaPasswordSegura123!" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "carlos@example.com" },
            password: { type: "string", format: "password", example: "UmaPasswordSegura123!" },
          },
        },
        CategoryInput: {
          type: "object",
          required: ["name"],
          properties: { name: { type: "string", example: "Electronics" } },
        },
        ProductInput: {
          type: "object",
          required: ["sku", "name", "price", "stockQuantity", "categoryId"],
          properties: {
            sku: { type: "string", example: "HEADPHONES-001" },
            name: { type: "string", example: "Wireless Headphones" },
            description: { type: "string", example: "Bluetooth headphones" },
            price: { type: "number", example: 79.99 },
            stockQuantity: { type: "integer", example: 15 },
            categoryId: { type: "string", example: "cmrr470gv0000zga4nq8hhg38" },
          },
        },
        CartItemInput: {
          type: "object",
          required: ["productId", "quantity"],
          properties: {
            productId: { type: "string", example: "cmrr4b5vg0000qca4u4fdoqvi" },
            quantity: { type: "integer", example: 2 },
          },
        },
      },
    },
    paths: {
      "/health": { get: { summary: "Check API health", responses: { "200": { description: "API is running" } } } },
      "/api/v1/auth/register": { post: { summary: "Register an account", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } } } }, responses: { "201": { description: "Account created" } } } },
      "/api/v1/auth/login": { post: { summary: "Log in and receive a JWT", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } } }, responses: { "200": { description: "Authenticated" } } } },
      "/api/v1/auth/me": { get: { summary: "Get the authenticated user", security: [{ bearerAuth: [] }], responses: { "200": { description: "Current user" } } } },
      "/api/v1/categories": {
        get: { summary: "List active categories", responses: { "200": { description: "Category list" } } },
        post: { summary: "Create a category (admin only)", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CategoryInput" } } } }, responses: { "201": { description: "Category created" } } },
      },
      "/api/v1/products": {
        get: { summary: "List active products", responses: { "200": { description: "Product list" } } },
        post: { summary: "Create a product (admin only)", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProductInput" } } } }, responses: { "201": { description: "Product created" } } },
      },
      "/api/v1/cart": { get: { summary: "Get the authenticated user's cart", security: [{ bearerAuth: [] }], responses: { "200": { description: "Cart" } } } },
      "/api/v1/cart/items": { post: { summary: "Add an item to the cart", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CartItemInput" } } } }, responses: { "201": { description: "Item added" } } } },
      "/api/v1/orders": { get: { summary: "List the authenticated user's orders", security: [{ bearerAuth: [] }], responses: { "200": { description: "Order list" } } } },
      "/api/v1/orders/checkout": { post: { summary: "Create an order from the cart", security: [{ bearerAuth: [] }], responses: { "201": { description: "Order created" } } } },
      "/api/v1/orders/{orderId}/pay": { patch: { summary: "Confirm simulated payment", security: [{ bearerAuth: [] }], responses: { "200": { description: "Order paid" } } } },
    },
  },
  apis: [],
});
