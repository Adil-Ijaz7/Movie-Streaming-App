import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import MaxLogo from "../components/MaxLogo";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  React.useEffect(() => {
    if (ready && user) navigate("/profiles", { replace: true });
  }, [ready, user, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* Header */}
      <header className="relative z-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="text-white">
            <MaxLogo size={32} />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/signin")}
              className="text-sm font-medium text-white/90 hover:text-white px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signin?mode=signup")}
              className="text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white px-5 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[86vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 40%, rgba(124,58,237,0.30), transparent 55%), radial-gradient(ellipse at 85% 25%, rgba(59,130,246,0.25), transparent 55%), radial-gradient(ellipse at 50% 95%, rgba(168,85,247,0.18), transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative max-w-[1600px] w-full mx-auto px-6 md:px-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/70 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#3b82f6]" />
              The one to watch
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.02] tracking-tight mb-6">
              The studio behind
              <br />
              <span className="bg-gradient-to-r from-[#c084fc] via-[#a78bfa] to-[#60a5fa] bg-clip-text text-transparent">
                your favorite stories.
              </span>
            </h1>
            <p className="text-white/75 text-lg mb-8 max-w-lg">
              Stream iconic series, blockbuster movies, and Max Originals. From Game of
              Thrones to The Last of Us — it's all here.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate("/signin?mode=signup")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white px-7 py-3.5 rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                Start Streaming <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="inline-flex items-center gap-2 bg-white/10 text-white px-7 py-3.5 rounded-md font-semibold hover:bg-white/15 transition-colors border border-white/15"
              >
                Sign In
              </button>
            </div>
            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
              {[
                "Ad-Free & Ultimate plans",
                "Stream on 4 devices at once",
                "Up to 4K UHD with Dolby Atmos",
                "Max Originals & HBO exclusives",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] flex items-center justify-center">
                    <Check size={12} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              t: "HBO Originals",
              d: "The Last of Us, House of the Dragon, Succession, The White Lotus & more.",
            },
            {
              t: "Blockbuster Movies",
              d: "Warner Bros. theatrical releases coming home — from Dune to Barbie.",
            },
            {
              t: "Max Originals",
              d: "Exclusive series and films you won't find anywhere else.",
            },
          ].map((f) => (
            <div
              key={f.t}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">{f.t}</h3>
              <p className="text-white/60 text-sm">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-white/40 text-xs">
        © {new Date().getFullYear()} Warner Bros. Discovery, Inc. Clone built for demo purposes.
      </footer>
    </div>
  );
}
