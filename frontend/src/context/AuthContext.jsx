import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_USER = "max_user";
const STORAGE_PROFILE = "max_profile";
const STORAGE_WATCHLIST = "max_watchlist";

const DEFAULT_PROFILES = [
  { id: "p1", name: "You", color: "#8b5cf6", kid: false },
  { id: "p2", name: "Alex", color: "#3b82f6", kid: false },
  { id: "p3", name: "Kids", color: "#f59e0b", kid: true },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem(STORAGE_USER);
    const p = localStorage.getItem(STORAGE_PROFILE);
    const w = localStorage.getItem(STORAGE_WATCHLIST);
    if (u) setUser(JSON.parse(u));
    if (p) setProfile(JSON.parse(p));
    if (w) setWatchlist(JSON.parse(w));
    setReady(true);
  }, []);

  const signIn = (email) => {
    const newUser = {
      id: "u_" + Date.now(),
      email,
      name: email.split("@")[0],
      profiles: DEFAULT_PROFILES,
    };
    localStorage.setItem(STORAGE_USER, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_PROFILE);
    setUser(null);
    setProfile(null);
  };

  const selectProfile = (p) => {
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(p));
    setProfile(p);
  };

  const toggleWatchlist = (item) => {
    const exists = watchlist.find(
      (w) => w.id === item.id && w.media_type === item.media_type
    );
    let next;
    if (exists) {
      next = watchlist.filter(
        (w) => !(w.id === item.id && w.media_type === item.media_type)
      );
    } else {
      next = [item, ...watchlist];
    }
    setWatchlist(next);
    localStorage.setItem(STORAGE_WATCHLIST, JSON.stringify(next));
  };

  const inWatchlist = (id, media_type) =>
    !!watchlist.find((w) => w.id === id && w.media_type === media_type);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        watchlist,
        ready,
        signIn,
        signOut,
        selectProfile,
        toggleWatchlist,
        inWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
