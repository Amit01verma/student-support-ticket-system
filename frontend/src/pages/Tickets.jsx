import { useEffect, useMemo, useState } from "react";
import TicketTable from "../components/tickets/TicketTable.jsx";
import { ErrorState, LoadingState } from "../components/ui/States.jsx";
import { getTickets } from "../services/api.js";
import {
  ticketCategories,
  ticketPriorities,
  ticketStatuses,
} from "../utils/constants.js";

const initialFilters = { status: "", priority: "", category: "" };

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTickets(filters);
      setTickets(response.data?.tickets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filters.status, filters.priority, filters.category]);

  const visibleTickets = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return tickets;
    return tickets.filter((ticket) =>
      [ticket.ticketId, ticket.title, ticket.description].some((value) =>
        value?.toLowerCase().includes(query),
      ),
    );
  }, [tickets, search]);

  const selectClass =
    "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Workspace
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            All tickets
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Monitor requests, ownership, and service levels in one place.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          {visibleTickets.length} ticket{visibleTickets.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40">
        <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_repeat(3,180px)]">
          <label className="relative">
            <span className="sr-only">Search tickets</span>
            <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
              ⌕
            </span>
            <input
              className={`${selectClass} w-full pl-9`}
              placeholder="Search ticket ID, title, or description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <select
            className={selectClass}
            value={filters.status}
            onChange={(event) =>
              setFilters({ ...filters, status: event.target.value })
            }
          >
            <option value="">All statuses</option>
            {ticketStatuses.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            className={selectClass}
            value={filters.priority}
            onChange={(event) =>
              setFilters({ ...filters, priority: event.target.value })
            }
          >
            <option value="">All priorities</option>
            {ticketPriorities.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            className={selectClass}
            value={filters.category}
            onChange={(event) =>
              setFilters({ ...filters, category: event.target.value })
            }
          >
            <option value="">All categories</option>
            {ticketCategories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <LoadingState label="Loading tickets" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadTickets} />
      ) : (
        <TicketTable tickets={visibleTickets} />
      )}
    </div>
  );
}
