// src/app/admin/trekking/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Region } from '@/types/trekking';
import { Toaster, toast } from 'react-hot-toast';
import ImageUpload from '@/components/admin/imageUpload/ImageUpload';
import { FaTrash } from 'react-icons/fa';

interface EditingRegion extends Region {
  isEditing: boolean;
}

export default function AdminTrekking() {
  const [regions, setRegions] = useState<EditingRegion[]>([]);
  const [newRegion, setNewRegion] = useState({ name: '', description: '', image: '', keywords: [] as string[] });
  const router = useRouter();

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await fetch('/api/trekking');
      if (response.ok) {
        const data = await response.json();
        setRegions(data.map((region: Region) => ({ ...region, isEditing: false })));
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch regions:', errorData);
        toast.error(`Failed to fetch regions: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
      toast.error(`Error fetching regions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreate = async () => {
    if (!newRegion.name.trim()) {
      toast.error('Region name is required');
      return;
    }
    if (!newRegion.description.trim()) {
      toast.error('Region description is required');
      return;
    }
    if (!newRegion.image) {
      toast.error('Region image is required');
      return;
    }

    try {
      const response = await fetch('/api/trekking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRegion.name.trim(),
          description: newRegion.description.trim(),
          image: newRegion.image,
          keywords: newRegion.keywords.map(keyword => keyword.trim()).filter(keyword => keyword.length > 0)
        }),
      });

      if (response.ok) {
        setNewRegion({ name: '', description: '', image: '', keywords: [] });
        await fetchRegions();
        toast.success('Region added successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to create region:', errorData);
        if (errorData.details && Array.isArray(errorData.details)) {
          errorData.details.forEach((error: string) => toast.error(error));
        } else {
          toast.error(`Failed to create region: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error creating region:', error);
      toast.error(`Error creating region: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (index: number) => {
    const updatedRegions = [...regions];
    updatedRegions[index].isEditing = true;
    setRegions(updatedRegions);
  };

  const handleSave = async (index: number) => {
    const region = regions[index];

    if (!region.name.trim()) {
      toast.error('Region name is required');
      return;
    }
    if (!region.description.trim()) {
      toast.error('Region description is required');
      return;
    }
    if (!region.image) {
      toast.error('Region image is required');
      return;
    }

    try {
      const response = await fetch('/api/trekking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: region._id,
          name: region.name.trim(),
          description: region.description.trim(),
          image: region.image,
          keywords: region.keywords ? region.keywords.map(keyword => keyword.trim()).filter(keyword => keyword.length > 0) : []
        }),
      });

      if (response.ok) {
        const updatedRegions = [...regions];
        updatedRegions[index].isEditing = false;
        setRegions(updatedRegions);
        toast.success('Region updated successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to update region:', errorData);
        if (errorData.details && Array.isArray(errorData.details)) {
          errorData.details.forEach((error: string) => toast.error(error));
        } else {
          toast.error(`Failed to update region: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error updating region:', error);
      toast.error(`Error updating region: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = (index: number) => {
    fetchRegions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this region? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/trekking', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchRegions();
        toast.success('Region deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete region:', errorData);
        toast.error(`Failed to delete region: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting region:', error);
      toast.error(`Error deleting region: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateRegionField = (index: number, field: keyof EditingRegion, value: string | string[]) => {
    const updatedRegions = [...regions];
    updatedRegions[index][field] = value;
    setRegions(updatedRegions);
  };

  const handleNewRegionImageUpload = (url: string, oldUrl?: string) => {
    setNewRegion({ ...newRegion, image: url });
  };

  const addKeyword = (index: number | null) => {
    if (index === null) {
      setNewRegion({
        ...newRegion,
        keywords: [...newRegion.keywords, '']
      });
    } else {
      const updatedRegions = [...regions];
      updatedRegions[index].keywords = [...(updatedRegions[index].keywords || []), ''];
      setRegions(updatedRegions);
    }
  };

  const updateKeyword = (index: number | null, keywordIndex: number, value: string) => {
    if (index === null) {
      const updatedKeywords = [...newRegion.keywords];
      updatedKeywords[keywordIndex] = value;
      setNewRegion({ ...newRegion, keywords: updatedKeywords });
    } else {
      const updatedRegions = [...regions];
      updatedRegions[index].keywords[keywordIndex] = value;
      setRegions(updatedRegions);
    }
  };

  const deleteKeyword = (index: number | null, keywordIndex: number) => {
    if (index === null) {
      const updatedKeywords = newRegion.keywords.filter((_, i) => i !== keywordIndex);
      setNewRegion({ ...newRegion, keywords: updatedKeywords });
    } else {
      const updatedRegions = [...regions];
      updatedRegions[index].keywords = updatedRegions[index].keywords.filter((_, i) => i !== keywordIndex);
      setRegions(updatedRegions);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Manage Trekking Regions</h1>

      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Add New Region</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Region Name"
            value={newRegion.name}
            onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <textarea
            placeholder="Region Description"
            value={newRegion.description}
            onChange={(e) => setNewRegion({ ...newRegion, description: e.target.value })}
            className="border p-2 w-full rounded h-24"
            required
          />
          <ImageUpload
            key="new-region-upload"
            instanceId="new-region"
            onUpload={handleNewRegionImageUpload}
            currentImage={newRegion.image}
            placeholder="Click to upload region image"
            className="w-full"
          />
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">SEO Keywords</h3>
            <div className="space-y-2">
              {newRegion.keywords.map((keyword, keywordIndex) => (
                <div key={`new-keyword-${keywordIndex}`} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword(null, keywordIndex, e.target.value)}
                    className="border p-2 rounded flex-1"
                    placeholder="Enter keyword"
                  />
                  <button
                    onClick={() => deleteKeyword(null, keywordIndex)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addKeyword(null)}
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
            Add Region
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region, index) => (
          <div key={region._id.toString()} className="border rounded-lg overflow-hidden shadow-sm">
            {region.isEditing ? (
              <div className="p-4 space-y-4">
                <input
                  type="text"
                  value={region.name}
                  onChange={(e) => updateRegionField(index, 'name', e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Region Name"
                  required
                />
                <textarea
                  value={region.description}
                  onChange={(e) => updateRegionField(index, 'description', e.target.value)}
                  className="border p-2 w-full rounded h-24 resize-none"
                  placeholder="Region Description"
                  required
                />
                <ImageUpload
                  key={`region-${region._id}-upload`}
                  instanceId={`region-${region._id}`}
                  onUpload={(url, oldUrl) => updateRegionField(index, 'image', url)}
                  currentImage={region.image}
                  placeholder="Click to change image"
                  className="w-full"
                />
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-2">SEO Keywords</h3>
                  <div className="space-y-2">
                    {(region.keywords || []).map((keyword, keywordIndex) => (
                      <div key={`keyword-${keywordIndex}`} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => updateKeyword(index, keywordIndex, e.target.value)}
                          className="border p-2 rounded flex-1"
                          placeholder="Enter keyword"
                        />
                        <button
                          onClick={() => deleteKeyword(index, keywordIndex)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addKeyword(index)}
                      className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600 transition-colors"
                    >
                      Add Keyword
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(index)}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 px-4 rounded transition-colors flex-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancel(index)}
                    className="bg-gray-500 hover:bg-gray-600 text-white p-2 px-4 rounded transition-colors flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="h-48 overflow-hidden">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{region.name}</h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{region.description}</p>
                  {region.keywords && region.keywords.length > 0 && (
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Keywords:</strong> {region.keywords.join(', ')}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => router.push(`/admin/trekking/${region.slug}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 px-3 rounded text-sm transition-colors"
                    >
                      Manage Treks
                    </button>
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 px-3 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(region._id.toString())}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 px-3 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {regions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No regions found. Add your first region above.
        </div>
      )}
    </div>
  );
}