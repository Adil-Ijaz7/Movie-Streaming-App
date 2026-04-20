import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import MediaRow from "../components/MediaRow";
import { tmdb } from "../lib/tmdb";

const withType = (items, type) =>
  items.map((i) => ({ ...i, media_type: i.media_type || type }));

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [hboTv, setHboTv] = useState([]);
  const [hboMovies, setHboMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topTv, setTopTv] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [tr, ht, hm, pm, tt, up] = await Promise.all([
          tmdb.trending("all", "week"),
          tmdb.hboTv(),
          tmdb.hboMovies(),
          tmdb.popularMovies(),
          tmdb.hboTvTop(),
          tmdb.upcomingMovies(),
        ]);
        setTrending(tr.results || []);
        setHboTv(withType((ht.results || []).filter((x) => x.backdrop_path), "tv"));
        setHboMovies(withType((hm.results || []).filter((x) => x.backdrop_path), "movie"));
        setPopularMovies(withType(pm.results || [], "movie"));
        setTopTv(withType(tt.results || [], "tv"));
        setUpcoming(withType(up.results || [], "movie"));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const heroItems = hboTv.length ? hboTv.slice(0, 5) : trending.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <Navbar />
      <Hero items={heroItems} />
      <main className="relative z-10 -mt-20 pb-8">
        <MediaRow title="HBO Originals" items={hboTv} variant="backdrop" />
        <MediaRow title="Trending Now" items={trending} />
        <MediaRow title="Max Movies" items={hboMovies} />
        <MediaRow title="Top-Rated on Max" items={topTv} />
        <MediaRow title="Popular Movies" items={popularMovies} />
        <MediaRow title="Coming Soon" items={upcoming} variant="backdrop" />
      </main>
      <Footer />
    </div>
  );
}
