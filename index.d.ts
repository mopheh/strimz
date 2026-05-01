type genre = {
  id: number;
  name: string;
};

type spoken_language = {
  english_name: string;
};
export type collection = {
  id: number;
  name: string;
};
interface MovieProps {
  id: string;
  title: string;
  name: string;
  poster_path: string;
  genres: [genre];
  first_air_date: string;
  belongs_to_collection: collection;
  last_episode_to_air: { runtime: number };
  next_episode_to_air: { runtime: number };
  spoken_languages: [spoken_language];
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
    cast: cast[];
  };
  seasons: any[];
  tagline?: string;
  number_of_seasons?: number;
}
type logo = {
  file_path: string;
};
export type casts = {
  id: number;
  name: string;
};
interface PopularListProps {
  type?: string | undefined;
}
export type movieVideo = {
  key: string;
  site: string;
  type: string;
};

type MovieData = {
  results: movieVideo[];
};
interface TrendingProps {
  type?: string;
}

interface OverviewProps {
  type?: string;
}

export interface InfiniteMovingCardItem {
  overview: string;
  name: string;
  title: string;
  id: number;
  backdrop_path: string;
  media_type: string;
  runtime: number;
  images?: {
    logos?: {
      file_path: string;
      iso_639_1: string;
    }[];
  };
  genres: {
    name: string;
  }[];
}
