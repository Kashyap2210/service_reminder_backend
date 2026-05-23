# Service Reminder Backend — CODEBASE.md

## Tech Stack

- **Runtime:** Node.js (NestJS framework)
- **Language:** TypeScript
- **ORM:** TypeORM (MySQL-compatible, schema name: `service_reminder`)
- **Validation:** `class-validator` + `class-transformer`
- **Auth:** JWT-based (`@nestjs/jwt`, `@nestjs/passport`)
- **Mail:** Nodemailer + Handlebars (`.hbs` templates)
- **API Docs:** Swagger (`@nestjs/swagger`)
- **Shared types:** `service_reminder_common` package (enums, interfaces, DTO interfaces)

---

## Architecture

### Module Structure (NestJS Standalone Modules)

Each feature is a self-contained NestJS module following:

```
module/
  ├── module.name.ts          (Module)
  ├── module.service.ts       (Service — business logic)
  ├── module.controller.ts    (Controller — routes)
  ├── module.swagger.ts       (Swagger decorators)
  ├── entities/
  │   └── *.entity.ts         (TypeORM entities)
  ├── dtos/
  │   ├── *.create.dto.ts
  │   ├── *.update.dto.ts
  │   └── *.search.dto.ts
  └── transactions/
      ├── interfaces/
      │   ├── *-create-transaction.interface.ts
      │   └── *-update-transaction.interface.ts
      └── *.transaction.ts    (Injectable transactional services)
```

### Modules

| Module        | Path                  | Purpose                                                          |
| ------------- | --------------------- | ---------------------------------------------------------------- |
| User          | `src/user/`           | User CRUD                                                        |
| RecurringItem | `src/recurring-item/` | Recurring service items (e.g. "Annual vehicle service")          |
| Vendor        | `src/vendor/`         | Service vendors, M:N with RecurringItem                          |
| Service       | `src/service/`        | Service records (actual service events)                          |
| Appointment   | `src/appointment/`    | Appointments for services                                        |
| Notification  | `src/notification/`   | Notification queue (email)                                       |
| CronJob       | `src/cronjob/`        | Scheduled job tracking                                           |
| Mail          | `src/mail/`           | Email sending with Handlebars templates                          |
| Auth          | `src/auth/`           | JWT authentication                                               |
| Database      | `src/database/`       | TypeORM DataSource config                                        |
| Shared        | `src/shared/`         | BaseService, EntityManagerBaseService, constants, pipes, filters |

### Shared Infrastructure

#### `BaseService<T>` (`src/shared/services/base.service.ts`)

Abstract base for all domain services. Uses `RegistryService` for cross-entity lookups. Key methods:

- `getInstanceBase()` — create entity instance from DTO
- `createBase()` / `createBulkBase()` — persist entities
- `updateByIdBase()` — update by ID
- `deleteByIdsBase()` — validate presence then bulk-delete
- `search()` — filter-based query
- `searchV2()` — advanced search with nested entity includes and relations (recursive)
- `updateBulkBase()` — bulk update with per-row CASE statements
- `getEntityConfig()` — abstract; defines relation mappings for searchV2

#### `EntityManagerBaseService<T>` (`src/shared/repositories/entity.base.manager.ts`)

Abstract base for TypeORM repository operations. Key methods:

- `getRepository()` / `getQueryBuilder()`
- `validatePresence()` — throws `BadRequestException` if any IDs missing
- `getByFilter()` — dynamic WHERE IN query builder with optional `include`, `columnKeys`, `orderBy`, `limit`
- `getInstance()` / `create()` / `createBulk()`
- `updateById()` / `updateBulk()` — bulk update uses raw SQL CASE for per-row values
- `deleteById()` / `deleteMany()`

#### `RegistryService` (`src/shared/services/registry.service.ts`)

Maps `EntityList` enum values to their `BaseService` instances (set during `onModuleInit`). Enables cross-entity lookups in `searchV2`.

#### `BaseEntity` (`src/shared/entities/base.entity.ts`)

Provides `createdOn` / `updatedOn` (epoch timestamps) and `createdBy` / `updatedBy` columns for all entities (except User and Appointment which use `createdAt`/`updatedAt` as Date).

---

## Entities & Relationships

### `UserEntity` — `users` table

| Column    | Type           | Notes          |
| --------- | -------------- | -------------- |
| id        | int PK         | auto-increment |
| name      | varchar(256)   |                |
| contactNo | varchar(32)    |                |
| email     | varchar(128)   | unique         |
| password  | varchar(256)   | hashed         |
| role      | enum(UserRole) | default `USER` |
| createdAt | datetime       | via BaseEntity |
| updatedAt | datetime       | via BaseEntity |

