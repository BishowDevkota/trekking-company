"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface GlassButtonProps {
  label: string;
  href: string;
}

export default function GlassButtonDark({ label, href }: GlassButtonProps) {
  return (
    <Link href={href} className="relative inline-block">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="relative inline-flex items-center justify-center px-8 py-3 
                   rounded-full font-semibold text-white 
                   bg-black/80 backdrop-blur-md border border-white/30 
                   shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
                   overflow-hidden group/button transition-all duration-500"
      >
        {/* Glow Border */}
        <span className="absolute inset-0 rounded-full border border-white/40 opacity-50 
                         group-hover/button:opacity-100 transition-opacity duration-500 pointer-events-none"></span>

        {/* Shiny reflection */}
        <span className="absolute w-[120%] h-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent 
                         rotate-45 -translate-x-[150%] group-hover/button:translate-x-[150%] 
                         transition-transform duration-1000 ease-in-out pointer-events-none"></span>

        {/* Inner Glow */}
        <div className="absolute inset-1 bg-white/5 rounded-full blur-sm 
                        group-hover/button:blur-md transition-all duration-300 pointer-events-none"></div>

        {/* Button Text */}
        <span className="relative z-10">{label}</span>
      </motion.div>
    </Link>
  );
}