import type { QueryStatus } from '../types/query.types';

const statusConfig: Record<QueryStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: 'bg-blue-100 text-blue-800' },
  answered: { label: 'Answered', color: 'bg-yellow-100 text-yellow-800' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800' },
  verified: { label: 'Verified', color: 'bg-purple-100 text-purple-800' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-600' },
};

interface Props {
  status: QueryStatus;
}

export function QueryStatusBadge({ status }: Props) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}