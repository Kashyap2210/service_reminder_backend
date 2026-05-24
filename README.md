# Service Reminder Backend

A NestJS backend application for managing service reminders, appointments, and notifications.

## Key Features

- User authentication and authorization
- Appointment scheduling and management
- Automated cron jobs for recurring tasks
- Email notifications via mail service
- Recurring item tracking
- Vendor management
- Service history and notifications

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT
- **Documentation**: Swagger
- **Email**: Nodemailer with Handlebars templates
- **Testing**: Jest
- **Containerization**: Docker

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd service_reminder_backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   docker-compose up -d
   ```

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

5. Configure environment variables (create `.env` file based on `.env.example` if available).

## Usage

Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1` with Swagger documentation at `http://localhost:3000/api/v1/docs`.

## Folder Structure

```
src/
├── appointment/       # Appointment management module
├── auth/             # Authentication module
├── config/           # Database and configuration
├── cronjob/          # Scheduled jobs
├── decorators/       # Custom decorators
├── guards/           # Authentication guards
├── mail/             # Email service
├── migrations/       # Database migrations
├── notification/     # Notification module
├── recurring-item/   # Recurring items
├── service/          # Service management
├── shared/           # Shared utilities
├── user/             # User management
└── vendor/           # Vendor management
```

## License

UNLICENSED
