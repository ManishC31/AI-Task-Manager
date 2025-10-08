import User from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  try {
    let employees = [];
    if (token?.role === "ADMIN" || token?.role === "MANAGER") {
      employees = await User.find({ organization: token?.organizationId });
    } else {
      employees = await User.find({ organization: token?.organizationId, role: ["MODERATOR", "DEVELOPER"] });
    }

    return NextResponse.json(
      {
        success: true,
        employees: employees,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Err in fetching employees", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch employees",
    });
  }
}
