import PopularMovies from "./components/feature/PopularMovies";
import NowPlaying from "./components/feature/NowPlaying";
import PopularTv from "./components/feature/PopularTv";

export default function Home() {
  return (
    <div>
      <NowPlaying />
      <PopularMovies />
      <PopularTv />
    </div>
  );
}
