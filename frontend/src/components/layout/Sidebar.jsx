import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "⌂", end: true },
  { to: "/tickets", label: "Tickets", icon: "▤" },
  { to: "/tickets/new", label: "Create ticket", icon: "+" },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const role = user?.role
    ? user.role[0].toUpperCase() + user.role.slice(1)
    : "User";

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/30 md:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 px-5 py-6 text-white transition-transform md:sticky md:top-0 md:h-screen md:shrink-0 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-400 font-black text-slate-950">
              SS
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight">
                Student Support
              </span>
              <span className="block text-xs text-slate-400">
                Ticket workspace
              </span>
            </span>
          </Link>
          <button
            className="rounded-lg p-2 text-slate-400 md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>
        <nav className="mt-12 space-y-2">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-teal-400 text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
              }
            >
              <span className="flex h-6 w-6 items-center justify-center text-base">
                {link.icon}
              </span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Demo user
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300 text-sm font-bold text-slate-950">
              {user?.name?.slice(0, 2).toUpperCase() || "US"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
              <span className="mt-1 inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
                {role}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-4 w-full rounded-lg border border-slate-700 px-3 py-2 text-left text-xs font-semibold text-slate-300 hover:border-rose-400 hover:text-rose-300"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
