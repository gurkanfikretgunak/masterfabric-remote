# MasterFabric Remote Config Manager

A multi-tenant remote configuration management system built with Next.js, Supabase, and TypeScript. Manage feature flags, A/B tests, and application configurations across multiple tenants with a clean, intuitive interface.

## Features

- 🏢 **Multi-Tenant Support** - Manage configurations for multiple tenants/organizations
- 📝 **Draft & Publish Workflow** - Create drafts, review changes, and publish when ready
- 🔐 **Secure API Access** - Public API endpoints with RLS (Row Level Security) policies
- 🎨 **Clean UI** - Minimalist white hierarchy design with Tailwind CSS
- ⚡ **Real-time Updates** - Built on Supabase for real-time data synchronization
- 🧪 **Test Configurations** - Test API endpoints directly from the dashboard
- 📊 **Analytics** - Track request counts and usage statistics

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd masterfabric-remote
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Supabase project:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the SQL script from `app/onboarding/page.tsx` in your Supabase SQL Editor
     - The script creates all necessary tables, RLS policies, and initial setup

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### First-Time Setup

When you first launch the application:

1. You'll be redirected to the **Onboarding** page
2. Enter your Supabase URL and Anon Key
3. Test the connection
4. Save your credentials
5. The app will guide you through the initial setup

## Project Structure

```
masterfabric-remote/
├── app/                    # Next.js app directory
│   ├── dashboard/          # Main dashboard page
│   ├── config/[id]/       # Config editor page
│   ├── onboarding/        # Initial setup page
│   ├── settings/          # Settings page
│   └── splash/            # Splash/loading page
├── components/
│   ├── features/          # Feature components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── hooks/             # Custom React hooks
│   ├── supabase/          # Supabase service layer
│   └── utils/             # Utility functions
├── migrations/            # Database migrations
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Key Components

### ConfigTable
Displays all configurations with actions (Test, Edit, Delete). Supports filtering by tenant and status.

### EditorPanel
Side-by-side editor for managing draft and published configurations. Features:
- JSON validation
- Template library
- Save draft / Publish workflow
- Confirmation dialogs

### ApiIntegration
Shows API endpoints and cURL examples for accessing published configurations.

### TenantTable
Manage tenants with API key generation and configuration counts.

## API Usage

### Public API Endpoint

Once a configuration is published, it's accessible via the public API:

```bash
curl -X GET "https://your-project.supabase.co/rest/v1/app_configs?key_name=eq.demoapi&tenant_id=eq.tenant-id&select=published_json" \
  -H "apikey: your-anon-key"
```

### Authentication

The public API uses Supabase's anonymous access with RLS policies. Only published configurations (`last_published_at IS NOT NULL`) are accessible via the public API.

## Database Schema

### Tenants
- `id` (UUID)
- `name` (TEXT)
- `api_key` (TEXT, UNIQUE)
- `created_at`, `updated_at` (TIMESTAMP)

### App Configs
- `id` (UUID)
- `tenant_id` (UUID, FK)
- `key_name` (TEXT)
- `draft_json` (JSONB)
- `published_json` (JSONB)
- `last_published_at` (TIMESTAMP)
- `request_count` (BIGINT)
- `created_at`, `updated_at` (TIMESTAMP)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Tailwind CSS for styling
- Component-based architecture

## Features in Detail

### Draft & Publish Workflow

1. **Create Draft**: Edit configuration JSON in the draft panel
2. **Save Draft**: Save changes without publishing
3. **Publish**: After saving a draft, publish to make it live
4. **Confirmation**: Publish dialog with options before making changes live

### Multi-Tenant Management

- Create multiple tenants (e.g., Mobile App, Web App)
- Each tenant has its own API key
- Configurations are scoped to tenants
- Track usage per tenant

### API Key Generation

- Automatic API key generation with `mfr_` prefix
- Secure random generation
- One-click generation in tenant forms

## Security

- Row Level Security (RLS) enabled on all tables
- Authenticated users can manage configurations
- Anonymous users can only read published configs via API
- API keys stored securely in database

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please contact the development team.

---

Built with ❤️ using Next.js and Supabase
