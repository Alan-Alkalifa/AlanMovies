import axios from "axios";
import SearchResultCard from "./../ui/SearchResultCard"; // pastikan path benar

export default async function PopularMovies() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
  );
  const movies = response.data.results;

  return (
    <section className="px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Popular Movies</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie: any) => (
          <SearchResultCard
            key={`popular-${movie.id}`}
            item={{
              ...movie,
              media_type: "movie", // ensure correct route handling
            }}
          />
        ))}
      </div>
    </section>
  );
}
