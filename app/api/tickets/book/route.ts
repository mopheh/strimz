import { db } from "@/database";
import { screenings, tickets, users } from "@/database/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, and, gte } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { movieId, movieTitle, mediaType } = await req.json();

    if (!movieId || !movieTitle) {
      return new NextResponse("Missing movie information", { status: 400 });
    }

    // 1. Ensure user exists in our DB
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!existingUser) {
      const user = await currentUser();
      if (!user) {
        return new NextResponse("User data not found", { status: 401 });
      }
      
      await db.insert(users).values({
        clerkId: userId,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        email: user.emailAddresses[0].emailAddress,
      });
    }

    // 2. Find or Create a screening for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let screening = await db.query.screenings.findFirst({
      where: and(
        eq(screenings.movieId, movieId),
        gte(screenings.startTime, today)
      ),
    });

    if (!screening) {
      // Create a default screening for 8 PM tonight
      const startTime = new Date();
      startTime.setHours(20, 0, 0, 0);
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

      const [newScreening] = await db.insert(screenings).values({
        movieId,
        mediaType: mediaType.toUpperCase(),
        title: movieTitle,
        startTime,
        endTime,
        roomName: "Virtual Hall 1",
      }).returning();
      
      screening = newScreening;
    }

    // 3. Check if user already has a ticket
    const existingTicket = await db.query.tickets.findFirst({
      where: and(
        eq(tickets.userId, userId),
        eq(tickets.screeningId, screening.id)
      ),
    });

    if (existingTicket) {
      return NextResponse.json({ message: "You already have a ticket for this screening", ticket: existingTicket });
    }

    // 4. Create the ticket
    const [ticket] = await db.insert(tickets).values({
      userId,
      screeningId: screening.id,
      seatNumber: `V-${Math.floor(Math.random() * 100)}`,
    }).returning();

    return NextResponse.json({ message: "Ticket booked successfully!", ticket });
  } catch (error) {
    console.error("[TICKET_BOOKING_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
