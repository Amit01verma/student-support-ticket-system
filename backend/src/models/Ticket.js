import { model, Schema } from "mongoose";

const ticketCategories = [
  "Fees",
  "Attendance",
  "ID Card",
  "Documents",
  "Certificates",
  "Technical Issue",
  "Other",
];

const ticketPriorities = ["Low", "Medium", "High", "Urgent"];

const ticketStatuses = [
  "Open",
  "Assigned",
  "In Progress",
  "Pending Student",
  "Pending Staff",
  "Resolved",
  "Closed",
];

const ticketSchema = new Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^TKT-\d+$/,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ticketCategories,
    },
    priority: {
      type: String,
      required: true,
      enum: ticketPriorities,
    },
    status: {
      type: String,
      required: true,
      enum: ticketStatuses,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    slaDueAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ createdAt: -1 });

export default model("Ticket", ticketSchema);
