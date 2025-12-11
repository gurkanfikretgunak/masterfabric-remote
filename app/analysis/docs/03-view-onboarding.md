# MasterFabric Remote - Onboarding View Analysis

## Screen: Setup / Onboarding

---

## Purpose

Guide users through initial Supabase connection setup and database initialization.

---

## User Flow

```
┌─────────────────────────────────────────┐
│         Onboarding Screen               │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 1: Enter Supabase Credentials     │
│  - Supabase URL                         │
│  - Anon Key                             │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 2: Copy & Run SQL Script          │
│  - Tables creation                      │
│  - RLS policies                         │
│  - Default user setup                   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 3: Live Test                      │
│  - Attempt authentication               │
│  - Validate database setup              │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
   Test Success        Test Failed
        │                   │
        ▼                   ▼
┌─────────────┐   ┌─────────────────┐
│ Save keys   │   │ Show error      │
│ → Dashboard │   │ with guidance   │
└─────────────┘   └─────────────────┘
```

---

## UI Layout

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  MasterFabric Remote                                           │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Welcome to MasterFabric Remote                          │  │
│  │  Configure your Supabase connection to get started.      │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Supabase URL                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ https://xxxxx.supabase.co                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  Anon Key                                                │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database Setup                                          │  │
│  │                                                          │  │
│  │  Run this SQL in your Supabase SQL Editor:               │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ -- MasterFabric Remote Setup                       │  │  │
│  │  │ CREATE TABLE IF NOT EXISTS tenants (               │  │  │
│  │  │   id UUID PRIMARY KEY...                           │  │  │
│  │  │ );                                                 │  │  │
│  │  │ ...                                                │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────┐                                    │  │
│  │  │  Copy Script     │                                    │  │
│  │  └──────────────────┘                                    │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │              Live Test Connection                │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Component Structure

```tsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <h1 className="text-xl font-semibold text-gray-900">
      MasterFabric Remote
    </h1>
  </header>

  {/* Content */}
  <main className="max-w-2xl mx-auto py-12 px-4">
    {/* Welcome Card */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-2">
        Welcome to MasterFabric Remote
      </h2>
      <p className="text-gray-600 text-sm">
        Configure your Supabase connection to get started.
      </p>
    </div>

    {/* Credentials Card */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Supabase URL
          </label>
          <input
            type="url"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                       text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="https://xxxxx.supabase.co"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Anon Key
          </label>
          <input
            type="password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                       text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
          />
        </div>
      </div>
    </div>

    {/* SQL Script Card */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Database Setup
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Run this SQL in your Supabase SQL Editor:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-100 font-mono">
          {sqlScript}
        </pre>
      </div>
      <button className="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 
                         rounded-lg hover:border-gray-400 transition-colors text-sm 
                         font-medium shadow-sm inline-flex items-center gap-2">
        <Copy className="w-4 h-4" />
        Copy Script
      </button>
    </div>

    {/* Test Button */}
    <button className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg 
                       hover:bg-gray-800 transition-colors font-medium 
                       inline-flex items-center justify-center gap-2">
      <Zap className="w-4 h-4" />
      Live Test Connection
    </button>
  </main>
</div>
```

---

## State Management

```typescript
interface OnboardingState {
  supabaseUrl: string;
  anonKey: string;
  step: 'credentials' | 'testing' | 'success' | 'error';
  error: string | null;
  copied: boolean;
}
```

---

## Live Test Logic

```typescript
async function handleLiveTest() {
  setState({ step: 'testing' });
  
  try {
    // 1. Initialize temporary client
    const supabase = createClient(supabaseUrl, anonKey);
    
    // 2. Attempt authentication with default credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'masterfabric-developer@masterfabric.io',
      password: 'masterfabric-developer'
    });
    
    if (error) {
      throw new Error('Authentication failed. Please ensure the SQL script was executed.');
    }
    
    // 3. Verify tables exist
    const { error: tableError } = await supabase
      .from('tenants')
      .select('id')
      .limit(1);
    
    if (tableError) {
      throw new Error('Tables not found. Please run the SQL script.');
    }
    
    // 4. Save credentials
    localStorage.setItem('supabase_url', supabaseUrl);
    localStorage.setItem('supabase_anon_key', anonKey);
    
    // 5. Redirect to dashboard
    setState({ step: 'success' });
    redirect('/dashboard');
    
  } catch (err) {
    setState({ 
      step: 'error', 
      error: err.message 
    });
  }
}
```

---

## Design Specifications

| Element | Style |
|---------|-------|
| Page Background | `bg-gray-50` |
| Header | `bg-white border-b border-gray-200` |
| Cards | `bg-white rounded-xl border border-gray-200 shadow-sm` |
| Input Fields | `border border-gray-300 rounded-lg px-4 py-2.5 text-sm` |
| Code Block | `bg-gray-900 rounded-lg text-gray-100 font-mono` |
| Primary Button | `bg-gray-900 text-white rounded-lg` |
| Secondary Button | `bg-white border border-gray-300 rounded-lg` |

---

## Error States

| Error | Message | Guidance |
|-------|---------|----------|
| Invalid URL | "Invalid Supabase URL format" | Check URL format |
| Auth Failed | "Authentication failed" | Verify SQL script execution |
| Tables Missing | "Tables not found" | Run SQL script again |
| Network Error | "Connection failed" | Check network & URL |
