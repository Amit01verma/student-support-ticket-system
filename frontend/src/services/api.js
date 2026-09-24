const configuredApiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = configuredApiUrl.replace(/\/$/, "").endsWith("/api")
  ? configuredApiUrl.replace(/\/$/, "")
  : `${configuredApiUrl.replace(/\/$/, "")}/api`;

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.message || "Something went wrong. Please try again.",
    );
  }

  return payload;
};

export const getTickets = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const query = params.toString();
  return request(`/tickets${query ? `?${query}` : ""}`);
};

export const getTicket = (id) => request(`/tickets/${id}`);

export const createTicket = (ticket) =>
  request("/tickets", {
    method: "POST",
    body: JSON.stringify(ticket),
  });

export const updateTicket = (id, updates) =>
  request(`/tickets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

export const getTicketStats = () => request("/tickets/stats");

export const getStaff = () => request("/users/staff");
