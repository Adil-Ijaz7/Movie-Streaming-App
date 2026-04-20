import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaRow from "../components/MediaRow";
import { tmdb } from "../lib/tmdb";

const tagged = (arr, t) => arr.map((i) => ({ ...i, media_type: t }));

export default function Series({ originalsOnly = false }) {
  const [popular, setPopular] = useState([]);
  const [top, setTop] = useState([]);
  const [hbo, setHbo] = useState([]);
  const [drama, setDrama] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [crime, setCrime] = useState([]);

  useEffect(() => {
    (async () => {
      const [p, t, h, d, c, cr] = await Promise.all([
        tmdb.popularTv(),
        tmdb.topTv(),
        tmdb.hboTv(),
        tmdb.discoverTv({ with_genres: 18, sort_by: "popularity.desc" }),
        tmdb.discoverTv({ with_genres: 35, sort_by: "popularity.desc" }),
        tmdb.discoverTv({ with_genres: 80, sort_by: "popularity.desc" }),
      ]);
      setPopular(tagged(p.results || [], "tv"));
      setTop(tagged(t.results || [], "tv"));
      setHbo(tagged(h.results || [], "tv"));
      setDrama(tagged(d.results || [], "tv"));
      setComedy(tagged(c.results || [], "tv"));
      setCrime(tagged(cr.results || [], "tv"));
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <Navbar />
      <div className="pt-24 pb-8">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 mb-8">
          <h1 className="text-4xl md:text-5xl font-black">
            {originalsOnly ? "Max Originals" : "Series"}
          </h1>
          <p className="text-white/60 mt-2">
            {originalsOnly
              ? "Exclusive series you won't find anywhere else."
              : "Binge-worthy shows from HBO, Max, and beyond."}
          </p>
        </div>
        <MediaRow title="HBO Originals" items={hbo} variant="backdrop" />
        {!originalsOnly && <MediaRow title="Popular" items={popular} />}
        {!originalsOnly && <MediaRow title="Top Rated" items={top} />}
        <MediaRow title="Drama" items={drama} />
        <MediaRow title="Comedy" items={comedy} />
        <MediaRow title="Crime" items={crime} />
      </div>
      <Footer />
    </div>
  );
}
