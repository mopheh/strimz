"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useMovie } from "@/hooks/useMovies";
import { Maximize, Volume2, VolumeX } from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

interface TheaterPlayerProps {
  movieId: number;
  mediaType: string;
}

const TheaterPlayer = ({ movieId, mediaType }: TheaterPlayerProps) => {
  const {
    movie,
    trailer,
    isMuted,
    playerRef,
    toggleMute,
  } = useMovie(`/api/movies/details?id=${movieId}&type=${mediaType}`);

  // const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (playerRef.current) {
      const playerElement = playerRef.current.getInternalPlayer()?.getIframe();
      if (playerElement) {
        if (!document.fullscreenElement) {
          playerElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    }
  };

  if (!trailer && movie) {
    return (
      <div className="w-full aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Preparing Feature...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video group shadow-[0_0_100px_rgba(0,0,0,1)] rounded-2xl overflow-hidden border border-white/10 bg-black">
      {trailer && (
        <ReactPlayer
          ref={(player: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (playerRef.current = player)}
          url={trailer}
          playing={true}
          muted={isMuted}
          width="100%"
          height="100%"
          controls={false}
          className="pointer-events-none scale-105"
        />
      )}

      {/* Theater Controls Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
             <button 
                onClick={toggleMute}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
             >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
             </button>
             
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Cinema Hall 1</span>
                <span className="text-sm font-bold text-white uppercase tracking-tighter">Dolby Atmos Enabled</span>
             </div>
          </div>

          <button 
             onClick={toggleFullScreen}
             className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
          >
             <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheaterPlayer;
