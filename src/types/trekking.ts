// types/trekking.ts
export interface Region {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  keywords: string[]; // Added keywords field
}

export interface Trek {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  overview: { icon: string; heading: string; description: string }[];
  itinerary: { heading: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  pricing: { minPersons: number; maxPersons: number; price: number }[];
  gallery: { src: string; alt: string; caption: string }[];
  faqs: { question: string; answer: string }[];
  keywords: string[]; // Added keywords field
}