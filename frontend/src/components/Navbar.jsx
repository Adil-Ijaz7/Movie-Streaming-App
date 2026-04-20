import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import MaxLogo from "./MaxLogo";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const links = [
  { to: "/home", label: "Home" },
  { to: "/series", label: "Series" },
  { to: "/movies", label: "Movies" },
  { to: "/originals", label: "Max Originals" },
  { to: "/watchlist", label: "My List" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[#0a0a14]/95 backdrop-blur-md border-b border-white/5"
          : "bg-gradient-to-b from-[#0a0a14]/90 to-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/home" className="text-white">
            <MaxLogo size={28} />
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/search")}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            className="text-white/80 hover:text-white transition-colors hidden sm:block"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-white font-semibold text-sm"
                style={{ background: profile?.color || "#8b5cf6" }}
              >
                {(profile?.name || "U").charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={14} className="text-white/70 hidden sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#15151f] border-white/10 text-white min-w-[200px]"
            >
              <DropdownMenuItem
                className="focus:bg-white/10 focus:text-white cursor-pointer"
                onClick={() => navigate("/profiles")}
              >
                Switch Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-white/10 focus:text-white cursor-pointer"
                onClick={() => navigate("/watchlist")}
              >
                My List
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="focus:bg-white/10 focus:text-white cursor-pointer"
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
              >
                <LogOut size={14} className="mr-2" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
