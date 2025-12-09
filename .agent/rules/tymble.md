---
trigger: always_on
glob:
description: Tymble project conventions and best practices
---

# Tymble Project Rules

## Monorepo Structure

This is a **pnpm workspace monorepo** managed with **Turborepo**.

```
tymble/
├── apps/
│   ├── tymble-api/     # NestJS backend
│   └── tymble-ui/      # React frontend
├── packages/
│   ├── db/             # @tymble/db - Drizzle schema & relations
│   ├── schemas/        # @tymble/schemas - Zod DTOs shared API/UI
│   ├── typescript-config/
│   └── ui/             # @tymble/ui - Shared UI components
└── bruno/              # API testing collection
```

### Common Commands

```bash
pnpm dev          # Run all dev servers
pnpm app          # Run tymble-api + tymble-ui with TUI
pnpm build        # Build all packages
pnpm lint         # Lint with Biome
pnpm lint:fix     # Fix lint issues
pnpm check-types  # TypeScript type checking
```

---

## Backend (tymble-api)

### Tech Stack

- **Framework**: NestJS 11
- **ORM**: Drizzle ORM with PostgreSQL
- **Database**: PostgreSQL via Supabase
- **Auth**: Passport.js with JWT + Local strategies
- **Validation**: Zod via nestjs-zod
- **Docs**: Swagger (@nestjs/swagger)
- **Runtime**: Node.js (Bun for scripts)

### Module Structure

Each feature follows NestJS conventions:
```
src/{feature}/
├── {feature}.module.ts      # Module definition
├── {feature}.controller.ts  # HTTP endpoints
├── {feature}.service.ts     # Business logic
├── dto/                     # Import from @tymble/schemas
└── strategies/              # Auth strategies (auth feature only)
```

### Database Commands

```bash
cd apps/tymble-api
pnpm db:push      # Push schema to database
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed with bun
```

### Schema Definition

- Define schemas in `packages/db/src/schemas/`
- Define relations in `packages/db/src/relations/`
- Use Drizzle's `pgTable` and export insert/select schemas

---

## Frontend (tymble-ui)

### Tech Stack

- **Framework**: React 19 with Vite (rolldown-vite)
- **Styling**: TailwindCSS v4 with oklch colors
- **Routing**: TanStack Router (file-based)
- **State**: TanStack Query for server state
- **Forms**: TanStack Form with Zod validation
- **Tables**: TanStack Table
- **UI Components**: shadcn/ui + Radix primitives
- **Icons**: Lucide React + Tabler Icons
- **Animations**: Motion (framer-motion)
- **Drag & Drop**: dnd-kit
- **Rich Text**: Tiptap
- **Charts**: Recharts
- **Theming**: next-themes (dark mode)

### Directory Structure

```
src/
├── api/            # API client functions
├── app/            # App-level concerns
├── assets/         # Static assets (Geist fonts)
├── components/     # Feature components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── layouts/        # Layout components
├── lib/            # Utility libraries
├── locales/        # i18n translation files
├── routes/         # TanStack Router file-based routes
├── schemas/        # Frontend-specific Zod schemas
├── ui/             # Base UI components (shadcn)
├── index.css       # TailwindCSS theme & globals
└── main.tsx        # App entry point
```

### Component Conventions

1. **UI Components** (`src/ui/`): Base shadcn/ui primitives
2. **Feature Components** (`src/components/`): Composed components
3. Export with `export const ComponentName = () => {}`
4. Use `class-variance-authority` (cva) for variants
5. Use `cn()` utility from `@/ui/utils` for class merging

### Styling Rules

- Use TailwindCSS v4 syntax with `@theme inline`
- Colors defined as CSS custom properties with oklch
- Dark mode via `.dark` class selector
- Use `@custom-variant dark (&:is(.dark *))` for dark mode
- Prefer semantic color tokens: `bg-background`, `text-foreground`

### Path Aliases

```typescript
@/components/* → src/components/*
@/ui/*         → src/ui/*
@/hooks/*      → src/hooks/*
@/lib/*        → src/lib/*
@/api/*        → src/api/*
@/schemas/*    → src/schemas/*
```

---

## Shared Packages

### @tymble/schemas

Zod schemas shared between API and UI.

```typescript
// Pattern for API DTOs
export const exampleSchema = {
  dto: z.object({ ... }),  // Request body
  res: z.object({ ... }),  // Response
} satisfies DTOStructure;

export type Example = InferDto<typeof exampleSchema>;
```

### @tymble/db

Drizzle schema definitions.

```typescript
// Extends Drizzle insert schemas
import { userInsertSchema } from '@tymble/db';

const createUserDto = userInsertSchema.omit({ ... }).extend({ ... });
```

---

## Tooling

### Linting (Biome)

- Config: `biome.jsonc` with `ultracite/core` + `ultracite/react` presets
- Single quotes for JS, double quotes for JSX
- Run: `pnpm lint` / `pnpm lint:fix`

### TypeScript

- Strict mode enabled
- Shared configs in `packages/typescript-config`
- Use `type` imports: `import type { ... }`

### Scripts

- Use **Bun** for TypeScript scripts: `bun run script.ts`
- Scripts directory: `scripts/` or `apps/*/scripts/`

---

## Conventions

### Imports

1. External packages first
2. Internal packages (`@tymble/*`)
3. Absolute path aliases (`@/...`)
4. Relative imports last

### Naming

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions/variables**: camelCase (`getUserById`)
- **Types**: PascalCase (`UserProfile`)
- **Constants**: SCREAMING_SNAKE_CASE or camelCase

### API Patterns

- Controllers use decorators from `@nestjs/*`
- Services inject dependencies via constructor
- Use `@tymble/schemas` for request/response validation
- Auth via `@UseGuards(JwtAuthGuard)` decorator

### i18n

- Translation files in `src/locales/` (en.json, fr.json, etc.)
- Use `useTranslation()` hook
- Keys follow dot notation: `navigation.portfolio.title`
- Validate translations: `pnpm i18n:validate`
