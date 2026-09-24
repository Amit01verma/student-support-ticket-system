import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    submitLogin(form.email, form.password);
  };

  const submitLogin = (email, password) => {
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFrame
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      subtitle="Manage student support requests from one focused workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => setForm({ ...form, email: value })}
          placeholder="you@example.com"
        />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(value) => setForm({ ...form, password: value })}
          placeholder="Enter your password"
        />
        <button
          disabled={submitting}
          className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-center text-sm text-slate-500">
          New to the workspace?{" "}
          <Link
            to="/signup"
            className="font-semibold text-teal-700 hover:text-teal-900"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthFrame>
  );
}

export function AuthFrame({ eyebrow, title, subtitle, children }) {
  return (
    <div className="box-border flex min-h-dvh items-center justify-center bg-[#f7f9f8] px-5 py-8 md:h-dvh md:min-h-0 md:overflow-hidden md:py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-none md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative hidden overflow-hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">
          <div className="relative z-10">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-400 font-black text-slate-950">
              SS
            </span>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              Student support
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight">
              A clearer way to move every request forward.
            </h2>
          </div>
          <p className="relative z-10 text-sm text-slate-400">
            Ticket workspace · Demo environment
          </p>
          <div className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full border-8 border-teal-400/20" />
          <div className="absolute -right-24 top-16 h-48 w-48 rounded-full border-8 border-amber-300/10" />
        </div>
        <div className="p-7 sm:p-10 md:p-10">
          <div className="mb-8 md:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-400 font-black text-slate-950">
              SS
            </span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
      />
    </label>
  );
}

export function Alert({ children }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {children}
    </div>
  );
}
