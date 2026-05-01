import React from "react";
import { casts, collection, movieVideo } from "..";

type Genre = {
  id: number;
  name: string;
};
type SpokenLanguage = {
  english_name: string;
};
interface Movie {
  movie: {
    id: string;
    title: string;
    name: string;
    poster_path: string;
    genres: Genre[];
    first_air_date: string;
    belongs_to_collection: collection;
    last_episode_to_air: { runtime: number };
    next_episode_to_air: { runtime: number };
    spoken_languages: SpokenLanguage[];
    backdrop_path: string;
    media_type: string;
    runtime: number;
    release_date: string;
    production_companies: [
      {
        name: string;
        id: number;
      },
    ];
    overview: string;
    vote_average: number;
    videos: movieVideo[];
    status: string;
    casts: {
      cast: casts[];
    };
  };
}

const Info = ({ movie }: Movie) => {
  const getRuntime = () => {
    const runtime =
      movie.next_episode_to_air?.runtime ??
      movie.last_episode_to_air?.runtime ??
      movie.runtime;

    if (!runtime) return "N/A";
    return runtime < 60
      ? `${runtime}m`
      : `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-poppins text-white">
      {/* Left section (Overview + Status) */}
      <div className="md:col-span-2 space-y-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bebas-neue tracking-widest text-primary/80 uppercase">The Story</h3>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed font-light">
            {movie.overview || "No description available for this production."}
          </p>
        </div>

        <div className="flex flex-wrap gap-8 pt-4 border-t border-white/10">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Status</p>
            <p className="text-sm font-semibold text-primary">{movie.status || "Unknown"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Original Release</p>
            <p className="text-sm font-semibold">{movie.release_date ?? movie.first_air_date ?? "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Runtime</p>
            <p className="text-sm font-semibold">{getRuntime()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Global Rating</p>
            <div className="flex items-center gap-2">
               <span className="text-sm font-bold text-white bg-green-800/30 px-2 py-0.5 rounded border border-green-500/20">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-[10px] text-gray-400">/ 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right section (Technical Details) */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Genres</p>
          <div className="flex flex-wrap gap-2">
            {movie.genres?.length > 0 ? movie.genres.map((g) => (
              <span key={g.id} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors cursor-default">
                {g.name}
              </span>
            )) : <span className="text-xs text-gray-500">N/A</span>}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Languages</p>
          <p className="text-sm text-gray-300 leading-snug">
            {movie.spoken_languages?.map((l) => l.english_name).join(", ") || "N/A"}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Production</p>
          <div className="space-y-1">
            {movie.production_companies?.length > 0 ? movie.production_companies.slice(0, 3).map((c) => (
              <p key={c.id} className="text-xs text-gray-400 border-l-2 border-primary/30 pl-2">
                {c.name}
              </p>
            )) : <p className="text-xs text-gray-500">N/A</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;

