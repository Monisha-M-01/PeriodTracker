# Cycle Backend

A robust Node.js/TypeScript REST API for period and cycle tracking. Designed with data privacy, isolation, and dynamic cycle predictions in mind.

## Tech Stack
- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Auth:** JWT (Short-lived Access Token + HTTP-Only Refresh Token)
- **Testing:** Vitest

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (for local PostgreSQL instance)

### Setup

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   (Modify `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` for production)

3. **Start Database**
   ```bash
   docker-compose up -d
   ```

4. **Initialize Database Schema**
   ```bash
   npx prisma db push
   # OR for migrations:
   npx prisma migrate dev --name init
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

### Scripts (Add to package.json)
```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "vitest",
  "db:push": "prisma db push",
  "db:studio": "prisma studio"
}
```

## API Modules

All endpoints are prefixed with `/api/v1`.

- **`/auth`**: Signup, login, logout, refresh tokens.
- **`/users`**: `GET /me` (profile), `PATCH /me/settings` (defaults & notifications).
- **`/period`**: Log raw period start and end dates.
- **`/symptoms`**: Log daily symptoms (mood, flow, cramps, etc.) using flexible categories.
- **`/cycles`**: `GET /predictions` computes average cycle/period lengths and estimates next period and fertile windows dynamically.
