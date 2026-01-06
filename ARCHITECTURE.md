# Architecture Overview

This project implements a **Real-Time Collaborative Task Board** using a modern, scalable tech stack. The architecture is designed to handle real-time state, ensure data consistency, and provide a seamless offline-first experience.

## System Components

### 1. Frontend (Next.js App Router)
- **Framework**: Next.js 14+ with App Router for server-side rendering and static optimization.
- **State Management**: `Zustand` with `persist` middleware for local storage.
    - `useAuthStore`: Manages user session and JWT.
    - `useTaskStore`: Manages board state, optimistic updates, and WebSocket events.
    - `useQueueStore`: Persists offline mutations.
- **Real-Time Client**: `Socket.io-client` listens for `TASK_CREATED`, `TASK_UPDATED`, `TASK_DELETED` events.
- **Offline Sync**: `OfflineSyncManager` component monitors `navigator.onLine` and replays queued mutations when connectivity is restored.

### 2. Backend (Fastify)
- **Framework**: Fastify for high-performance Node.js API.
- **Database**: PostgreSQL with Prisma ORM for type-safe database access.
- **Caching**: Redis is used to cache `GET /tasks` responses. Cache is invalidated on any write operation (Create, Update, Delete).
- **WebSockets**: `Socket.io` server integrated via `app.decorate('io')`. Broadcasts events to all connected clients immediately after DB writes.
- **Authentication**: JWT-based protection using `@fastify/jwt`.

### 3. Infrastructure
- **Docker Compose**: Orchestrates PostgreSQL (Port 5432) and Redis (Port 6379) services.

## Data Flow

1.  **User Action**: User moves a task card.
2.  **Optimistic UI**: Zustand store updates immediately; UI reflects change.
3.  **Offline Check**:
    - If **Offline**: Action added to `useQueueStore`. UI shows offline warning.
    - If **Online**: API request sent to Fastify.
4.  **Backend Processing**:
    - Auth check.
    - DB Update via Prisma.
    - Redis Cache Invalidation.
    - Socket.io Event Emission (`TASK_UPDATED`).
5.  **Synchronization**: Other clients receive the event and update their local stores without a full refetch.

## Error Handling
- **API Failure**: If an API call fails after an optimistic update, the frontend triggers a rollback by refetching the consistent state from the server.
- **Offline Recovery**: When online status is detected, the `OfflineSyncManager` iterates through the queue and synchronizes changes sequentially.
