"use client";

import { motion, AnimatePresence } from "framer-motion";

interface IncludeExcludeSectionProps {
  title: string;
  shortInfo: string;
  included: string[];
  excluded: string[];
}

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const IncludeExcludeSection: React.FC<IncludeExcludeSectionProps> = ({ title, shortInfo, included, excluded }) => {
  return (
    <section className="py-6">
      <div className="p-6">
        {/* Title and short info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-4 mb-6"
        >
          <h2 className="text-3xl font-bold text-white text-center tracking-tight">
            {title}
          </h2>
          <p className="text-gray-300 text-center mt-2 max-w-2xl mx-auto">
            {shortInfo}
          </p>
        </motion.div>

        {/* Included Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="
            relative overflow-hidden group/card
            bg-black/50 backdrop-blur-xl
            border border-gray-700/50 rounded-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            p-6 mb-6
            transition-all duration-500
            hover:scale-103 hover:bg-black/60
            cursor-pointer
          "
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-white mb-4">What&apos;s Included</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <AnimatePresence>
                {included.map((point, index) => (
                  <motion.li
                    key={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="transition-colors duration-300 group-hover/card:text-gray-200"
                  >
                    {point}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>

        {/* Excluded Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="
            relative overflow-hidden group/card
            bg-black/50 backdrop-blur-xl
            border border-gray-700/50 rounded-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            p-6
            transition-all duration-500
            hover:scale-103 hover:bg-black/60
            cursor-pointer
          "
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-white mb-4">What&apos;s Excluded</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <AnimatePresence>
                {excluded.map((point, index) => (
                  <motion.li
                    key={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="transition-colors duration-300 group-hover/card:text-gray-200"
                  >
                    {point}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IncludeExcludeSection;
