# Agent Instructions — Service Reminder Backend

## Before Every Task

1. Read CODEBASE.md fully before making any changes
2. Understand which module, service, and controller is affected
3. Never create new services, modules, or entities unless explicitly asked

## Architecture Rules

- NestJS standalone modules — every feature has its own module
- Always follow the existing module structure: Controller → Service → Repository pattern
- DTOs must be validated using class-validator decorators
- All responses must follow the existing response shape used in that module
- Never change the API base path or versioning (`/api/v1`)

## Database Rules

- Never modify existing entity columns unless explicitly asked
- Always use TypeORM conventions already present in the codebase
- Migrations must be created for any schema change — never use `synchronize: true`

## Email Templates Rules

- ALL styles must live inside a single <style> tag in <head> — no inline style="" attributes anywhere
- Exception: anchor tags used as buttons (e.g. Book button) may keep inline styles as email clients require it
- Never modify template variables, handlebars expressions, conditionals, or content
- Always refer to CODEBASE.md for all color, spacing, and typography values — never guess or use values not documented there
- Never guess or hallucinate style values

## Code Conventions

- Follow naming patterns already in the codebase exactly
- Never introduce a new library without being explicitly asked
- Never remove existing error handling or validation
- Keep controllers thin — all logic lives in services
- This is a pure NestJS backend — never reference, import, or suggest anything from the frontend

## Files to NEVER Read, Reference, or Modify

- .env, .env._, _.env
- _.pem, _.key, _.pub, \*\*/.ssh/_
- .aws/, .gcp/, .azure/, \*\*/credentials.json
- secrets/, private/, _.secret, _.secrets
- _.sqlite, _.db
- logs/, \*.log
- .npmrc, .yarnrc, .pnpmrc
- .DS_Store, Thumbs.db

## Do NOTs

- Do NOT read, open, reference, or mention any file listed above under "Files to NEVER Read"
- Do NOT import or suggest anything from the frontend codebase
- Do NOT modify .env or any config files
- Do NOT change existing DTO structures without being asked
- Do NOT add console.log statements
- Do NOT guess styling values for email templates
- Do NOT use synchronize: true in TypeORM config
- Do NOT create new modules, services, or entities unless explicitly instructed
- Do NOT use inline style="" attributes in templates except on anchor button tags
