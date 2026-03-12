# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Clients                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Mini App   │  │ Admin (SPA)  │  │   Mobile     │  │
│  │  (uni-app)   │  │  React/AntD  │  │   (future)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │
          └────────────┬────┘                 │
                       ▼                      │
          ┌────────────────────────┐          │
          │    API Gateway         │◄─────────┘
          │  (NestJS :3000)        │
          │  - Auth (JWT)          │
          │  - Products/Orders     │
          │  - Users/Cart          │
          │  - Swagger /api/docs   │
          └────────────┬───────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
 ┌──────────┐  ┌──────────┐  ┌─────────────┐
 │ Postgres │  │  Redis   │  │Agent Service│
 │  :5432   │  │  :6379   │  │  FastAPI    │
 │(Prisma)  │  │ (cache)  │  │  :8000      │
 └──────────┘  └──────────┘  └─────────────┘

Future Microservices (backend/):
 ┌───────────┐ ┌─────────────┐ ┌──────────────┐ ┌─────────────┐
 │   user    │ │   product   │ │    order     │ │   payment   │
 │ :3001     │ │   :3002     │ │    :3003     │ │   :3004     │
 └───────────┘ └─────────────┘ └──────────────┘ └─────────────┘
```

## Service Descriptions

### apps/miniapp
WeChat mini program built with uni-app + Vue 3 + TypeScript.
- **State**: Pinia stores (auth, cart, order, address)
- **UI**: uview-plus + @dcloudio/uni-ui
- **API**: Connects to api-gateway via REST

### apps/admin
React-based admin dashboard.
- **Framework**: React 18 + Vite
- **UI**: Ant Design 5
- **State**: Zustand (persisted auth), React Query (server state)
- **API**: Proxied to api-gateway at `/api`

### backend/api-gateway
Main NestJS monolith (single backend for now).
- **ORM**: Prisma + PostgreSQL
- **Auth**: JWT (passport-jwt)
- **Docs**: Swagger at `/api/docs`
- **Port**: 3000

### agent-service
Python FastAPI service for AI-powered chat.
- **AI**: LangGraph + LangChain + OpenAI
- **Agents**: Recommendation + Customer Support
- **Port**: 8000

### packages/
Shared TypeScript packages:
- `api-sdk`: Type definitions (models + API responses)
- `config`: Shared constants and environment config
- `utils`: Formatters and validators
- `ui`: Stub for future cross-platform components

## Data Flow

### User Authentication
```
Mini App → POST /api/auth/login → api-gateway → Prisma → PostgreSQL
                                ← JWT tokens ←
```

### Add to Cart
```
Mini App → POST /api/cart → api-gateway (auth check) → Prisma → PostgreSQL
                          ← CartItem ←
```

### AI Chat
```
Mini App → POST /chat/message → agent-service → OpenAI API
                              ← AI response ←
```

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Mini App | uni-app 3, Vue 3, TypeScript, Pinia, uview-plus |
| Admin | React 18, Ant Design 5, Zustand, React Query |
| API Gateway | NestJS 11, Prisma 7, PostgreSQL 16 |
| Agent | FastAPI, LangGraph, LangChain, OpenAI |
| Package Manager | pnpm workspaces |
| CI/CD | GitHub Actions |
| Container | Docker Compose |
