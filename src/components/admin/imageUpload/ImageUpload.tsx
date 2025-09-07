// src/components/admin/imageUpload/ImageUpload.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  onUpload: (url: string, oldUrl?: string) => void;
  onDelete?: (url: string) => void; // Added for deleting old image
  currentImage?: string;
  placeholder?: string;
  className?: string;
  instanceId?: string;
}

export default function ImageUpload({ 
  onUpload, 
  onDelete,
  currentImage, 
  placeholder = "Click to upload image",
  className = "",
  instanceId = "unknown",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  useEffect(() => {
    console.log(`ImageUpload instance ${instanceId}: currentImage changed to ${currentImage}`);
    setPreview(currentImage || null);
  }, [currentImage, instanceId]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log(`ImageUpload instance ${instanceId}: No file selected`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, WebP, and GIF files are allowed.');
      console.log(`ImageUpload instance ${instanceId}: Invalid file type ${file.type}`);
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 10MB.');
      console.log(`ImageUpload instance ${instanceId}: File size too large ${file.size}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      console.log(`ImageUpload instance ${instanceId}: Setting preview to ${previewUrl}`);
      setPreview(previewUrl);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log(`ImageUpload instance ${instanceId}: Uploading file ${file.name}`);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`ImageUpload instance ${instanceId}: Upload successful, URL: ${data.url}`);
        // Call onUpload with new and old URLs
        onUpload(data.url, currentImage);
        toast.success('Image uploaded successfully');
      } else {
        const errorData = await response.json();
        console.error(`ImageUpload instance ${instanceId}: Upload failed`, errorData);
        toast.error(`Upload failed: ${errorData.error}`);
        setPreview(currentImage || null);
      }
    } catch (error) {
      console.error(`ImageUpload instance ${instanceId}: Upload error`, error);
      toast.error('Failed to upload image');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
      console.log(`ImageUpload instance ${instanceId}: Upload process completed`);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id={`image-upload-${instanceId}`}
      />
      <label
        htmlFor={`image-upload-${instanceId}`}
        className={`
          block w-full h-32 border-2 border-dashed border-gray-300 rounded-lg
          flex items-center justify-center cursor-pointer transition-colors
          ${uploading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}
          ${preview ? 'p-0' : 'p-4'}
        `}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-white">Uploading...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-gray-500">
              {uploading ? 'Uploading...' : placeholder}
            </div>
          </div>
        )}
      </label>
    </div>
  );
}