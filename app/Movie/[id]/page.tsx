import axios from "axios";
import Link from "next/link";

export default async function MovieDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const [movieRes, videoRes] = await Promise.all([
    axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits`
    ),
    axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
    ),
  ]);

  const movie = movieRes.data;
  const videoKey = videoRes.data.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  )?.key;
  const cast = movie.credits?.cast?.slice(0, 6) || [];

  return (
    <div className="bg-zinc-950 text-white min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Poster */}
        <div className="w-full">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-xl shadow-2xl w-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-sm text-gray-400 mb-2">
            {movie.release_date} • {movie.runtime} mins
          </p>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre: any) => (
              <span
                key={genre.id}
                className="bg-zinc-800 text-sm px-3 py-1 rounded-full border border-zinc-700 text-gray-300"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-full shadow">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-sm text-gray-400">TMDB Rating</span>
          </div>

          {/* Overview */}
          <p className="text-gray-300 leading-relaxed mb-6">{movie.overview}</p>

          <Link href={`/Watch/${id}`}>
            <button className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-full shadow text-white font-semibold w-fit">
              ▶️ Watch Now
            </button>
          </Link>
        </div>
      </div>

      {/* Trailer */}
      {videoKey && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold mb-4">🎬 Official Trailer</h2>
          <div className="rounded-xl overflow-hidden shadow-lg aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}`}
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      )}

      {/* Cast */}
      {cast.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold mb-6">👥 Top Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((actor: any) => (
              <div
                key={actor.id}
                className="w-[140px] flex-shrink-0 bg-zinc-800 rounded-xl shadow-md p-2"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-[200px] object-cover rounded-md mb-2"
                />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-100 truncate">
                    {actor.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {actor.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
