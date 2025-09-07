// src/components/BlogSearch.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LucideSearch } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-xl gap-2"
    >
      {/* Search Input with Glass Effect */}
      <div className="relative flex-1">
        {/* Search Icon always visible */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
          <LucideSearch className="w-5 h-5 text-white/70" />
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="block w-full pl-10 pr-3 py-2.5 rounded-full
                     bg-white/10 backdrop-blur-md border border-white/20
                     placeholder-white/70 text-white text-sm focus:outline-none
                     focus:ring-2 focus:ring-white/30 focus:border-white/40
                     transition-all duration-300 relative z-0"
        />
      </div>

      {/* Glass Search Button */}
      <button
        type="submit"
        className="relative inline-flex items-center justify-center px-6 py-2.5
                   rounded-full font-semibold text-white
                   bg-white/10 backdrop-blur-md border border-white/20
                   shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden group transition-all duration-500
                   hover:bg-white/20 hover:backdrop-blur-lg hover:scale-105 "
      >
        {/* Shimmer Reflection */}
        <span className="absolute w-[120%] h-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent
                         rotate-45 -translate-x-[150%] group-hover:translate-x-[150%]
                         transition-transform duration-1000 ease-in-out"></span>
        <span className="relative z-10">Search</span>
      </button>
    </form>
  );
}
