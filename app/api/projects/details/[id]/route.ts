import Project from "@/models/project.model";
import Ticket from "@/models/ticket.model";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(req: NextRequest, context: { params: Params }) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json(
      {
        success: false,
        error: "Project id is required",
      },
      { status: 400 }
    );
  }

  try {
    const project = await Project.findById(id)
      .populate({ path: "manager", select: "id firstname lastname" })
      .populate({ path: "techlead", select: "id firstname lastname" })
      .populate({ path: "contributors", select: "id firstname lastname" });

    const tickets = await Ticket.find({ project: id })
      .populate({ path: "creator", select: "id firstname lastname" })
      .populate({ path: "developer", select: "id firstname lastname" });

    const inProgessTickets = [];
    const inTestingTickets = [];
    const completedTickets = [];

    for (let ticket of tickets) {
      if (ticket.status === "INPROGRESS") {
        inProgessTickets.push(ticket);
      } else if (ticket.status === "INTESTING") {
        inTestingTickets.push(ticket);
      } else if (ticket.status === "COMPLETED") {
        completedTickets.push(ticket);
      }
    }

    const mainData = [
      {
        id: "in-progress",
        title: "In Progress",
        tasks: inProgessTickets,
      },
      {
        id: "in-testing",
        title: "In Testing",
        tasks: inTestingTickets,
      },
      {
        id: "completed",
        title: "Completed",
        tasks: completedTickets,
      },
    ];

    return NextResponse.json({
      success: true,
      project,
      tickets: mainData,
    });
  } catch (error) {
    console.log("Err in fetching detailed information of a project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch detailed information of a project.",
      },
      { status: 500 }
    );
  }
}
