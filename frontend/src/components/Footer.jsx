import React from "react";
import MaxLogo from "./MaxLogo";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a14] border-t border-white/5 mt-16">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-12">
        <div className="text-white mb-8">
          <MaxLogo size={36} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-white/60">
          <div className="space-y-2">
            <div className="text-white font-semibold mb-3">Max</div>
            <a className="block hover:text-white cursor-pointer">Devices</a>
            <a className="block hover:text-white cursor-pointer">Student Discount</a>
            <a className="block hover:text-white cursor-pointer">Connected Partners</a>
          </div>
          <div className="space-y-2">
            <div className="text-white font-semibold mb-3">Explore</div>
            <a className="block hover:text-white cursor-pointer">Movies</a>
            <a className="block hover:text-white cursor-pointer">Series</a>
            <a className="block hover:text-white cursor-pointer">Max Originals</a>
          </div>
          <div className="space-y-2">
            <div className="text-white font-semibold mb-3">Help</div>
            <a className="block hover:text-white cursor-pointer">Help Center</a>
            <a className="block hover:text-white cursor-pointer">Subscription</a>
            <a className="block hover:text-white cursor-pointer">Contact Us</a>
          </div>
          <div className="space-y-2">
            <div className="text-white font-semibold mb-3">Legal</div>
            <a className="block hover:text-white cursor-pointer">Terms of Use</a>
            <a className="block hover:text-white cursor-pointer">Privacy Policy</a>
            <a className="block hover:text-white cursor-pointer">Cookie Preferences</a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 text-xs text-white/40">
          © {new Date().getFullYear()} Warner Bros. Discovery, Inc. All rights reserved. Max
          is used under license.
        </div>
      </div>
    </footer>
  );
}