### `RecurringItemEntity` — `recurring_items` table

| Column              | Type                    | Notes                         |
| ------------------- | ----------------------- | ----------------------------- |
| id                  | int PK                  |                               |
| name                | varchar(100)            | e.g. "Annual vehicle service" |
| type                | varchar(100)            | e.g. "vehicle"                |
| companyName         | varchar(100)            | nullable                      |
| servicePeriod       | int                     | numeric value                 |
| servicePeriodUnit   | enum(ServicePeriodUnit) | DAYS / WEEKS / MONTHS / YEARS |
| userId              | int                     | FK to User                    |
| createdOn/updatedOn | bigint                  | epoch                         |

- **M:N** with Vendor through `recurring_item_vendor` junction table
- RecurringItemVendorEntity: `id`, `recurringItemId`, `vendorId`

### `VendorEntity` — `vendors` table

| Column              | Type         | Notes      |
| ------------------- | ------------ | ---------- |
| id                  | int PK       |            |
| name                | varchar(100) |            |
| contactNo           | varchar(15)  |            |
| email               | varchar      | nullable   |
| address             | varchar(255) |            |
| userId              | int          | FK to User |
| createdOn/updatedOn | bigint       | epoch      |

- **M:N** with RecurringItem through `recurring_item_vendor` junction
- **M:1** with User

### `ServiceEntity` — `services` table

| Column              | Type                  | Notes                     |
| ------------------- | --------------------- | ------------------------- |
| id                  | int PK                |                           |
| serviceDate         | bigint                | epoch                     |
| recurringItemId     | int                   | FK                        |
| appointmentId       | int                   | nullable FK               |
| userId              | int                   | FK                        |
| serviceType         | enum(AppointmentType) |                           |
| serviceStatus       | enum(ServiceStatus)   | default `SERVICE_STARTED` |
| vendorId            | int                   | FK                        |
| serviceEstimate     | decimal(10,2)         | nullable                  |
| serviceAmount       | decimal(10,2)         | nullable                  |
| invoiceDocument     | varchar               | nullable URL/path         |
| createdOn/updatedOn | bigint                | epoch                     |

### `AppointmentEntity` — `appointments` table

| Column              | Type                    | Notes              |
| ------------------- | ----------------------- | ------------------ |
| id                  | int PK                  |                    |
| appointmentDate     | bigint                  | YYYYMMDD as number |
| recurringItemId     | int                     | FK                 |
| userId              | int                     | FK                 |
| appointmentType     | enum(AppointmentType)   |                    |
| vendorId            | int                     | FK (non-nullable)  |
| appointmentStatus   | enum(AppointmentStatus) | default `BOOKED`   |
| checkPoints         | varchar(1024)           | nullable           |
| createdAt/updatedAt | datetime                | via BaseEntity     |

### `NotificationEntity` — `notifications` table

| Column              | Type                     | Notes                                              |
| ------------------- | ------------------------ | -------------------------------------------------- |
| id                  | int PK                   |                                                    |
| userId              | int                      | FK                                                 |
| recurringItemId     | int                      | FK                                                 |
| appointmentId       | int                      | nullable FK                                        |
| type                | enum(NotificationType)   |                                                    |
| status              | enum(NotificationStatus) | default `PENDING`                                  |
| scheduledFor        | bigint                   | epoch                                              |
| sentAt              | bigint                   | nullable                                           |
| retryCount          | int                      | default 0                                          |
| lastError           | varchar                  | nullable                                           |
| payload             | jsonb                    | `{ subject, body, recipientEmail, recipientName }` |
| createdOn/updatedOn | bigint                   | epoch                                              |

### `CronJobEntity` — `cron_jobs` table

| Column              | Type                | Notes                  |
| ------------------- | ------------------- | ---------------------- |
| id                  | int PK              |                        |
| name                | varchar(100)        |                        |
| cronExpression      | varchar(50)         |                        |
| scheduledAt         | bigint              | epoch                  |
| startedAt           | bigint              | nullable               |
| completedAt         | bigint              | nullable               |
| status              | enum(CronJobStatus) | default `SCHEDULED`    |
| error               | jsonb               | nullable `{ message }` |
| createdOn/updatedOn | bigint              | epoch                  |

---

## Enums (from `service_reminder_common`)

