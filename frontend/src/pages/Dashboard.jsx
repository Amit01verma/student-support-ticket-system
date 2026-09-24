import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTicketStats, getTickets } from "../services/api.js";
import StatCard from "../components/ui/StatCard.jsx";
import TicketTable from "../components/tickets/TicketTable.jsx";
import { ErrorState, LoadingState } from "../components/ui/States.jsx";

const statCards = [
  ["totalTickets", "Total tickets", "teal", "#"],
  ["openTickets", "Open tickets", "blue", "○"],
  ["assignedTickets", "Assigned", "violet", "→"],
  ["inProgressTickets", "In progress", "blue", "↗"],
  ["pendingStudentTickets", "Pending student", "amber", "…"],
  ["pendingStaffTickets", "Pending staff", "violet", "…"],
  ["resolvedTickets", "Resolved", "teal", "✓"],
  ["closedTickets", "Closed", "slate", "■"],
  ["urgentTickets", "Urgent", "rose", "!"],
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const [statsResponse, ticketsResponse] = await Promise.all([
        getTicketStats(),
        getTickets(),
      ]);
      setStats(statsResponse.data);
      setTickets((ticketsResponse.data?.tickets || []).slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <LoadingState label="Loading dashboard" />;
  if (error) return <ErrorState message={error} onRetry={loadDashboard} />;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-300/30 md:px-9 md:py-10">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
            Good morning, Amit
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Keep every student request moving.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            A clear view of your support queue, pending actions, and service
            levels.
          </p>
        </div>
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-8 border-teal-400/20" />
        <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full border-8 border-amber-300/10" />
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Overview
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Support workload
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map(([key, label, accent, icon]) => (
            <StatCard
              key={key}
              label={label}
              value={stats?.[key]}
              accent={accent}
              icon={icon}
            />
          ))}
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Live queue
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Recent tickets
            </h2>
          </div>
          <Link
            to="/tickets"
            className="text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            View all tickets →
          </Link>
        </div>
        <TicketTable tickets={tickets} compact />
      </section>
    </div>
  );
}
