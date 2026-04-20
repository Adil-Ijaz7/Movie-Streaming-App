import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Play,
  Plus,
  Check,
  X,
  Star,
  Calendar,
  Clock,
  Globe,
  Server,
  Info,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaRow from "../components/MediaRow";
import { tmdb, img, playerUrl, SERVERS } from "../lib/tmdb";
import { useAuth } from "../context/AuthContext";

const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिन्दी (Hindi)", short: "HI" },
  { code: "es", label: "Español", short: "ES" },
  { code: "fr", label: "Français", short: "FR" },
];
const LANG_KEY = "max_lang";
const SERVER_KEY = "max_server";

export default function Detail({ type }) {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || "en");
  const [server, setServer] = useState(
    () => localStorage.getItem(SERVER_KEY) || "111movies"
  );
  const [iframeKey, setIframeKey] = useState(0);
  const { inWatchlist, toggleWatchlist } = useAuth();

  const playing = params.get("play") === "1";

  const changeLang = (code) => {
    setLang(code);
    localStorage.setItem(LANG_KEY, code);
    setIframeKey((k) => k + 1);
  };
  const changeServer = (id) => {
    setServer(id);
    localStorage.setItem(SERVER_KEY, id);
    setIframeKey((k) => k + 1);
  };

  useEffect(() => {
    (async () => {
      setData(null);
      try {
        const res = type === "tv" ? await tmdb.tvDetail(id) : await tmdb.movieDetail(id);
        setData(res);
        if (type === "tv" && res.seasons?.length) {
          const s = res.seasons.find((x) => x.season_number >= 1) || res.seasons[0];
          setSeason(s.season_number);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id, type]);

  useEffect(() => {
    if (type !== "tv" || !data) return;
    (async () => {
      try {
        const s = await tmdb.seasonDetail(id, season);
        setEpisodes(s.episodes || []);
        setEpisode(1);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [type, id, season, data]);

  const title = data?.title || data?.name;
  const year = (data?.release_date || data?.first_air_date || "").slice(0, 4);
  const added = data ? inWatchlist(Number(id), type) : false;

  const similar = useMemo(
    () => (data?.similar?.results || []).map((x) => ({ ...x, media_type: type })),
    [data, type]
  );

  const cast = data?.credits?.cast?.slice(0, 8) || [];
  const runtime =
    data?.runtime ||
    (data?.episode_run_time && data.episode_run_time[0]) ||
    null;

  // Isolate the player: when playing, don't render heavy Detail content
  // (backdrop image, episode stills, similar carousel). This avoids
  // network + CPU contention with the video stream → much less lag.
  if (playing) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        <div className="flex items-center justify-between px-4 md:px-6 h-14 bg-black/90 border-b border-white/10 gap-3">
          <div className="text-white font-semibold truncate flex-1 min-w-0">
            {title || "Loading..."}{" "}
            {type === "tv" ? `• S${season} E${episode}` : ""}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Server size={14} className="hidden md:block text-white/60" />
            <select
              value={server}
              onChange={(e) => changeServer(e.target.value)}
              className="bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#7c3aed] cursor-pointer"
              aria-label="Streaming server"
            >
              {SERVERS.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#0a0a14]">
                  {s.name}
                </option>
              ))}
            </select>
            <Globe size={14} className="hidden md:block text-white/60 ml-1" />
            <select
              value={lang}
              onChange={(e) => changeLang(e.target.value)}
              className="bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#7c3aed] cursor-pointer"
              aria-label="Audio language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#0a0a14]">
                  {l.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setParams({})}
              className="text-white/80 hover:text-white ml-1"
              aria-label="Close player"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-black relative">
          <iframe
            key={iframeKey}
            title="player"
            src={
              type === "tv"
                ? playerUrl.tv(id, season, episode, lang, server)
                : playerUrl.movie(id, lang, server)
            }
            className="w-full h-full block"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="no-referrer"
            frameBorder="0"
            loading="eager"
          />
          {lang === "hi" && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 max-w-[90%] bg-black/85 backdrop-blur text-white/95 text-xs md:text-sm px-4 py-2 rounded-full border border-white/15 pointer-events-none flex items-center gap-2 shadow-lg">
              <Info size={14} className="shrink-0 text-purple-300" />
              <span>
                Hindi selected — open the player's <b>audio menu</b> (gear /
                CC icon) to pick Hindi. Try another <b>Server</b> if not listed.
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <Navbar />

      {data && (
        <div className="relative">
          <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
            {data.backdrop_path && (
              <img
                src={img(data.backdrop_path, "w1280")}
                alt={title}
                loading="eager"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a14] via-[#0a0a14]/60 to-transparent" />
          </div>

          <div className="max-w-[1600px] mx-auto px-6 md:px-10 -mt-64 relative z-10">
            <div className="flex flex-col md:flex-row gap-8">
              {data.poster_path && (
                <img
                  src={img(data.poster_path, "w500")}
                  alt={title}
                  className="hidden md:block w-56 h-80 object-cover rounded-lg shadow-2xl"
                />
              )}
              <div className="flex-1">
                <h1 className="text-4xl md:text-6xl font-black leading-tight">{title}</h1>
                <div className="flex items-center flex-wrap gap-4 mt-3 text-sm text-white/70">
                  {year && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} /> {year}
                    </span>
                  )}
                  {runtime && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} /> {runtime} min
                    </span>
                  )}
                  {data.vote_average > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star size={14} className="text-yellow-400" fill="currentColor" />
                      {data.vote_average.toFixed(1)}
                    </span>
                  )}
                  {data.genres?.slice(0, 3).map((g) => (
                    <span
                      key={g.id}
                      className="px-2 py-0.5 border border-white/15 rounded text-xs"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-white/80 max-w-3xl leading-relaxed">
                  {data.overview}
                </p>
                <div className="flex items-center gap-3 mt-6 flex-wrap">
                  <button
                    onClick={() => setParams({ play: "1" })}
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-white/90 transition-colors"
                  >
                    <Play size={18} fill="currentColor" /> Play
                    {type === "tv" ? " S" + season + " E" + episode : ""}
                  </button>
                  <button
                    onClick={() =>
                      toggleWatchlist({
                        id: Number(id),
                        media_type: type,
                        title,
                        poster_path: data.poster_path,
                        backdrop_path: data.backdrop_path,
                      })
                    }
                    className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-md font-semibold hover:bg-white/15 transition-colors border border-white/15"
                  >
                    {added ? <Check size={18} /> : <Plus size={18} />}
                    {added ? "On My List" : "Add to My List"}
                  </button>
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 rounded-md px-3 py-3">
                    <Globe size={16} className="text-white/60" />
                    <select
                      value={lang}
                      onChange={(e) => changeLang(e.target.value)}
                      className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
                      aria-label="Audio language"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code} className="bg-[#0a0a14]">
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {cast.length > 0 && (
                  <div className="mt-8">
                    <div className="text-white/60 text-sm mb-2">Cast</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {cast.map((c) => (
                        <span key={c.id} className="text-white/85">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {type === "tv" && data.seasons?.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Episodes</h2>
                  <select
                    value={season}
                    onChange={(e) => setSeason(Number(e.target.value))}
                    className="bg-white/5 border border-white/15 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#7c3aed]"
                  >
                    {data.seasons
                      .filter((s) => s.season_number > 0)
                      .map((s) => (
                        <option key={s.id} value={s.season_number} className="bg-[#0a0a14]">
                          Season {s.season_number}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-3">
                  {episodes.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => {
                        setEpisode(ep.episode_number);
                        setParams({ play: "1" });
                      }}
                      className="w-full flex gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left"
                    >
                      <div className="w-40 h-24 flex-shrink-0 rounded overflow-hidden bg-[#1a1a26] relative">
                        {ep.still_path ? (
                          <img
                            src={img(ep.still_path, "w300")}
                            alt={ep.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity">
                          <Play size={28} fill="currentColor" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold">
                          {ep.episode_number}. {ep.name}
                        </div>
                        <div className="text-white/50 text-xs mt-1">
                          {ep.air_date} {ep.runtime ? `• ${ep.runtime} min` : ""}
                        </div>
                        <p className="text-white/70 text-sm mt-2 line-clamp-2">
                          {ep.overview}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-14" />
          </div>

          {similar.length > 0 && (
            <div className="mt-8">
              <MediaRow title="More Like This" items={similar} />
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
