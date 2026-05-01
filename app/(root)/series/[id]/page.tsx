"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, Volume2, VolumeX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Info from "@/components/Info";
import Head from "next/head";
import Recommendation from "@/components/Recommendation";
import { MovieProps } from "@/index";
import Image from "next/image";
import dynamic from "next/dynamic";

// ✅ Import type only (doesn't affect bundle)
import type ReactPlayer from "react-player";

// ✅ Dynamic import of player
const ReactPlayerDynamic = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

type MovieVideo = {
  key: string;
  site: string;
  type: string;
};

type MovieData = {
  results: MovieVideo[];
};

const Page = () => {
  const { id: movieId } = useParams();
  const [movie, setMovie] = useState<MovieProps | null>(null);
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // ✅ Properly typed ref
  const playerRef = useRef<ReactPlayer | null>(null);

  const getMovieDetails = React.useCallback(async () => {
    try {
      const movieDetails = await fetch(`/api/movies/details?id=${movieId}&type=tv`);
      if (!movieDetails.ok) throw new Error(`HTTP error! Status: ${movieDetails.status}`);

      const movieText = await movieDetails.text();
      const movieData = movieText.trim() ? JSON.parse(movieText) : {};
      setMovie(movieData);
      await fetchTrailer(movieData.videos);
    } catch (error) {
      console.error(error);
    }
  }, [movieId]);

  const fetchTrailer = async (movie: MovieData) => {
    const trailer = movie.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    if (trailer) {
      setTrailer(`https://www.youtube.com/watch?v=${trailer.key}`);
      setShowVideo(true);
    } else {
      setTrailer(null);
      setShowVideo(false);
    }
  };

  useEffect(() => {
    getMovieDetails();
    const timer = setTimeout(() => setShowVideo(true), 5000);
    return () => clearTimeout(timer);
  }, [getMovieDetails]);

  useEffect(() => {
    document.title = `${movie?.title || movie?.name} || Strimz`;
  }, [movie]);

  const toggleMute = () => {
    const player = playerRef.current?.getInternalPlayer?.();
    if (player) {
      if (isMuted) {
        player.unMute?.();
        setIsMuted(false);
      } else {
        player.mute?.();
        setIsMuted(true);
      }
    }
  };

  return (
      <>
        <Head>
          <title>{movie?.title || movie?.name} || Strimz</title>
          <meta name="description" content={movie?.overview} />
        </Head>

        <div className="flex flex-col gap-3">
          <div className="pl-7 xs:pl-12 md:pl-20 flex gap-3 h-[783px] relative">
            {/* LEFT SIDE */}
            <div className="flex flex-col gap-3 mt-16 w-[25%]">
              <div className="flex justify-between items-center">
                <Button
                    className="bg-gray-600 text-xs rounded-full px-8 text-white font-poppins"
                    onClick={() => router.back()}
                >
                  ⬅ Go Back
                </Button>
                <Button className="rounded-full border-2 hover:bg-dark-400 border-white bg-transparent text-white">
                  <PlusIcon />
                </Button>
              </div>

              {movie ? (
                  <Image
                      src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
                      alt="movie"
                      className="cursor-pointer object-cover"
                      width={500}
                      height={750}
                  />
              ) : (
                  <div className="animate-pulse bg-gray-800 rounded-lg w-full h-full" />
              )}
            </div>

            {/* RIGHT SIDE */}
            {movie ? (
                <div className="inset-0 bg-top gap-4 bg-cover relative -z-0 transition-opacity duration-1000 w-[75%] h-[640px]">
                  {!showVideo || !trailer ? (
                      <div
                          className="h-full w-full inset-0 bg-cover brightness-75 transition-opacity duration-1000"
                          style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie?.backdrop_path || ""})`,
                          }}
                      />
                  ) : (
                      <ReactPlayerDynamic
                          ref={playerRef}
                          url={trailer}
                          playing
                          muted={isMuted}
                          volume={1}
                          controls={false}
                          loop
                          width="100%"
                          height="100%"
                          className="relative inset-0"
                      />
                  )}

                  <div className="absolute inset-0 bg-black opacity-20"></div>

                  {showVideo && (
                      <button
                          onClick={toggleMute}
                          className="absolute bottom-36 right-5 z-30 bg-black/70 p-3 rounded-full text-gray-300 hover:text-white flex items-center justify-center"
                      >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                      </button>
                  )}

                  <Info movie={movie} />
                </div>
            ) : (
                <div className="animate-pulse bg-gray-800 rounded-lg w-[75%] h-[640px]" />
            )}
          </div>

          {/* SEASONS + RECOMMENDATIONS */}
          <div className="w-full px-7 xs:px-12 md:px-20">
            <div className="flex w-full gap-4">
              <div className="w-[60%]">
                <Recommendation id={movieId} type="tv" />
              </div>
              <div className="w-[40%] flex flex-col gap-3">
                <h2 className="font-bold text-white font-lato">
                  Seasons ({movie?.seasons.length || 0})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {movie?.seasons.map((collection: { id: number; poster_path: string; name?: string; title?: string; season_number: number }) => (
                      <Image
                          key={collection.id}
                          src={`https://image.tmdb.org/t/p/original/${collection?.poster_path}`}
                          alt={collection.name || collection.title || "Season"}
                          className="cursor-pointer object-cover"
                          onClick={() =>
                              router.push(`/series/${movieId}/season/${collection.season_number}`)
                          }
                          width={200}
                          height={300}
                      />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default Page;
