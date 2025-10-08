import { ConnectDB } from "@/lib/db";
import Organization from "@/models/organization.model";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const { orgname, firstname, lastname, email, password, role } = await req.json();

  const registerSchema = z.object({
    orgname: z.string().min(2, "Organization name must be at least 2 characters"),
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address").lowercase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.string().uppercase(),
  });

  const parseResult = registerSchema.safeParse({ orgname, firstname, lastname, email, password, role });

  console.log("parseResult:", parseResult);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        success: false,
        errors: parseResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }
  const session = await mongoose.startSession();

  try {
    await ConnectDB();
    session.startTransaction();

    const extension = email.split("@")[1];
    const existingOrganization = await Organization.findOne({ extension: extension });

    if (existingOrganization) {
      return NextResponse.json({
        success: false,
        error: "The organization already present",
      });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: "Email is already present in some other organization",
      });
    }

    const organization = await Organization.create({
      name: orgname,
      extension: extension,
    });

    const encPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: encPassword,
      role: role || "MANAGER",
      organization: organization._id,
    });

    await session.commitTransaction();

    return NextResponse.json({
      success: true,
      message: "Organization created successfully",
    });
  } catch (error: any) {
    console.log("Err in creating new organization:", error);
    await session.abortTransaction();
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to create new organization",
      },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}
