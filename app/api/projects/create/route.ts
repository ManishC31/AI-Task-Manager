import { ConnectDB } from "@/lib/db";
import Project from "@/models/project.model";
import { StandardSentence } from "@/utils/helpers";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .trim(),
  manager: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid manager ID",
  }),
  techlead: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid techlead ID",
  }),
  developers: z
    .array(
      z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid developer ID",
      })
    )
    .optional()
    .default([]),
  tags: z.array(z.string().min(1, "Tag cannot be empty").trim()).optional().default([]),
});

/**
 * Create new project in an organization
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validationResult = createProjectSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = (validationResult.error as z.ZodError<any>).issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    const { title, description, manager, techlead, developers, tags } = validationResult.data;

    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized user",
        },
        { status: 401 }
      );
    }

    // Validate organization ID from token
    if (!token.organizationId || !mongoose.Types.ObjectId.isValid(token.organizationId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid organization ID",
        },
        { status: 400 }
      );
    }

    // connect to database
    await ConnectDB();

    // Check if the project title is already present in organization or not.
    const existingProject = await Project.findOne({
      title: StandardSentence(title),
      organization: new mongoose.Types.ObjectId(token.organizationId),
    });

    if (existingProject) {
      return NextResponse.json(
        {
          success: false,
          message: "Project with same title already exists in this organization",
        },
        { status: 400 }
      );
    }

    // Convert developers array to ObjectIds if provided
    const contributorIds = developers.length > 0 ? developers.map((id: string) => new mongoose.Types.ObjectId(id)) : [];

    const newProject = await Project.create({
      title: StandardSentence(title),
      description: description,
      manager: new mongoose.Types.ObjectId(manager),
      techlead: new mongoose.Types.ObjectId(techlead),
      contributors: contributorIds,
      techstack: tags,
      organization: new mongoose.Types.ObjectId(token.organizationId),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: {
          projectId: newProject._id,
          title: newProject.title,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Err in create project:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create project",
      },
      { status: 500 }
    );
  }
}
