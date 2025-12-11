'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  copyable?: boolean;
  className?: string;
}

export function CodeBlock({ 
  code, 
  language = 'text', 
  copyable = true, 
  className = '' 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          paddingRight: copyable ? '4.5rem' : '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          background: '#1e1e1e',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
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

