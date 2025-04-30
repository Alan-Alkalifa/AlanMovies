'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SkeletonCard from '../components/ui/SkeletonCard';
import SearchResultCard from '../components/ui/SearchResultCard';

export default function YearPage() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const observerRef = useRef<HTMLDivElement>(null);

  // Reset saat tahun berubah
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
  }, [year]);

  // Fetch data berdasarkan tahun dan page
  useEffect(() => {
    const fetchByYear = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: API_KEY,
            sort_by: 'popularity.desc',
            primary_release_year: year,
            page,
          },
        });

        const movies = res.data.results;

        // Hilangkan duplikat berdasarkan ID
        const uniqueMovies = movies.filter(
          (movie: any, index: number, self: any[]) =>
            index === self.findIndex((m) => m.id === movie.id)
        );

        setResults((prev) =>
          [...(page === 1 ? [] : prev), ...uniqueMovies].filter(
            (item, index, self) => index === self.findIndex((t) => t.id === item.id)
          )
        );

        setHasMore(res.data.page < res.data.total_pages);
      } catch (error) {
        console.error('Year fetch error:', error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchByYear();
  }, [year, page, API_KEY]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const ref = observerRef.current;
    if (ref) observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [hasMore, loading]);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">
          Movies Released in: <span className="text-red-500">{year}</span>
        </h1>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-zinc-800 text-white px-3 py-2 rounded"
        >
          {Array.from({ length: 30 }).map((_, idx) => {
            const y = currentYear - idx;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      {/* Content */}
      {initialLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="text-gray-400">No movies found for {year}.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((item: any, index: number) => (
            <SearchResultCard
              key={`movie-${item.id}-${index}`}
              item={{ ...item, media_type: 'movie' }}
            />
          ))}
        </div>
      )}

      {/* Observer for infinite scroll */}
      <div ref={observerRef} className="h-12 mt-8 flex justify-center items-center">
        {loading && <p className="text-gray-400 text-sm">Loading more...</p>}
      </div>
    </div>
  );
}
