import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
  role: ["ADMIN", "MODERATOR", "MANAGER", "DEVELOPER"];
  is_mail_verified: boolean;
  organization: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
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
      enum: ["ADMIN", "MODERATOR", "MANAGER", "DEVELOPER"],
    },
    is_mail_verified: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
