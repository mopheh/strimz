"use client";
import React, { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MovieProps {
  id: number;
  poster_path: string;
  title?: string;
  name?: string;
}

const Recommendation = ({ id, type }: { id:  string | string[] | undefined; type: string }) => {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const router = useRouter();

  const getRecommendations = React.useCallback(async () => {
    try {
      const recommendations = await fetch(
        `/api/movies/recommendations?id=${id}&type=${type}`
      );
      const text = await recommendations.text();
      const data = text.trim() ? JSON.parse(text) : {};
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  }, [id, type]);

  useEffect(() => {
    getRecommendations();
  }, [getRecommendations]);

  return (
    <section className="flex flex-col gap-4 mt-6">
      <h2 className="font-bold text-white font-lato text-lg md:text-xl">
        Recommendations
      </h2>

      {/* Responsive scrollable container */}
      <div
        className="
          flex gap-3
          overflow-x-auto
          md:overflow-x-visible
          flex-nowrap md:flex-wrap
          scrollbar-hide
          pb-2
        "
      >
        {movies.length > 0
          ? movies.slice(0, 10).map((movie) => (
              <div
                key={movie.id}
                className="
                  flex-shrink-0
                  w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px]
                  cursor-pointer
                  transition-transform
                  hover:scale-105
                "
                onClick={() =>
                  router.push(`/${type === "tv" ? "series" : type}/${movie.id}`)
                }
              >
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                      : `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AHAAMBAQAYj0lcAAAAAElFTkSuQmCC`
                  }
                  alt={movie.name || movie.title || "movie"}
                  width={200}
                  height={300}
                  className="rounded-md object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AHAAMBAQAYj0lcAAAAAElFTkSuQmCC"
                />
              </div>
            ))
          : Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px]"
              >
                <Skeleton />
              </div>
            ))}
      </div>
    </section>
  );
};

export default Recommendation;
