import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "staff", "admin"],
    },
    department: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default model("User", userSchema);
