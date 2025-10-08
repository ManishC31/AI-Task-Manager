import Project from "@/models/project.model";
import Ticket from "@/models/ticket.model";
import User from "@/models/user.model";
import { AIFunction } from "@/utils/ai";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, projectId } = await req.json();
  const token = await getToken({ req });

  if (!description) {
    return NextResponse.json({ success: false, error: "User description is required" }, { status: 400 });
  }

  try {
    const data = await AIFunction(description);
    if (!data) {
      return NextResponse.json({ success: false, error: "Failed to generate details from the user input" }, { status: 400 });
    }

    const projectData = await Project.findById(projectId);
    if (!projectData) {
      return NextResponse.json({ success: false, error: "Invalid project ID" }, { status: 400 });
    }

    data.tags = [...data.tags, ...projectData.techstack];

    // Step 1: Find developers with matching skills in the same organization
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

    let developerToAssign = null;

    if (suggestedDevelopers.length > 0 && suggestedDevelopers[0].matchingSkillsCount > 0) {
      // Highest skill match developer
      developerToAssign = suggestedDevelopers[0];
    } else {
      // Step 2: No skill match → assign developer with least number of active projects
      const leastLoadedDeveloper = await User.aggregate([
        { $match: { organization: token?.organizationId, role: "DEVELOPER" } },
        {
          $lookup: {
            from: "tickets",
            localField: "_id",
            foreignField: "developer",
            as: "assignedTickets",
          },
        },
        {
          $addFields: {
            projectCount: { $size: "$assignedTickets" },
          },
        },
        { $sort: { projectCount: 1 } }, // ascending → least busy first
        { $limit: 1 },
      ]);

      developerToAssign = leastLoadedDeveloper[0] || null;
    }

    const ticket = await Ticket.create({
      title: data.title,
      description: data.description,
      project: projectId,
      creator: token?.id,
      developer: developerToAssign?._id || null,
      priority: data.priority,
      tags: data.tags,
    });

    return NextResponse.json({ success: true, ticket }, { status: 200 });
  } catch (error) {
    console.error("Error creating new ticket:", error);
    return NextResponse.json({ success: false, error: "Failed to create new ticket" }, { status: 500 });
  }
}
