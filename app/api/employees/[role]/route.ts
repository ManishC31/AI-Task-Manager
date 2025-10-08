import User from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  role: string;
}

export async function GET(req: NextRequest, context: { params: Promise<Params> }) {
  const { role } = await context.params;

  if (!role) {
    return NextResponse.json(
      {
        success: false,
        error: "Role is required",
      },
      { status: 400 }
    );
  }

  const token = await getToken({ req });
  try {
    const data = await User.find({ organization: token?.organizationId, role: role.toUpperCase() });

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Err in fetching employees by a role:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch employees with role ${role}`,
      },
      { status: 500 }
    );
  }
}
