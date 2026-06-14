interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "🔍",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <section className="bg-white rounded-[28px] border border-[#eadfce] p-10 text-center shadow-sm">
      <div className="mx-auto h-16 w-16 rounded-full bg-[#F5EDD8] flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>

      <h3 className="text-gray-900 font-bold text-lg mb-2">{title}</h3>

      {description && <p className="text-gray-500 text-sm mb-5">{description}</p>}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 bg-[#8B1A1A] text-white rounded-2xl text-sm font-semibold hover:bg-[#6B1414] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </section>
  );
}
