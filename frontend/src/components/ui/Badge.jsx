const styles = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-sky-100 text-sky-700",
  High: "bg-amber-100 text-amber-800",
  Urgent: "bg-rose-100 text-rose-700",
  Open: "bg-emerald-100 text-emerald-700",
  Assigned: "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  "Pending Student": "bg-orange-100 text-orange-800",
  "Pending Staff": "bg-violet-100 text-violet-700",
  Resolved: "bg-teal-100 text-teal-700",
  Closed: "bg-slate-200 text-slate-700",
};

export default function Badge({ value }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value] || "bg-slate-100 text-slate-700"}`}
    >
      {value}
    </span>
  );
}
