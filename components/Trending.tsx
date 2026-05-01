"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { MovieProps, TrendingProps } from "@/index";
import { motion } from "framer-motion";

const Trending = ({ type }: TrendingProps) => {
  const { results: movies, isLoading } = useFetch(`/api/movies/trending?type=${type}`);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-hidden px-6 md:px-12 lg:px-20 py-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="min-w-[280px] h-[350px] bg-white/5 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <section className="relative flex flex-col gap-6 py-12 overflow-hidden group/trending">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-20">
        <h2 className="font-bebas-neue text-4xl tracking-widest text-white uppercase">
          Trending <span className="text-primary">Now</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-active:scale-90 transition-transform" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors group"
          >
            <ChevronRight className="w-5 h-5 group-active:scale-90 transition-transform" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-scroll scroll-smooth hide-scrollbar px-6 md:px-12 lg:px-20 pt-10 pb-6"
      >
        {movies?.slice(0, 10).map((movie: MovieProps, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative flex items-end min-w-[240px] md:min-w-[320px] h-[300px] md:h-[400px] group/item"
          >
            {/* Index Number (Netflix Style) */}
            <div className="absolute -left-10 -bottom-4 z-0 select-none pointer-events-none overflow-hidden">
              <span 
                className="text-[180px] md:text-[260px] font-anton leading-none text-black/90 tracking-tighter"
                style={{ 
                  WebkitTextStroke: '4px rgba(255, 255, 255, 0.4)',
                  paintOrder: 'stroke fill'
                }}
              >
                {index + 1}
              </span>
            </div>


            {/* Poster Card */}
            <Link 
              href={`/${movie.media_type}/${movie.id}`}
              className="relative z-10 w-full ml-12 md:ml-16 h-[85%] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover/item:-translate-y-4 group-hover/item:border-primary/50 group-hover/item:shadow-primary/20"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title || movie.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 180px, 240px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                 <p className="text-white text-xs font-bold truncate">{movie.title || movie.name}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Trending;

