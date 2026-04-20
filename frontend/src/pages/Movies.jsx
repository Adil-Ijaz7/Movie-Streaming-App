import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaRow from "../components/MediaRow";
import { tmdb } from "../lib/tmdb";

const tagged = (arr, t) => arr.map((i) => ({ ...i, media_type: t }));

export default function Movies() {
  const [popular, setPopular] = useState([]);
  const [top, setTop] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [action, setAction] = useState([]);
  const [drama, setDrama] = useState([]);
  const [scifi, setScifi] = useState([]);
  const [hbo, setHbo] = useState([]);

  useEffect(() => {
    (async () => {
      const [p, t, u, a, d, s, h] = await Promise.all([
        tmdb.popularMovies(),
        tmdb.topMovies(),
        tmdb.upcomingMovies(),
        tmdb.discoverMovies({ with_genres: 28, sort_by: "popularity.desc" }),
        tmdb.discoverMovies({ with_genres: 18, sort_by: "popularity.desc" }),
        tmdb.discoverMovies({ with_genres: 878, sort_by: "popularity.desc" }),
        tmdb.hboMovies(),
      ]);
      setPopular(tagged(p.results || [], "movie"));
      setTop(tagged(t.results || [], "movie"));
      setUpcoming(tagged(u.results || [], "movie"));
      setAction(tagged(a.results || [], "movie"));
      setDrama(tagged(d.results || [], "movie"));
      setScifi(tagged(s.results || [], "movie"));
      setHbo(tagged(h.results || [], "movie"));
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <Navbar />
      <div className="pt-24 pb-8">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 mb-8">
          <h1 className="text-4xl md:text-5xl font-black">Movies</h1>
          <p className="text-white/60 mt-2">
            Blockbusters, indies, and everything in between.
          </p>
        </div>
        <MediaRow title="Max Movies" items={hbo} variant="backdrop" />
        <MediaRow title="Popular" items={popular} />
        <MediaRow title="Top Rated" items={top} />
        <MediaRow title="Coming Soon" items={upcoming} variant="backdrop" />
        <MediaRow title="Action" items={action} />
        <MediaRow title="Drama" items={drama} />
        <MediaRow title="Sci-Fi" items={scifi} />
      </div>
      <Footer />
    </div>
  );
}
