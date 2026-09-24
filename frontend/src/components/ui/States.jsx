export function LoadingState({ label = "Loading" }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
      <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />
      {label}...
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
      <p className="font-semibold">Unable to load this view</p>
      <p className="mt-1">{message}</p>
      {onRetry && (
        <button className="mt-4 font-semibold underline" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700">
        +
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}
