# Chatster — Developer Reference

## Project Layout

```
stranger_project/
  backend/          Express 5 + Socket.IO 4 (no database — ephemeral only)
    server.js       Single entry point
  frontend/         Next.js 16 App Router, React 19, TypeScript, Tailwind v4
    src/
      app/          Pages (App Router conventions)
      components/   Shared UI components
```

## Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | Next.js 16, React 19, TypeScript          |
| Styling   | Tailwind CSS v4 (`@tailwindcss/postcss`)  |
| Realtime  | socket.io-client → backend port 5050      |
| Backend   | Express 5, Socket.IO 4, Node.js           |
| Database  | None — all chat is ephemeral              |

## Design System

- **Background gradient**: `from-pink-700 via-fuchsia-800 to-purple-900`
- **Primary button**: `bg-gradient-to-r from-pink-500 to-purple-600`
- **Input focus ring**: `ring-pink-400`
- **Accent text**: `text-pink-600`
- **Card**: `bg-white rounded-2xl shadow-2xl`

## Storage Conventions

| Key             | Storage       | Purpose                          |
|-----------------|---------------|----------------------------------|
| `ageVerified`   | localStorage  | Skip age modal on return visit   |
| `username`      | sessionStorage| Guest name for current session   |
| `gender`        | sessionStorage| Used in matchmaking              |
| `preference`    | sessionStorage| Used in matchmaking              |

## Running Locally

```bash
# Backend (port 5050)
cd backend && node server.js

# Frontend (port 3000)
cd frontend && npm run dev
```

## Key Rules

- `"use client"` only on components that use hooks or browser APIs
- No database — do not add one without discussion
- Legal pages (`/terms`, `/privacy`) are static server components
- Do not store chat messages anywhere (server or client persistence)
- Keep components small and single-purpose
- Do not add libraries without a clear need
- Age gate lives in `AgeModal` component, checked via `localStorage`
