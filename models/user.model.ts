import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for skills (optional if only string[])
export interface ISkills {
  types: string[]; // optional wrapper if needed
}

// User interface extending mongoose.Document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "moderator" | "developer";
  skills: string[]; // Keeping it simple as per schema
}

// Mongoose Schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "developer",
      enum: ["admin", "moderator", "developer"],
    },
    skills: {
      type: [String],
      default: [], // optional default value
    },
  },
  {
    timestamps: true,
  }
);

// Define model
const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;
