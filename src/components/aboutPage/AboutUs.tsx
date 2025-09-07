"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import GlassButtonDark from "../bottons/GlassButtonDark";

export default function AboutUs() {
  return (
    <section className="py-16 px-8 md:px-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-64 h-64 bg-teal-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-violet-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-4 font-serif tracking-tight drop-shadow-sm">
            About Us
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col justify-center relative"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 drop-shadow-sm">
              Nepal&apos;s Premier Mardi Himal Trek Agency
            </h3>
            <p className="text-lg text-black/90 leading-relaxed mb-6 drop-shadow-sm">
              We are the leading travel agency in Nepal, specializing in the Mardi Himal Trek. Our expert guides, personalized itineraries, and commitment to sustainable travel ensure an unforgettable adventure through the breathtaking Himalayan landscapes. Discover the beauty of Mardi Himal with us, where every step is a journey into nature and culture.
            </p>

            <GlassButtonDark label="Plan Your Trek" href="/contact" />
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-3xl overflow-visible backdrop-blur-lg border border-gray-200 shadow-2xl group"
          >
            {/* Image with hover zoom and shine */}
            <motion.div
              className="absolute inset-0 rounded-3xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src="/Images/TrekkingHero.jpg"
                alt="Mardi Himal Trek"
                fill
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
              />
              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-3xl translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none" />
            </motion.div>

            
          </motion.div>
        </div>
      </div>
    </section>
  );
}