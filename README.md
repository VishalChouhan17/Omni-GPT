# 🚀 OmniGPT — Next-Generation AI Chat Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?logo=prisma)](https://www.prisma.io/)
[![Neon PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-336791?logo=postgresql)](https://neon.tech/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)](https://clerk.com/)

**OmniGPT** is a production-ready, full-stack conversational AI platform built with **Next.js 16 App Router**, **React 19**, and the **Vercel AI SDK**. It features real-time Server-Sent Events (SSE) token streaming, relational persistence with PostgreSQL & Prisma, optimistic state synchronization via TanStack Query, and authentication backed by Clerk.

---

## 🏗️ Architecture & Data Flow

```text
┌─────────────────┐       HTTP / SSE Stream       ┌────────────────────────┐
│  Client UI      │ ◄───────────────────────────► │  Next.js 16 App Router │
│  (React 19)     │                               │  (/api/chat route)     │
└────────┬────────┘                               └───────────┬────────────┘
         │                                                    │
         │ TanStack Query (Optimistic UI)                     │ OpenAI SDK
         ▼                                                    ▼
┌─────────────────┐                               ┌────────────────────────┐
│  App Sidebar &  │                               │  OpenAI API            │
│  Chat History   │                               │  (gpt-4o / gpt-4o-mini)│
└────────┬────────┘                               └────────────────────────┘
         │
         │ Prisma ORM (Connection Pooler)
         ▼
┌─────────────────────────────┐
│  Neon Serverless PostgreSQL │
│  (Users, Chats, Messages)   │
└─────────────────────────────┘
```

---

## ✨ Key Engineering Highlights

- **Real-Time Token Streaming**: High-throughput response streaming powered by Vercel AI SDK (`toUIMessageStreamResponse`), delivering low Time-To-First-Token (TTFT) latency.
- **Relational Chat Persistence**: Multi-turn chat persistence in serverless PostgreSQL using Prisma ORM with indexed message lookup and title auto-generation from first prompts.
- **Next.js 16 App Router Architecture**: Uses modern layout grouping `(root)` vs `(auth)`, dynamic route handlers, Server Actions for mutations, and Suspense boundaries.
- **Authentication & Onboarding**: Clerk authentication integrated at the root layout with auto-provisioning database sync and route protection via `auth.protect()`.
- **Rich AI Render Engine**: Syntax highlighting via Shiki and Streamdown supporting code blocks, mathematical equations via KaTeX, and Mermaid diagrams.
- **Theme & Modern Design System**: Responsive sidebar layout, dark/light theme toggle powered by `next-themes`, and Tailwind CSS v4 design tokens.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Next.js 16 (Turbopack), Tailwind CSS v4, Base UI, Lucide Icons |
| **AI & Streaming** | Vercel AI SDK 5/7, `@ai-sdk/openai`, Server-Sent Events (SSE) |
| **State & Cache** | TanStack React Query v5, Optimistic UI Cache Invalidation |
| **Database & ORM**| PostgreSQL (Neon Serverless), Prisma ORM 7 with PgPool adapter |
| **Auth & Security**| Clerk Auth, Protected API Routes & Server Actions |
| **Markdown / Code**| Streamdown, Shiki syntax highlighter, KaTeX math rendering |

---

## 📁 Project Structure

```text
op-gpt/
├── app/
│   ├── (auth)/signin/         # Clerk Authentication pages with Suspense boundaries
│   ├── (root)/                # Protected workspace shell
│   │   ├── c/[id]/page.tsx    # Dynamic chat conversation view
│   │   ├── layout.tsx         # Sidebar shell & route guard
│   │   └── page.tsx           # Auto-provisioning new chat root
│   ├── api/chat/route.ts      # SSE streaming endpoint with OpenAI integration
│   └── globals.css            # Tailwind CSS v4 styling & theme tokens
├── components/
│   ├── ai-elements/           # Conversation scroller, message bubble, streaming loader
│   ├── providers/             # Theme & React Query client providers
│   └── ui/                    # Reusable UI primitives (dialogs, sidebars, inputs)
├── features/
│   ├── ai/                    # Model resolvers & chat store persistence logic
│   ├── auth/                  # Clerk onboarding & user authorization hooks
│   └── conversation/          # Sidebar, message composer, action hooks & mutations
├── lib/
│   ├── db.ts                  # Prisma client instance with Neon connection pool
│   └── highlighter.tsx        # Shiki streaming syntax highlighter
└── prisma/
    └── schema.prisma          # Database schema (User, Conversation, Message)
```

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/omni-gpt.git
cd omni-gpt
bun install  # or npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGNIN_URL="/signin"
NEXT_PUBLIC_CLERK_SIGNIN_FALLBACK_URL="/"
NEXT_PUBLIC_CLERK_SIGNUP_FALLBACK_URL="/"

OPENAI_API_KEY="sk-proj-..."
```

### 3. Setup Database Schema
```bash
bun x prisma db push
# or bun x prisma migrate dev
```

### 4. Run Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 💼 Resume Bullet Points

> *Feel free to use or adapt these for your resume:*

- **Full-Stack AI Chat Platform (OmniGPT)**: Architected and built a responsive AI chat platform using **Next.js 16**, **React 19**, and **Vercel AI SDK**, supporting real-time SSE streaming with sub-second Time-To-First-Token latency.
- **Relational Data Modeling & Performance**: Designed normalized PostgreSQL database schema with Prisma ORM; optimized queries with composite indexes on user conversations and message history.
- **Optimistic State Management**: Integrated **TanStack React Query** for client-side optimistic UI updates, active chat status indicators, and automatic query cache invalidation on stream completion.
- **Enterprise-Grade Security**: Enforced route protection and user session sync using **Clerk Authentication** and Server Actions, verifying user ownership across all message operations.
