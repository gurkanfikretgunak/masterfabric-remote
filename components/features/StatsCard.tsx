import { FileJson, Activity, Building2 } from 'lucide-react';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </div>
      </div>
    </div>
  );
}

