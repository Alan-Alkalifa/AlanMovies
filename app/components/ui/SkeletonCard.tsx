export default function SkeletonCard() {
    return (
      <div className="bg-zinc-800 animate-pulse rounded-lg overflow-hidden shadow">
        <div className="h-[300px] bg-zinc-700" />
        <div className="p-2 space-y-2">
          <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
          <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  