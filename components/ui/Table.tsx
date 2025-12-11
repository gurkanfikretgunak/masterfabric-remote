import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  columns: string[];
}

export function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        {columns.map((col, i) => (
          <th
            key={i}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-500 uppercase whitespace-nowrap ${
              i === columns.length - 1 ? 'text-right' : 'text-left'
            }`}
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
}

export function TableRow({ children, onClick }: TableRowProps) {
  return (
    <tr
      className={`hover:bg-gray-50 border-b border-gray-200 last:border-0 transition-all duration-150 ease-in-out ${
        onClick ? 'cursor-pointer hover:shadow-sm' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
  colSpan?: number;
}

export function TableCell({ children, align = 'left', className = '', colSpan }: TableCellProps) {
  return (
    <td 
      colSpan={colSpan}
      className={`px-3 sm:px-6 py-3 sm:py-4 text-sm ${align === 'right' ? 'text-right' : 'text-left'} ${className}`}
    >
      {children}
    </td>
  );
}

