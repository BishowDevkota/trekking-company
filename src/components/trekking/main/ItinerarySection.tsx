"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ItineraryItem {
  heading: string;
  description: string;
}

interface ItinerarySectionProps {
  title: string;
  shortDescription: string;
  items: ItineraryItem[];
}

const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  title,
  shortDescription,
  items,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-6">
      <div className="p-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-4 mb-4"
        >
          <h2 className="text-3xl font-bold text-white text-center tracking-tight">
            {title}
          </h2>
          <p className="text-gray-300 text-center mt-2 max-w-2xl mx-auto">
            {shortDescription}
          </p>
        </motion.div>

        {/* Itinerary Accordion */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
              className="
                relative overflow-hidden group/card
                bg-black/50 backdrop-blur-xl
                border border-gray-700/50 rounded-xl
                shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                transition-all duration-300
              "
            >
              {/* Shine Effect Overlay */}
              <div
                className="
                  absolute inset-0 
                  bg-gradient-to-r from-transparent via-white/30 to-transparent 
                  -translate-x-full group-hover/card:translate-x-full 
                  transition-transform duration-1000 ease-in-out 
                  pointer-events-none
                "
              ></div>

              {/* Heading row */}
              <button
                onClick={() => toggleItem(index)}
                className="relative z-10 w-full flex justify-between items-center px-6 py-4 text-left text-lg font-semibold text-white group-hover/card:text-gray-100 transition-transform duration-300 "
              >
                <span>{item.heading}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-300" />
                )}
              </button>

              {/* Expandable description */}
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden relative z-10"
                  >
                    <p
                      className="
                        px-6 pb-4 text-gray-300 leading-relaxed 
                        transition-transform duration-300 group-hover/card:text-gray-200
                      "
                    >
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItinerarySection;