| Enum                 | Values                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| `UserRole`           | ADMIN, USER                                                               |
| `ServicePeriodUnit`  | DAYS, WEEKS, MONTHS, YEARS                                                |
| `AppointmentType`    | SERVICE, REPAIR, INSPECTION, OTHER                                        |
| `AppointmentStatus`  | BOOKED, IN_PROGRESS, COMPLETED, CANCELLED                                 |
| `ServiceStatus`      | SERVICE_STARTED, IN_PROGRESS, COMPLETED, CANCELLED                        |
| `NotificationType`   | EMAIL_SERVICE_REMINDER, EMAIL_APPOINTMENT_REMINDER, etc.                  |
| `NotificationStatus` | PENDING, SENT, FAILED, CANCELLED                                          |
| `CronJobStatus`      | SCHEDULED, RUNNING, COMPLETED, FAILED                                     |
| `EntityList`         | USER, RECURRING_ITEM, VENDOR, SERVICE, APPOINTMENT, NOTIFICATION, CRONJOB |

---

## API Endpoints (`/api/v1`)

Every module follows the same CRUD pattern:

| Method | Route              | Swagger Decorator |
| ------ | ------------------ | ----------------- |
| POST   | `/{module}`        | `Create*Swagger`  |
| PATCH  | `/{module}`        | `Update*Swagger`  |
| POST   | `/{module}/search` | `Search*Swagger`  |
| DELETE | `/{module}/:id`    | `Delete*Swagger`  |

**Note:** The Vendor module additionally has an internal `/vendors/validate-presence` endpoint for validating vendor IDs exist.

### Auth Endpoints

| Method | Route            | Description                |
| ------ | ---------------- | -------------------------- |
| POST   | `/auth/login`    | Returns JWT token          |
| POST   | `/auth/register` | Create user + return token |

### Auth Guard

- `JwtAuthGuard` extends `AuthGuard('jwt')` — applies to all routes except `POST /auth/login`, `POST /auth/register`, `POST /users`
- Uses `@jti()` param decorator to extract JWT ID from token

---

## Transaction Pattern

Each domain module has injectable transaction classes for create/update operations. These handle:

1. Validation (entity existence, constraints)
2. Side-effect operations (junction table mappings, notifications)
3. Rollback on failure (via TypeORM `transaction` EntityManager)

Transaction interfaces define `InputData` and `OutputData` types. The module service delegates to transaction classes rather than doing inline logic.

---

## DTO & Validation Conventions

- All DTOs use `class-validator` decorators: `@IsString()`, `@IsNumber()`, `@IsOptional()`, `@IsEnum()`, `@IsEmail()`, etc.
- Search DTOs: all fields are optional arrays (e.g. `id?: number[]`, `name?: string[]`)
- Error responses are `BadRequestException` with shape `{ key: string, message: string }`
- DTOs implement interfaces from `service_reminder_common`

---

## Mail System

- **Engine:** Nodemailer + Handlebars
- **Templates:** `.hbs` files in `src/mail/templates/`
- **Template interfaces:** `src/mail/templates/template-interfaces/`
- **Available templates:**
  - `service-reminder.hbs` — IServiceReminderTemplateData
  - `service-created.hbs` — IServiceCreated
  - `appointment-created.hbs` — IAppointmentCreated
  - `recurring-item-created.hbs` — IRecurringItemCreated
  - `vendor-created.hbs` — IVendorCreated
  - `user-signup.hbs` — IUserSignUp
- **Styling rules:** All styles in a single `<style>` tag in `<head>`; no inline `style=""` attributes except on anchor buttons
- **Config:** `src/mail/mail.config.ts` reads from env vars

### Email Template Theme

#### Colors

| Role                      | Value               | Usage                                                           |
| ------------------------- | ------------------- | --------------------------------------------------------------- |
| Page background           | `#0d0d0d`           | `body` background                                               |
| Container background      | `#1a1a1a`           | `.container` background                                         |
| Container border          | `1px solid #2a2a2a` | `.container` border                                             |
| Header background         | `#1a1a1a`           | `.header` background                                            |
| Header border-bottom      | `1px solid #2a2a2a` | `.header` border-bottom                                         |
| Primary accent            | `#6ee7b7`           | h1, section titles, left-border accents, links, table header bg |
| Heading text              | `#ffffff`           | `.header h1`, strong text                                       |
| Body text                 | `#c4c4c4`           | `.greeting p`, `.detail-value`, table `td`                      |
| Muted/label text          | `#888888`           | `.header p`, `.detail-label`, footer text                       |
| Error/danger              | `#f87171`           | Error states (if any)                                           |
| Info block background     | `#111111`           | `.appointment-info`, `.item-info`, `.last-service` background   |
| Info block left border    | `4px solid #6ee7b7` | Left accent border on info blocks                               |
| Details block background  | `#111111`           | `.appointment-details`, `.item-details`, `.service-details`     |
| Details block border      | `1px solid #2a2a2a` | Details block border                                            |
| Message block background  | `#1a1a1a`           | `.message` background                                           |
| Message block border      | `1px solid #2a2a2a` | `.message` border                                               |
| Message text              | `#c4c4c4`           | `.message` text                                                 |
| Footer border-top         | `1px solid #2a2a2a` | Footer separator                                                |
| Table header background   | `#6ee7b7`           | `thead tr` background                                           |
| Table header text         | `#0d0d0d`           | `thead th` text                                                 |
| Table row even background | `#111111`           | `tbody tr:nth-child(even)`                                      |
| Table row odd background  | `#1a1a1a`           | `tbody tr:nth-child(odd)`                                       |
| Table cell text           | `#c4c4c4`           | `tbody td`                                                      |
| Table border              | `1px solid #2a2a2a` | `tbody td` border-bottom                                        |
| Button background         | `#6ee7b7`           | Anchor buttons (Book, CTA)                                      |
| Button text               | `#0d0d0d`           | Anchor button text                                              |
| Input/divider border      | `#2a2a2a`           | Dividers, borders                                               |

