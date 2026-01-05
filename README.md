# Real-Time Collaborative Task Board

A production-style task management system with real-time updates, utilizing Next.js, Fastify, PostgreSQL, Redis, and WebSockets.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Zustand, Tailwind CSS, WebSockets.
- **Backend**: Fastify, TypeScript, Prisma, PostgreSQL, Redis, WebSockets.
- **Infrastructure**: Docker (for DB and Redis).

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- npm or pnpm

## Getting Started

### 1. Start Infrastructure

```bash
docker-compose up -d
```

### 2. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Features

- **Authentication**: JWT-based auth.
- **Task Board**: 3-column Kanban board with drag & drop.
- **Real-time Sync**: Updates reflect instantly across all connected clients.
- **Optimistic UI**: Immediate feedback with rollback on error.
- **Caching**: Redis caching for task lists.
