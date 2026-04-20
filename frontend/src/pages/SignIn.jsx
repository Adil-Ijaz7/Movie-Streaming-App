import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MaxLogo from "../components/MaxLogo";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const [params] = useSearchParams();
  const mode = params.get("mode") === "signup" ? "signup" : "signin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErr("Please enter email and password");
      return;
    }
    signIn(email);
    navigate("/profiles", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(124,58,237,0.25), transparent 60%), radial-gradient(ellipse at bottom left, rgba(59,130,246,0.2), transparent 60%)",
        }}
      />
      <div className="relative z-10">
        <header className="max-w-[1600px] mx-auto px-6 md:px-10 h-16 flex items-center">
          <button onClick={() => navigate("/")} className="text-white">
            <MaxLogo size={32} />
          </button>
        </header>
        <div className="max-w-md mx-auto px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {mode === "signup" ? "Create your account" : "Sign in to Max"}
          </h1>
          <p className="text-white/60 mb-8 text-sm">
            {mode === "signup"
              ? "Start streaming in under a minute."
              : "Welcome back. Pick up where you left off."}
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#7c3aed] focus:bg-white/10 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#7c3aed] focus:bg-white/10 transition-colors"
                placeholder="••••••••"
              />
            </div>
            {err && <div className="text-red-400 text-sm">{err}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white font-semibold py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              {mode === "signup" ? "Create Account" : "Sign In"}
            </button>
          </form>
          <div className="mt-6 text-sm text-white/60 text-center">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/signin")}
                  className="text-white hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New to Max?{" "}
                <button
                  onClick={() => navigate("/signin?mode=signup")}
                  className="text-white hover:underline"
                >
                  Sign up now
                </button>
              </>
            )}
          </div>
          <p className="mt-10 text-xs text-white/40 text-center">
            This is a demo. Any email/password will work. No data is sent to a server.
          </p>
        </div>
      </div>
    </div>
  );
}
