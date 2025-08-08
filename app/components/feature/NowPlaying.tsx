// File: app/(home)/NowPlaying.tsx

import SearchResultCard from '../ui/SearchResultCard';
import axios from 'axios';

export default async function NowPlaying() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
  );
  const movies = res.data.results;
  return (
    <section className="px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Now Playing</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie: any) => (
          <SearchResultCard
            key={`movie-${movie.id}`}
            item={{
              ...movie,
              media_type: 'movie',
              title: movie.title,
              poster_path: movie.poster_path,
              vote_average: movie.vote_average
            }}
          />
        ))}
      </div>
    </section>
  );
}