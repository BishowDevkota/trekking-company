// src/app/admin/trekking/[region]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Trek } from '@/types/trekking';
import { Toaster, toast } from 'react-hot-toast';
import ImageUpload from '@/components/admin/imageUpload/ImageUpload';
import { FaTrash } from 'react-icons/fa';

export default function AdminRegionTreks() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [newTrek, setNewTrek] = useState({ name: '', description: '', image: '', keywords: [] as string[] });
  const router = useRouter();
  const params = useParams();
  const region = params.region as string;

  useEffect(() => {
    fetchTreks();
  }, [region]);

  const fetchTreks = async () => {
    try {
      const response = await fetch(`/api/trekking/${region}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setTreks(data);
        } else {
          console.error('Failed to fetch treks:', data);
          toast.error(`Failed to fetch treks: ${data.error || 'Unknown error'}`);
          setTreks([]);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch treks:', errorData);
        toast.error(`Failed to fetch treks: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching treks:', error);
      toast.error(`Error fetching treks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreate = async () => {
    if (!newTrek.name.trim()) {
      toast.error('Trek name is required');
      return;
    }
    if (!newTrek.description.trim()) {
      toast.error('Trek description is required');
      return;
    }
    if (!newTrek.image) {
      toast.error('Trek image is required');
      return;
    }

    try {
      const response = await fetch(`/api/trekking/${region}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTrek.name.trim(),
          description: newTrek.description.trim(),
          image: newTrek.image,
          overview: [],
          itinerary: [],
          inclusions: [],
          exclusions: [],
          pricing: [],
          gallery: [{ src: newTrek.image, alt: newTrek.name, caption: newTrek.name }],
          faqs: [],
          keywords: newTrek.keywords.map(keyword => keyword.trim()).filter(keyword => keyword.length > 0)
        }),
      });

      if (response.ok) {
        setNewTrek({ name: '', description: '', image: '', keywords: [] });
        await fetchTreks();
        toast.success('Trek added successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to create trek:', errorData);
        if (errorData.details && Array.isArray(errorData.details)) {
          errorData.details.forEach((error: string) => toast.error(error));
        } else {
          toast.error(`Failed to create trek: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error creating trek:', error);
      toast.error(`Error creating trek: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this trek? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/trekking/${region}/${slug}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        await fetchTreks();
        toast.success('Trek deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete trek:', errorData);
        toast.error(`Failed to delete trek: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting trek:', error);
      toast.error(`Error deleting trek: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addKeyword = () => {
    setNewTrek({
      ...newTrek,
      keywords: [...newTrek.keywords, '']
    });
  };

  const updateKeyword = (keywordIndex: number, value: string) => {
    const updatedKeywords = [...newTrek.keywords];
    updatedKeywords[keywordIndex] = value;
    setNewTrek({ ...newTrek, keywords: updatedKeywords });
  };

  const deleteKeyword = (keywordIndex: number) => {
    const updatedKeywords = newTrek.keywords.filter((_, i) => i !== keywordIndex);
    setNewTrek({ ...newTrek, keywords: updatedKeywords });
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Manage Treks for {region.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h1>
        <button
          onClick={() => router.push('/admin/trekking')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
        >
          ← Back to Regions
        </button>
      </div>
      
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Add New Trek</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Trek Name"
            value={newTrek.name}
            onChange={(e) => setNewTrek({ ...newTrek, name: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <textarea
            placeholder="Trek Description"
            value={newTrek.description}
            onChange={(e) => setNewTrek({ ...newTrek, description: e.target.value })}
            className="border p-2 w-full rounded h-24"
            required
          />
          <ImageUpload
            key="new-trek-upload"
            instanceId="new-trek"
            onUpload={(url, oldUrl) => setNewTrek({ ...newTrek, image: url })}
            currentImage={newTrek.image}
            placeholder="Click to upload trek image"
            className="w-full"
          />
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">SEO Keywords</h3>
            <div className="space-y-2">
              {newTrek.keywords.map((keyword, keywordIndex) => (
                <div key={`new-trek-keyword-${keywordIndex}`} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword(keywordIndex, e.target.value)}
                    className="border p-2 rounded flex-1"
                    placeholder="Enter keyword"
                  />
                  <button
                    onClick={() => deleteKeyword(keywordIndex)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={addKeyword}
                className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                Add Keyword
              </button>
            </div>
          </div>
          <button 
            onClick={handleCreate} 
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 px-4 rounded transition-colors"
          >
            Add Trek
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treks.map((trek) => (
          <div key={trek._id.toString()} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="h-48 overflow-hidden">
              {trek.image && (
                <img 
                  src={trek.image} 
                  alt={trek.name} 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{trek.name}</h2>
              <p className="text-sm text-gray-600 mb-2 line-clamp-3">{trek.description}</p>
              {trek.keywords && trek.keywords.length > 0 && (
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Keywords:</strong> {trek.keywords.join(', ')}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/trekking/${region}/${trek.slug}`)}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 px-3 rounded text-sm transition-colors flex-1"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => handleDelete(trek.slug)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 px-3 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {treks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No treks found for this region. Add your first trek above.
        </div>
      )}
    </div>
  );
}