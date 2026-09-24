import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthFrame, Alert } from "./Login.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword ||
      !form.role
    ) {
      setError("Complete all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      signup(form);
      setSuccess("Account created. Redirecting to sign in...");
      window.setTimeout(() => navigate("/login", { replace: true }), 700);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthFrame
      eyebrow="Demo signup"
      title="Create your account"
      subtitle="Set up a lightweight demo profile for the assignment workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <Alert>{error}</Alert>}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}
        <Field
          label="Name"
          value={form.name}
          onChange={(value) => update("name", value)}
          placeholder="Your full name"
        />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => update("email", value)}
          placeholder="you@example.com"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) => update("password", value)}
            placeholder="Create a password"
          />
          <Field
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={(value) => update("confirmPassword", value)}
            placeholder="Repeat password"
          />
        </div>
        <label className="block text-sm font-semibold text-slate-700">
          Role
          <select
            value={form.role}
            onChange={(event) => update("role", event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        </label>
        <button className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800">
          Create demo account
        </button>
        <p className="text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-teal-700 hover:text-teal-900"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthFrame>
  );
}

function Field({ label, type = "text", value, onChange, placeholder }) {
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
