import { Schema, model, Types } from "mongoose";

const ticketSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    expectedCompletion: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["New", "Attending", "Completed", "Escalated"],
      default: "New",
    },
    criticalLevel: {
      type: String,
      enum: ["C1", "C2", "C3", null],
      default: null,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Types.ObjectId,
      ref: "User",
    },
    escalationLevel: {
      type: Number,
      enum: [0, 1, 2], // 0: L1, 1: L2, 2: L3
      default: 0,
    },
    escalatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    resolution: {
      type: String,
      default: null,
    },
    closedAt: {
      type: Date,
    },
    logs: [
      {
        actionBy: { type: Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["L1", "L2", "L3"] },
        note: String,
        createdAt: { type: Date, default: Date.now },
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default model("Ticket", ticketSchema);
