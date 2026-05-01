import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
type UpcomingProps = {
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  setShowTrailer: React.Dispatch<React.SetStateAction<boolean>>;
};

const Upcoming = ({ setId, setShowTrailer }: UpcomingProps) => {
  const [movie, setMovie] = useState<Record<string, any /* eslint-disable-line @typescript-eslint/no-explicit-any */>[]>([]);
  const getMovies = React.useCallback(async () => {
    try {
      const movies = await fetch("/api/movies/upcoming");

      if (!movies.ok) {
        throw new Error(`HTTP error! Status: ${movies.status}`);
      }

      const data = await movies.json().catch(() => ({}));

      const randNum = Math.floor(Math.random() * data.results.length);

      const movieId = data.results[randNum]?.id;
      console.log(movieId);
      console.log(data.results);
      const movieFound = await Promise.all(
        data.results.map(async (result: { id: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => {
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
    <div className={"px-7 xs:px-12 md:px-20 flex flex-col gap-3"}>
      <h1
        className={
          "font-poppins text-white font-bold tracking-tighter text-lg uppercase"
        }
      >
        Upcoming
      </h1>
      <div className={"grid grid-cols-3 gap-3"}>
        {movie.map((item) => (
          <div
            key={item.id}
            className={
              "flex text-white font-poppins w-full text-xs bg-dark-800 bg-opacity-25"
            }
          >
            <Image
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/original/${item?.poster_path}`
                  : `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AHAAMBAQAYj0lcAAAAAElFTkSuQmCC`
              }
              alt={item?.name || item?.title}
              width={150}
              height={226}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AHAAMBAQAYj0lcAAAAAElFTkSuQmCC"
            />
            <div className={"flex flex-col gap-3 p-5"}>
              <div className={"flex gap-2 items-center"}>
                <div className={"flex items-center gap-1"}>
                  <Image
                    src={"/icons/star.svg"}
                    alt={"rating star"}
                    width={20}
                    height={20}
                  />
                  <span className={"text-emerald-400"}>
                    {item.vote_average.toFixed(1)}{" "}
                    <span className={"text-white"}> / 10</span>
                  </span>
                </div>
                <div>{item.genres.map((genre: { name: string }) => `${genre.name}, `)}</div>
              </div>
              <div className={"flex gap-3"}>
                <span>
                  <span className={"text-gray-100"}>Release Date:</span>{" "}
                  {item?.release_date}
                </span>
                <span>
                  {item.runtime < 60
                    ? `${item.runtime}mins`
                    : `${Math.floor(item.runtime / 60)}h  ${item.runtime % 60}m`}
                </span>
              </div>
              <div className={"text-gray-100 line-clamp-3"}>
                {item?.overview}
              </div>
              <div className={"flex items-center gap-3"}>
                <Button
                  className={
                    "bg-light-300 text-dark-100 cursor-pointer p-3 font-nunito-sans font-bold text-xs uppercase tracking-tight hover:bg-light-400 "
                  }
                  onClick={() => {
                    setId(item.id);
                    setShowTrailer(true);
                  }}
                >
                  <Image
                    src={"/icons/play-solid.svg"}
                    alt={"info"}
                    width={15}
                    className={"text-white"}
                    height={15}
                  />
                  Watch Trailer
                </Button>
                <Button
                  className={
                    "rounded-full w-10 h-10 cursor-pointer hover:bg-dark-400  bg-transparent text-white"
                  }
                >
                  <BookmarkIcon />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Upcoming;
