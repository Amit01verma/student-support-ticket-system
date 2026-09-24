import { Link } from "react-router-dom";
import Badge from "../ui/Badge.jsx";
import { EmptyState } from "../ui/States.jsx";
import { formatDate, getSlaState } from "../../utils/formatters.js";

export default function TicketTable({ tickets, compact = false }) {
  if (!tickets.length) {
    return (
      <EmptyState
        title="No tickets found"
        message="Try adjusting the filters or create a new support request."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Ticket</th>
              <th className="px-5 py-4 font-semibold">Category</th>
              <th className="px-5 py-4 font-semibold">Priority</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              {!compact && <th className="px-5 py-4 font-semibold">Student</th>}
              {!compact && (
                <th className="px-5 py-4 font-semibold">Assigned staff</th>
              )}
              <th className="px-5 py-4 font-semibold">SLA</th>
              <th className="px-5 py-4 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => {
              const sla = getSlaState(ticket.slaDueAt);
              return (
                <tr key={ticket._id} className="transition hover:bg-teal-50/30">
                  <td className="px-5 py-4">
                    <Link
                      to={`/tickets/${ticket._id}`}
                      className="group block max-w-xs"
                    >
                      <span className="font-mono text-xs font-bold text-teal-700">
                        {ticket.ticketId}
                      </span>
                      <span className="mt-1 block truncate font-semibold text-slate-900 group-hover:text-teal-700">
                        {ticket.title}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {ticket.category}
                  </td>
                  <td className="px-5 py-4">
                    <Badge value={ticket.priority} />
                  </td>
                  <td className="px-5 py-4">
                    <Badge value={ticket.status} />
                  </td>
                  {!compact && (
                    <td className="px-5 py-4 text-slate-600">
                      {ticket.student?.name || "—"}
                    </td>
                  )}
                  {!compact && (
                    <td className="px-5 py-4 text-slate-600">
                      {ticket.assignedTo?.name || "Unassigned"}
                    </td>
                  )}
                  <td className={`px-5 py-4 text-xs ${sla.className}`}>
                    {sla.label}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {formatDate(ticket.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
