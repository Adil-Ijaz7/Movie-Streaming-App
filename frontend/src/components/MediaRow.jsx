import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { img } from "../lib/tmdb";
import { useAuth } from "../context/AuthContext";

export default function MediaRow({ title, items = [], variant = "poster" }) {
  const scrollRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <div
      className="relative group/row mb-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className="px-6 md:px-10 text-white text-lg md:text-xl font-semibold mb-3">
        {title}
      </h2>
      <div className="relative">
        {hovered && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-r from-[#0a0a14]/90 to-transparent flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={32} />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-6 md:px-10 pb-3 scroll-smooth"
        >
          {items.map((item) => (
            <MediaCard key={`${item.media_type}-${item.id}`} item={item} variant={variant} />
          ))}
        </div>
        {hovered && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-l from-[#0a0a14]/90 to-transparent flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </div>
  );
}

function MediaCard({ item, variant }) {
  const navigate = useNavigate();
  const { inWatchlist, toggleWatchlist } = useAuth();
  const isTv = item.media_type === "tv";
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const added = inWatchlist(item.id, item.media_type);

  const poster = img(item.poster_path, "w500");
  const backdrop = img(item.backdrop_path, "w780");

  const isBackdrop = variant === "backdrop";
  const width = isBackdrop ? "w-[300px] md:w-[360px]" : "w-[160px] md:w-[200px]";
  const aspect = isBackdrop ? "aspect-video" : "aspect-[2/3]";
  const src = isBackdrop ? backdrop || poster : poster || backdrop;

  return (
    <div
      className={`${width} flex-shrink-0 group relative cursor-pointer`}
      onClick={() => navigate(`/${isTv ? "tv" : "movie"}/${item.id}`)}
    >
      <div
        className={`${aspect} rounded-md overflow-hidden bg-[#1a1a26] relative transition-transform duration-300 group-hover:scale-[1.04] group-hover:shadow-2xl group-hover:shadow-purple-900/40`}
      >
        {src ? (
          <img
            src={src}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-sm p-3 text-center">
            {title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${isTv ? "tv" : "movie"}/${item.id}?play=1`);
              }}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Play"
            >
              <Play size={16} fill="currentColor" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist({
                  id: item.id,
                  media_type: item.media_type,
                  title,
                  poster_path: item.poster_path,
                  backdrop_path: item.backdrop_path,
                });
              }}
              className="w-9 h-9 rounded-full border-2 border-white/70 text-white flex items-center justify-center hover:border-white hover:bg-white/10 transition-all"
              aria-label="Add to list"
            >
              {added ? <Check size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <div className="text-white text-sm font-medium truncate">{title}</div>
        {year && <div className="text-white/50 text-xs">{year}</div>}
      </div>
    </div>
  );
}