#### Typography

| Property             | Value                          |
| -------------------- | ------------------------------ |
| Font family          | `'DM Sans', Arial, sans-serif` |
| h1 size              | `1.75rem`                      |
| h1 weight            | `600`                          |
| Body size            | `1rem`                         |
| Body color           | `#c4c4c4`                      |
| Label/small size     | `0.875rem`                     |
| Footer size          | `0.75rem`                      |
| Button size          | `1rem`                         |
| Button weight        | `500`                          |
| Section title size   | `0.95rem`                      |
| Section title weight | `700`                          |

#### Spacing

| Context                     | Value       |
| --------------------------- | ----------- |
| Container max-width         | `600px`     |
| Container border-radius     | `12px`      |
| Header padding              | `30px 20px` |
| Content padding             | `30px 20px` |
| Info/details block padding  | `15px`      |
| Details block border-radius | `8px`       |
| Message block padding       | `12px 15px` |
| Message block border-radius | `6px`       |
| Footer padding              | `20px`      |
| Button padding              | `12px 30px` |
| Button border-radius        | `8px`       |
| Detail row margin           | `10px 0`    |
| Section gap                 | `20px 0`    |

---

## Swagger Documentation

Each module has a `module.swagger.ts` file exporting decorator functions:

- `Create*Swagger()`
- `Update*Swagger()`
- `Search*Swagger()`
- `Delete*Swagger()`

All use `applyDecorators()` with `ApiBearerAuth('access-token')`, `ApiOperation`, `ApiBody` (with examples), `ApiOkResponse`, and `ApiBadRequestResponse`.

---

## Filter & Interceptor

- **HttpExceptionFilter** (`src/shared/filters/`) — global exception filter
- **TransformInterceptor** (`src/shared/interceptors/`) — transforms responses

---

## Key Directories

```
src/
├── appointment/       # Appointment module
├── auth/              # JWT auth (strategies, guards, dtos)
├── cronjob/           # Cron job tracking
├── database/          # TypeORM config
├── mail/              # Email sending + templates
├── notification/      # Notification queue
├── recurring-item/    # Recurring service items
├── service/           # Service records
├── shared/            # BaseService, EntityManagerBaseService, constants,
│                      # entities, filters, interceptors, pipes, services
├── user/              # User CRUD
└── vendor/            # Vendors + M:N junction with RecurringItem
```

---

## Development Commands

| Command                                                      | Description        |
| ------------------------------------------------------------ | ------------------ |
| `npm run start`                                              | Start dev server   |
| `npm run start:dev`                                          | Watch mode         |
| `npm run build`                                              | Compile            |
| `npm run lint`                                               | ESLint             |
| `npm run format`                                             | Prettier           |
| `npm run test`                                               | Jest tests         |
| `npm run migration:generate -- src/migrations/MigrationName` | Generate migration |
| `npm run migration:run`                                      | Run migrations     |

---

## Coding Conventions

1. **Pattern:** Controller → Service → Repository (via BaseService / EntityManagerBaseService)
2. **No inline console.log** — use structured logging
3. **DTOs:** Every Create/Update/Search DTO has matching interface in `service_reminder_common`
4. **Transactions:** Complex create/update logic must use transaction classes
5. **Entities:** All extend `BaseEntity` (except User/Appointment which extend a different base with `createdAt`/`updatedAt`)
6. **Timestamps:** Epoch `bigint` (`createdOn`/`updatedOn`) for most entities; `datetime` (`createdAt`/`updatedAt`) for User and Appointment
7. **Swagger:** Every endpoint decorated via module-specific swagger decorator function
8. **Errors:** Always throw `BadRequestException` with `{ key, message }` shape
