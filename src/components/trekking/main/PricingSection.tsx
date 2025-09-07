import { PricingItem } from '@/types/trekking';

interface PricingSectionProps {
  title: string;
  pricing: PricingItem[];
}

export default function PricingSection({ title, pricing }: PricingSectionProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pricing.map((item, index) => (
            <div key={index} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">
                {item.minPersons === item.maxPersons
                  ? `${item.minPersons} Person`
                  : `${item.minPersons}-${item.maxPersons} Persons`}
              </h3>
              <p className="text-xl font-bold">${item.price}/person</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}