"use client";

import { motion } from "framer-motion";
import GlassCard from "../cards/GlassCard";
import { getLowestPrice } from "@/functions/calculateLowestPrice";
import { useEffect, useState } from "react";
import { Trek } from "@/types/trekking";

export default function OurTrekking() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace these with the actual trek IDs from your database
  const selectedTrekIds = [
    "68baf727c234cedb26955dcd", // Example ID 1 (e.g., Mardi Himal Trek)
    "68b9a84dd7e555f8a8cb5b19", // Example ID 2
    "68bae66c32c7807ec4f6a081", // Example ID 3
  ];

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const response = await fetch("/api/treks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch treks");
        }

        const data: Trek[] = await response.json();
        // Filter the treks to only include those with the specified IDs
        const selectedTreks = data.filter((trek) =>
          selectedTrekIds.includes(trek._id.toString())
        );
        setTreks(selectedTreks);
        setLoading(false);
      } catch (err) {
        setError("Error fetching treks");
        setLoading(false);
        console.error(err);
      }
    };

    fetchTreks();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (treks.length === 0) {
    return <div className="text-center py-20">No treks found</div>;
  }

  return (
    <section className="py-20 px-8 md:px-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-serif tracking-tight">
            Our Adventures
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover extraordinary journeys crafted for adventurers seeking authentic experiences in the heart of the Himalayas
          </p>
        </motion.div>

        {/* Adventure Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {treks.map((trek, index) => (
            <motion.div
              key={trek._id.toString()}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <GlassCard
                title={trek.name}
                description={trek.description}
                image={trek.image}
                topLeft={trek.itinerary ? `${trek.itinerary.length} Days` : "N/A"} // Example: Using itinerary length for duration
                topRight="10% Off" // Replace with dynamic discount if available
                price={getLowestPrice(trek)} // Calculate the lowest price
                ctaLabel="Learn More"
                ctaLink={`/adventures/${trek.slug}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}