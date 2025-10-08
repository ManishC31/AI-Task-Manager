import { ConnectDB } from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, role } = await req.json();

  const token = await getToken({ req });

  try {
    await ConnectDB();

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User already present with the email",
        },
        { status: 400 }
      );
    }

    const randomPassword = process.env.RANDOM_PASSWORD || "nsdaksdeaujkace";
    const encPassword = await bcrypt.hash(randomPassword, 10);

    const user = await User.create({
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: encPassword,
      role: role,
      organization: token?.organizationId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Employee created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Err in creating new employee:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to register new employee",
      },
      { status: 500 }
    );
  }
}
