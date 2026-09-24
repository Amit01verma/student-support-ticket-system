import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../services/api.js";
import {
  demoStudent,
  ticketCategories,
  ticketPriorities,
} from "../utils/constants.js";

const initialForm = { title: "", description: "", category: "", priority: "" };

export default function NewTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!demoStudent.id) {
      setError(
        "Set VITE_DEMO_STUDENT_ID in frontend/.env before creating a ticket.",
      );
      return;
    }
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.category ||
      !form.priority
    ) {
      setError("Complete all required fields before submitting.");
      return;
    }
    try {
      setSubmitting(true);
      const response = await createTicket({ ...form, student: demoStudent.id });
      navigate(`/tickets/${response.data.ticket._id}`, {
        state: { message: "Ticket created successfully" },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-50";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
          Student request
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Create a support ticket
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Tell the support team what you need help with. They will use the
          details below to triage your request.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:p-8"
      >
        <div className="mb-7 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 text-sm font-bold text-slate-950">
            AS
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Submitting as
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {demoStudent.name}{" "}
              <span className="font-normal text-slate-500">
                · {demoStudent.email}
              </span>
            </p>
          </div>
        </div>
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        <div className="space-y-5">
          <label className="block text-sm font-semibold text-slate-700">
            Title{" "}
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              className={inputClass}
              placeholder="Briefly describe the issue"
              maxLength={120}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Description{" "}
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              className={`${inputClass} min-h-36 resize-y`}
              placeholder="Include any details that will help the support team resolve this request"
              rows="5"
            />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Category{" "}
              <select
                name="category"
                value={form.category}
                onChange={updateField}
                className={inputClass}
              >
                <option value="">Select category</option>
                {ticketCategories.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Priority{" "}
              <select
                name="priority"
                value={form.priority}
                onChange={updateField}
                className={inputClass}
              >
                <option value="">Select priority</option>
                {ticketPriorities.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}
