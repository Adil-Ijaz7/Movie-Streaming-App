import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { img } from "../lib/tmdb";

export default function Watchlist() {
  const { watchlist, toggleWatchlist } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <Navbar />
      <div className="pt-24 pb-8">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <h1 className="text-4xl md:text-5xl font-black">My List</h1>
          <p className="text-white/60 mt-2 mb-10">
            {watchlist.length
              ? `${watchlist.length} title${watchlist.length > 1 ? "s" : ""} saved for later.`
              : "Your list is empty. Add shows and movies to watch later."}
          </p>
          {watchlist.length === 0 ? (
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              Browse Max
            </button>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlist.map((item) => {
                const isTv = item.media_type === "tv";
                return (
                  <div
                    key={`${item.media_type}-${item.id}`}
                    className="relative group cursor-pointer"
                    onClick={() => navigate(`/${isTv ? "tv" : "movie"}/${item.id}`)}
                  >
                    <div className="aspect-[2/3] rounded-md overflow-hidden bg-[#1a1a26] group-hover:scale-[1.03] transition-transform">
                      {item.poster_path && (
                        <img
                          src={img(item.poster_path, "w500")}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-sm font-medium truncate">{item.title}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(item);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black transition-all"
                      aria-label="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
