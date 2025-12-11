---
name: MasterFabric Remote Implementation Plan
overview: Complete implementation plan for MasterFabric Remote Config Manager with Next.js, Supabase, and white hierarchy design system. Includes detailed Mermaid diagrams for UI flows, component architecture, and data flow.
todos:
  - id: setup-project
    content: "Set up project infrastructure: install dependencies (@supabase/supabase-js, lucide-react), create lib/supabase structure, configure TypeScript types, update globals.css with white hierarchy design system"
    status: completed
  - id: create-services
    content: "Create core services: SupabaseService.ts for database operations, AuthService.ts for authentication, storage utilities for localStorage management"
    status: completed
    dependencies:
      - setup-project
  - id: build-ui-components
    content: "Build reusable UI component library: Button (Primary/Secondary/Ghost/Danger), Input (Text/Password), Card, Table, Badge, Alert, CodeBlock, Spinner following white hierarchy design"
    status: completed
    dependencies:
      - setup-project
  - id: implement-splash
    content: "Implement Splash view: connection check logic, localStorage validation, authentication attempt, redirect handling"
    status: completed
    dependencies:
      - create-services
      - build-ui-components
  - id: implement-onboarding
    content: "Implement Onboarding view: credential inputs, SQL script display with copy, live connection test, error handling, success flow"
    status: completed
    dependencies:
      - create-services
      - build-ui-components
  - id: implement-dashboard
    content: "Implement Dashboard view: header navigation, stats cards, configs table, tenants table, create dialogs, data fetching"
    status: completed
    dependencies:
      - create-services
      - build-ui-components
  - id: implement-config-editor
    content: "Implement Config Editor view: side-by-side draft/published panels, JSON editor with validation, save/publish actions, API integration card"
    status: completed
    dependencies:
      - create-services
      - build-ui-components
  - id: implement-settings
    content: "Implement Settings view: connection settings card, session card, danger zone, test connection, save changes, sign out, reset app"
    status: completed
    dependencies:
      - create-services
      - build-ui-components
  - id: setup-routing
    content: "Configure Next.js routing: update root page.tsx, create route structure, add navigation between views, implement redirects"
    status: completed
    dependencies:
      - implement-splash
      - implement-onboarding
      - implement-dashboard
      - implement-config-editor
      - implement-settings
---

# MasterFabric Remote - Complete Implementation Plan

## Overview

Build a multi-tenant Remote Config Manager using Next.js 16, Supabase, TypeScript, and Tailwind CSS with a white hierarchy design system. The application manages remote configurations with draft/published workflows, tenant isolation, and API access.

## Architecture Overview

```mermaid
flowchart TB
    subgraph Client["Client Application"]
        NextJS["Next.js App Router"]
        Components["React Components"]
        State["State Management"]
    end
    
    subgraph Backend["Supabase Backend"]
        Auth["Supabase Auth"]
        Postgres["PostgreSQL Database"]
        RLS["Row Level Security"]
        API["REST API"]
    end
    
    subgraph Storage["Browser Storage"]
        LocalStorage["localStorage<br/>Credentials"]
    end
    
    NextJS --> Components
    Components --> State
    State --> LocalStorage
    Components --> API
    API --> Auth
    Auth --> Postgres
    Postgres --> RLS
    API --> RLS
```

## Application Flow

```mermaid
stateDiagram-v2
    [*] --> Splash: App Start
    Splash --> Onboarding: No Credentials
    Splash --> Dashboard: Auth Success
    Onboarding --> Dashboard: Setup Complete
    Dashboard --> ConfigEditor: Edit Config
    Dashboard --> Settings: Open Settings
    Dashboard --> Onboarding: Sign Out
    ConfigEditor --> Dashboard: Back
    Settings --> Dashboard: Back
    Settings --> Onboarding: Reset App
```

## Database Schema

```mermaid
erDiagram
    tenants ||--o{ app_configs : "has"
    
    tenants {
        uuid id PK
        text name
        text api_key UK
        timestamp created_at
        timestamp updated_at
    }
    
    app_configs {
        uuid id PK
        uuid tenant_id FK
        text key_name
        jsonb draft_json
        jsonb published_json
        timestamp last_published_at
        bigint request_count
        timestamp created_at
        timestamp updated_at
    }
    
    auth_users {
        uuid id PK
        text email
        text encrypted_password
    }
```

## Component Architecture

