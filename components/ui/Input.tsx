'use client';

import { AlertCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showPasswordToggle?: boolean;
  showGenerateButton?: boolean;
  onGenerate?: () => string;
}

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  error,
  showPasswordToggle = false,
  showGenerateButton = false,
  onGenerate,
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  const handleGenerate = () => {
    if (onGenerate) {
      const generated = onGenerate();
      onChange(generated);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {showGenerateButton && (
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-3 h-3" />
            Generate
          </button>
        )}
      </div>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-400 ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } ${showPasswordToggle ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 active:scale-95 p-1 rounded"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

