"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_PATH;

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
}

const TrendCarousel = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleStart, setVisibleStart] = useState(0); // Index del primer elemento visible
  const visibleCount = 10; // Cantidad de miniaturas visibles al mismo tiempo

  useEffect(() => {
    const fetchMovies = async () => {
      const url = `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`;

      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Error fetching movies: ${res.status}`);
        }

        const data = await res.json();
        if (data && data.results) {
          setMovies(data.results);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      }
    };

    fetchMovies();
  }, []);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % movies.length);
    setVisibleStart((prev) => Math.min(prev + 1, movies.length - visibleCount));
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
    setVisibleStart((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="w-full h-screen bg-black text-white relative overflow-hidden">
      {/* Contenedor con el backdrop como fondo */}
      <div className="relative w-full h-screen">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={`${BASE_IMAGE_URL}${movie.backdrop_path}`}
              alt={movie.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        ))}
        {/* Gradiente para contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-20"></div>
      </div>

      {/* Fila de miniaturas */}
      <div className="absolute bottom-20 w-full flex justify-center items-center space-x-6 z-30">
        <button
          onClick={handlePrev}
          className="bg-black/50 p-2 rounded-full z-30"
        >
          ⬅
        </button>
        <div className="flex items-center space-x-4">
          {movies
            .slice(visibleStart, visibleStart + visibleCount)
            .map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => setActiveIndex(visibleStart + index)}
                className={`relative w-[200px] h-[300px] overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 ${
                  visibleStart + index === activeIndex
                    ? "transform scale-110 z-30"
                    : "z-20"
                }`}
              >
                <Image
                  src={`${BASE_IMAGE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
        </div>
        <button
          onClick={handleNext}
          className="bg-black/50 p-2 rounded-full z-30"
        >
          ➡
        </button>
      </div>

      {/* Título */}
      <h1 className="absolute top-48 left-8 text-5xl font-bold z-30">
        {movies[activeIndex]?.title}
      </h1>
    </section>
  );
};

export default TrendCarousel;
