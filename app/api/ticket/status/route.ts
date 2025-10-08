import Ticket from "@/models/ticket.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { ticket_id, new_status } = await req.json();

  if (!ticket_id || !new_status) {
    return NextResponse.json(
      {
        success: false,
        error: "Ticket id and status are required",
      },
      { status: 400 }
    );
  }
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(ticket_id, { status: new_status }, { new: true });

    return NextResponse.json(
      {
        success: true,
        message: "Ticket status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Err in updating status of a ticket:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update the status of a ticket",
      },
      { status: 500 }
    );
  }
}
