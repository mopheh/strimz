import React from "react";
import { XIcon } from "lucide-react";
import ReactPlayer from "react-player";
import Image from "next/image";
import { useMovie } from "@/hooks/useMovies";

const SideContent = ({ id, onClose }: { id: number; onClose: () => void }) => {
  const { movie, trailer, englishLogo } = useMovie(
    `/api/movies/details?id=${id}&type=movie`
  );

  return (
    movie && (
      <>
        <div
          className={"fixed inset-0 w-screen h-screen backdrop-blur-sm z-20"}
        ></div>
        <div className="fixed right-0 top-0 w-1/3 flex flex-col gap-3 h-screen bg-gray-800 z-30 shadow-lg">
          <div
            className="absolute top-8 right-8 flex items-center gap-1 text-white text-sm font-poppins cursor-pointer"
            onClick={onClose}
          >
            <XIcon className="h-6 w-6" /> Close
          </div>

          <div className="text-white p-8">
            <h3 className={"font-poppins"}>
              {englishLogo ? (
                <Image
                  src={`https://image.tmdb.org/t/p/original/${englishLogo.file_path}`}
                  alt={movie?.title || movie?.name}
                  width={200}
                  height={100}
                />
              ) : (
                movie?.title || movie?.name
              )}
            </h3>
          </div>
          <div className={"h-[330px]"}>
            {trailer && (
              <ReactPlayer
                url={trailer}
                playing={true}
                volume={1}
                controls={false}
                loop={true}
                width="100%"
                height="100%"
                className={"select-none"}
              />
            )}
          </div>
          <div className={"px-4 flex flex-col flex-auto font-poppins gap-4 "}>
            <div className={"flex gap-4 text-xs items-center  text-white"}>
              <div>{movie.first_air_date ? "Series" : "Movie"}</div>
              <div>{movie.release_date ?? movie.first_air_date}</div>
              <div>
                {movie.next_episode_to_air
                  ? movie.next_episode_to_air.runtime < 60
                    ? `${movie.next_episode_to_air.runtime}mins`
                    : `${Math.floor(movie.next_episode_to_air.runtime / 60)}h  ${movie.next_episode_to_air.runtime % 60}m`
                  : movie.last_episode_to_air
                    ? movie.last_episode_to_air.runtime < 60
                      ? `${movie.last_episode_to_air.runtime}mins`
                      : `${Math.floor(movie.last_episode_to_air.runtime / 60)}h  ${movie.last_episode_to_air.runtime % 60}m`
                    : movie.runtime < 60
                      ? `${movie.runtime}mins`
                      : `${Math.floor(movie.runtime / 60)}h  ${movie.runtime % 60}m`}
              </div>
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
              <div className={"flex gap-2"}>
                <div className={"text-gray-400"}>Genre:</div>
                <div className={"capitalize text-white"}>
                  {movie.genres.map((genre: { name: string }) => `${genre.name}, `)}
                </div>
              </div>
            </div>
            <div className={"text-xs text-white leading-[1.5]"}>
              <div className={"text-gray-400"}>Overview:</div>
              {movie.overview}
            </div>
            <div className={"text-xs"}>
              <div className={"text-gray-400"}>Casts:</div>
              <div className={"text-white"}>
                {movie.casts.cast.slice(0, 4).map((cast: { name: string }) => `${cast.name}, `)}{" "}
                and more
              </div>
            </div>
            <div className={"flex gap-3 text-xs"}>
              <div className={"flex flex-col "}>
                <div className={"text-gray-400"}>Status:</div>{" "}
                <span className={"text-white"}>{movie.status}</span>
              </div>
              <div className={"flex-1"}>
                <div className={"text-gray-400"}>Production Companies:</div>
                <div className={"capitalize text-white flex gap-3"}>
                  {movie.production_companies.map(
                    (company: { name: string }) => `${company.name},  `
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};
export default SideContent;