```mermaid
graph TB
    subgraph Pages["Page Components"]
        SplashPage["app/splash/page.tsx"]
        OnboardingPage["app/onboarding/page.tsx"]
        DashboardPage["app/dashboard/page.tsx"]
        ConfigEditorPage["app/config/[id]/page.tsx"]
        SettingsPage["app/settings/page.tsx"]
    end
    
    subgraph Layout["Layout Components"]
        AppLayout["app/layout.tsx"]
        Header["components/layout/Header.tsx"]
    end
    
    subgraph UI["UI Components"]
        Button["components/ui/Button.tsx"]
        Input["components/ui/Input.tsx"]
        Card["components/ui/Card.tsx"]
        Table["components/ui/Table.tsx"]
        Badge["components/ui/Badge.tsx"]
        Alert["components/ui/Alert.tsx"]
    end
    
    subgraph Features["Feature Components"]
        StatsCard["components/features/StatsCard.tsx"]
        ConfigTable["components/features/ConfigTable.tsx"]
        TenantTable["components/features/TenantTable.tsx"]
        EditorPanel["components/features/EditorPanel.tsx"]
        ApiIntegration["components/features/ApiIntegration.tsx"]
    end
    
    subgraph Services["Services"]
        SupabaseService["lib/supabase/SupabaseService.ts"]
        AuthService["lib/supabase/AuthService.ts"]
    end
    
    Pages --> Layout
    Pages --> Features
    Features --> UI
    Pages --> Services
    Features --> Services
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant Service
    participant Supabase
    participant Database
    
    User->>Component: User Action
    Component->>Service: API Call
    Service->>Supabase: Authenticated Request
    Supabase->>Database: Query with RLS
    Database-->>Supabase: Result
    Supabase-->>Service: Response
    Service-->>Component: Transformed Data
    Component-->>User: Updated UI
```

## Implementation Phases

### Phase 1: Project Setup & Core Infrastructure

**Files to Create:**

- `lib/supabase/client.ts` - Supabase client initialization
- `lib/supabase/SupabaseService.ts` - Centralized service layer
- `lib/supabase/AuthService.ts` - Authentication service
- `lib/utils/storage.ts` - localStorage utilities
- `types/index.ts` - TypeScript type definitions
- `app/globals.css` - Tailwind configuration with white hierarchy

**Dependencies to Install:**

- `@supabase/supabase-js` - Supabase client
- `lucide-react` - Icon library
- `zustand` (optional) - State management

### Phase 2: UI Component Library

**Files to Create:**

- `components/ui/Button.tsx` - Primary, Secondary, Ghost, Danger variants
- `components/ui/Input.tsx` - Text and Password inputs
- `components/ui/Card.tsx` - Card container with header/content
- `components/ui/Table.tsx` - Table components
- `components/ui/Badge.tsx` - Status badges
- `components/ui/Alert.tsx` - Success/Error/Warning alerts
- `components/ui/CodeBlock.tsx` - Code display with copy
- `components/ui/Spinner.tsx` - Loading indicators

**Design System:**

- Pure white backgrounds (`bg-white`)
- High contrast text (`text-gray-900`)
- Soft borders (`border-gray-200`)
- Minimal shadows (`shadow-sm`)
- Lucide icons only

### Phase 3: Splash View

**Files to Create:**

- `app/splash/page.tsx` - Connection check screen
- `app/splash/loading.tsx` - Loading state

**Logic:**

1. Check localStorage for `supabase_url` and `supabase_anon_key`
2. If missing → redirect to `/onboarding`
3. If present → initialize Supabase client
4. Attempt authentication with default credentials
5. On success → redirect to `/dashboard`
6. On failure → clear storage → redirect to `/onboarding`

### Phase 4: Onboarding View

**Files to Create:**

- `app/onboarding/page.tsx` - Setup screen
- `components/features/SqlScriptCard.tsx` - SQL script display

**Features:**

- Supabase URL input
- Anon Key input (password field with toggle)
- SQL script display with copy button
- Live connection test
- Error handling and validation
- Success → save credentials → redirect to dashboard

### Phase 5: Dashboard View

**Files to Create:**

- `app/dashboard/page.tsx` - Main dashboard
- `components/layout/Header.tsx` - App header with navigation
- `components/features/StatsCard.tsx` - Statistics cards
- `components/features/ConfigTable.tsx` - Configurations table
- `components/features/TenantTable.tsx` - Tenants table
- `components/features/NewConfigDialog.tsx` - Create config modal
- `components/features/NewTenantDialog.tsx` - Create tenant modal

