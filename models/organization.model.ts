import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    extension: {
      type: String,
    },
    plan: {
      type: String,
      enum: ["HOBBY", "PRO", "ENTERPRISE"],
      default: "HOBBY",
    },
  },
  { timestamps: true }
);

const Organization = mongoose.models?.Organization || mongoose.model("Organization", organizationSchema);

export default Organization;
