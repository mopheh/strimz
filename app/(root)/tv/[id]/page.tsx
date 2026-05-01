"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Volume2, VolumeX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

import Info from "@/components/Info";
import Casts from "@/components/Casts";
import Recommendation from "@/components/Recommendation";
import { useMovie } from "@/hooks/useMovies";

const Page = () => {
  const { id: movieId } = useParams();
  const router = useRouter();
  const { userId: clerkUserId } = useAuth();

  const {
    movie,
    showVideo,
    isMuted,
    trailer,
    playerRef,
    toggleMute,
    englishLogo,
  } = useMovie(`/api/movies/details?id=${movieId}&type=tv`);


  useEffect(() => {
    if (movie) {
      document.title = `${movie?.name || movie?.title} || Strimz`;
    }
  }, [movie]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
        {/* Backdrop / Video Container */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            {!showVideo || !trailer ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="relative h-full w-full"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  alt={movie.name}
                  fill
                  priority
                  className="object-cover brightness-[0.4]"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full w-full relative"
              >
                <ReactPlayer
                  ref={(player: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => { playerRef.current = player; }}
                  url={trailer}
                  playing
                  muted={isMuted}
                  loop
                  width="100%"
                  height="115%"
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                  className="pointer-events-none scale-110"
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 px-6 md:px-12 lg:px-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl space-y-6"
          >
            <button 
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 md:mb-8"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium uppercase tracking-widest">Back to Cinema</span>
            </button>

            <div className="h-20 md:h-32 lg:h-40 flex items-center">
              {englishLogo ? (
                <Image
                  src={`https://image.tmdb.org/t/p/original/${englishLogo.file_path}`}
                  alt={movie?.name || movie?.title}
                  width={400}
                  height={150}
                  className="w-auto h-full max-w-[280px] md:max-w-[450px] lg:max-w-[600px] object-contain"
                />
              ) : (
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas-neue tracking-wider leading-none">
                  {movie.name}
                </h1>
              )}
            </div>


            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-poppins text-gray-300">
              <span className="text-primary font-bold">{movie.vote_average.toFixed(1)} Rating</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span>{new Date(movie.first_air_date).getFullYear()}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span>{movie.number_of_seasons} Seasons</span>
              <div className="flex gap-2 ml-2">
                {movie.genres.slice(0, 3).map((g: { id: number; name: string }) => (
                  <span key={g.id} className="px-2 py-0.5 border border-white/20 rounded text-xs uppercase tracking-tighter">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-gray-400 max-w-2xl text-sm md:text-lg leading-relaxed line-clamp-3 md:line-clamp-none">
              {movie.overview}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Button 
                onClick={async () => {
                  if (!clerkUserId) {
                    router.push("/sign-in");
                    return;
                  }
                  try {
                    const res = await fetch("/api/tickets/book", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        movieId: movie.id,
                        movieTitle: movie.name,
                        mediaType: "tv",
                      }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      import("sonner").then(({ toast }) => toast.success(data.message));
                    } else {
                      import("sonner").then(({ toast }) => toast.error(data.message || "Failed to book ticket"));
                    }
                  } catch (error) {
                    console.error(error);
                    import("sonner").then(({ toast }) => toast.error("An error occurred while booking"));
                  }
                }}
                className="bg-primary text-black hover:bg-primary/90 font-bold px-8 py-6 rounded-md text-lg transition-transform active:scale-95"
              >
                Attend Screening
              </Button>
              <Button variant="outline" className="border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-6 rounded-md text-lg transition-transform active:scale-95">
                <Plus className="mr-2" /> Watchlist
              </Button>

              {showVideo && (
                <button
                  onClick={toggleMute}
                  className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- DETAILS SECTION --- */}
      <section className="relative z-30 px-6 md:px-12 lg:px-20 py-16 space-y-24 bg-black">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-3 space-y-6">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10 group">
              <Image
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                alt={movie.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <div className="lg:col-span-9">
            <Info movie={movie} />
            <div className="mt-12">
              <Casts movie={movie} />
            </div>
          </div>
        </div>

        {/* Seasons */}
        {movie.seasons?.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-3xl font-bebas-neue tracking-widest text-primary">Seasons</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movie.seasons.map((season: { id: number; poster_path: string; name: string; season_number: number; episode_count: number }) => (
                <div 
                  key={season.id} 
                  className="group cursor-pointer space-y-3"
                  onClick={() => router.push(`/series/${movieId}/season/${season.season_number}`)}
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 bg-gray-900">
                    {season.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500/${season.poster_path}`}
                        alt={season.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 text-xs">No Poster</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {season.name}
                    </p>
                    <p className="text-xs text-gray-500">{season.episode_count} Episodes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="space-y-8 pb-20">
          <h3 className="text-3xl font-bebas-neue tracking-widest text-primary">Similar Productions</h3>
          <Recommendation id={movieId as string} type="tv" />
        </div>
      </section>
    </div>
  );
};

export default Page;

