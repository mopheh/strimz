"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import { motion } from "framer-motion";

const PopularList = ({ type }: { type: string }) => {
  const router = useRouter();
  const { results: movies, isLoading } = useFetch(`/api/movies/popular?type=${type}`);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-hidden px-6 md:px-12 lg:px-20 py-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="min-w-[160px] md:min-w-[220px] aspect-[2/3] bg-white/5 animate-pulse rounded-xl border border-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative group/row">
      <div className="flex gap-4 md:gap-6 overflow-x-scroll scroll-smooth hide-scrollbar px-6 md:px-12 lg:px-20 py-6">
        {movies?.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative min-w-[160px] md:min-w-[220px] aspect-[2/3] cursor-pointer group/card"
            onClick={() => router.push(`/${type === "tv" ? "tv" : "movie"}/${movie.id}`)}
          >
            <div className="relative h-full w-full rounded-xl overflow-hidden border border-white/10 transition-all duration-500 group-hover/card:scale-105 group-hover/card:border-primary/50 group-hover/card:shadow-[0_0_30px_rgba(231,201,165,0.2)]">
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AHAAMBAQAYj0lcAAAAAElFTkSuQmCC"
                }
                alt={movie.title || movie.name}
                fill
                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                sizes="(max-width: 768px) 160px, 220px"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-xs md:text-sm font-bold line-clamp-1">{movie.title || movie.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-primary font-bold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(movie.release_date || movie.first_air_date).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PopularList;

