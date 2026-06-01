interface Props {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function QueryEmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center min-w-0">
      <div className="text-4xl mb-4">📭</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 break-words">{title}</h3>
      <p className="text-gray-500 max-w-sm break-words">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}