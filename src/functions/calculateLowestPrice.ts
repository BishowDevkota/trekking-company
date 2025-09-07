// src/functions/calculateLowestPrice.ts
import { Trek } from "@/types/trekking";

export function getLowestPrice(trek: Trek): number | null {
  if (!trek?.pricing || trek.pricing.length === 0) return null;

  return trek.pricing.reduce((min, item) => {
    const price = Number(item.price);
    return price < min ? price : min;
  }, Number.MAX_VALUE);
}
