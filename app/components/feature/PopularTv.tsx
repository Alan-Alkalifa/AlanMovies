import axios from "axios";
import SearchResultCard from "./../ui/SearchResultCard"; // pastikan path benar

export default async function PopularTv() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await axios.get(
    `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`
  );
  const tvShows = response.data.results;

  return (
    <section className="px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Popular TV Shows</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {tvShows.map((show: any) => (
          <SearchResultCard
            key={`tv-${show.id}`}
            item={{
              ...show,
              media_type: "tv", // penting agar diarahkan ke /Tv/[id]
            }}
          />
        ))}
      </div>
    </section>
  );
}
