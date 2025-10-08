import mongoose from "mongoose";

// Project interface with all fields including _id and timestamps
export interface IProject {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  organization?: mongoose.Types.ObjectId;
  manager?: mongoose.Types.ObjectId;
  techlead?: mongoose.Types.ObjectId;
  start_date: Date;
  finish_date?: Date;
  status?: "INPROGRESS" | "COMPLETED" | "PLANNING" | "ONHOLD";
  is_active: boolean;
  techstack: string[];
  contributors: mongoose.Types.ObjectId[];
  moderators: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    techlead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    finish_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["INPROGRESS", "COMPLETED", "PLANNING", "ONHOLD"],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    techstack: {
      type: [String],
      default: [],
    },
    contributors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.models?.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;
