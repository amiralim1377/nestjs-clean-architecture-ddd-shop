<div align="center">

# 🛍️ Clean Shop

### A modular e-commerce backend built with NestJS

**Domain-Driven Design · Hexagonal Architecture · CQRS · Stripe Checkout**

[![NestJS](https://img.shields.io/badge/NestJS-12-ea2845?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169e1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-c5f74f?logo=drizzle&logoColor=111)](https://orm.drizzle.team/)
[![Stripe](https://img.shields.io/badge/Stripe-Test%20Payments-635bff?logo=stripe&logoColor=white)](https://stripe.com/)
[![License](https://img.shields.io/badge/License-Unlicensed-lightgrey)]

_A learning-focused e-commerce backend exploring clean boundaries, domain logic, and payment workflows._

</div>

---

## ✨ What is Clean Shop?

Clean Shop is an e-commerce backend built with **NestJS and TypeScript**. Its codebase is organized around business capabilities—customers, products, orders, and payments—with a focus on keeping business rules independent from frameworks and external services.

The project combines **Domain-Driven Design (DDD)**, **Hexagonal Architecture (Ports and Adapters)**, and **CQRS**. It also includes a Stripe Checkout integration and a local webhook workflow for development.

> 🚧 **Project status:** This project is under active development. Review the current controllers, DTOs, configuration, and payment flow before using it in production.

## 🧭 At a glance

| Area                        | Current approach                              |
| --------------------------- | --------------------------------------------- |
| Backend                     | NestJS + TypeScript                           |
| Architecture                | Modular Monolith, DDD, Hexagonal Architecture |
| Application flow            | CQRS with `@nestjs/cqrs`                      |
| Relational database         | PostgreSQL                                    |
| Database toolkit            | Drizzle ORM + `postgres` driver               |
| Additional database adapter | MongoDB driver (product adapter exists)       |
| Payments                    | Stripe Checkout                               |
| Email                       | Nodemailer / SMTP                             |
| Validation                  | `class-validator` + `class-transformer`       |
| Testing                     | Vitest, NestJS Testing, Supertest             |
| Package manager             | pnpm                                          |

**Intentionally not included right now:** RabbitMQ, Kafka, Redis, and BullMQ are not listed in the current `package.json`. The application can use its in-process CQRS events without introducing a separate message broker. Add external messaging only when a clear requirement calls for it.

## 🧩 Features

- **Customer management** — register, list, retrieve, and delete customers.
- **Product management** — create, list, retrieve, and delete products.
- **Order lifecycle** — place, retrieve, confirm, ship, deliver, and cancel orders.
- **Payment workflow** — create a Stripe Checkout Session through a payment gateway abstraction.
- **Payment webhook foundation** — forward Stripe events to the local NestJS app during development.
- **Domain modeling** — entities, value objects, domain events, and shared domain primitives.
- **Ports and adapters** — abstract repositories, order pricing, payment providers, and notifications behind contracts.
- **CQRS** — keep commands that change state separate from queries that read data.
- **Email notifications** — send messages through Nodemailer, with a console adapter available for development.

## 🏛️ Architecture

The project is structured as a **Modular Monolith**: each business area lives in its own module, while the application can still be deployed as one service.

```mermaid
flowchart TB
    Client[HTTP Client] --> Presentation[Controllers & DTOs]
    Presentation --> Application[Application Layer\nCommands, Queries & Handlers]
    Application --> Domain[Domain Layer\nEntities, Value Objects & Rules]
    Application --> Ports[Ports / Interfaces]
    Ports -. implemented by .-> Infrastructure[Infrastructure Adapters]
    Infrastructure --> PostgreSQL[(PostgreSQL)]
    Infrastructure --> MongoDB[(MongoDB, optional)]
    Infrastructure --> Stripe[Stripe API]
    Infrastructure --> SMTP[SMTP / Nodemailer]
```

### The layers

| Layer              | Responsibility                                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**         | Business rules, entities, value objects, and domain events. Keep this layer independent from NestJS, Drizzle, and Stripe where practical. |
| **Application**    | Use cases, command/query handlers, orchestration, and the ports required by the application.                                              |
| **Infrastructure** | Concrete implementations such as Drizzle repositories, Stripe integration, order-pricing adapters, and email adapters.                    |
| **Presentation**   | HTTP controllers and DTOs that define and validate API input.                                                                             |
| **Shared**         | Small, genuinely shared building blocks such as `Money`, `UniqueId`, base entities, and exception types.                                  |

### CQRS in this project

- A **Command** represents an operation that changes state, such as `PlaceOrderCommand` or `CreatePaymentCommand`.
- A **Query** reads data, such as `GetOrderQuery` or `ListProductsQuery`.
- A **Domain Event** records something meaningful that happened, such as `OrderPlaced` or `PaymentCompleted`.
- An **Event Handler** reacts to an event—for example, by sending a notification.

CQRS does **not** require RabbitMQ or Kafka. The NestJS CQRS EventBus is in-process by default; it does not automatically provide durable message storage, cross-service delivery, or retry guarantees.

### Repository layout

```text
src/
├── customers/
│   ├── application/       # Ports, use cases, queries and handlers
│   ├── domain/            # Customer entity and value objects
│   ├── events/            # Customer domain event and handler
│   ├── infrastructure/    # Drizzle repository and notification adapters
│   ├── presentation/      # DTOs
│   ├── customers.controller.ts
│   └── customers.module.ts
├── product/
│   ├── application/       # Product commands, queries and repository port
│   ├── domain/            # Product entity and value objects
│   ├── infrastructure/    # Drizzle and MongoDB adapters
│   ├── presentation/
│   └── product.module.ts
├── order/
│   ├── application/       # Order use cases, queries, ports and event handlers
│   ├── domain/            # Order entities, statuses and domain events
│   ├── infrastructure/    # Order repository and customer/product adapters
│   ├── presentation/
│   └── order.module.ts
├── payment/
│   ├── application/       # Create/confirm payment use cases and ports
│   ├── domain/            # Payment entity and status value object
│   ├── events/            # Payment-related domain events
│   ├── infrastructure/    # Drizzle, order pricing and Stripe adapters
│   ├── port/              # Payment gateway contract
│   ├── presentation/      # Payment controller and DTOs
│   └── payment.module.ts
├── shared/
│   ├── domain/            # Entity, AggregateRoot, Money and exceptions
│   └── infrastructure/    # Database providers and exception filters
├── app.module.ts
└── main.ts
```

## ⚙️ Getting started

### Requirements

- Node.js compatible with the project (development has been run with Node.js 24)
- pnpm
- PostgreSQL for the relational persistence path
- MongoDB only if you enable the MongoDB adapter
- A Stripe account in **Test mode** to exercise the real Checkout integration
- Stripe CLI for local webhook forwarding (optional)
- An SMTP sandbox such as Mailtrap for testing email delivery (optional)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a local `.env` file in the repository root. Do **not** commit it.

```dotenv
# Database selection
DATABASE=postgres
POSTGRES_DATABASE_URL=postgres://postgres:postgres@localhost:15432/clean_shop

# Optional MongoDB adapter
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=clean_shop

# SMTP / Mailtrap
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=replace_with_mailtrap_username
SMTP_PASSWORD=replace_with_mailtrap_password
SMTP_FROM="Clean Shop <no-reply@example.com>"

# Optional application setting
ADMIN_USER_ID=00000000-0000-4000-8000-000000000000

# Stripe Test mode — use your own local values
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_SUCCESS_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_replace_me
```

All values above are examples, not working credentials. Update the variables to match your local configuration and the code in your current branch. If you do not use MongoDB or SMTP during development, those settings may not be needed by your selected application path.

**Important:** `POSTGRES_DATABASE_URL` used by the application and the connection configured in `drizzle.config.ts` should point to the same database. Otherwise, a migration can succeed in one database while the NestJS application connects to another.

### 3. Prepare PostgreSQL and run migrations

Make sure PostgreSQL is running and the `clean_shop` database exists. Review `drizzle.config.ts`, especially its `schema`, `out`, and database URL settings.

Generate a migration after changing Drizzle schema definitions:

```bash
pnpm exec drizzle-kit generate
```

Apply generated migrations:

```bash
pnpm exec drizzle-kit migrate
```

> `migrate` applies migration files that already exist. It does not automatically turn a new TypeScript schema definition into a migration—that is the job of `generate`.

If an expected table is missing, verify the active database, schema path, migration output directory, and Drizzle migration journal before manually changing migration history.

### 4. Start the API

```bash
pnpm start:dev
```

The examples in this README assume the API is available at `http://localhost:3000`. Adjust URLs if your app uses a different port or a global route prefix.

## 🔌 API overview

The routes below are based on the route registrations observed during development. Check the relevant controller and DTO for exact request bodies, response shapes, authentication requirements, and status codes.

### Products

| Method   | Endpoint        | Purpose            |
| -------- | --------------- | ------------------ |
| `POST`   | `/products`     | Create a product   |
| `GET`    | `/products`     | List products      |
| `GET`    | `/products/:id` | Retrieve a product |
| `DELETE` | `/products/:id` | Delete a product   |

### Customers

| Method   | Endpoint         | Purpose             |
| -------- | ---------------- | ------------------- |
| `POST`   | `/customers`     | Register a customer |
| `GET`    | `/customers`     | List customers      |
| `GET`    | `/customers/:id` | Retrieve a customer |
| `DELETE` | `/customers/:id` | Delete a customer   |

### Orders

| Method  | Endpoint              | Purpose                    |
| ------- | --------------------- | -------------------------- |
| `POST`  | `/orders`             | Place an order             |
| `GET`   | `/orders`             | List orders                |
| `GET`   | `/orders/:id`         | Retrieve an order          |
| `PATCH` | `/orders/:id/confirm` | Confirm an order           |
| `PATCH` | `/orders/:id/ship`    | Mark an order as shipped   |
| `PATCH` | `/orders/:id/deliver` | Mark an order as delivered |
| `PATCH` | `/orders/:id/cancel`  | Cancel an order            |

### Payments

| Method | Endpoint            | Purpose                                                                                          |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------ |
| `POST` | `/payments`         | Request a payment / Checkout Session (verify against the current controller)                     |
| `POST` | `/payments/webhook` | Local webhook forwarding target used in development; ensure the matching route exists in the app |

## 💳 Stripe Checkout & webhooks

### Create a Checkout Session

The payment use case is handled by `CreatePaymentHandler`. It relies on:

- `PaymentRepository` to find and persist payment state;
- `OrderPricingPort` to obtain server-side order pricing;
- `PaymentGatewayPort` to abstract the payment provider;
- `StripePaymentAdapter` as the current provider adapter.

The application should calculate prices from trusted server-side order data, not from an amount supplied by the client. A production payment flow also needs a clear policy for concurrent requests, repeated Checkout Session creation, expired sessions, and failures between Stripe and PostgreSQL.

### Forward Stripe events to localhost

You can run Stripe CLI without installing it globally by using `pnpm dlx`.

Authenticate the CLI once:

```bash
pnpm dlx @stripe/cli login
```

Start a listener in a separate terminal:

```bash
pnpm dlx @stripe/cli listen \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed \
  --forward-to http://localhost:3000/payments/webhook
```

The CLI prints a webhook signing secret beginning with `whsec_`. Put that value in your **local** `.env` as `STRIPE_WEBHOOK_SECRET`. The listener secret is separate from `STRIPE_SECRET_KEY`; it may change when the listener is recreated, so update your local configuration accordingly.

Start the NestJS app in another terminal and trigger a sample event in a third terminal:

```bash
pnpm dlx @stripe/cli trigger checkout.session.completed
```

A triggered sample event may not contain the order or payment IDs used by your application. Use it to verify forwarding and signature validation, then test the full business workflow with data appropriate for the application.

### Webhook safety checklist

- Validate the Stripe signature using the raw request body and the `stripe-signature` header.
- With NestJS and Express, enable raw body capture if needed, for example with `NestFactory.create(AppModule, { rawBody: true })`.
- Do not treat a redirect to the success URL as proof that a payment succeeded.
- Expect webhook deliveries to be retried; make processing idempotent and track provider event IDs.
- Keep payment status changes consistent with domain rules and database state.
- Never expose Stripe secret keys or webhook signing secrets in source control, client-side code, or logs.

## 🧪 Tests & code quality

The project currently defines these scripts in `package.json`:

```bash
pnpm test          # Run tests with Vitest
pnpm test:watch    # Watch mode
pnpm test:cov      # Test coverage
pnpm test:e2e      # End-to-end tests
pnpm lint          # Oxlint
pnpm format        # Format TypeScript source and test files
pnpm build         # Build the NestJS application
```

Use unit tests for domain rules and use cases, integration tests for persistence adapters, and end-to-end tests for critical order and payment flows. Tests involving Stripe should use test credentials or a fake adapter—not live payment credentials.

## 🧱 Engineering principles

- **Depend on abstractions:** application handlers depend on ports, not directly on Drizzle, Stripe, or Nodemailer.
- **Keep domain rules in the domain:** state transitions belong in domain methods rather than arbitrary database updates.
- **Keep module boundaries meaningful:** avoid importing another module's database schema directly when a port or explicit contract is more appropriate.
- **Make payment processing resilient:** account for concurrent requests, duplicate events, provider idempotency, and reconciliation after partial failures.
- **Add infrastructure with a purpose:** RabbitMQ, Kafka, Redis, BullMQ, and microservices are not prerequisites for DDD, Hexagonal Architecture, or CQRS.
- **Prefer consistency in naming:** the current tree contains naming variations such as `use-case`/`use-cases` and `entity`/`entities`; standardize these gradually as the code evolves.

## 🔐 Security notes

- Keep `.env` out of version control. Commit only safe placeholders in an optional `.env.example`.
- Rotate any Stripe key or SMTP credential that has been exposed in a public place, chat, screenshot, or repository history.
- Use a Stripe **Secret key** only on the server; a **Publishable key** belongs in client-side Stripe.js integrations.
- Use a webhook signing secret (`whsec_...`) only to validate webhook signatures on the server.
- Before production, review authentication, authorization, rate limiting, request validation, TLS, logging, database backups, and migration strategy.
- Never log raw credentials, secrets, or sensitive payment data.

## 📜 Package scripts

| Command            | Description                           |
| ------------------ | ------------------------------------- |
| `pnpm start`       | Start NestJS                          |
| `pnpm start:dev`   | Start in watch mode                   |
| `pnpm start:debug` | Start with debugging and watch mode   |
| `pnpm start:prod`  | Run the compiled app from `dist/main` |
| `pnpm build`       | Build the app                         |
| `pnpm test`        | Run tests                             |
| `pnpm test:watch`  | Run tests in watch mode               |
| `pnpm test:cov`    | Run tests with coverage               |
| `pnpm test:e2e`    | Run end-to-end tests                  |
| `pnpm lint`        | Check source and tests with Oxlint    |
| `pnpm format`      | Format TypeScript files with Prettier |

---

<div align="center">

**Built to learn, designed to evolve.** 🚀

<sub>Clean Shop is an actively evolving project. Always verify the implementation and configuration in the current branch before relying on this documentation.</sub>

</div>