**Data Fetching:**

- Fetch all tenants
- Fetch all configs with tenant relationships
- Calculate statistics (total configs, requests, active tenants)
- Display in tables with actions

### Phase 6: Config Editor View

**Files to Create:**

- `app/config/[id]/page.tsx` - Config detail page
- `components/features/EditorPanel.tsx` - Draft/Published editor
- `components/features/ApiIntegration.tsx` - API documentation card
- `lib/utils/json.ts` - JSON validation utilities

**Features:**

- Side-by-side draft/published panels
- JSON editor with syntax validation
- Save draft functionality
- Publish functionality (draft → published)
- API endpoint display
- cURL example with copy
- Request statistics

### Phase 7: Settings View

**Files to Create:**

- `app/settings/page.tsx` - Settings screen
- `components/features/ConnectionSettings.tsx` - Connection card
- `components/features/SessionCard.tsx` - Session info
- `components/features/DangerZone.tsx` - Reset functionality

**Features:**

- Edit Supabase credentials
- Test connection
- Save changes
- Sign out
- Reset application (clear all data)

### Phase 8: Routing & Navigation

**Files to Update:**

- `app/layout.tsx` - Root layout with metadata
- `app/page.tsx` - Root redirect to splash
- `middleware.ts` - Route protection (optional)

**Routes:**

- `/` → redirect to `/splash`
- `/splash` → connection check
- `/onboarding` → setup
- `/dashboard` → main hub
- `/config/[id]` → config editor
- `/settings` → settings

## Key Implementation Details

### Supabase Service Pattern

```typescript
// lib/supabase/SupabaseService.ts
class SupabaseService {
  private client: SupabaseClient;
  
  async getTenants(): Promise<Tenant[]>
  async createTenant(data: CreateTenantInput): Promise<Tenant>
  async getConfigs(): Promise<AppConfig[]>
  async updateConfig(id: string, data: UpdateConfigInput): Promise<AppConfig>
  async publishConfig(id: string): Promise<void>
}
```

### State Management

- Use React Context for auth state
- Use local component state for forms
- Use server components for data fetching (Next.js App Router)
- Optional: Zustand for global UI state

### Error Handling

- Toast notifications for user feedback
- Error boundaries for component errors
- Graceful fallbacks for API failures
- Validation at input and service layers

### Type Safety

```typescript
// types/index.ts
interface Tenant {
  id: string;
  name: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

interface AppConfig {
  id: string;
  tenant_id: string;
  key_name: string;
  draft_json: Record<string, any>;
  published_json: Record<string, any>;
  last_published_at: string | null;
  request_count: number;
  created_at: string;
  updated_at: string;
}
```

## UI Flow Diagram

```mermaid
flowchart LR
    A[Splash] -->|No Credentials| B[Onboarding]
    A -->|Auth Success| C[Dashboard]
    B -->|Setup Complete| C
    C -->|Edit Config| D[Config Editor]
    C -->|Settings| E[Settings]
    C -->|New Config| F[New Config Dialog]
    C -->|New Tenant| G[New Tenant Dialog]
    D -->|Back| C
    E -->|Back| C
    E -->|Sign Out| B
    E -->|Reset| B
```

## Testing Strategy

1. **Unit Tests**: Component logic, utilities, services
2. **Integration Tests**: API interactions, auth flows
3. **E2E Tests**: Critical user journeys (onboarding → dashboard → edit → publish)
4. **Manual Testing**: UI/UX validation, design system compliance

## Deployment Considerations

1. **Environment Variables**: Supabase URL/keys (client-side safe)
2. **Build Optimization**: Next.js production build
3. **Static Assets**: Favicon, logos
4. **Database Setup**: SQL script execution in Supabase dashboard
5. **RLS Policies**: Verify all policies are active

## Design System Compliance

- Pure white backgrounds (`bg-white`) - no gray backgrounds
- No shadows in light mode (per user preference)
- High contrast text (`text-gray-900`)
- Soft borders (`border-gray-200`)
- Rounded corners (`rounded-lg`, `rounded-xl`)
- Lucide icons only (no emojis)
- Minimal accent colors for status indicators

## Next Steps After Implementation

1. Add request count tracking (API endpoint)
2. Add config version history
3. Add export/import functionality
4. Add search and filtering
5. Add bulk operations
6. Add