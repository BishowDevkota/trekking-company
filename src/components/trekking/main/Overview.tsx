'use client';

import { motion } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';
import { Trek } from '@/types/trekking';
import { ReactElement } from 'react';

interface OverviewSectionProps {
  title: string;
  shortDescription?: string;
  info: Trek['overview'];
}

export default function OverviewSection({
  title,
  shortDescription,
  info = [],
}: OverviewSectionProps) {
  // Map icon names to components safely
  const items = info.map((item) => {
    const IconComponent =
      item.icon && FaIcons[item.icon as keyof typeof FaIcons]
        ? (FaIcons[item.icon as keyof typeof FaIcons] as React.ComponentType<{ size?: number }>)
        : FaIcons.FaRocket;

    return {
      icon: <IconComponent size={20} />,
      heading: item.heading || 'Heading',
      description: item.description || 'Description not provided.',
    };
  });

  return (
    <section className="py-6">
      <div className="p-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="p-4 mb-4 text-center"
        >
          <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
          {shortDescription && (
            <p className="text-gray-300 mt-2 text-sm sm:text-base">{shortDescription}</p>
          )}
        </motion.div>

        {/* Grid of cards */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
                className="relative overflow-hidden group/card
                  bg-black/50 backdrop-blur-xl
                  border border-gray-700/50 rounded-xl
                  shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                  p-6 h-32
                  transition-all duration-500
                  hover:scale-105 hover:bg-black/60
                  cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

                <div className="relative z-10 flex items-start gap-4 h-full">
                  <div
                    className="flex-shrink-0 w-12 h-12 
                    bg-gray-800/50 backdrop-blur-md
                    border border-gray-600/50 rounded-lg
                    flex items-center justify-center
                    text-gray-200
                    transition-all duration-300
                    group-hover/card:bg-gray-700/50 group-hover/card:text-white
                    group-hover/card:scale-110"
                  >
                    {item.icon}
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                      {item.heading}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center">No overview items available.</p>
        )}
      </div> {/* ✅ fixed missing div */}
    </section>
  );
}
