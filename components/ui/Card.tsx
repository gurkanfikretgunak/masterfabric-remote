import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  action?: ReactNode;
  titleColor?: string;
  borderColor?: string;
}

export function CardHeader({ title, action, titleColor = 'text-gray-900', borderColor = 'border-gray-200' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b ${borderColor} flex items-center justify-between`}>
      <h2 className={`text-sm font-medium ${titleColor}`}>{title}</h2>
      {action}
    </div>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

