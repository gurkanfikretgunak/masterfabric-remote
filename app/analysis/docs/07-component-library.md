# MasterFabric Remote - Component Library

## Design System Components

---

## Button Components

### Primary Button

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

function PrimaryButton({ children, onClick, disabled, loading, icon: Icon }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="px-4 py-2.5 bg-gray-900 text-white rounded-lg 
                 hover:bg-gray-800 transition-colors text-sm font-medium
                 disabled:opacity-50 disabled:cursor-not-allowed
                 inline-flex items-center justify-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
```

### Secondary Button (Input-like / Medium Style)

```tsx
function SecondaryButton({ children, onClick, disabled, loading, icon: Icon }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 
                 rounded-lg hover:border-gray-400 transition-colors 
                 text-sm font-medium shadow-sm
                 disabled:opacity-50 disabled:cursor-not-allowed
                 inline-flex items-center justify-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
```

### Ghost Button

```tsx
function GhostButton({ children, onClick, icon: Icon }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 text-gray-600 hover:text-gray-900 
                 transition-colors text-sm font-medium
                 inline-flex items-center gap-2"
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
```

### Danger Button

```tsx
function DangerButton({ children, onClick, variant = 'outline' }: ButtonProps & { variant?: 'solid' | 'outline' }) {
  const styles = variant === 'solid' 
    ? 'bg-red-600 text-white hover:bg-red-700'
    : 'bg-white text-red-600 border border-red-200 hover:border-red-300 shadow-sm';
    
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg transition-colors text-sm font-medium
                 inline-flex items-center justify-center gap-2 ${styles}`}
    >
      {children}
    </button>
  );
}
```

---

## Input Components

### Text Input

```tsx
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'url' | 'password' | 'email';
  placeholder?: string;
  error?: string;
}

function TextInput({ label, value, onChange, type = 'text', placeholder, error }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-lg text-sm 
                   focus:ring-2 focus:ring-gray-900 focus:border-transparent
                   ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
```

### Password Input with Toggle

```tsx
function PasswordInput({ label, value, onChange, placeholder }: InputProps) {
  const [show, setShow] = useState(false);
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg 
                     text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                     hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
```

---

## Card Components

### Base Card

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
```

### Card Header

```tsx
interface CardHeaderProps {
  title: string;
  action?: React.ReactNode;
}

function CardHeader({ title, action }: CardHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h2 className="text-sm font-medium text-gray-900">{title}</h2>
      {action}
    </div>
  );
}
```

### Card Content

```tsx
function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
```

---

## Alert Components

### Success Alert

```tsx
function SuccessAlert({ message }: { message: string }) {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg 
                    text-sm text-green-700 flex items-center gap-2">
      <CheckCircle className="w-4 h-4" />
      {message}
    </div>
  );
}
```

### Error Alert

```tsx
function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg 
                    text-sm text-red-700 flex items-center gap-2">
      <XCircle className="w-4 h-4" />
      {message}
    </div>
  );
}
```

### Warning Alert

```tsx
function WarningAlert({ message }: { message: string }) {
  return (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg 
                    text-sm text-yellow-700 flex items-center gap-2">
      <AlertTriangle className="w-4 h-4" />
      {message}
    </div>
  );
}
```

---

## Badge Components

### Status Badge

```tsx
type Status = 'published' | 'draft' | 'error';

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    published: 'bg-green-50 text-green-700 border-green-200',
    draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  };

  const labels: Record<Status, string> = {
    published: 'Published',
    draft: 'Draft',
    error: 'Error',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
```

---

## Table Components

### Table Container

```tsx
function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {children}
      </table>
    </div>
  );
}
```

### Table Header

```tsx
function TableHeader({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        {columns.map((col, i) => (
          <th
            key={i}
            className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase 
                       ${i === columns.length - 1 ? 'text-right' : 'text-left'}`}
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}
```

### Table Row

```tsx
function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200 last:border-0">
      {children}
    </tr>
  );
}
```

### Table Cell

```tsx
function TableCell({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <td className={`px-6 py-4 text-sm text-gray-600 ${align === 'right' ? 'text-right' : ''}`}>
      {children}
    </td>
  );
}
```

---

## Loading Components

### Spinner

```tsx
function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  return <Loader2 className={`${sizes[size]} animate-spin text-gray-400`} />;
}
```

### Loading Overlay

```tsx
function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center 
                    justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
```

---

## Code Block Component

```tsx
function CodeBlock({ code, copyable = true }: { code: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-100 
                     font-mono overflow-x-auto">
        {code}
      </pre>
      {copyable && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-2.5 py-1.5 text-xs text-gray-400 
                     hover:text-gray-200 border border-gray-700 rounded-md
                     hover:border-gray-500 transition-colors
                     inline-flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      )}
    </div>
  );
}
```

---

## Divider

```tsx
function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-px bg-gray-200 ${className}`} />;
}

function VerticalDivider() {
  return <div className="w-px h-6 bg-gray-200" />;
}
```

---

## Icon Set (Lucide Icons)

All icons from Lucide React:

```tsx
import {
  // Navigation
  ArrowLeft,
  ChevronRight,
  
  // Actions
  Plus,
  Save,
  Trash2,
  Copy,
  Check,
  Edit2,
  Rocket,
  Zap,
  
  // Status
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Loader2,
  
  // UI
  Eye,
  EyeOff,
  Settings,
  LogOut,
  
  // Data
  FileJson,
  Activity,
  Building2,
  Clock,
} from 'lucide-react';
```
