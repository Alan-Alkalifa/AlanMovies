// File: components/SearchResultCard.tsx

'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';

interface SearchResultCardProps {
  item: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string;
    backdrop_path?: string;
    vote_average?: number;
    media_type: 'movie' | 'tv';
  };
}

export default function SearchResultCard({ item }: SearchResultCardProps) {
  const title = item.title || item.name;
  const image = item.poster_path || item.backdrop_path;
  const rating = item.vote_average?.toFixed(1) || 'N/A';
  const link = item.media_type === 'movie' ? `/Movie/${item.id}` : `/Tv/${item.id}`;

  return (
    <Link href={link} className="group">
      <div className="relative rounded-lg overflow-hidden shadow-md bg-zinc-900 text-white hover:scale-105 transition-transform">
        {/* Fallback FEATURED badge */}
        <span className="absolute top-2 left-2 bg-red-600 text-xs font-bold px-2 py-1 rounded z-10">
          {item.media_type.toUpperCase()}
        </span>

        {/* Poster */}
        {image ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${image}`}
            alt={title}
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="w-full h-[300px] bg-zinc-700 flex items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}

        {/* Hover Overlay with Play Icon */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
          <Star size={14} className="text-white" />
          {rating}
        </div>
      </div>
    </Link>
  );
}
