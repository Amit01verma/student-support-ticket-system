import { model, Schema } from "mongoose";

const ticketActivitySchema = new Schema(
  {
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

ticketActivitySchema.index({ ticket: 1, createdAt: -1 });

ticketActivitySchema.index({ actor: 1 });

export default model("TicketActivity", ticketActivitySchema);
