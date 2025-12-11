import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export function Button({
  children,
  variant = 'primary',
  loading = false,
  icon: Icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2.5 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 focus:ring-gray-900 active:bg-gray-950',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-105 focus:ring-gray-900 active:bg-gray-100',
    ghost: 'px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-105 focus:ring-gray-900 active:bg-gray-100 rounded-md [&_*]:transition-colors [&_*]:duration-200',
    danger: 'bg-white text-red-600 border border-red-200 hover:border-red-300 hover:bg-red-50 hover:scale-105 focus:ring-red-500 active:bg-red-100',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
      ) : null}
      {children && <span className="transition-all duration-200 pointer-events-none select-none">{children}</span>}
    </button>
  );
}

interface DangerButtonSolidProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: LucideIcon;
}

export function DangerButtonSolid({
  children,
  className = '',
  icon: Icon,
  ...props
}: DangerButtonSolidProps) {
  return (
    <button
      className={`px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-800 ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />}
      <span className="transition-all duration-200">{children}</span>
    </button>
  );
}

