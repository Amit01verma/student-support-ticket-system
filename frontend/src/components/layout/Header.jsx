import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const titles = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/tickets": "Tickets",
  "/tickets/new": "Create ticket",
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const title = titles[location.pathname] || "Ticket details";
  const role = user?.role
    ? user.role[0].toUpperCase() + user.role.slice(1)
    : "User";

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-[#f7f9f8]/90 px-5 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl p-2 text-slate-500 hover:bg-white md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <span className="text-xl">☰</span>
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Student support
          </p>
          <h1 className="text-xl font-bold text-slate-950">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/tickets/new"
          className="hidden items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 sm:flex"
        >
          <span className="text-lg leading-none">+</span> New ticket
        </Link>
        <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300 text-xs font-bold text-slate-950">
            {user?.name?.slice(0, 2).toUpperCase() || "US"}
          </span>
          <div className="max-w-32">
            <p className="truncate text-xs font-semibold text-slate-900">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-500">{role}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="ml-1 text-xs font-semibold text-slate-500 hover:text-rose-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
