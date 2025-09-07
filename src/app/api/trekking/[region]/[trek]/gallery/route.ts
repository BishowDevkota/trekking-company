// src/app/api/trekking/[region]/[trek]/gallery/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to extract public_id from Cloudinary URL
function getPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
    return null;
  }
}

// Helper function to delete image from Cloudinary
async function deleteCloudinaryImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error(`Failed to delete image from Cloudinary: ${publicId}`, error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ region: string; trek: string }> }) {
  try {
    const { trek } = await context.params;
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('trekking');
    
    const trekDoc = await db.collection('treks').findOne({ slug: trek });
    if (!trekDoc) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }
    
    // Delete image from Cloudinary
    const publicId = getPublicIdFromUrl(imageUrl);
    if (publicId) {
      await deleteCloudinaryImage(publicId);
    }
    
    // Remove image from gallery
    const updatedGallery = trekDoc.gallery.filter((item: any) => item.src !== imageUrl);
    
    const result = await db.collection('treks').updateOne(
      { slug: trek },
      { $set: { gallery: updatedGallery } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Gallery image deleted successfully', result });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}