'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  copyable?: boolean;
  className?: string;
}

export function CodeBlock({ code, copyable = true, className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-100 font-mono overflow-x-auto w-full max-w-full">
        <code className="block whitespace-pre text-left">{code}</code>
      </pre>
      {copyable && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-2.5 py-1.5 text-xs text-gray-200 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-1 z-10"
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

