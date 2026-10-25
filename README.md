# 🚀 OmniGPT — Production Full-Stack AI Chat Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?logo=prisma)](https://www.prisma.io/)
[![Neon PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-336791?logo=postgresql)](https://neon.tech/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)](https://clerk.com/)
[![AI SDK 7](https://img.shields.io/badge/AI_SDK-v7-000000?logo=vercel)](https://sdk.vercel.ai/)

**OmniGPT** is an enterprise-ready, full-stack AI conversational platform built with **Next.js 16 App Router**, **React 19**, and the **Vercel AI SDK**. It features real-time Server-Sent Events (SSE) token streaming, multi-step tool execution with real-time web search, serverless PostgreSQL persistence, Shiki code syntax highlighting, KaTeX mathematical typesetting, and end-to-end authentication via Clerk.

---

## 🏗️ System Architecture & Execution Flow

```text
┌─────────────────┐       HTTP / SSE Stream       ┌────────────────────────┐
│  Client UI      │ ◄───────────────────────────► │  Next.js 16 App Router │
│  (React 19)     │                               │  (/api/chat route)     │
└────────┬────────┘                               └───────────┬────────────┘
         │                                                    │
         │ TanStack Query (Optimistic UI)                     │ Vercel AI SDK (streamText)
         ▼                                                    ▼
┌─────────────────┐                               ┌────────────────────────┐
│  App Sidebar &  │                               │  OpenAI / AI Gateway   │
│  Chat History   │                               │  (gpt-4o / gpt-4o-mini)│
└────────┬────────┘                               └───────────┬────────────┘
         │                                                    │
         │ Prisma ORM (PgPool Adapter)                        │ Tool Call Loop (stopWhen)
         ▼                                                    ▼
┌─────────────────────────────┐                   ┌────────────────────────┐
│  Neon Serverless PostgreSQL │                   │  Web Search Tool       │
│  (Users, Chats, Messages)   │                   │  (DuckDuckGo / Tavily) │
└─────────────────────────────┘                   └────────────────────────┘
```

---

## ✨ Key Features & Engineering Highlights

- ⚡ **Low-Latency Streaming**: Sub-second Time-To-First-Token (TTFT) via Vercel AI SDK (`toUIMessageStreamResponse`) over Server-Sent Events (SSE).
- 🌐 **Real-Time Web Search Tool**: Multi-step AI agent calling with live internet data retrieval (DuckDuckGo zero-config fallback + optional Tavily search API) for real-time weather, news, and live facts.
- 🎨 **Rich AI Rendering Engine**:
  - **Syntax Highlighting**: Shiki-powered server/client code blocks with language badges, copy-to-clipboard buttons, and line numbers.
  - **Mathematical Typesetting**: KaTeX math rendering supporting inline (`$...$`) and block (`$$...$$`) LaTeX formulas.
  - **Markdown Hierarchy**: Headers, formatted tables, task lists, and quotes.
- 🗄️ **Relational Multi-Turn Persistence**: PostgreSQL schema managed with Prisma ORM 7; automatically saves conversations, auto-generates chat titles from the initial prompt, and loads historical context.
- 🔐 **Production-Grade Auth & Security**: User authentication and session management via Clerk with middleware route protection (`auth.protect()`) and user-isolated conversation ownership.
- 🌗 **Responsive Theme System**: Dark and light mode toggle powered by `next-themes` and modern Tailwind CSS v4 design tokens.
- ⚡ **Optimistic Cache Management**: TanStack React Query v5 handles sidebar chat listing, active status indicators, and cache updates.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Next.js 16 (Turbopack), Tailwind CSS v4, Base UI, Lucide Icons |
| **AI & Agent Tools**| Vercel AI SDK 7, `@ai-sdk/openai`, multi-step tool calling, DuckDuckGo / Tavily |
| **State & Cache** | TanStack React Query v5, Optimistic UI Cache Invalidation |
| **Database & ORM**| PostgreSQL (Neon Serverless), Prisma ORM 7 with `@prisma/adapter-pg` |
| **Auth & Security**| Clerk Auth (`@clerk/nextjs`), Protected API Routes & Middleware |
| **Markdown / Highlighting**| Streamdown, Shiki (`@streamdown/code`), KaTeX (`@streamdown/math`) |

---

## 📁 Project Directory Structure

```text
op-gpt/
├── app/
│   ├── (auth)/signin/         # Clerk Authentication pages with Suspense boundaries
│   ├── (root)/                # Protected workspace shell
│   │   ├── c/[id]/page.tsx    # Dynamic chat conversation view
│   │   ├── layout.tsx         # Sidebar shell & route guard
│   │   └── page.tsx           # Auto-provisioning new chat root
│   ├── api/chat/route.ts      # Multi-step SSE streaming & tool execution endpoint
│   └── globals.css            # Tailwind CSS v4 styles & Shiki code block tokens
├── components/
│   ├── ai-elements/           # Conversation scroller, message bubble, streaming loader
│   ├── providers/             # Theme & React Query client providers
│   └── ui/                    # Reusable UI primitives (dialogs, sidebars, buttons)
├── features/
│   ├── ai/
│   │   ├── actions/           # Chat store persistence (load & save messages)
│   │   ├── tools/             # AI tools (web-search with DuckDuckGo / Tavily)
│   │   └── utils/             # Model resolver & system prompt configuration
│   ├── auth/                  # Clerk user onboarding & database sync actions
│   └── conversation/          # Sidebar, message composer, action hooks & mutations
├── lib/
│   └── db.ts                  # Prisma Client instance with PgPool adapter
└── prisma/
    └── schema.prisma          # Database schema (User, Conversation, Message)
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- [Bun](https://bun.sh/) (or Node.js 18+)
- A [Neon](https://neon.tech/) or [Supabase](https://supabase.com/) PostgreSQL database
- A [Clerk](https://clerk.com/) account
- An [OpenAI](https://platform.openai.com/) API Key

### 2. Clone & Install
```bash
git clone https://github.com/your-username/omni-gpt.git
cd omni-gpt
bun install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in the variables in `.env`:
```env
# PostgreSQL Connection (Neon Serverless recommended)
DATABASE_URL="postgresql://user:password@endpoint-pooler.region.neon.tech/neondb?sslmode=require"

# Clerk Authentication (Development keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/signin"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_URL="/"

# OpenAI API Key
OPENAI_API_KEY="sk-proj-..."

# Optional: Tavily Search (Free DuckDuckGo fallback is active by default)
# TAVILY_API_KEY="tvly-..."
```

### 4. Push Database Schema
```bash
bun x prisma db push
```

### 5. Run the App
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment Guide (Vercel + Neon + Clerk)

To ensure login, database persistence, streaming, and tools work reliably in production, follow these steps:

### Step 1: Deploy Database (Neon Serverless PostgreSQL)
1. In your [Neon Console](https://console.neon.tech/), create a project.
2. Under **Connection Details**, ensure **Connection Pooling** is toggled **ON** (pooled connection prevents connection limits in serverless environments).
3. Copy the pooled connection string.
4. Run migrations against your production database:
   ```bash
   DATABASE_URL="<your-production-pooled-database-url>" bun x prisma db push
   ```

### Step 2: Configure Clerk for Production
1. In your [Clerk Dashboard](https://dashboard.clerk.com/):
   - Switch your application from **Development** mode to **Production** (or create a production instance).
   - Go to **API Keys** and copy your production keys:
     - `pk_live_...` (Publishable Key)
     - `sk_live_...` (Secret Key)
   - Go to **Configure > Domains & Paths**:
     - Set your production URL (e.g. `https://omni-gpt.vercel.app` or your custom domain).
   - Under **Paths**, verify sign-in is set to `/signin`.

### Step 3: Deploy to Vercel
1. Push your repository to GitHub / GitLab.
2. In the [Vercel Dashboard](https://vercel.com/):
   - Click **Add New > Project** and import your repository.
   - Framework Preset: **Next.js** (detected automatically).
   - Build Command: `prisma generate && next build` (configured in `package.json`).
3. Add the **Environment Variables** in Vercel project settings:

| Variable Name | Value Description |
| :--- | :--- |
| `DATABASE_URL` | Pooled Neon PostgreSQL connection string (`sslmode=require`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk production publishable key (`pk_live_...`) |
| `CLERK_SECRET_KEY` | Clerk production secret key (`sk_live_...`) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/signin` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_URL` | `/` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_URL` | `/` |
| `OPENAI_API_KEY` | OpenAI API Key (`sk-proj-...`) |
| `TAVILY_API_KEY` | *(Optional)* Tavily search API key |

4. Click **Deploy**.

---

## ✅ Post-Deployment Smoke Test Checklist

Once deployed, verify these core flows:
- [ ] **Authentication**: Open your deployed URL (`https://your-domain.vercel.app`), verify redirect to `/signin`, and complete sign-up / login.
- [ ] **Database Provisioning**: Verify the user record appears in your Neon database `User` table upon first login.
- [ ] **Streaming Chat**: Send a coding question (e.g. *"Write a TypeScript debounce function"*); ensure code syntax highlighting and token streaming work smoothly.
- [ ] **Math Rendering**: Ask a math question (e.g. *"Show Bayes' Theorem and quadratic formula"*); verify formulas render cleanly via KaTeX.
- [ ] **Web Search Tool**: Ask a live question (e.g. *"What is the current weather in Tokyo today?"*); verify the AI invokes `searchWeb` and answers with live data.
- [ ] **Chat Persistence**: Refresh the browser; verify your previous chat appears in the sidebar and loads conversation history.

---
