'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { Trek } from '@/types/trekking';
import { useTrekkingContext } from '@/context/TrekkingContext';
import OverviewSection from '@/components/trekking/main/Overview';
import GlassSeparator from '@/components/trekking/main/GlassSeperator';
import ItinerarySection from '@/components/trekking/main/ItinerarySection';
import IncludeExcludeSection from '@/components/trekking/main/IncludeAndExcludeSection';
import HowMardiTreksHelpsSection from '@/components/trekking/main/HowMardiTreksHelpSection';
import GallerySection from '@/components/trekking/main/GallerySection';
import FAQSection from '@/components/trekking/main/FAQSection';
import ContactForm from '@/components/contact/ContactForm';
import PricingSection from '@/components/trekking/main/PricingSection';

export default function TrekPage() {
  const { setSiteTitle, setBackgroundImage, setCurrentRoute } = useTrekkingContext();
  const [trek, setTrek] = useState<Trek | null>(null);
  const params = useParams();
  const region = params.region as string;
  const trekSlug = params.trek as string;

  useEffect(() => {
    fetch(`/api/trekking/${region}/${trekSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setTrek(data);
        setSiteTitle(data.name);
        setBackgroundImage(data.gallery[0]?.src || '/images/default-bg.jpg');
        setCurrentRoute(`${region}/${trekSlug}`);
      });
  }, [region, trekSlug, setSiteTitle, setBackgroundImage, setCurrentRoute]);

  if (!trek) return <div>Loading...</div>;

  return (
    <>
      <OverviewSection
        title={`Overview for ${trek.name}`}
        shortDescription="Explore the adventure of a lifetime."
        info={trek.overview}
      />
      <GlassSeparator />
      <ItinerarySection
        title={`${trek.name} Itinerary`}
        shortDescription={`Discover the detailed, day-by-day journey that takes you all the way to ${trek.name}, with every step filled with adventure and breathtaking views.`}
        items={trek.itinerary}
      />
      <GlassSeparator />
      <IncludeExcludeSection
        title={`${trek.name} Inclusions & Exclusions`}
        shortInfo="What's covered and what's not in your trekking package."
        included={trek.inclusions}
        excluded={trek.exclusions}
      />
      <GlassSeparator />
      <HowMardiTreksHelpsSection />
      <GlassSeparator />
      <GallerySection
        title={`${trek.name} Gallery`}
        shortDescription={`Discover the beauty of ${trek.name} through stunning images.`}
        images={trek.gallery}
      />
      <GlassSeparator />
      <FAQSection
        title="Frequently Asked Questions"
        shortDescription={`Got questions about the ${trek.name}? We’ve gathered the most common queries from trekkers and answered them here to help you prepare with confidence.`}
        items={trek.faqs}
      />
      <GlassSeparator />
      <ContactForm />
      <GlassSeparator />
      <PricingSection
        title={`${trek.name} Pricing`}
        pricing={trek.pricing}
      />
    </>
  );
}