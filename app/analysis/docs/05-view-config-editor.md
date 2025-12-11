# MasterFabric Remote - Config Editor View Analysis

## Screen: Config Detail / Editor

---

## Purpose

Side-by-side editor for managing draft and published Remote Config data with version control.

---

## UI Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ← Back to Dashboard          homepage_flags          ┌─────────────────┐  │
│                                                       │ Tenant: Mobile  │  │
│                                                       └─────────────────┘  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐   │
│  │                                │  │                                │   │
│  │  Draft                         │  │  Published                     │   │
│  │  ┌──────────────────────────┐  │  │  ┌──────────────────────────┐  │   │
│  │  │ {                        │  │  │  │ {                        │  │   │
│  │  │   "show_banner": true,   │  │  │  │   "show_banner": false,  │  │   │
│  │  │   "theme": "dark",       │  │  │  │   "theme": "light",      │  │   │
│  │  │   "max_items": 10        │  │  │  │   "max_items": 5         │  │   │
│  │  │ }                        │  │  │  │ }                        │  │   │
│  │  └──────────────────────────┘  │  │  └──────────────────────────┘  │   │
│  │                                │  │                                │   │
│  │  ┌────────────┐ ┌──────────┐   │  │  Last published: 2 hours ago  │   │
│  │  │ Save Draft │ │ Publish  │   │  │                                │   │
│  │  └────────────┘ └──────────┘   │  │                                │   │
│  │                                │  │                                │   │
│  └────────────────────────────────┘  └────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  API Integration                                                     │  │
│  │                                                                      │  │
│  │  Endpoint:                                                           │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ GET https://xxx.supabase.co/rest/v1/app_configs?key_name=eq... │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  │  cURL Example:                                            ┌────────┐ │  │
│  │  ┌────────────────────────────────────────────────────┐   │  Copy  │ │  │
│  │  │ curl -X GET "https://xxx.supabase.co/rest/v1/..." \ │   └────────┘ │  │
│  │  │   -H "apikey: your-anon-key" \                      │              │  │
│  │  │   -H "Authorization: Bearer your-api-key"           │              │  │
│  │  └────────────────────────────────────────────────────┘              │  │
│  │                                                                      │  │
│  │  Statistics:  12,450 requests  |  Last called: 5 min ago            │  │
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
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <h1 className="text-lg font-semibold text-gray-900">{configName}</h1>
      </div>
      <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600">
        Tenant: {tenantName}
      </div>
    </div>
  </header>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto py-8 px-6">
    {/* Editor Panels */}
    <div className="grid grid-cols-2 gap-6 mb-8">
      {/* Draft Panel */}
      <EditorPanel
        title="Draft"
        json={draftJson}
        editable={true}
        onSave={handleSaveDraft}
        onPublish={handlePublish}
      />
      
      {/* Published Panel */}
      <EditorPanel
        title="Published"
        json={publishedJson}
        editable={false}
        lastPublished={lastPublishedAt}
      />
    </div>

    {/* API Integration Section */}
    <ApiIntegrationCard config={config} tenant={tenant} />
  </main>
</div>
```

---

## Editor Panel Component

```tsx
function EditorPanel({ title, json, editable, onSave, onPublish, lastPublished }) {
  const [value, setValue] = useState(JSON.stringify(json, null, 2));
  const [isValid, setIsValid] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (newValue) => {
    setValue(newValue);
    setHasChanges(true);
    try {
      JSON.parse(newValue);
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {!editable && lastPublished && (
          <span className="text-xs text-gray-500">
            Last published: {formatRelativeTime(lastPublished)}
          </span>
        )}
      </div>

      {/* Editor */}
      <div className="p-6">
        <div className={`
          rounded-lg border overflow-hidden
          ${isValid ? 'border-gray-200' : 'border-red-300 bg-red-50'}
        `}>
          {editable ? (
            <textarea
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-64 p-4 font-mono text-sm resize-none 
                         focus:outline-none bg-gray-50"
              spellCheck={false}
            />
          ) : (
            <pre className="w-full h-64 p-4 font-mono text-sm bg-gray-50 
                           overflow-auto text-gray-700">
              {value}
            </pre>
          )}
        </div>

        {!isValid && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Invalid JSON format
          </p>
        )}
      </div>

      {/* Actions */}
      {editable && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-3">
          <button
            onClick={() => onSave(JSON.parse(value))}
            disabled={!isValid || !hasChanges}
            className="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 
                       rounded-lg hover:border-gray-400 text-sm font-medium 
                       shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                       inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={onPublish}
            disabled={!isValid}
            className="px-4 py-2.5 bg-gray-900 text-white rounded-lg 
                       hover:bg-gray-800 text-sm font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       inline-flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            Publish
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## API Integration Card Component

```tsx
function ApiIntegrationCard({ config, tenant }) {
  const supabaseUrl = localStorage.getItem('supabase_url');
  
  const endpoint = `${supabaseUrl}/rest/v1/app_configs?key_name=eq.${config.key_name}&tenant_id=eq.${config.tenant_id}&select=published_json`;
  
  const curlCommand = `curl -X GET "${endpoint}" \\
  -H "apikey: ${tenant.api_key}" \\
  -H "Authorization: Bearer ${tenant.api_key}"`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">API Integration</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Endpoint */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
            Endpoint
          </label>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 
                          font-mono text-sm text-gray-700 break-all">
            GET {endpoint}
          </div>
        </div>

        {/* cURL Example */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-500 uppercase">
              cURL Example
            </label>
            <button
              onClick={() => navigator.clipboard.writeText(curlCommand)}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 
                         border border-gray-200 rounded-md hover:border-gray-300
                         inline-flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-100 
                         font-mono overflow-x-auto">
            {curlCommand}
          </pre>
        </div>

        {/* Statistics */}
        <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Activity className="w-4 h-4" />
            <span>{config.request_count.toLocaleString()} requests</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last called: 5 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## State Management

```typescript
interface ConfigEditorState {
  config: AppConfig | null;
  tenant: Tenant | null;
  draftJson: object;
  publishedJson: object;
  saving: boolean;
  publishing: boolean;
  hasUnsavedChanges: boolean;
}
```

---

## Actions

### Save Draft

```typescript
async function handleSaveDraft(newDraftJson: object) {
  setState({ saving: true });
  
  const { error } = await supabase
    .from('app_configs')
    .update({
      draft_json: newDraftJson,
      updated_at: new Date().toISOString()
    })
    .eq('id', configId);
  
  if (error) {
    showToast('Failed to save draft', 'error');
  } else {
    showToast('Draft saved', 'success');
    setState({ hasUnsavedChanges: false });
  }
  
  setState({ saving: false });
}
```

### Publish

```typescript
async function handlePublish() {
  setState({ publishing: true });
  
  const { error } = await supabase
    .from('app_configs')
    .update({
      published_json: draftJson,
      last_published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', configId);
  
  if (error) {
    showToast('Failed to publish', 'error');
  } else {
    showToast('Config published successfully', 'success');
    setState({ publishedJson: draftJson });
  }
  
  setState({ publishing: false });
}
```

---

## Design Specifications

| Element | Style |
|---------|-------|
| Page Background | `bg-gray-50` |
| Editor Cards | `bg-white rounded-xl border border-gray-200 shadow-sm` |
| Code Areas | `bg-gray-50 font-mono text-sm` |
| cURL Block | `bg-gray-900 text-gray-100` |
| Save Button | `bg-white border border-gray-300 rounded-lg shadow-sm` |
| Publish Button | `bg-gray-900 text-white rounded-lg` |
| Error State | `border-red-300 bg-red-50` |
