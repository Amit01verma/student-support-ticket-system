export const ticketCategories = [
  "Fees",
  "Attendance",
  "ID Card",
  "Documents",
  "Certificates",
  "Technical Issue",
  "Other",
];

export const ticketPriorities = ["Low", "Medium", "High", "Urgent"];

export const ticketStatuses = [
  "Open",
  "Assigned",
  "In Progress",
  "Pending Student",
  "Pending Staff",
  "Resolved",
  "Closed",
];

export const demoStudent = {
  name: "Amit Student",
  email: "amit.student@example.com",
  id: import.meta.env.VITE_DEMO_STUDENT_ID || "",
};
