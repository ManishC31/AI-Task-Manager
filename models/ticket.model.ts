import mongoose, { Document, Model, Schema } from "mongoose";

// Define valid status values as a TypeScript union
export type TicketStatus = "TODO" | "INPROGRESS" | "COMPLETED";

// Define the interface for a Ticket document
export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TicketStatus;
  assigned_to?: mongoose.Types.ObjectId | null;
  priority?: string;
  deadline?: Date;
  helpful_notes?: string;
  related_skills?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose schema definition
const ticketSchema: Schema<ITicket> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "TODO",
      enum: ["TODO", "INPROGRESS", "COMPLETED"], // ✅ fixed "emun" typo
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    priority: {
      type: String,
    },
    deadline: {
      type: Date,
    },
    helpful_notes: {
      type: String,
    },
    related_skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Create the model with proper typing
const Ticket: Model<ITicket> =
  mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", ticketSchema);

export default Ticket;
