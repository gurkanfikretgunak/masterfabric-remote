type Status = 'published' | 'draft' | 'error';

interface BadgeProps {
  status: Status;
}

export function StatusBadge({ status }: BadgeProps) {
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

