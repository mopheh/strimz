import { db } from "@/database";
import { screenings, tickets } from "@/database/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import TheaterPlayer from "@/components/TheaterPlayer";

export default async function TheaterPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const screeningId = params.id;

  // 1. Verify Screening and Ticket
  const screening = await db.query.screenings.findFirst({
    where: eq(screenings.id, screeningId),
  });

  if (!screening) {
    redirect("/");
  }

  const ticket = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.userId, userId),
      eq(tickets.screeningId, screeningId)
    ),
  });

  if (!ticket) {
    // Redirect back to the movie page if they don't have a ticket
    redirect(`/movie/${screening.movieId}`);
  }

  return (
    <div className="min-h-screen bg-black text-white font-poppins flex flex-col">
      {/* Top Bar */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Now Screening</span>
          <h1 className="text-xl font-bebas-neue tracking-widest uppercase">{screening.title}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Your Seat</span>
            <span className="text-sm font-bold text-primary">{ticket.seatNumber}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Main Cinema Screen */}
        <div className="flex-1 relative bg-black flex items-center justify-center p-4 lg:p-12">
          <TheaterPlayer 
            movieId={screening.movieId} 
            mediaType={screening.mediaType.toLowerCase()} 
          />
          
          {/* Cinema Ambience Shadows */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>

        {/* Sidebar (Chat & Info) */}
        <aside className="w-full lg:w-[400px] border-l border-white/10 flex flex-col bg-zinc-950/50 backdrop-blur-sm">
           <div className="p-6 border-b border-white/10">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Theater Chat</h2>
              <div className="space-y-4 h-[300px] lg:h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                 <p className="text-xs text-gray-500 italic">Welcome to the screening of {screening.title}. Enjoy the show!</p>
                 <div className="space-y-1">
                    <span className="text-[10px] text-primary font-bold">Projectionist</span>
                    <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-xl rounded-tl-none">Please remember to keep your microphones muted during the feature.</p>
                 </div>
              </div>
           </div>
           
           <div className="mt-auto p-6">
              <input 
                type="text" 
                placeholder="Say something to the audience..."
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
           </div>
        </aside>
      </main>
    </div>
  );
}
