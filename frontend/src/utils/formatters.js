export const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

export const getSlaState = (value) => {
  if (!value) return { label: "No SLA", className: "text-slate-400" };
  const due = new Date(value);
  const remaining = due.getTime() - Date.now();
  if (remaining <= 0)
    return { label: "Overdue", className: "font-semibold text-rose-600" };
  const hours = Math.floor(remaining / 3600000);
  const days = Math.floor(hours / 24);
  return {
    label:
      days > 0
        ? `${days}d ${hours % 24}h remaining`
        : `${Math.max(hours, 1)}h remaining`,
    className: "font-semibold text-emerald-700",
  };
};
