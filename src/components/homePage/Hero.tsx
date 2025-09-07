"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GlassButton from "../bottons/GlassBotton";
import SearchBar from "../subHero/SearchBar";

const slides = [
  {
    image: "/images/slide1.webp",
    title: "Discover the Himalayas",
    content:
      "Embark on breathtaking treks through Nepal's most iconic trails with expert guides.",
    link: "/trekking/mardi-himal-trek",
  },
  {
    image: "/images/slide2.jpg",
    title: "Adventure of a Lifetime",
    content:
      "From Everest Base Camp to hidden valleys, experience the magic of nature firsthand.",
    link: "/trekking/mardi-himal-trek-from-pokhara",
  },
  {
    image: "/images/slide3.jpg",
    title: "Your Journey, Our Promise",
    content:
      "We ensure safe, unforgettable, and personalized adventures for every traveler.",
    link: "/trekking/mardi-himal-trek-with-annapurna-base-camp",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [pauseSlider, setPauseSlider] = useState(false); // Track pause

  useEffect(() => {
    if (pauseSlider) return; // don't run interval if paused

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [current, pauseSlider]);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence>
        <motion.div
          key={slides[current].image}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(59,130,246,0.15) 0%, transparent 50%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-8 md:px-20">
        <motion.div
          key={slides[current].title}
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight font-serif text-white drop-shadow-2xl">
            {slides[current].title}
          </h1>
          <p className="text-lg md:text-2xl mb-8 leading-relaxed font-light text-gray-100 drop-shadow-lg">
            {slides[current].content}
          </p>

          {/* Blog Search */}
          <div
            className="mb-8"
            onMouseEnter={() => setPauseSlider(true)}
            onMouseLeave={() => setPauseSlider(false)}
          >
            <SearchBar />
          </div>

          {/* Liquid Glass Button */}
          <GlassButton label="Book Now" href={slides[current].link} />
        </motion.div>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 backdrop-blur-sm border border-white/30 ${
              current === index
                ? "bg-white scale-125 shadow-lg shadow-white/50"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
