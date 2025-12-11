import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'warning';
}

export function Alert({ message, type }: AlertProps) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
  };

  const Icon = icons[type];

  return (
    <div className={`p-3 border rounded-lg text-sm flex items-center gap-2 ${styles[type]}`}>
      <Icon className="w-4 h-4" />
      {message}
    </div>
  );
}

