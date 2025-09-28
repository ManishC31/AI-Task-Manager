import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
    },
    status: {
      type: String,
      enum: ["INPROGRESS", "INTESTING", "COMPLETED"],
      default: "INPROGRESS",
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    finish_date: {
      type: Date,
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    developer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
    },
    images: {
      type: Array,
      default: [],
    },
    conversation: [
      {
        author: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
          required: true,
        },
        created_date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Ticket = mongoose.models?.Ticket || mongoose.model("Ticket", ticketSchema);

export default Ticket;
