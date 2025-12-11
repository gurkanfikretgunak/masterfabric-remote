# MasterFabric Remote - Core Architecture Analysis

## Overview

This document outlines the core architecture for the MasterFabric Remote Config Manager, a multi-tenant web application built with Next.js, Shadcn UI, and Supabase.

---

## Technology Stack

| Component | Technology | Role |
|-----------|------------|------|
| Frontend | Next.js (React) | Application interface and client-side logic |
| Styling | Shadcn UI & Tailwind CSS | White hierarchy, minimalist design |
| Backend | Supabase (Postgres, Auth, Edge Functions) | Database, authentication, API |
| State Management | React Context / Zustand | Session and connection state |
| Language | TypeScript | Type-safe, maintainable codebase |

---

## Design System: White Hierarchy

### Core Principles

- **Background**: Pure white (`bg-white`)
- **Text**: High contrast black (`text-gray-900`)
- **Borders**: Soft gray lines (`border-gray-200`)
- **Shadows**: Subtle depth (`shadow-sm`, `shadow-lg`)
- **Corners**: Rounded edges (`rounded-lg`, `rounded-xl`)
- **Icons**: Lucide Icons only (no emojis)
- **Accent Colors**: Minimal use for actions and status indicators

### Button Styles

```css
/* Primary Action Button */
.btn-primary {
  @apply px-4 py-2 bg-gray-900 text-white rounded-lg 
         hover:bg-gray-800 transition-colors font-medium;
}

/* Secondary Button */
.btn-secondary {
  @apply px-4 py-2 bg-white text-gray-900 border border-gray-200 
         rounded-lg hover:bg-gray-50 transition-colors font-medium;
}

/* Medium Input-like Button */
.btn-input {
  @apply px-4 py-2.5 bg-white text-gray-700 border border-gray-300 
         rounded-lg hover:border-gray-400 transition-colors 
         text-sm font-normal shadow-sm;
}
```

---

## Application Structure

```
app/
├── analysis/
│   └── docs/           # Technical documentation
├── components/
│   ├── ui/             # Shadcn UI components
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── lib/
│   ├── supabase/       # Supabase client & services
│   └── utils/          # Utility functions
├── types/              # TypeScript type definitions
└── App.tsx             # Main application entry
```

---

## Security Model

### Authentication Flow

1. User provides Supabase URL and Anon Key
2. Application initializes Supabase client
3. Authentication via `masterfabric-developer` credentials
4. JWT token stored and used for all subsequent requests

### Row-Level Security (RLS)

- All CRUD operations require authenticated user (`auth.uid() IS NOT NULL`)
- Tenant isolation enforced at database level
- Anonymous access strictly prohibited

---

## Service Layer

All Supabase interactions handled through centralized `SupabaseService.ts`:

- JWT token management
- Error handling
- Request/response transformation
- Authorization header injection

---

## Logo Usage

**Text Logo**: `MasterFabric Remote`

- Font: System sans-serif, medium weight
- Color: `text-gray-900` on white backgrounds
- Spacing: Proper letter-spacing for readability
