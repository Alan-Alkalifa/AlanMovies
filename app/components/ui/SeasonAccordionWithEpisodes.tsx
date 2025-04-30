"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Season {
  id: number;
  name: string;
  air_date: string;
  overview: string;
  episode_count: number;
  poster_path: string | null;
  season_number: number;
}

interface Props {
  tvId: string;
  seasons: Season[];
}

export default function SeasonAccordionWithEpisodes({ tvId, seasons }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [episodesMap, setEpisodesMap] = useState<Record<number, any[]>>({});

  const toggle = async (season: Season) => {
    const isOpen = openId === season.id;
    setOpenId(isOpen ? null : season.id);

    if (!isOpen && !episodesMap[season.season_number]) {
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const res = await axios.get(
        `https://api.themoviedb.org/3/tv/${tvId}/season/${season.season_number}?api_key=${API_KEY}`
      );
      setEpisodesMap((prev) => ({
        ...prev,
        [season.season_number]: res.data.episodes || [],
      }));
    }
  };

  return (
    <div className="space-y-4">
      {seasons.map((season) => (
        <div key={season.id} className="bg-zinc-800 rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => toggle(season)}
            className="w-full flex justify-between items-center px-4 py-4 text-left hover:bg-zinc-700 transition"
          >
            <div>
              <h3 className="text-lg font-semibold">{season.name}</h3>
              <p className="text-sm text-gray-400">
                {season.episode_count} episode{season.episode_count !== 1 ? "s" : ""} •{" "}
                {season.air_date || "TBA"}
              </p>
            </div>
            <span className="text-xl text-gray-400">{openId === season.id ? "−" : "+"}</span>
          </button>

          {openId === season.id && (
            <div className="px-4 pb-5 space-y-4">
              {/* Season Poster + Overview + Watch */}
              <div className="flex gap-4">
                {season.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w154${season.poster_path}`}
                    alt={season.name}
                    className="w-28 h-auto rounded-md object-cover"
                  />
                ) : (
                  <div className="w-28 h-40 bg-zinc-700 rounded-md flex items-center justify-center text-sm text-gray-400 italic">
                    No Image
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-gray-300 leading-relaxed mb-2">
                    {season.overview || "No overview available."}
                  </p>
                </div>
              </div>

              {/* Episode List */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-3">📼 Episodes</h4>
                <div className="space-y-3">
                  {episodesMap[season.season_number]?.map((ep) => (
                    <div
                      key={ep.id}
                      className="border border-zinc-700 rounded-lg bg-zinc-900 p-4 flex flex-col gap-2 hover:border-zinc-600 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-100 font-medium">
                            {ep.episode_number}. {ep.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {ep.air_date || "Unknown date"}
                          </p>
                        </div>
                        <Link
                          href={`/Watch/${tvId}?season=${season.season_number}&episode=${ep.episode_number}`}
                          className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full font-medium transition"
                        >
                          ▶ Watch
                        </Link>
                      </div>
                      {ep.overview && (
                        <p className="text-sm text-gray-300">{ep.overview}</p>
                      )}
                    </div>
                  )) || (
                    <p className="text-sm text-gray-400">Loading episodes...</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
