# MasterFabric Remote - Dashboard View Analysis

## Screen: Dashboard

---

## Purpose

Central hub displaying all Remote Config sets with key metrics, status, and quick actions.

---

## Data Requirements

```typescript
interface DashboardData {
  tenants: Tenant[];
  configs: AppConfig[];
  totalRequests: number;
  activeConfigs: number;
}

interface Tenant {
  id: string;
  name: string;
  api_key: string;
  created_at: string;
}

interface AppConfig {
  id: string;
  tenant_id: string;
  key_name: string;
  draft_json: object;
  published_json: object;
  last_published_at: string | null;
  request_count: number;
  updated_at: string;
}
```

---

## UI Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  MasterFabric Remote                              ┌─────────┐ ┌──────────┐ │
│                                                   │ Settings│ │ Sign Out │ │
│                                                   └─────────┘ └──────────┘ │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │ Total Configs  │  │ Total Requests │  │ Active Tenants │                │
│  │      12        │  │    45,231      │  │       3        │                │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  Configurations                                    ┌───────────────┐ │  │
│  │                                                    │ + New Config  │ │  │
│  │  ┌────────────────────────────────────────────────────────────────┐ │  │
│  │  │ Config Name    │ Tenant      │ Requests │ Status   │ Actions  │ │  │
│  │  ├────────────────┼─────────────┼──────────┼──────────┼──────────┤ │  │
│  │  │ homepage_flags │ Mobile App  │  12,450  │ Published│ Edit ▶   │ │  │
│  │  ├────────────────┼─────────────┼──────────┼──────────┼──────────┤ │  │
│  │  │ feature_gates  │ Web Portal  │   8,721  │ Draft    │ Edit ▶   │ │  │
│  │  ├────────────────┼─────────────┼──────────┼──────────┼──────────┤ │  │
│  │  │ ab_tests       │ Mobile App  │   5,102  │ Published│ Edit ▶   │ │  │
│  │  └────────────────┴─────────────┴──────────┴──────────┴──────────┘ │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  Tenants                                           ┌───────────────┐ │  │
│  │                                                    │ + New Tenant  │ │  │
│  │  ┌────────────────────────────────────────────────────────────────┐ │  │
│  │  │ Tenant Name    │ API Key              │ Configs │ Actions     │ │  │
│  │  ├────────────────┼──────────────────────┼─────────┼─────────────┤ │  │
│  │  │ Mobile App     │ mfr_xxxxxxxx...      │    4    │ Edit  Delete│ │  │
│  │  ├────────────────┼──────────────────────┼─────────┼─────────────┤ │  │
│  │  │ Web Portal     │ mfr_yyyyyyyy...      │    2    │ Edit  Delete│ │  │
│  │  └────────────────┴──────────────────────┴─────────┴─────────────┘ │  │
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
      <h1 className="text-xl font-semibold text-gray-900">
        MasterFabric Remote
      </h1>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 
                           inline-flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
          Sign Out
        </button>
      </div>
    </div>
  </header>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto py-8 px-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-3 gap-6 mb-8">
      <StatsCard title="Total Configs" value={12} icon={FileJson} />
      <StatsCard title="Total Requests" value="45,231" icon={Activity} />
      <StatsCard title="Active Tenants" value={3} icon={Building2} />
    </div>

    {/* Configurations Table */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Configurations</h2>
        <button className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg 
                           hover:bg-gray-800 inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Config
        </button>
      </div>
      <ConfigTable configs={configs} />
    </div>

    {/* Tenants Table */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Tenants</h2>
        <button className="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 
                           text-sm rounded-lg hover:border-gray-400 
                           inline-flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          New Tenant
        </button>
      </div>
      <TenantTable tenants={tenants} />
    </div>
  </main>
</div>
```

---

## Stats Card Component

```tsx
function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </div>
  );
}
```

---

## Config Table Component

```tsx
function ConfigTable({ configs }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Config Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Tenant
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Requests
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {configs.map((config) => (
          <tr key={config.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {config.key_name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {config.tenant_name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {config.request_count.toLocaleString()}
            </td>
            <td className="px-6 py-4">
              <StatusBadge status={config.status} />
            </td>
            <td className="px-6 py-4 text-right">
              <button className="text-sm text-gray-600 hover:text-gray-900 
                                 inline-flex items-center gap-1">
                Edit
                <ChevronRight className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Status Badge Component

```tsx
function StatusBadge({ status }) {
  const styles = {
    published: 'bg-green-50 text-green-700 border-green-200',
    draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  );
}
```

---

## Data Fetching

```typescript
async function fetchDashboardData() {
  const supabase = getSupabaseClient();
  
  // Fetch tenants
  const { data: tenants } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Fetch configs with tenant info
  const { data: configs } = await supabase
    .from('app_configs')
    .select(`
      *,
      tenant:tenants(name)
    `)
    .order('updated_at', { ascending: false });
  
  // Calculate stats
  const totalRequests = configs?.reduce((sum, c) => sum + c.request_count, 0) || 0;
  
  return {
    tenants: tenants || [],
    configs: configs?.map(c => ({
      ...c,
      tenant_name: c.tenant?.name,
      status: c.last_published_at ? 'published' : 'draft'
    })) || [],
    totalRequests,
    activeConfigs: configs?.filter(c => c.last_published_at).length || 0
  };
}
```

---

## Design Specifications

| Element | Style |
|---------|-------|
| Page Background | `bg-gray-50` |
| Header | `bg-white border-b border-gray-200` |
| Cards | `bg-white rounded-xl border border-gray-200 shadow-sm` |
| Table Header | `bg-gray-50 text-xs font-medium text-gray-500 uppercase` |
| Table Rows | `hover:bg-gray-50 divide-y divide-gray-200` |
| Primary Button | `bg-gray-900 text-white rounded-lg` |
| Secondary Button | `bg-white border border-gray-300 rounded-lg shadow-sm` |
