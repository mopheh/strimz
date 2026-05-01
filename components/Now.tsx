"use client";
import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
type NowProps = {
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  setShowTrailer: React.Dispatch<React.SetStateAction<boolean>>;
};
export function Now({ setId, setShowTrailer }: NowProps) {
  const [movie, setMovie] = useState<Record<string, any /* eslint-disable-line @typescript-eslint/no-explicit-any */>[]>([]);

  const getMovies = React.useCallback(async () => {
    try {
      const movies = await fetch("/api/movies/showing");

      if (!movies.ok) {
        throw new Error(`HTTP error! Status: ${movies.status}`);
      }

      const data = await movies.json().catch(() => ({}));

      const randNum = Math.floor(Math.random() * data.results.length);

      const movieId = data.results[randNum]?.id;
      console.log(movieId);
      console.log(data.results);
      const movieFound = await Promise.all(
        data.results.map(async (result: { id: number; [key: string]: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => {
          const movieDetails = await fetch(
            `/api/movies/details?id=${result.id}&type=movie`
          );
          if (!movieDetails.ok) {
            throw new Error(`HTTP error! Status: ${movieDetails.status}`);
          }
          return movieDetails.json();
        })
      );
      setMovie(movieFound);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, []);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  return (
    <>
      <div className="h-[40rem] rounded-md flex flex-col antialiased  bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <h1
          className={
            "font-poppins uppercase font-bold text-lg absolute left-14 tracking-tighter text-white top-20"
          }
        >
          Showing Now
        </h1>
        {
          <InfiniteMovingCards
            items={movie}
            direction="right"
            speed="slow"
            setId={setId}
            setShowTrailer={setShowTrailer}
          />
        }
      </div>
    </>
  );
}
