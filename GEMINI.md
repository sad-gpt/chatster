# Chatster — Developer Reference

## Project Layout

```
stranger_project/
  backend/          Express 5 + Socket.IO 4
    server.js       Main entry point
    services/
      redis.js      Redis connection & retry logic
      matchmaking.js Redis-based queue management
  frontend/         Next.js 15 App Router, React 19, TypeScript, Tailwind v4
    src/
      app/          Pages (Strict Pink/Purple theme, No White)
      components/   Shared UI (AgeModal, SafetyBanner)
```

## Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | Next.js 15, React 19, TypeScript          |
| Styling   | Tailwind CSS v4 (Strict Purple/Pink)      |
| Realtime  | socket.io-client → backend port 5050      |
| Backend   | Express 5, Socket.IO 4, Node.js           |
| Queue/DB  | Redis (Docker) — Ephemeral matchmaking    |

## Design System (Strict Constraints)

- **Theme**: Strictly Purple and Pink basis. 
- **NO WHITE**: Pure white (`#ffffff` / `bg-white`) is strictly prohibited.
- **Backgrounds**: `bg-gradient-to-br from-pink-700 via-fuchsia-800 to-purple-900`
- **Text**: Use `text-pink-50` or `text-pink-100` for light content.
- **Cards/Modals**: `bg-pink-50` (light variant) or `bg-purple-900/bg-purple-950` (dark variant).
- **Interactive**: Buttons must be disabled until Terms & Conditions checkbox is checked on the landing page.

## Matchmaking Logic (Redis)

- **Waiting Queues**: Stored in Redis lists: `waiting:male`, `waiting:female`, `waiting:any`.
- **Matching**: 
  - Users are pushed to their gender-specific queue.
  - Finder pops from queues matching their `preference`.
  - Logic handles "any" preference and "any" gender cross-matching.
- **Resilience**: On disconnect/skip, partners are automatically re-queued for a new match.

## Storage Conventions

| Key             | Storage       | Purpose                          |
|-----------------|---------------|----------------------------------|
| `ageVerified`   | localStorage  | Skip age modal on return visit   |
| `username`      | sessionStorage| Guest name for current session   |
| `gender`        | sessionStorage| Used in matchmaking              |
| `preference`    | sessionStorage| Used in matchmaking              |
| `waiting:*`     | Redis (List)  | Active matchmaking pool          |

## Running Locally

```bash
# 1. Start Redis (Docker)
docker run -d --name chatster-redis -p 6379:6379 redis:alpine

# 2. Backend (port 5050)
cd backend && npm install && node server.js

# 3. Frontend (port 3000)
cd frontend && npm install && npm run dev
```

## Key Rules

- **Theme Integrity**: Never use `bg-white` or `text-white`. Use pink/purple equivalents.
- **Navigation**: Landing page actions are blocked until T&C checkbox is `true`.
- **Age Gate**: Lives in `AgeModal`, mandatory on first visit.
- **Realtime**: Keep socket logic in `server.js` but offload queue logic to `matchmaking.js`.
- **Database**: Do not add a persistent database (MongoDB/SQL). All data is ephemeral.
- **Linting**: Ensure all apostrophes and entities are escaped (`&apos;`, etc.).
