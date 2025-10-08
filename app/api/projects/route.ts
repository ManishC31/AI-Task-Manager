import Project from "@/models/project.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  console.log("token:", token);

  const organizationId = token?.organizationId;
  try {
    // get the data via the role

    let projects = [];
    if (token?.role === "ADMIN") {
      projects = await Project.find({ organization: organizationId });
    } else if (token?.role === "DEVELOPER") {
      projects = await Project.find({ contributors: { $in: [token?.id] } });
    } else if (token?.role === "MANAGER") {
      projects = await Project.find({ manager: token?.id });
    } else if (token?.role === "MODERATORS") {
      projects = await Project.find({ moderators: { $in: [token?.id] } });
    }

    return NextResponse.json({ success: true, projects: projects });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create project",
      },
      { status: 500 }
    );
  }
}
