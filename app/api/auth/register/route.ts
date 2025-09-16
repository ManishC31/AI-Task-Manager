import { NextRequest } from "next/server";
import { SendResponse } from "@/utils/response";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { StandardSentence } from "@/utils/functions";
import { ConnectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  // Validate required fields
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return SendResponse(400, "Name is required", null);
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return SendResponse(400, "A valid email is required", null);
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return SendResponse(400, "Password should be at least 8 characters", null);
  }

  try {
    await ConnectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return SendResponse(400, "User already present with email");
    }

    const encPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name: StandardSentence(name), email: email.toLowerCase(), password: encPassword });

    return SendResponse(201, "User registered successfully");
  } catch (error) {
    console.log("Err in register user:", error);
    return SendResponse(500, "Failed to register user");
  }
}
