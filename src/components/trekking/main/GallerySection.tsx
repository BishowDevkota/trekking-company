"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image"; // Import Image from next/image

interface GalleryProps {
  title?: string;
  shortDescription?: string;
  images: { src: string; alt: string; caption?: string }[];
}

const GallerySection: React.FC<GalleryProps> = ({ images, title, shortDescription }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  const showImage = (index: number) => {
    const newIndex = (index + images.length) % images.length;
    setCurrentIndex(newIndex);
  };

  return (
    <section className="py-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {images.map((img, index) => (
          <motion.figure
            key={index}
            className="relative overflow-hidden rounded-xl cursor-pointer bg-black/50 backdrop-blur-md border border-gray-700/50 shadow-lg"
            whileHover={{ scale: 1.03 }}
            onClick={() => openLightbox(index)}
          >
            <img
              src={img.src}
              alt={img.alt}
              width={400} // Adjust based on your layout needs
              height={192} // Matches h-48 (48 * 4 = 192px in Tailwind)
              className="w-full h-48 object-cover rounded-xl"
            />
            {img.caption && (
              <figcaption className="absolute bottom-2 left-2 text-white text-sm bg-black/40 px-2 py-1 rounded">
                {img.caption}
              </figcaption>
            )}
          </motion.figure>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col justify-center items-center p-4"
          >
            <X
              className="absolute top-6 right-6 text-white w-10 h-10 cursor-pointer"
              onClick={closeLightbox}
            />
            <img
              key={images[currentIndex].src}
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              width={1200} // Adjust based on max-w-[90vw]
              height={720} // Adjust based on max-h-[80vh]
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
            />

            {/* Navigation Arrows */}
            <ChevronLeft
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 cursor-pointer"
              onClick={() => showImage(currentIndex - 1)}
            />
            <ChevronRight
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 cursor-pointer"
              onClick={() => showImage(currentIndex + 1)}
            />

            {/* Thumbnails */}
            <div className="absolute bottom-6 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.src}
                  alt={img.alt}
                  width={64} // Matches w-16 (16 * 4 = 64px in Tailwind)
                  height={64} // Matches h-16
                  className={`h-16 w-16 object-cover rounded cursor-pointer border-2 ${
                    idx === currentIndex ? "border-white" : "border-transparent"
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;