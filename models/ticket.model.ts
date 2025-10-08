import mongoose, { Document, Schema } from "mongoose";

// Define the conversation message interface
interface IConversationMessage {
  author: mongoose.Types.ObjectId;
  message: string;
  created_date: Date;
}

// Define the main ticket interface
export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  project?: mongoose.Types.ObjectId;
  status: "INPROGRESS" | "INTESTING" | "COMPLETED";
  start_date: Date;
  finish_date?: Date;
  creator?: mongoose.Types.ObjectId;
  developer?: any;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  images: string[];
  tags: string[];
  conversation: IConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    project: {
      type: Schema.ObjectId,
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
      type: Schema.ObjectId,
      ref: "User",
    },
    developer: {
      type: Schema.ObjectId,
      ref: "User",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    conversation: [
      {
        author: {
          type: Schema.ObjectId,
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

const Ticket = mongoose.models?.Ticket || mongoose.model<ITicket>("Ticket", ticketSchema);

export default Ticket;
