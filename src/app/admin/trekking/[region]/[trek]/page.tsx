// src/app/admin/trekking/[region]/[trek]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trek } from '@/types/trekking';
import * as FaIcons from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import ImageUpload from '@/components/admin/imageUpload/ImageUpload';

export default function AdminTrekDetails() {
  const [trek, setTrek] = useState<Trek | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const region = params.region as string;
  const trekSlug = params.trek as string;

  const iconOptions = Object.keys(FaIcons).filter((key) => key.startsWith('Fa'));

  useEffect(() => {
    fetchTrek();
  }, [region, trekSlug]);

  const fetchTrek = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/trekking/${region}/${trekSlug}`);
      if (response.ok) {
        const data = await response.json();
        setTrek(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch trek:', errorData);
        toast.error(`Failed to fetch trek: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching trek:', error);
      toast.error(`Error fetching trek: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!trek) return;
    
    if (!trek.name.trim()) {
      toast.error('Trek name is required');
      return;
    }
    if (!trek.description.trim()) {
      toast.error('Trek description is required');
      return;
    }
    if (!trek.image) {
      toast.error('Trek image is required');
      return;
    }

    const invalidOverview = trek.overview.some(
      (item) => !item.icon || !item.heading || !item.description
    );
    if (invalidOverview) {
      toast.error('All fields are required in Overview');
      return;
    }
    const invalidIcons = trek.overview.filter((item) => item.icon && !iconOptions.includes(item.icon.trim()));
    if (invalidIcons.length > 0) {
      toast.error(`Invalid icon(s): ${invalidIcons.map((item) => item.icon).join(', ')}`);
      return;
    }

    const invalidItinerary = trek.itinerary.some(
      (item) => !item.heading || !item.description
    );
    if (invalidItinerary) {
      toast.error('All fields are required in Itinerary');
      return;
    }

    const invalidInclusions = trek.inclusions.some((item) => !item.trim());
    if (invalidInclusions) {
      toast.error('All fields are required in Inclusions');
      return;
    }

    const invalidExclusions = trek.exclusions.some((item) => !item.trim());
    if (invalidExclusions) {
      toast.error('All fields are required in Exclusions');
      return;
    }

    const isPricingValid = trek.pricing.every(
      (item) => item.minPersons > 0 && item.maxPersons >= item.minPersons && item.price >= 0
    );
    if (!isPricingValid) {
      toast.error('Invalid pricing data: Ensure minPersons > 0, maxPersons >= minPersons, and price >= 0');
      return;
    }

    const invalidGallery = trek.gallery.some(
      (item) => !item.src || !item.alt || !item.caption
    );
    if (invalidGallery) {
      toast.error('All fields in Gallery must be filled');
      return;
    }

    const invalidFAQs = trek.faqs.some(
      (item) => !item.question || !item.answer
    );
    if (invalidFAQs) {
      toast.error('All fields are required in FAQs');
      return;
    }

    try {
      const trimmedTrek = {
        ...trek,
        name: trek.name.trim(),
        description: trek.description.trim(),
        overview: trek.overview.map((item) => ({
          ...item,
          icon: item.icon ? item.icon.trim() : item.icon,
          heading: item.heading.trim(),
          description: item.description.trim(),
        })),
        itinerary: trek.itinerary.map((item) => ({
          ...item,
          heading: item.heading.trim(),
          description: item.description.trim(),
        })),
        inclusions: trek.inclusions.map((item) => item.trim()),
        exclusions: trek.exclusions.map((item) => item.trim()),
        gallery: trek.gallery.map((item) => ({
          ...item,
          src: item.src.trim(),
          alt: item.alt.trim(),
          caption: item.caption.trim(),
        })),
        faqs: trek.faqs.map((item) => ({
          ...item,
          question: item.question.trim(),
          answer: item.answer.trim(),
        })),
        keywords: trek.keywords ? trek.keywords.map(keyword => keyword.trim()).filter(keyword => keyword.length > 0) : []
      };

      const response = await fetch(`/api/trekking/${region}/${trekSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmedTrek),
      });

      if (response.ok) {
        await fetchTrek();
        toast.success('Trek updated successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to update trek:', errorData);
        if (errorData.details && Array.isArray(errorData.details)) {
          errorData.details.forEach((error: string) => toast.error(error));
        } else {
          toast.error(`Failed to update trek: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error updating trek:', error);
      toast.error(`Error updating trek: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addPricingRow = () => {
    if (!trek) return;
    setTrek({
      ...trek,
      pricing: [...trek.pricing, { minPersons: 1, maxPersons: 1, price: 0 }],
    });
  };

  const deletePricingRow = (index: number) => {
    if (!trek) return;
    setTrek({
      ...trek,
      pricing: trek.pricing.filter((_, i) => i !== index),
    });
  };

  const addOverviewRow = () => {
    if (!trek) return;
    setTrek({
      ...trek,
      overview: [...trek.overview, { heading: '', description: '', icon: 'FaRocket' }],
    });
  };

  const deleteOverviewRow = (index: number) => {
    if (!trek) return;
    setTrek({
      ...trek,
      overview: trek.overview.filter((_, i) => i !== index),
    });
  };

  const addItineraryRow = () => {
    if (!trek) return;
    setTrek({
      ...trek,
      itinerary: [...trek.itinerary, { heading: '', description: '' }],
    });
  };

  const deleteItineraryRow = (index: number) => {
    if (!trek) return;
    setTrek({
      ...trek,
      itinerary: trek.itinerary.filter((_, i) => i !== index),
    });
  };

  const addInclusionRow = () => {
    if (!trek) return;
    setTrek({
      ...trek,
      inclusions: [...trek.inclusions, ''],
    });
  };

  const deleteInclusionRow = (index: number) => {
    if (!trek) return;
    setTrek({
      ...trek,
      inclusions: trek.inclusions.filter((_, i) => i !== index),
    });
  };

  const addExclusionRow = () => {
    if (!trek) return;
    setTrek({
      ...trek,
      exclusions: [...trek.exclusions, ''],
    });
  };

  const deleteExclusionRow = (index: number) => {
    if (!trek) return;
    setTrek({
      ...trek,
      exclusions: trek.exclusions.filter((_, i) => i !== index),
    });
  };

  const addGalleryRow = () => {
    if (!trek) return;
    setTrek({
      ...trek,
      gallery: [...trek.gallery, { src: '', alt: '', caption: '' }],
    });
  };

  const deleteGalleryRow = async (index: number) => {
    if (!trek) return;
    const imageUrl = trek.gallery[index].src;
    if (imageUrl) {
      try {
        const response = await fetch(`/api/trekking/${region}/${trekSlug}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`Failed to delete gallery image: ${errorData.error || 'Unknown error'}`);
          return;
        }
      } catch (error) {
        console.error('Error deleting gallery image:', error);
        toast.error(`Error deleting gallery image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      }
    }

    setTrek({
      ...trek,
      gallery: trek.gallery.filter((_, i) => i !== index),
    });
  };

  const addFAQRow = () => {
    if (!trek) return;
    setTrek({
      ...trek,
      faqs: [...trek.faqs, { question: '', answer: '' }],
    });
  };

  const deleteFAQRow = (index: number) => {
    if (!trek) return;
    setTrek({
      ...trek,
      faqs: trek.faqs.filter((_, i) => i !== index),
    });
  };

  const addKeywordRow = () => {
    if (!trek) return;
    setTrek({
      ...trek,
      keywords: [...(trek.keywords || []), '']
    });
  };

  const deleteKeywordRow = (index: number) => {
    if (!trek) return;
    setTrek({
      ...trek,
      keywords: (trek.keywords || []).filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!trek) {
    return <div className="container mx-auto p-4">Trek not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Edit Trek: {trek.name}
        </h1>
        <button
          onClick={() => router.push(`/admin/trekking/${region}`)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
        >
          ← Back to Treks
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={trek.name}
              onChange={(e) => setTrek({ ...trek, name: e.target.value })}
              className="border p-2 w-full rounded"
              placeholder="Trek Name"
              required
            />
            <textarea
              value={trek.description}
              onChange={(e) => setTrek({ ...trek, description: e.target.value })}
              className="border p-2 w-full rounded h-24"
              placeholder="Trek Description"
              required
            />
            <ImageUpload
              key={`trek-${trekSlug}-main`}
              instanceId={`trek-${trekSlug}-main`}
              onUpload={(url, oldUrl) => setTrek({ ...trek, image: url })}
              currentImage={trek.image}
              placeholder="Click to upload main trek image"
              className="w-full"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">SEO Keywords</h2>
          <div className="space-y-3">
            {(trek.keywords || []).map((keyword, index) => (
              <div key={`keyword-${index}`} className="flex gap-3 items-center p-3 bg-gray-50 rounded">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    const newKeywords = [...(trek.keywords || [])];
                    newKeywords[index] = e.target.value;
                    setTrek({ ...trek, keywords: newKeywords });
                  }}
                  className="border p-2 rounded flex-1"
                  placeholder="Enter keyword"
                />
                <button
                  onClick={() => deleteKeywordRow(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addKeywordRow}
              className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Add Keyword
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="space-y-3">
            {trek.overview.map((item, index) => (
              <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Icon</label>
                  <select
                    value={item.icon}
                    onChange={(e) => {
                      const newOverview = [...trek.overview];
                      newOverview[index].icon = e.target.value;
                      setTrek({ ...trek, overview: newOverview });
                    }}
                    className="border p-2 rounded w-48"
                    required
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-gray-600 mb-1">Heading</label>
                  <input
                    type="text"
                    value={item.heading}
                    onChange={(e) => {
                      const newOverview = [...trek.overview];
                      newOverview[index].heading = e.target.value;
                      setTrek({ ...trek, overview: newOverview });
                    }}
                    className="border p-2 rounded"
                    placeholder="Overview Heading"
                    required
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-gray-600 mb-1">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const newOverview = [...trek.overview];
                      newOverview[index].description = e.target.value;
                      setTrek({ ...trek, overview: newOverview });
                    }}
                    className="border p-2 rounded h-20"
                    placeholder="Overview Description"
                    required
                  />
                </div>
                <button
                  onClick={() => deleteOverviewRow(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors mt-6"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addOverviewRow}
              className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Add Overview Item
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
          <div className="space-y-3">
            {trek.itinerary.map((item, index) => (
              <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded">
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-gray-600 mb-1">Heading</label>
                  <input
                    type="text"
                    value={item.heading}
                    onChange={(e) => {
                      const newItinerary = [...trek.itinerary];
                      newItinerary[index].heading = e.target.value;
                      setTrek({ ...trek, itinerary: newItinerary });
                    }}
                    className="border p-2 rounded"
                    placeholder="Itinerary Heading"
                    required
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-gray-600 mb-1">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const newItinerary = [...trek.itinerary];
                      newItinerary[index].description = e.target.value;
                      setTrek({ ...trek, itinerary: newItinerary });
                    }}
                    className="border p-2 rounded h-20"
                    placeholder="Itinerary Description"
                    required
                  />
                </div>
                <button
                  onClick={() => deleteItineraryRow(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors mt-6"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addItineraryRow}
              className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Add Itinerary Item
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Inclusions</h2>
          <div className="space-y-3">
            {trek.inclusions.map((item, index) => (
              <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 rounded">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newInclusions = [...trek.inclusions];
                    newInclusions[index] = e.target.value;
                    setTrek({ ...trek, inclusions: newInclusions });
                  }}
                  className="border p-2 rounded flex-1"
                  placeholder="Inclusion Item"
                  required
                />
                <button
                  onClick={() => deleteInclusionRow(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addInclusionRow}
              className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Add Inclusion
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Exclusions</h2>
          <div className="space-y-3">
            {trek.exclusions.map((item, index) => (
              <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 rounded">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newExclusions = [...trek.exclusions];
                    newExclusions[index] = e.target.value;
                    setTrek({ ...trek, exclusions: newExclusions });
                  }}
                  className="border p-2 rounded flex-1"
                  placeholder="Exclusion Item"
                  required
                />
                <button
                  onClick={() => deleteExclusionRow(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addExclusionRow}
              className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Add Exclusion
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="space-y-3">
            {trek.pricing.map((item, index) => (
              <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 rounded">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Min Persons</label>
                  <input
                    type="number"
                    value={item.minPersons}
                    onChange={(e) => {
                      const newPricing = [...trek.pricing];
                      newPricing[index].minPersons = parseInt(e.target.value) || 1;
                      setTrek({ ...trek, pricing: newPricing });
                    }}
                    className="border p-2 rounded w-24"
                    min="1"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Max Persons</label>
                  <input
                    type="number"
                    value={item.maxPersons}
                    onChange={(e) => {
                      const newPricing = [...trek.pricing];
                      newPricing[index].maxPersons = parseInt(e.target.value) || 1;
                      setTrek({ ...trek, pricing: newPricing });
                    }}
                    className="border p-2 rounded w-24"
                    min={item.minPersons}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Price</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const newPricing = [...trek.pricing];
                      newPricing[index].price = parseFloat(e.target.value) || 0;
                      setTrek({ ...trek, pricing: newPricing });
                    }}
                    className="border p-2 rounded w-24"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <button
                  onClick={() => deletePricingRow(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors mt-6"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addPricingRow}
              className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Add Pricing
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Gallery</h2>
          <div className="space-y-3">
            {trek.gallery.map((item, index) => (
              <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Image</label>
                  <ImageUpload
                    key={`gallery-${index}`}
                    instanceId={`gallery-${trekSlug}-${index}`}
                    onUpload={(url, oldUrl) => {
                      const newGallery = [...trek.gallery];
                      newGallery[index].src = url;
                      setTrek({ ...trek, gallery: newGallery });
                    }}
                    currentImage={item.src}
                    placeholder="Click to upload gallery image"
                    className="w-48 h-32"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-gray-600 mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => {
                      const newGallery = [...trek.gallery];
                      newGallery[index].alt = e.target.value;
                      setTrek({ ...trek, gallery: newGallery });
                    }}
                    className="border p-2 rounded"
                    placeholder="Image Alt Text"
                    required
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-gray-600 mb-1">Caption</label>
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) => {
                      const newGallery = [...trek.gallery];
                      newGallery[index].caption = e.target.value;
                      setTrek({ ...trek, gallery: newGallery });
                    }}
                    className="border p-2 rounded"
                    placeholder="Image Caption"
                    required
                  />
                </div>
                <button
                  onClick={() => deleteGalleryRow(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors mt-6"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addGalleryRow}
              className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Add Gallery Image
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">FAQs</h2>
          <div className="space-y-3">
            {trek.faqs.map((item, index) => (
              <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded">
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-gray-600 mb-1">Question</label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const newFAQs = [...trek.faqs];
                      newFAQs[index].question = e.target.value;
                      setTrek({ ...trek, faqs: newFAQs });
                    }}
                    className="border p-2 rounded"
                    placeholder="FAQ Question"
                    required
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-gray-600 mb-1">Answer</label>
                  <textarea
                    value={item.answer}
                    onChange={(e) => {
                      const newFAQs = [...trek.faqs];
                      newFAQs[index].answer = e.target.value;
                      setTrek({ ...trek, faqs: newFAQs });
                    }}
                    className="border p-2 rounded h-20"
                    placeholder="FAQ Answer"
                    required
                  />
                </div>
                <button
                  onClick={() => deleteFAQRow(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors mt-6"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addFAQRow}
              className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Add FAQ
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 px-4 rounded transition-colors flex-1"
          >
            Save Changes
          </button>
          <button
            onClick={() => router.push(`/admin/trekking/${region}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 px-4 rounded transition-colors flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}