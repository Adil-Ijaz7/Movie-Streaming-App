import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MaxLogo from "../components/MaxLogo";

export default function Profiles() {
  const { user, selectProfile } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) navigate("/signin", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const pick = (p) => {
    selectProfile(p);
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex flex-col">
      <header className="max-w-[1600px] w-full mx-auto px-6 md:px-10 h-16 flex items-center">
        <MaxLogo size={30} />
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center">Who's watching?</h1>
        <p className="text-white/60 mb-12 text-center">Select a profile to continue</p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {user.profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => pick(p)}
              className="group flex flex-col items-center gap-3"
            >
              <div
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl flex items-center justify-center text-white text-5xl font-black group-hover:ring-4 ring-white/80 transition-all"
                style={{ background: p.color }}
              >
                {p.name.charAt(0)}
              </div>
              <div className="text-white/70 group-hover:text-white font-medium">
                {p.name}
                {p.kid && (
                  <span className="ml-2 text-[10px] uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded">
                    Kid
                  </span>
                )}
              </div>
            </button>
          ))}
          <button className="group flex flex-col items-center gap-3">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/60 transition-colors">
              <Plus size={40} />
            </div>
            <div className="text-white/50 group-hover:text-white/80">Add Profile</div>
          </button>
        </div>
      </div>
    </div>
  );
}
