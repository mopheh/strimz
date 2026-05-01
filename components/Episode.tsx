import React from "react";
import Image from "next/image";
import {Movie} from "@/app/(root)/series/[id]/season/[season_num]/page";
type episode = {
  id: number;
  air_date: string;
  name: string;
  episode_number: number;
  still_path: string;
  overview: string;
  vote_average: number;
  runtime: number;
};
const Episode = ({ movie }: {movie: Movie | null}) => {
  return (
    <div className={"w-full flex flex-col gap-4"}>
      <h2 className={"font-bold text-white font-lato"}>
        Episodes ({`${movie?.episodes.length}`})
      </h2>
      <div className={"flex flex-wrap gap-2"}>
        {movie?.episodes.map((collection: episode) => (
          <div
            key={collection.id}
            className={"flex gap-3 max-w-lg bg-dark-100 p-5"}
          >
            <Image
              src={`https://image.tmdb.org/t/p/original/${collection?.still_path}`}
              alt={collection.name}
              className="cursor-pointer object-cover"
              width={200}
              height={112}
            />
            <div className={"flex flex-col gap-3"}>
              <div className={"flex gap-2 text-sm text-white"}>
                <h2 className={"font-lato"}>{collection.episode_number}</h2>
                <h4>{collection.name}</h4>
              </div>

              <div className={"flex gap-4 text-xs items-center  text-white"}>
                <div>{collection.air_date}</div>
                <div>
                  {collection.runtime < 60
                    ? `${collection.runtime}mins`
                    : `${Math.floor(collection.runtime / 60)}h  ${collection.runtime % 60}m`}
                </div>
                <div className={"flex gap-1 items-center"}>
                  <Image
                    src={"/icons/star.svg"}
                    alt={"rating star"}
                    width={20}
                    height={20}
                  />
                  <span className={"text-emerald-400"}>
                    {collection.vote_average.toFixed(1)}
                    <span className={"text-white"}> / 10</span>
                  </span>
                </div>
              </div>
              <p className={"line-clamp-3 text-white text-xs font-poppins"}>
                {collection.overview}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Episode;
