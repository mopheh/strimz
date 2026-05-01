"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import { PlusIcon, Volume2, VolumeX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import Image from "next/image";
import Head from "next/head";
import Episode from "@/components/Episode";

type genre = {
  id: number;
  name: string;
};
type spoken_language = {
  english_name: string;
};
type collection = {
  id: number;
  name: string;
};
interface Movie {
  id: number;
  title: string;
  name: string;
  poster_path: string;
  genres: [genre];
  spoken_languages: [spoken_language];
  backdrop_path: string;
  belongs_to_collection: collection;
  runtime: number;
  air_date: string;
  overview: string;
  vote_average: number;
  casts: [];
  episodes: {
    id: number;
    air_date: string;
    name: string;
    episode_number: number;
    still_path: string;
    overview: string;
    vote_average: number;
    runtime: number;
  }[]
}
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
  const { season_num: season } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const router = useRouter();
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [trailer, setTrailer] = useState<string | null>();
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const playerRef = useRef<InstanceType<typeof ReactPlayer> | null>(null);

  const getMovieDetails = React.useCallback(async () => {
    try {
      const movieDetails = await fetch(
        `/api/tv/season?id=${movieId}&season=${season}`,
      );

      if (!movieDetails.ok) {
        throw new Error(`HTTP error! Status: ${movieDetails.status}`);
      }
      const movieText = await movieDetails.text(); // Read as text first
      const movieData = movieText.trim() ? JSON.parse(movieText) : {};
      setMovie(movieData);
      console.log(movieData);

      await fetchTrailer(movieData.videos);
    } catch (error) {
      console.error(error);
    }
  }, [movieId, season]);
  const fetchTrailer = async (movie: MovieData) => {
    const trailer = movie.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube",
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
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [getMovieDetails]);
  useEffect(() => {
    document.title = `${movie?.title || movie?.name} || Strimz`;
  }, [movie]);
  const toggleMute = () => {
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (isMuted) {
        internalPlayer?.unMute();
        setIsMuted(false);
        console.log("🔊 Unmuted!");
      } else {
        internalPlayer?.mute();
        setIsMuted(true);
        console.log("🔇 Muted!");
      }
    }
  };

  return (
    <>
      <Head>
        <title>{movie?.title || movie?.name} || Strimz</title>
        <meta name="description" content={movie?.overview} />
      </Head>
      <div className={"flex flex-col gap-3"}>
        <div className={"pl-7 xs:pl-12 md:pl-20 flex gap-3 h-[783px] relative"}>
          <div className={"flex flex-col gap-3 mt-16 w-[25%]"}>
            <div className={"flex justify-between items-center"}>
              <Button
                className={
                  "bg-gray-600 text-xs rounded-full px-8 text-white font-poppins"
                }
                onClick={() => router.back()}
              >
                ⬅ Go Back
              </Button>
              <Button
                className={
                  "rounded-full border-2 hover:bg-dark-400 border-white bg-transparent text-white"
                }
              >
                <PlusIcon />
              </Button>
            </div>
            {movie ? (
              <Image
                src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
                alt={"movie"}
                className={"cursor-pointer object-cover"}
                width={500}
                height={750}
              />
            ) : (
              <div className="animate-pulse bg-gray-800 rounded-lg w-full h-full" />
            )}
          </div>
          {movie ? (
            <>
              <div className="inset-0 bg-top gap-4 bg-cover relative -z-0 transition-opacity duration-1000 w-[75%] h-[640px]">
                {!showVideo || !trailer ? (
                  <div
                    className="h-full w-full inset-0 bg-cover brightness-75 transition-opacity duration-1000"
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie?.backdrop_path || ""})`,
                    }}
                  />
                ) : (
                  trailer && (
                    <ReactPlayer
                      ref={(player) => { playerRef.current = player; }}
                      url={trailer}
                      playing={true} // ✅ Auto Play
                      muted={isMuted} // ✅ Start Muted
                      volume={1} // ✅ Max Volume
                      controls={false}
                      loop={true}
                      width="100%"
                      height="100%"
                      className="relative inset-0"
                      onReady={() => {
                        console.log("✅ Video is ready");
                        setShowVideo(true);
                      }}
                    />
                  )
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
                <div
                  className={
                    "flex flex-col mt-3 font-poppins pr-7 gap-3 xs:pr-12 md:pr-20"
                  }
                >
                  <div
                    className={"flex gap-4 text-sm items-center  text-white"}
                  >
                    <div>Series</div>
                    <div>{movie.name}</div>
                    <div>{movie.air_date}</div>
                    <div className={"flex gap-1 items-center"}>
                      <Image
                        src={"/icons/star.svg"}
                        alt={"rating star"}
                        width={20}
                        height={20}
                      />
                      <span className={"text-emerald-400"}>
                        {movie.vote_average.toFixed(1)}{" "}
                        <span className={"text-white"}>/ 10</span>
                      </span>
                    </div>
                  </div>
                  <div className={"text-white text-sm"}>{movie.overview}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="animate-pulse bg-gray-800 rounded-lg w-[75%] h-[640px]" />
          )}
        </div>
        <div className={"w-full px-7 xs:px-12 md:px-20"}>
          <Episode movie={movie} />
        </div>
      </div>
    </>
  );
};
export default Page;
