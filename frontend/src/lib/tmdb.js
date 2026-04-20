import axios from "axios";

const TMDB_KEYS = [
  "c8dea14dc917687ac631a52620e4f7ad",
  "3cb41ecea3bf606c56552db3d17adefd",
];
let keyIndex = 0;
const getKey = () => TMDB_KEYS[keyIndex % TMDB_KEYS.length];
const rotateKey = () => {
  keyIndex += 1;
};

const BASE = "https://api.themoviedb.org/3";
export const IMG = "https://image.tmdb.org/t/p";
export const img = (path, size = "w500") =>
  path ? `${IMG}/${size}${path}` : null;

async function tmdbGet(path, params = {}) {
  let attempts = 0;
  let lastErr = null;
  while (attempts < TMDB_KEYS.length) {
    try {
      const res = await axios.get(`${BASE}${path}`, {
        params: { api_key: getKey(), ...params },
      });
      return res.data;
    } catch (e) {
      lastErr = e;
      rotateKey();
      attempts += 1;
    }
  }
  throw lastErr;
}

// HBO / Max related networks on TMDB
// 49 = HBO, 3186 = Max, 2552 = HBO Max (legacy), 213 = Netflix (for comparison)
export const NETWORKS = {
  HBO: 49,
  MAX: 3186,
  HBO_MAX: 2552,
};

export const tmdb = {
  trending: (type = "all", window = "week") =>
    tmdbGet(`/trending/${type}/${window}`),
  popularMovies: () => tmdbGet("/movie/popular"),
  topMovies: () => tmdbGet("/movie/top_rated"),
  upcomingMovies: () => tmdbGet("/movie/upcoming"),
  popularTv: () => tmdbGet("/tv/popular"),
  topTv: () => tmdbGet("/tv/top_rated"),
  hboMovies: () =>
    tmdbGet("/discover/movie", {
      with_networks: `${NETWORKS.HBO}|${NETWORKS.MAX}|${NETWORKS.HBO_MAX}`,
      sort_by: "popularity.desc",
    }),
  hboTv: () =>
    tmdbGet("/discover/tv", {
      with_networks: `${NETWORKS.HBO}|${NETWORKS.MAX}|${NETWORKS.HBO_MAX}`,
      sort_by: "popularity.desc",
    }),
  hboTvTop: () =>
    tmdbGet("/discover/tv", {
      with_networks: `${NETWORKS.HBO}|${NETWORKS.MAX}|${NETWORKS.HBO_MAX}`,
      sort_by: "vote_average.desc",
      "vote_count.gte": 200,
    }),
  movieDetail: (id) =>
    tmdbGet(`/movie/${id}`, { append_to_response: "videos,credits,similar,images" }),
  tvDetail: (id) =>
    tmdbGet(`/tv/${id}`, { append_to_response: "videos,credits,similar,images" }),
  seasonDetail: (id, season) => tmdbGet(`/tv/${id}/season/${season}`),
  searchMulti: (query) => tmdbGet("/search/multi", { query }),
  discoverMovies: (params = {}) => tmdbGet("/discover/movie", params),
  discoverTv: (params = {}) => tmdbGet("/discover/tv", params),
  genreMovies: () => tmdbGet("/genre/movie/list"),
  genreTv: () => tmdbGet("/genre/tv/list"),
  hindiMovies: () =>
    tmdbGet("/discover/movie", {
      with_original_language: "hi",
      sort_by: "popularity.desc",
      "vote_count.gte": 50,
    }),
  hindiTv: () =>
    tmdbGet("/discover/tv", {
      with_original_language: "hi",
      sort_by: "popularity.desc",
    }),
};

// Embed server providers. Different scrapers carry different audio tracks
// (including Hindi dubs), so exposing a Server selector lets users find one.
// Some providers accept a language hint query param; we pass it when supported.
export const SERVERS = [
  {
    id: "111movies",
    name: "Server 1 (111movies)",
    movie: (id) => `https://111movies.net/movie/${id}`,
    tv: (id, s, e) => `https://111movies.net/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc",
    name: "Server 2 (VidSrc)",
    // vidsrc.xyz accepts ds_lang for default subtitle; audio track lives in-player
    movie: (id, lang) =>
      `https://vidsrc.xyz/embed/movie?tmdb=${id}${lang ? `&ds_lang=${lang}` : ""}`,
    tv: (id, s, e, lang) =>
      `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}${lang ? `&ds_lang=${lang}` : ""}`,
  },
  {
    id: "vidlink",
    name: "Server 3 (VidLink)",
    movie: (id) => `https://vidlink.pro/movie/${id}?autoplay=true`,
    tv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=true`,
  },
  {
    id: "2embed",
    name: "Server 4 (2Embed)",
    movie: (id) => `https://www.2embed.cc/embed/${id}`,
    tv: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    id: "videasy",
    name: "Server 5 (Videasy)",
    movie: (id) => `https://player.videasy.net/movie/${id}`,
    tv: (id, s, e) => `https://player.videasy.net/tv/${id}/${s}/${e}`,
  },
];

export const getServer = (serverId) =>
  SERVERS.find((s) => s.id === serverId) || SERVERS[0];

export const playerUrl = {
  movie: (id, lang, serverId = "111movies") => {
    const s = getServer(serverId);
    return s.movie(id, lang);
  },
  tv: (id, season = 1, episode = 1, lang, serverId = "111movies") => {
    const s = getServer(serverId);
    return s.tv(id, season, episode, lang);
  },
};
