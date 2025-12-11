# MasterFabric Remote - Splash View Analysis

## Screen: Connection Check / Splash

---

## Purpose

Initial loading screen that checks for existing connection configuration and validates authentication state.

---

## User Flow

```
┌─────────────────────────────────────────┐
│           Application Start             │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│    Check localStorage for keys          │
│    - supabase_url                       │
│    - supabase_anon_key                  │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
   Keys Found          No Keys Found
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│ Initialize    │   │ Redirect to   │
│ Supabase      │   │ Onboarding    │
│ Client        │   └───────────────┘
└───────┬───────┘
        │
        ▼
┌───────────────────────────────────────┐
│ Attempt signIn with                    │
│ masterfabric-developer credentials     │
└───────────────┬───────────────────────┘
                │
      ┌─────────┴─────────┐
      │                   │
      ▼                   ▼
  Auth Success       Auth Failed
      │                   │
      ▼                   ▼
┌─────────────┐   ┌─────────────────┐
│ Redirect to │   │ Clear storage   │
│ Dashboard   │   │ → Onboarding    │
└─────────────┘   └─────────────────┘
```

---

## UI Components

### Layout

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                                                        │
│                                                        │
│              ┌──────────────────────┐                  │
│              │                      │                  │
│              │   MasterFabric       │                  │
│              │      Remote          │                  │
│              │                      │                  │
│              │   ○ Loading...       │                  │
│              │                      │                  │
│              └──────────────────────┘                  │
│                                                        │
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Component Structure

```tsx
<div className="min-h-screen bg-white flex items-center justify-center">
  <div className="text-center">
    {/* Logo */}
    <h1 className="text-2xl font-semibold text-gray-900 mb-6">
      MasterFabric Remote
    </h1>
    
    {/* Loading Indicator */}
    <div className="flex items-center justify-center gap-2 text-gray-500">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-sm">Checking connection...</span>
    </div>
  </div>
</div>
```

---

## State Management

```typescript
interface SplashState {
  status: 'checking' | 'authenticating' | 'redirecting' | 'error';
  message: string;
}
```

---

## Logic Flow

```typescript
async function checkConnection() {
  // 1. Check localStorage
  const url = localStorage.getItem('supabase_url');
  const key = localStorage.getItem('supabase_anon_key');
  
  if (!url || !key) {
    return redirect('/onboarding');
  }
  
  // 2. Initialize client
  const supabase = createClient(url, key);
  
  // 3. Attempt authentication
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'masterfabric-developer@masterfabric.io',
    password: 'masterfabric-developer'
  });
  
  if (error) {
    localStorage.clear();
    return redirect('/onboarding');
  }
  
  // 4. Success - redirect to dashboard
  return redirect('/dashboard');
}
```

---

## Design Specifications

| Element | Style |
|---------|-------|
| Background | `bg-white` |
| Logo Text | `text-2xl font-semibold text-gray-900` |
| Loading Text | `text-sm text-gray-500` |
| Loading Icon | Lucide `Loader2`, `w-4 h-4 animate-spin` |
| Container | `flex items-center justify-center min-h-screen` |

---

## Error States

| State | Message | Action |
|-------|---------|--------|
| No keys | - | Silent redirect to Onboarding |
| Auth failed | - | Clear storage, redirect to Onboarding |
| Network error | "Connection failed" | Show retry option |
