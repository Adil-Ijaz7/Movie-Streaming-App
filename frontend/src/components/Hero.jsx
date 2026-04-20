import React, { useEffect, useState } from "react";
import { Play, Info, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { img } from "../lib/tmdb";
import { useAuth } from "../context/AuthContext";

export default function Hero({ items = [] }) {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const { toggleWatchlist, inWatchlist } = useAuth();
  const item = items[idx];

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % Math.min(items.length, 5)), 8000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!item) return <div className="h-[90vh] bg-[#0a0a14]" />;

  const title = item.title || item.name;
  const isTv = item.media_type === "tv" || !item.title;
  const backdrop = img(item.backdrop_path, "original");
  const overview = item.overview || "";
  const added = inWatchlist(item.id, isTv ? "tv" : "movie");

  return (
    <div className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
      {items.slice(0, 5).map((it, i) => (
        <div
          key={it.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        >
          {it.backdrop_path && (
            <img
              src={img(it.backdrop_path, "w1280")}
              alt={it.title || it.name}
              loading={i === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a14] via-[#0a0a14]/70 to-transparent" />

      <div className="relative z-10 h-full flex items-end pb-24 md:pb-28">
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3 font-semibold">
              Max Original
            </div>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-[1.05] mb-4">
              {title}
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 max-w-xl">
              {overview}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate(`/${isTv ? "tv" : "movie"}/${item.id}?play=1`)}
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-white/90 transition-colors"
              >
                <Play size={18} fill="currentColor" /> Play
              </button>
              <button
                onClick={() => navigate(`/${isTv ? "tv" : "movie"}/${item.id}`)}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-6 py-3 rounded-md font-semibold hover:bg-white/25 transition-colors border border-white/20"
              >
                <Info size={18} /> More Info
              </button>
              <button
                onClick={() =>
                  toggleWatchlist({
                    id: item.id,
                    media_type: isTv ? "tv" : "movie",
                    title,
                    poster_path: item.poster_path,
                    backdrop_path: item.backdrop_path,
                  })
                }
                className="w-12 h-12 rounded-full border-2 border-white/40 text-white flex items-center justify-center hover:border-white hover:bg-white/10 transition-all"
                aria-label="Add to list"
              >
                {added ? <Check size={18} /> : <Plus size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-2">
        {items.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1 rounded-full transition-all ${
              i === idx ? "w-8 bg-white" : "w-4 bg-white/30"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
