import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import TicketActivity from "../models/TicketActivity.js";
import User from "../models/User.js";

const slaHoursByPriority = {
  Low: 72,
  Medium: 48,
  High: 24,
  Urgent: 8,
};

const getNextTicketId = async () => {
  const latestTicket = await Ticket.findOne({ ticketId: /^TKT-\d+$/ })
    .sort({ ticketId: -1 })
    .select("ticketId")
    .lean();

  const latestNumber = latestTicket
    ? Number.parseInt(latestTicket.ticketId.replace("TKT-", ""), 10)
    : 0;

  return `TKT-${String(latestNumber + 1).padStart(4, "0")}`;
};

export const createTicket = async (req, res) => {
  try {
    const { student, title, description, category, priority } = req.body;

    if (
      !student ||
      !title?.trim() ||
      !description?.trim() ||
      !category ||
      !priority
    ) {
      return res.status(400).json({
        success: false,
        message:
          "student, title, description, category, and priority are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(student)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const validCategories = Ticket.schema.path("category").enumValues;
    const validPriorities = Ticket.schema.path("priority").enumValues;

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket category",
      });
    }

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket priority",
      });
    }

    const studentUser = await User.findById(student).select("_id role");

    if (!studentUser) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (studentUser.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only users with the student role can create tickets",
      });
    }

    const slaDueAt = new Date(
      Date.now() + slaHoursByPriority[priority] * 60 * 60 * 1000,
    );
    const ticketId = await getNextTicketId();

    const ticket = await Ticket.create({
      ticketId,
      student,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: "Open",
      assignedTo: null,
      slaDueAt,
    });

    await TicketActivity.create({
      ticket: ticket._id,
      actor: student,
      action: "Ticket Created",
      message: "Ticket created successfully",
    });

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: { ticket },
    });
  } catch (error) {
    console.error("Create ticket failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create ticket",
    });
  }
};

const populateTicket = (query) =>
  query
    .populate("student", "name email department")
    .populate("assignedTo", "name email department");

const sendServerError = (res, message, error) => {
  console.error(message, error);

  return res.status(500).json({
    success: false,
    message,
  });
};

export const getTickets = async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (category) filters.category = category;

    const validStatuses = Ticket.schema.path("status").enumValues;
    const validPriorities = Ticket.schema.path("priority").enumValues;
    const validCategories = Ticket.schema.path("category").enumValues;

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket status",
      });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket priority",
      });
    }

    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket category",
      });
    }

    const tickets = await populateTicket(
      Ticket.find(filters).sort({ createdAt: -1 }),
    );

    return res.status(200).json({
      success: true,
      message: "Tickets retrieved successfully",
      data: { tickets },
    });
  } catch (error) {
    return sendServerError(res, "Unable to retrieve tickets", error);
  }
};

export const getTicketById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
    }

    const ticket = await populateTicket(Ticket.findById(req.params.id));

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const activities = await TicketActivity.find({ ticket: ticket._id })
      .populate("actor", "name email department")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Ticket retrieved successfully",
      data: { ticket, activities },
    });
  } catch (error) {
    return sendServerError(res, "Unable to retrieve ticket", error);
  }
};

export const updateTicket = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
    }

    const allowedFields = ["status", "priority", "assignedTo"];
    const submittedFields = Object.keys(req.body);
    const unsupportedField = submittedFields.find(
      (field) => !allowedFields.includes(field),
    );

    if (unsupportedField) {
      return res.status(400).json({
        success: false,
        message: `Field '${unsupportedField}' cannot be updated`,
      });
    }

    if (submittedFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one update field is required",
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const validStatuses = Ticket.schema.path("status").enumValues;
    const validPriorities = Ticket.schema.path("priority").enumValues;

    if (
      req.body.status !== undefined &&
      !validStatuses.includes(req.body.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket status",
      });
    }

    if (
      req.body.priority !== undefined &&
      !validPriorities.includes(req.body.priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket priority",
      });
    }

    if (req.body.assignedTo !== undefined && req.body.assignedTo !== null) {
      if (!mongoose.Types.ObjectId.isValid(req.body.assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignedTo user ID",
        });
      }

      const assignee = await User.findOne({
        _id: req.body.assignedTo,
        role: { $in: ["staff", "admin"] },
      }).select("_id");

      if (!assignee) {
        const userExists = await User.exists({ _id: req.body.assignedTo });

        return res.status(userExists ? 400 : 404).json({
          success: false,
          message: userExists
            ? "assignedTo must reference a staff or admin user"
            : "Assigned user not found",
        });
      }
    }

    const activities = [];
    const actor = ticket.student;

    if (req.body.assignedTo !== undefined) {
      const previousAssignee = ticket.assignedTo?.toString() || null;
      const nextAssignee = req.body.assignedTo?.toString() || null;

      if (previousAssignee !== nextAssignee) {
        ticket.assignedTo = req.body.assignedTo;
        activities.push({
          action: "Ticket Assigned",
          message: nextAssignee
            ? `Ticket assigned to ${nextAssignee}`
            : "Ticket assignment removed",
        });
      }
    }

    if (req.body.status !== undefined && req.body.status !== ticket.status) {
      ticket.status = req.body.status;

      if (req.body.status === "Resolved") ticket.resolvedAt = new Date();
      if (req.body.status === "Closed") ticket.closedAt = new Date();

      activities.push({
        action: "Status Updated",
        message: `Status changed to ${req.body.status}`,
      });
    }

    if (
      req.body.priority !== undefined &&
      req.body.priority !== ticket.priority
    ) {
      ticket.priority = req.body.priority;
      activities.push({
        action: "Priority Updated",
        message: `Priority changed to ${req.body.priority}`,
      });
    }

    await ticket.save();

    if (activities.length > 0) {
      await TicketActivity.insertMany(
        activities.map((activity) => ({
          ticket: ticket._id,
          actor,
          ...activity,
        })),
      );
    }

    const updatedTicket = await populateTicket(Ticket.findById(ticket._id));

    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: { ticket: updatedTicket },
    });
  } catch (error) {
    return sendServerError(res, "Unable to update ticket", error);
  }
};

export const getTicketStats = async (req, res) => {
  try {
    const [
      totalTickets,
      openTickets,
      assignedTickets,
      inProgressTickets,
      pendingStudentTickets,
      pendingStaffTickets,
      resolvedTickets,
      closedTickets,
      urgentTickets,
    ] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: "Open" }),
      Ticket.countDocuments({ status: "Assigned" }),
      Ticket.countDocuments({ status: "In Progress" }),
      Ticket.countDocuments({ status: "Pending Student" }),
      Ticket.countDocuments({ status: "Pending Staff" }),
      Ticket.countDocuments({ status: "Resolved" }),
      Ticket.countDocuments({ status: "Closed" }),
      Ticket.countDocuments({ priority: "Urgent" }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Ticket statistics retrieved successfully",
      data: {
        totalTickets,
        openTickets,
        assignedTickets,
        inProgressTickets,
        pendingStudentTickets,
        pendingStaffTickets,
        resolvedTickets,
        closedTickets,
        urgentTickets,
      },
    });
  } catch (error) {
    return sendServerError(res, "Unable to retrieve ticket statistics", error);
  }
};
