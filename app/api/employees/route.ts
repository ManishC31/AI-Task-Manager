/**
 * Get employees by organization
 */

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/user.model";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized user",
      },
      { status: 400 }
    );
  }

  const organizationId = new mongoose.Types.ObjectId(token.organizationId);
  try {
    const employees = await User.find({ organization: organizationId });

    return NextResponse.json(
      {
        success: true,
        employees: employees,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Err in fetching employees", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch employees",
      },
      { status: 500 }
    );
  }
}
