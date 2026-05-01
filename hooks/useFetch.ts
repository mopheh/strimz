import { MovieProps } from "@/index";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UseFetch = (url: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<MovieProps[]>([]);
  const [error, setError] = useState("");
  const [movieId, setMovieId] = useState("");
  const [mediaType, setMediaType] = useState("");

  useEffect(() => {
    const getMovies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }

        const text = await response.text();
        if (!text) {
          throw new Error("Empty response from server");
        }

        const data = JSON.parse(text);
        
        if (Array.isArray(data) && data.length > 0) {
          const randNum = Math.floor(Math.random() * data.length);
          const selected = data[randNum];
          
          setMovieId(selected?.id);
          const detectedType = selected?.first_air_date
            ? "tv"
            : selected?.release_date
              ? "movie"
              : "tv";
          setMediaType(detectedType);
          setResults(data);
        } else if (data.results) {
           // Handle case where data is an object with a results array
           setResults(data.results);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err?.message || "An unexpected error occurred");
        toast.error("Data fetch failed", {
          description: err?.message || "Please check your connection.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getMovies();
  }, [url]);

  return { results, error, isLoading, movieId, mediaType };
};

export default UseFetch;

