import Project from "@/models/project.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

/**
 * Get the list of all projects of an organization
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const token = await getToken({ req });
  console.log("token:", token);

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized user",
      },
      { status: 401 }
    );
  }
  try {
    const organizationId = token.organizationId;
    const projects = await Project.find({ organization: new mongoose.Types.ObjectId(organizationId) });

    return NextResponse.json({
      success: true,
      projets: projects,
    });
  } catch (error) {}
}
