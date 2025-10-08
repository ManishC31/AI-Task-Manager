import Project from "@/models/project.model";
import Ticket from "@/models/ticket.model";
import User, { IUser } from "@/models/user.model";
import { AIFunction } from "@/utils/ai";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, projectId } = await req.json();
  const token = await getToken({ req });

  if (!description) {
    return NextResponse.json(
      {
        success: false,
        error: "User description is required",
      },
      { status: 400 }
    );
  }

  try {
    const data = await AIFunction(description);
    console.log("data:", data);

    if (!data) {
      return (
        NextResponse.json({
          success: false,
          error: "Failed to generate details from the user input",
        }),
        { status: 400 }
      );
    }

    const projectData = await Project.findById(projectId);
    console.log("project data:", projectData);

    data.tags = [...data.tags, ...projectData.techstack];

    console.log("data:", data);

    let developerToAssign;

    // Find users in the same organization, and sort by number of matching skills with data.tags (descending)
    const suggestedDevelopers = await User.aggregate([
      { $match: { organization: token?.organizationId, role: "DEVELOPER" } },
      {
        $addFields: {
          matchingSkillsCount: {
            $size: {
              $ifNull: [
                {
                  $setIntersection: [{ $ifNull: ["$skills", []] }, Array.isArray(data.tags) ? data.tags : []],
                },
                [],
              ],
            },
          },
        },
      },
      { $sort: { matchingSkillsCount: -1 } },
    ]);

    console.log("suggestedDevelopers:", suggestedDevelopers);

    if (suggestedDevelopers.length === 0) {
      const fallbackDevelopers = await User.find({ organization: token?.organizationId, role: "DEVELOPER" }).limit(1);
      developerToAssign = fallbackDevelopers[0];
    }

    console.log("developerToAssign:", developerToAssign);

    // create a new ticket
    const ticket = await Ticket.create({
      title: data.title,
      description: data.description,
      project: projectId,
      creator: token?.id,
      developer: developerToAssign?._id,
      priority: data.priority,
      tags: data.tags,
    });

    return NextResponse.json(
      {
        success: true,
        ticket: ticket,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Err in crating new ticket:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create new token",
      },
      { status: 500 }
    );
  }
}
