import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
    },
    manager: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    techlead: {
      type: mongoose.Schema.ObjectId,
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
      type: Array,
      default: [],
    },
    contributors: [
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

const Project = mongoose.models?.Project || mongoose.model("Project", projectSchema);

export default Project;
