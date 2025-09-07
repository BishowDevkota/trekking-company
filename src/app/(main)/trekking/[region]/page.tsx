'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Trek } from '@/types/trekking';
import GlassCard from '@/components/cards/GlassCard';
import { getLowestPrice } from '@/functions/calculateLowestPrice';

export default function RegionTreks() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const params = useParams();
  const region = params.region as string;

  useEffect(() => {
    fetch(`/api/trekking/${region}`)
      .then((res) => res.json())
      .then((data) => setTreks(data));
  }, [region]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Treks in {region.replace(/-/g, ' ')}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treks.map((trek) => {
          const lowestPrice = getLowestPrice(trek);
          return (
            <GlassCard
              key={trek._id}
              image={trek.image}
              title={trek.name}
              ctaLink={`/trekking/${region}/${trek.slug}`}
              ctaLabel="View"
              description={trek.description}
              topLeft={`${trek.itinerary.length} Days`}
              topRight="10% OFF"
              price={lowestPrice ?? 100} // fallback if no price
            />
          );
        })}
      </div>
    </div>
  );
}
