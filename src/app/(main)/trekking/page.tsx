'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import GlassCard from '@/components/cards/GlassCard';

interface Region {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  elevation?: string;
  difficulty?: string;
  duration?: string;
  bestSeason?: string;
}

// Structured Data Schema
const generateStructuredData = (regions: Region[]) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Trekking Regions in Nepal | Best Trekking Destinations",
  "description": "Explore Nepal's top trekking regions, including Everest, Annapurna, and Langtang. Discover stunning trails, vibrant cultures, and unforgettable adventures.",
  "url": "https://yourdomain.com/trekking",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Nepal Trekking Regions",
    "numberOfItems": regions.length,
    "itemListElement": regions.map((region, index) => ({
      "@type": "Place",
      "position": index + 1,
      "name": region.name,
      "description": region.description,
      "url": `https://yourdomain.com/trekking/${region.slug}`,
      "image": region.image,
      "geo": {
        "@type": "GeoCoordinates",
        "addressCountry": "Nepal"
      }
    }))
  }
});

export default function TrekkingRegions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trekking')
      .then((res) => res.json())
      .then((data) => {
        setRegions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching regions:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* SEO Head */}
      <Head>
        <title>Nepal Trekking Regions | Ultimate Guide 2025</title>
        <meta
          name="description"
          content="Discover Nepal's most spectacular trekking regions including Everest Base Camp, Annapurna Circuit, Langtang Valley & more. Complete guide with routes, difficulty levels, and best seasons."
        />
        <link rel="canonical" href="https://yourdomain.com/trekking" />
        {regions.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateStructuredData(regions))
            }}
          />
        )}
      </Head>

      <main className="bg-white text-gray-800">


        {/* Hero */}
        <header className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trekking Regions of Nepal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From Everest Base Camp to the hidden valleys of Langtang,
            each trekking region in Nepal offers unique adventures,
            cultural encounters, and breathtaking mountain landscapes.
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
          </div>
        )}

        {/* Regions */}
        {!loading && regions.length > 0 && (
          <section className="container mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regions.map((region) => (
                <article key={region._id} >
                  <GlassCard
                    image={region.image}
                    title={region.name}
                    ctaLink={`/trekking/${region.slug}`}
                    ctaLabel="Explore Region"
                    description={region.description}
                    altText={`Trekking in ${region.name} Nepal`}
                  />
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gray-50 py-12 text-center border-t">
          <h2 className="text-2xl font-bold mb-4">Plan Your Trek in Nepal</h2>
          <p className="text-gray-600 mb-6">
            Get expert guidance and start your Himalayan adventure today.
          </p>
          <Link
            href="/contact"
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-black transition"
          >
            Contact Us
          </Link>
        </section>
      </main>
    </>
  );
}
