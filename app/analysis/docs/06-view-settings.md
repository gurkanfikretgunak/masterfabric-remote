# MasterFabric Remote - Settings View Analysis

## Screen: Settings

---

## Purpose

Manage Supabase connection credentials and application session.

---

## UI Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ← Back to Dashboard                    Settings                           │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  Connection Settings                                                 │  │
│  │                                                                      │  │
│  │  Supabase URL                                                        │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ https://xxxxx.supabase.co                                      │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  │  Anon Key                                                            │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ ••••••••••••••••••••••••••••••••                               │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                    │  │
│  │  │ Test Connection     │  │ Save Changes        │                    │  │
│  │  └─────────────────────┘  └─────────────────────┘                    │  │
│  │                                                                      │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ ✓ Connection verified                                         │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  Session                                                             │  │
│  │                                                                      │  │
│  │  Logged in as: masterfabric-developer@masterfabric.io               │  │
│  │                                                                      │  │
│  │  ┌─────────────────────┐                                             │  │
│  │  │ Sign Out            │                                             │  │
│  │  └─────────────────────┘                                             │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  Danger Zone                                                         │  │
│  │                                                                      │  │
│  │  Clear all local data and reset the application.                    │  │
│  │                                                                      │  │
│  │  ┌─────────────────────┐                                             │  │
│  │  │ Reset Application   │                                             │  │
│  │  └─────────────────────┘                                             │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Structure

```tsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="max-w-3xl mx-auto flex items-center gap-4">
      <button className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>
      <div className="h-6 w-px bg-gray-200" />
      <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
    </div>
  </header>

  {/* Main Content */}
  <main className="max-w-3xl mx-auto py-8 px-6 space-y-6">
    {/* Connection Settings */}
    <ConnectionSettingsCard />
    
    {/* Session */}
    <SessionCard />
    
    {/* Danger Zone */}
    <DangerZoneCard />
  </main>
</div>
```

---

## Connection Settings Card

```tsx
function ConnectionSettingsCard() {
  const [url, setUrl] = useState(localStorage.getItem('supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('supabase_anon_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const supabase = createClient(url, key);
      const { error } = await supabase.auth.signInWithPassword({
        email: 'masterfabric-developer@masterfabric.io',
        password: 'masterfabric-developer'
      });
      
      setTestResult(error ? 'error' : 'success');
    } catch {
      setTestResult('error');
    }
    
    setTesting(false);
  };

  const handleSave = () => {
    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_anon_key', key);
    setHasChanges(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900">Connection Settings</h2>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Supabase URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Supabase URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setHasChanges(true); }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                       text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* Anon Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Anon Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => { setKey(e.target.value); setHasChanges(true); }}
              className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg 
                         text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                         hover:text-gray-600"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleTestConnection}
            disabled={testing || !url || !key}
            className="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 
                       rounded-lg hover:border-gray-400 text-sm font-medium 
                       shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
          >
            {testing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Test Connection
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || testResult !== 'success'}
            className="px-4 py-2.5 bg-gray-900 text-white rounded-lg 
                       hover:bg-gray-800 text-sm font-medium
                       disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`
            p-3 rounded-lg text-sm flex items-center gap-2
            ${testResult === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'}
          `}>
            {testResult === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Connection verified
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Connection failed. Please check your credentials.
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Session Card

```tsx
function SessionCard() {
  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
    redirect('/onboarding');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900">Session</h2>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4">
          Logged in as: <span className="font-medium text-gray-900">
            masterfabric-developer@masterfabric.io
          </span>
        </p>
        
        <button
          onClick={handleSignOut}
          className="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 
                     rounded-lg hover:border-gray-400 text-sm font-medium 
                     shadow-sm inline-flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
```

---

## Danger Zone Card

```tsx
function DangerZoneCard() {
  const [confirming, setConfirming] = useState(false);

  const handleReset = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    localStorage.clear();
    redirect('/onboarding');
  };

  return (
    <div className="bg-white rounded-xl border border-red-200 shadow-sm">
      <div className="px-6 py-4 border-b border-red-200">
        <h2 className="text-sm font-medium text-red-700">Danger Zone</h2>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4">
          Clear all local data and reset the application.
        </p>
        
        {confirming ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-red-600 text-white rounded-lg 
                         hover:bg-red-700 text-sm font-medium
                         inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Confirm Reset
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-900 text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="px-4 py-2.5 bg-white text-red-600 border border-red-200 
                       rounded-lg hover:border-red-300 text-sm font-medium 
                       shadow-sm inline-flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Reset Application
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## State Management

```typescript
interface SettingsState {
  url: string;
  anonKey: string;
  showKey: boolean;
  testing: boolean;
  testResult: 'success' | 'error' | null;
  hasChanges: boolean;
  confirming: boolean;
}
```

---

## Design Specifications

| Element | Style |
|---------|-------|
| Page Background | `bg-gray-50` |
| Cards | `bg-white rounded-xl border border-gray-200 shadow-sm` |
| Danger Zone Card | `border border-red-200` |
| Input Fields | `border border-gray-300 rounded-lg px-4 py-2.5 text-sm` |
| Test Button | `bg-white border border-gray-300 rounded-lg shadow-sm` |
| Save Button | `bg-gray-900 text-white rounded-lg` |
| Success Alert | `bg-green-50 text-green-700 border border-green-200` |
| Error Alert | `bg-red-50 text-red-700 border border-red-200` |
| Danger Button | `bg-red-600 text-white` or `text-red-600 border-red-200` |
