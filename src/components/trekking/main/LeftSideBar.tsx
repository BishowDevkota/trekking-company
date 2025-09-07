'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, MapPin, Loader2, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Heading {
  id: string;
  text: string;
  level: number;
  element?: HTMLElement;
}

interface LeftSideBarProps {
  className?: string;
}

// Utility function to generate slug from text
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Utility function to format route title
const formatRouteTitle = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  
  if (!lastSegment) return 'Trekking Guide';
  
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const LeftSideBar: React.FC<LeftSideBarProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Extract headings from the current page
  const extractHeadings = useCallback((): Heading[] => {
    const headingElements = document.querySelectorAll('main h2, article h2, .content h2');
    
    return Array.from(headingElements).map((element, index) => {
      const headingElement = element as HTMLHeadingElement;
      let id = headingElement.id;
      
      // Generate ID if not present
      if (!id) {
        id = generateSlug(headingElement.textContent || `heading-${index}`);
        headingElement.id = id;
      }
      
      return {
        id,
        text: headingElement.textContent?.trim() || '',
        level: 2,
        element: headingElement
      };
    }).filter(heading => heading.text); // Filter out empty headings
  }, []);

  // Load headings with retry mechanism
  useEffect(() => {
    let retries = 0;
    const maxRetries = 10; // Retry up to 10 times (1 second total)
    const retryInterval = 1000; // Retry every 100ms

    const loadHeadings = () => {
      const extractedHeadings = extractHeadings();
      setHeadings(extractedHeadings);

      // Set first heading as active if available
      if (extractedHeadings.length > 0) {
        setActiveHeading(extractedHeadings[0].id);
        setLoading(false);
      } else if (retries < maxRetries) {
        // If no headings found and retries remain, try again
        retries += 1;
        setTimeout(loadHeadings, retryInterval);
      } else {
        // No headings found after max retries
        setActiveHeading('');
        setLoading(false);
      }
    };

    setLoading(true);
    loadHeadings();

    // Cleanup not needed for setTimeout as it’s managed within loadHeadings
  }, [pathname, extractHeadings]);

  // Set up Intersection Observer for active heading detection
  useEffect(() => {
    if (headings.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
      rootMargin: '-20% 0% -80% 0%',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all heading elements
    headings.forEach((heading) => {
      if (heading.element) {
        observer.observe(heading.element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  // Handle heading click
  const handleHeadingClick = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      // Smooth scroll to heading
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update active heading
      setActiveHeading(headingId);
      
      // Update URL hash without triggering page reload
      if (typeof window !== 'undefined') {
        window.history.replaceState(
          null,
          '',
          `${pathname}#${headingId}`
        );
      }
    }
    setIsMenuOpen(false); // Close mobile menu on click
  };

  // Handle initial hash on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      if (hash && headings.some(h => h.id === hash)) {
        setActiveHeading(hash);
        // Scroll to element after a brief delay
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    }
  }, [headings]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const currentPageTitle = formatRouteTitle(pathname);

  return (
    <>
      {/* Mobile Hamburger Button - Simple Black Glass */}
      <motion.button
        onClick={toggleMenu}
        className="
          md:hidden fixed top-6 left-6 z-50
          w-12 h-12 
          bg-black/70 backdrop-blur-xl
          border border-gray-700/50 rounded-xl
          shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
          flex flex-col items-center justify-center
          transition-all duration-300
          hover:bg-black/80 hover:scale-105
          active:scale-95
        "
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle table of contents"
      >
        <motion.span
          className="w-5 h-0.5 bg-gray-300 mb-1 rounded-full"
          animate={{
            rotate: isMenuOpen ? 45 : 0,
            y: isMenuOpen ? 3 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="w-5 h-0.5 bg-gray-300 mb-1 rounded-full"
          animate={{
            opacity: isMenuOpen ? 0 : 1,
            x: isMenuOpen ? -20 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
        <motion.span
          className="w-5 h-0.5 bg-gray-300 rounded-full"
          animate={{
            rotate: isMenuOpen ? -45 : 0,
            y: isMenuOpen ? -3 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </motion.button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Simple Black Glass */}
      <motion.aside
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className={`
          hidden md:block
          group relative
          w-[90%] left-[10%] max-h-[80vh]
          bg-black/50 backdrop-blur-xl
          border border-gray-700/50 rounded-2xl
          shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
          sticky top-[100px]
          z-10
          overflow-y-auto overflow-x-hidden
          custom-scrollbar
          transition-all duration-500
          hover:scale-105
          ${className}
        `}
      >
        <div className="relative p-6">
          {/* Shimmer Overlay on container */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
          </div>

          {/* Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Table of Contents
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-100">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate font-medium">{currentPageTitle}</span>
            </div>
            <div className="mt-1 text-xs text-gray-300 truncate">
              {pathname}
            </div>
          </div>

          {/* Navigation */}
          <nav className="relative z-10 mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-100" />
                <span className="ml-2 text-sm text-gray-100">Loading headings...</span>
              </div>
            ) : headings.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-gray-200 uppercase tracking-wide font-medium mb-3 px-1">
                  On This Page
                </div>
                {headings.map((heading, index) => (
                  <motion.button
                    key={heading.id}
                    onClick={() => handleHeadingClick(heading.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg
                      text-sm relative overflow-hidden
                      transition-all duration-300
                      group/item
                      ${activeHeading === heading.id
                        ? 'bg-gray-800/50 text-white shadow-lg'
                        : 'text-gray-100 hover:text-white hover:bg-gray-800/50 hover:shadow-lg'
                      }
                    `}
                    aria-label={`Navigate to ${heading.text}`}
                  >
                    {/* Individual Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-800 ease-in-out pointer-events-none"></div>
                    <div className="relative z-10 flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 ${
                        activeHeading === heading.id
                          ? 'bg-gray-200 text-gray-800'
                          : 'bg-gray-700 text-gray-300 group-hover/item:bg-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium leading-relaxed transition-transform duration-300 group-hover/item:scale-[1.03]">
                          {heading.text}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-300 mt-1">
                          <Hash className="w-3 h-3" />
                          <span className="truncate">{heading.id}</span>
                        </div>
                      </div>
                      {activeHeading === heading.id && (
                        <ChevronRight className="w-4 h-4 text-gray-200 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-100 mb-3">
                </div>
                <div className="text-sm font-medium text-gray-100 mb-1">
                  No headings found
                </div>
                <div className="text-xs text-gray-300 max-w-48 mx-auto leading-relaxed">
                  Add H2 headings to your page content to see them appear here
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          {!loading && headings.length > 0 && (
            <div className="relative z-10 p-4 border-t border-gray-700/50">
              <div className="text-xs text-gray-300 text-center">
                {headings.length} heading{headings.length !== 1 ? 's' : ''} • {currentPageTitle}
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Mobile Sliding Sidebar - Simple Black Glass */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="
              md:hidden fixed left-0 top-0 h-full w-80 max-w-[85vw]
              bg-black/50 backdrop-blur-xl
              border-r border-gray-700/50
              shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
              z-40
              overflow-y-auto overflow-x-hidden
              custom-scrollbar
            "
          >
            <div className="relative p-6 pt-20">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Table of Contents
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-100">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate font-medium">{currentPageTitle}</span>
              </div>
              <div className="mt-1 text-xs text-gray-300 truncate">
                {pathname}
              </div>

              {/* Navigation */}
              <nav className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-100" />
                    <span className="ml-2 text-sm text-gray-100">Loading headings...</span>
                  </div>
                ) : headings.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-200 uppercase tracking-wide font-medium mb-3 px-1">
                      On This Page
                    </div>
                    {headings.map((heading, index) => (
                      <motion.button
                        key={`mobile-${heading.id}`}
                        onClick={() => handleHeadingClick(heading.id)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`
                          w-full text-left px-4 py-3 rounded-lg
                          text-sm relative overflow-hidden
                          transition-all duration-300
                          group/item
                          ${activeHeading === heading.id
                            ? 'bg-gray-800/50 text-white shadow-lg'
                            : 'text-gray-100 hover:text-white hover:bg-gray-800/50 hover:shadow-lg'
                          }
                        `}
                        aria-label={`Navigate to ${heading.text}`}
                      >
                        {/* Individual Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-800 ease-in-out pointer-events-none"></div>
                        <div className="relative z-10 flex items-start gap-3">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 ${
                            activeHeading === heading.id
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-gray-700 text-gray-300 group-hover/item:bg-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium leading-relaxed transition-transform duration-300 group-hover/item:scale-[1.02]">
                              {heading.text}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-300 mt-1">
                              <Hash className="w-3 h-3" />
                              <span className="truncate">{heading.id}</span>
                            </div>
                          </div>
                          {activeHeading === heading.id && (
                            <ChevronRight className="w-4 h-4 text-gray-200 flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-100 mb-3">
                    </div>
                    <div className="text-sm font-medium text-gray-100 mb-1">
                      No headings found
                    </div>
                    <div className="text-xs text-gray-300 max-w-48 mx-auto leading-relaxed">
                      Add H2 headings to your page content to see them appear here
                    </div>
                  </div>
                )}
              </nav>

              {/* Footer */}
              {!loading && headings.length > 0 && (
                <div className="p-4 border-t border-gray-700/50">
                  <div className="text-xs text-gray-300 text-center">
                    {headings.length} heading{headings.length !== 1 ? 's' : ''} • {currentPageTitle}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeftSideBar;