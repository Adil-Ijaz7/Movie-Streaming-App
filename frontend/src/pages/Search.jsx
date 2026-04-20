import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { tmdb, img } from "../lib/tmdb";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const r = await tmdb.trending("all", "week");
      setTrending((r.results || []).filter((x) => x.poster_path).slice(0, 18));
    })();
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await tmdb.searchMulti(q.trim());
        setResults(
          (r.results || []).filter(
            (x) => (x.media_type === "movie" || x.media_type === "tv") && x.poster_path
          )
        );
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const list = q.trim() ? results : trending;

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <Navbar />
      <div className="pt-24 pb-8">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="relative max-w-2xl">
            <SearchIcon
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
            />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies, series, actors..."
              className="w-full bg-white/5 border border-white/15 rounded-lg pl-12 pr-4 py-4 text-white placeholder-white/40 focus:outline-none focus:border-[#7c3aed] focus:bg-white/10 transition-colors"
            />
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">
              {q.trim() ? (loading ? "Searching..." : `Results for "${q}"`) : "Trending"}
            </h2>
            {list.length === 0 && !loading && q.trim() && (
              <div className="text-white/60">No matches found.</div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {list.map((item) => {
                const isTv = item.media_type === "tv";
                const title = item.title || item.name;
                const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                return (
                  <button
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => navigate(`/${isTv ? "tv" : "movie"}/${item.id}`)}
                    className="text-left group"
                  >
                    <div className="aspect-[2/3] rounded-md overflow-hidden bg-[#1a1a26] group-hover:scale-[1.03] transition-transform">
                      <img
                        src={img(item.poster_path, "w500")}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-2 text-sm font-medium truncate">{title}</div>
                    <div className="text-xs text-white/50">
                      {year} {isTv ? "• Series" : "• Movie"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
