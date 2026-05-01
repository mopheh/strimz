"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { VolumeX, Volume2, Info, Play } from "lucide-react";
const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});
import { motion, AnimatePresence } from "framer-motion";
import { useMovie } from "@/hooks/useMovies";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { OverviewProps } from "@/index";

const Overview = ({ type }: OverviewProps) => {
  const { movieId, mediaType, isLoading: isFetchingMeta } = useFetch(`/api/overview?type=${type}`);
  const {
    movie,
    trailer,
    showVideo,
    isMuted,
    englishLogo,
    timeoutReached,
    playerRef,
    toggleMute,
    setTimeoutReached,
  } = useMovie(`/api/movies/details?id=${movieId}&type=${mediaType}`, "home");
  const router = useRouter();

  if (isFetchingMeta || !movie) {
    return (
      <div className="relative w-full h-[70vh] md:h-[85vh] bg-black/40 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden group">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {!showVideo || timeoutReached || !trailer ? (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="relative w-full h-full"
            >
              <Image
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                alt={movie.title || movie.name}
                fill
                priority
                className="object-cover brightness-[0.6] scale-105"
              />
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              <ReactPlayer
                ref={(player: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => { playerRef.current = player; }}
                url={trailer}
                playing={true}
                muted={isMuted}
                volume={1}
                controls={false}
                loop={false}
                width="100%"
                height="115%"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                className="scale-110 pointer-events-none"
                onEnded={() => setTimeoutReached(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 md:pb-24 px-6 md:px-12 lg:px-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          {/* Logo or Title */}
          <div className="space-y-2">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded text-[10px] uppercase tracking-[0.2em] text-primary font-bold"
            >
              {mediaType === "tv" ? "Featured Series" : "Featured Cinema"}
            </motion.span>
            
            <div className="h-20 md:h-32 flex items-center">
              {englishLogo ? (
                <Image
                  src={`https://image.tmdb.org/t/p/original/${englishLogo.file_path}`}
                  alt={movie?.title || movie?.name}
                  width={400}
                  height={150}
                  className="w-auto h-full max-w-[280px] md:max-w-[450px] object-contain"
                />
              ) : (
                <h1 className="text-4xl md:text-7xl font-bebas-neue tracking-widest text-white drop-shadow-2xl">
                  {movie?.title || movie?.name}
                </h1>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">{movie.vote_average.toFixed(1)}</span>
              <span className="text-xs text-gray-500">Rating</span>
            </div>
            <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
            <div className="flex gap-2">
              {movie.genres.slice(0, 2).map((g: { id: number; name: string }) => (
                <span key={g.id} className="text-gray-400">{g.name}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm md:text-lg leading-relaxed max-w-xl line-clamp-3 drop-shadow-md">
            {movie?.overview}
          </p>


          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              onClick={() => router.push(`/${mediaType}/${movie?.id}`)}
              className="bg-primary text-black hover:bg-primary/90 px-8 py-6 rounded-md font-bold text-base md:text-lg flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="fill-current w-5 h-5" /> Watch Now
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/${mediaType}/${movie?.id}`)}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white px-8 py-6 rounded-md font-bold text-base md:text-lg flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
            >
              <Info className="w-5 h-5" /> Details
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Utilities (Mute, etc) */}
      <div className="absolute bottom-12 right-6 md:right-12 z-30 flex items-center gap-4">
        {showVideo && !timeoutReached && (
          <button
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
           <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
           <span className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">Showing Live</span>
        </div>
      </div>
    </section>
  );
};

export default Overview;

