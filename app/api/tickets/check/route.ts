import { db } from "@/database";
import { screenings, tickets } from "@/database/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, gte } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return new NextResponse("Missing movieId", { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the active screening for this movie
    const screening = await db.query.screenings.findFirst({
      where: and(
        eq(screenings.movieId, parseInt(movieId)),
        gte(screenings.startTime, today)
      ),
    });

    if (!screening) {
      return NextResponse.json({ hasTicket: false });
    }

    // Check if the user has a ticket for this screening
    const ticket = await db.query.tickets.findFirst({
      where: and(
        eq(tickets.userId, userId),
        eq(tickets.screeningId, screening.id)
      ),
    });

    return NextResponse.json({ 
      hasTicket: !!ticket, 
      screeningId: screening.id,
      seatNumber: ticket?.seatNumber 
    });
  } catch (error) {
    console.error("[TICKET_CHECK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
