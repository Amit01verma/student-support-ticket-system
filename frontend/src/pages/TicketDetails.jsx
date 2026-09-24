import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Badge from "../components/ui/Badge.jsx";
import { ErrorState, LoadingState } from "../components/ui/States.jsx";
import { getStaff, getTicket, updateTicket } from "../services/api.js";
import { ticketPriorities, ticketStatuses } from "../utils/constants.js";
import { formatDateTime, getSlaState } from "../utils/formatters.js";

export default function TicketDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [ticket, setTicket] = useState(null);
  const [activities, setActivities] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(location.state?.message || "");
  const [updating, setUpdating] = useState("");

  const loadTicket = async () => {
    try {
      setLoading(true);
      setError("");
      const ticketResponse = await getTicket(id);
      setTicket(ticketResponse.data.ticket);
      setActivities(ticketResponse.data.activities || []);

      try {
        const staffResponse = await getStaff();
        setStaff(
          staffResponse.data?.staff ||
            staffResponse.data?.users ||
            staffResponse.data ||
            [],
        );
      } catch (staffError) {
        console.warn("Staff list unavailable:", staffError.message);
        setStaff([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const changeValue = async (field, value) => {
    try {
      setUpdating(field);
      setFeedback("");
      const response = await updateTicket(id, {
        [field]: value === "" ? null : value,
      });
      setTicket(response.data.ticket);
      const refreshed = await getTicket(id);
      setActivities(refreshed.data.activities || []);
      setFeedback("Ticket updated successfully");
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setUpdating("");
    }
  };

  if (loading) return <LoadingState label="Loading ticket" />;
  if (error) return <ErrorState message={error} onRetry={loadTicket} />;
  if (!ticket) return null;

  const sla = getSlaState(ticket.slaDueAt);
  const selectClass =
    "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:opacity-50";

  return (
    <div className="space-y-6">
      <Link
        to="/tickets"
        className="inline-flex text-sm font-semibold text-teal-700 hover:text-teal-900"
      >
        ← Back to tickets
      </Link>
      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${feedback.includes("success") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}
        >
          {feedback}
        </div>
      )}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-teal-700">
              {ticket.ticketId}
            </span>
            <Badge value={ticket.status} />
          </div>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950">
            {ticket.title}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Created {formatDateTime(ticket.createdAt)} · Updated{" "}
            {formatDateTime(ticket.updatedAt)}
          </p>
        </div>
        <div
          className={`rounded-xl bg-white px-4 py-3 text-right shadow-sm ring-1 ring-slate-200 ${sla.className}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            SLA
          </p>
          <p className="mt-1 text-sm">{sla.label}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Request details
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {ticket.description}
            </p>
            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <Info label="Category" value={ticket.category} />
              <Info
                label="Student"
                value={ticket.student?.name}
                subvalue={ticket.student?.email}
              />
              <Info label="SLA due" value={formatDateTime(ticket.slaDueAt)} />
              <Info
                label="Assigned staff"
                value={ticket.assignedTo?.name || "Unassigned"}
                subvalue={ticket.assignedTo?.email}
              />
              <Info
                label="Resolved"
                value={formatDateTime(ticket.resolvedAt)}
              />
              <Info label="Closed" value={formatDateTime(ticket.closedAt)} />
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  History
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-950">
                  Activity timeline
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {activities.length} event{activities.length === 1 ? "" : "s"}
              </span>
            </div>
            {activities.length ? (
              <div className="mt-6 space-y-0">
                {activities.map((activity, index) => (
                  <div
                    key={activity._id}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    <div className="relative flex w-4 shrink-0 justify-center">
                      <span className="z-10 mt-1 h-3 w-3 rounded-full border-2 border-white bg-teal-500 ring-1 ring-teal-200" />
                      {index < activities.length - 1 && (
                        <span className="absolute top-4 h-full w-px bg-slate-200" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {activity.action}
                        </p>
                        <time className="text-xs text-slate-400">
                          {formatDateTime(activity.createdAt)}
                        </time>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {activity.message}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        by {activity.actor?.name || "System"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">
                No activity recorded yet.
              </p>
            )}
          </section>
        </div>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Manage ticket
          </p>
          <div className="mt-5 space-y-5">
            <Control
              label="Status"
              value={ticket.status}
              options={ticketStatuses}
              onChange={(value) => changeValue("status", value)}
              disabled={!!updating}
            />
            <Control
              label="Priority"
              value={ticket.priority}
              options={ticketPriorities}
              onChange={(value) => changeValue("priority", value)}
              disabled={!!updating}
            />
            <label className="block text-sm font-semibold text-slate-700">
              Assigned staff
              <select
                className={`${selectClass} mt-2 w-full`}
                value={ticket.assignedTo?._id || ""}
                onChange={(event) =>
                  changeValue("assignedTo", event.target.value)
                }
                disabled={!!updating}
              >
                <option value="">Unassigned</option>
                {staff.map((person) => (
                  <option key={person._id} value={person._id}>
                    {person.name} · {person.department || "Staff"}
                  </option>
                ))}
              </select>
            </label>
            {updating && (
              <p className="text-xs font-medium text-teal-700">
                Saving {updating}...
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value, subvalue }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>
      {subvalue && (
        <p className="mt-0.5 truncate text-xs text-slate-500">{subvalue}</p>
      )}
    </div>
  );
}
function Control({ label, value, options, onChange, disabled }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <select
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:opacity-50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
