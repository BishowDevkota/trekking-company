"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LiquidGlassBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, " ");

  return (
    <motion.nav
      className="flex items-center text-sm space-x-2"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Home Button */}
      <motion.div
        className="relative"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link
          href="/"
          className="relative p-3 rounded-xl flex items-center transition-all duration-300 group overflow-hidden"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255,255,255,0.08) 0%, 
              rgba(255,255,255,0.03) 50%, 
              rgba(255,255,255,0.06) 100%)`,
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.1),
                        0 8px 32px 0 rgba(0,0,0,0.3)`,
          }}
        >
          {/* Shining effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                          -skew-x-12 -translate-x-full group-hover:translate-x-full
                          transition-transform duration-1000 ease-out" />
          
          {/* Glow border on hover */}
          <div className="absolute inset-0 rounded-xl border border-white/20 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-500" />
          
          <Home className="w-4 h-4 text-white/80 group-hover:text-white 
                          transition-colors duration-300 relative z-10" />
          <span className="sr-only">Home</span>
        </Link>
      </motion.div>

      {/* Breadcrumb Segments */}
      {segments.map((segment, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        return (
          <motion.span
            key={path}
            className="flex items-center space-x-2"
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
          >
            {/* Animated Separator */}
            <div className="text-white">
              &gt;
            </div>

            {isLast ? (
              /* Current Page (Non-clickable) */
              <motion.div
                className="relative px-4 py-2 rounded-lg text-white/90 font-medium overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255,255,255,0.15) 0%, 
                    rgba(255,255,255,0.08) 50%, 
                    rgba(255,255,255,0.12) 100%)`,
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.15),
                              0 10px 20px -8px rgba(0,0,0,0.3)`,
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                -skew-x-12 -translate-x-full group-hover:translate-x-full
                                transition-transform duration-1500 ease-out" />
                
                <span className="relative z-10">
                  {capitalize(segment)}
                </span>
              </motion.div>
            ) : (
              /* Clickable Breadcrumb */
              <Link
                href={path}
                className="relative group px-4 py-2 rounded-lg font-medium overflow-hidden
                          transition-all duration-300 hover:scale-105 active:scale-98"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255,255,255,0.06) 0%, 
                    rgba(255,255,255,0.02) 50%, 
                    rgba(255,255,255,0.04) 100%)`,
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.08),
                              0 10px 20px -8px rgba(0,0,0,0.25)`,
                }}
              >
                {/* Shining effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent
                                -skew-x-12 -translate-x-full group-hover:translate-x-full
                                transition-transform duration-1000 ease-out" />
                
                {/* Glow border on hover */}
                <div className="absolute inset-0 rounded-lg border border-white/15 opacity-0 
                                group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="relative z-10 text-white/70 group-hover:text-white/95 
                                transition-colors duration-300">
                  {capitalize(segment)}
                </span>
              </Link>
            )}
          </motion.span>
        );
      })}
    </motion.nav>
  );
}