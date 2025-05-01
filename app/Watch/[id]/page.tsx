import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FastForward } from "lucide-react";

interface Props {
  params: {
    id: string;
  };
  searchParams?: {
    season?: string;
    episode?: string;
  };
}

export default async function WatchMovie(props: Props) {
  const id = props.params.id;
  const season = props.searchParams?.season;
  const episode = props.searchParams?.episode;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const isTV = season && episode;

  let title = "";
  let overview = "";
  let embedUrl = "";
  let backUrl = "";

  try {
    if (isTV) {
      embedUrl = `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
      const tvRes = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`
      );
      const tv = tvRes.data;
      title = `${tv.name} - Season ${season}, Episode ${episode}`;
      overview = tv.overview;
      backUrl = `/Tv/${id}`;
    } else {
      embedUrl = `https://vidsrc.icu/embed/movie/${id}`;
      const movieRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
      );
      const movie = movieRes.data;
      title = movie.title;
      overview = movie.overview;
      backUrl = `/Movie/${id}`;
    }
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href={backUrl}
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Back to Detail
          </Link>

          {/* Placeholder Skip Intro */}
          {isTV && (
            <button
              onClick={() => alert("⏩ Intro skipped!")}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-full shadow transition"
            >
              <FastForward size={16} />
              Skip Intro
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center">{title}</h1>

        {/* Player */}
        <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-zinc-800">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>💬 Subtitle: Auto / English</span>
          <span>🎚️ Quality: Auto</span>
        </div>

        {/* Overview */}
        <div className="mt-4 text-gray-300 text-sm md:text-base leading-relaxed">
          {overview || "No description available for this content."}
        </div>
      </div>
    </div>
  );
}
