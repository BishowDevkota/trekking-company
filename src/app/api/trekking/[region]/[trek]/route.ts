// src/app/api/trekking/[region]/[trek]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Trek } from '@/types/trekking';
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

// Complete trek validation function
function validateTrekUpdate(trek: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!trek.name || typeof trek.name !== 'string' || trek.name.trim().length === 0) {
    errors.push('Trek name is required and must be a non-empty string');
  }
  
  if (!trek.description || typeof trek.description !== 'string' || trek.description.trim().length === 0) {
    errors.push('Trek description is required and must be a non-empty string');
  }
  
  if (!trek.image || typeof trek.image !== 'string' || trek.image.trim().length === 0) {
    errors.push('Trek image is required and must be a non-empty string');
  }
  
  if (trek.overview && Array.isArray(trek.overview)) {
    trek.overview.forEach((item: any, index: number) => {
      if (!item.icon || typeof item.icon !== 'string' || item.icon.trim().length === 0) {
        errors.push(`Overview item ${index + 1}: Icon is required`);
      }
      if (!item.heading || typeof item.heading !== 'string' || item.heading.trim().length === 0) {
        errors.push(`Overview item ${index + 1}: Heading is required`);
      }
      if (!item.description || typeof item.description !== 'string' || item.description.trim().length === 0) {
        errors.push(`Overview item ${index + 1}: Description is required`);
      }
    });
  }
  
  if (trek.itinerary && Array.isArray(trek.itinerary)) {
    trek.itinerary.forEach((item: any, index: number) => {
      if (!item.heading || typeof item.heading !== 'string' || item.heading.trim().length === 0) {
        errors.push(`Itinerary item ${index + 1}: Heading is required`);
      }
      if (!item.description || typeof item.description !== 'string' || item.description.trim().length === 0) {
        errors.push(`Itinerary item ${index + 1}: Description is required`);
      }
    });
  }
  
  if (trek.inclusions && Array.isArray(trek.inclusions)) {
    trek.inclusions.forEach((item: any, index: number) => {
      if (!item || typeof item !== 'string' || item.trim().length === 0) {
        errors.push(`Inclusion item ${index + 1}: Must be a non-empty string`);
      }
    });
  }
  
  if (trek.exclusions && Array.isArray(trek.exclusions)) {
    trek.exclusions.forEach((item: any, index: number) => {
      if (!item || typeof item !== 'string' || item.trim().length === 0) {
        errors.push(`Exclusion item ${index + 1}: Must be a non-empty string`);
      }
    });
  }
  
  if (trek.pricing && Array.isArray(trek.pricing)) {
    trek.pricing.forEach((item: any, index: number) => {
      if (!item.minPersons || typeof item.minPersons !== 'number' || item.minPersons <= 0) {
        errors.push(`Pricing item ${index + 1}: minPersons must be a number greater than 0`);
      }
      if (!item.maxPersons || typeof item.maxPersons !== 'number' || item.maxPersons < item.minPersons) {
        errors.push(`Pricing item ${index + 1}: maxPersons must be a number greater than or equal to minPersons`);
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        errors.push(`Pricing item ${index + 1}: price must be a number greater than or equal to 0`);
      }
    });
  }
  
  if (trek.gallery && Array.isArray(trek.gallery)) {
    trek.gallery.forEach((item: any, index: number) => {
      if (!item.src || typeof item.src !== 'string' || item.src.trim().length === 0) {
        errors.push(`Gallery item ${index + 1}: Image source is required`);
      }
      if (!item.alt || typeof item.alt !== 'string' || item.alt.trim().length === 0) {
        errors.push(`Gallery item ${index + 1}: Alt text is required`);
      }
      if (!item.caption || typeof item.caption !== 'string' || item.caption.trim().length === 0) {
        errors.push(`Gallery item ${index + 1}: Caption is required`);
      }
    });
  }
  
  if (trek.faqs && Array.isArray(trek.faqs)) {
    trek.faqs.forEach((item: any, index: number) => {
      if (!item.question || typeof item.question !== 'string' || item.question.trim().length === 0) {
        errors.push(`FAQ item ${index + 1}: Question is required`);
      }
      if (!item.answer || typeof item.answer !== 'string' || item.answer.trim().length === 0) {
        errors.push(`FAQ item ${index + 1}: Answer is required`);
      }
    });
  }
  
  if (trek.keywords && Array.isArray(trek.keywords)) {
    trek.keywords.forEach((keyword: any, index: number) => {
      if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
        errors.push(`Keyword ${index + 1}: Must be a non-empty string`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function GET(request: Request, context: { params: Promise<{ region: string; trek: string }> }) {
  try {
    const { trek } = await context.params;
    const client = await clientPromise;
    const db = client.db('trekking');
    const trekDoc = await db.collection('treks').findOne({ slug: trek });
    
    if (!trekDoc) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }
    
    return NextResponse.json(trekDoc);
  } catch (error) {
    console.error('Error fetching trek:', error);
    return NextResponse.json({ error: 'Failed to fetch trek' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ region: string; trek: string }> }) {
  try {
    const { region, trek: trekSlug } = await context.params;
    const client = await clientPromise;
    const db = client.db('trekking');
    const body: Trek = await request.json();
    
    if (!body._id) {
      return NextResponse.json({ error: 'Trek ID is required' }, { status: 400 });
    }
    
    const validation = validateTrekUpdate(body);
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }
    
    const existingTrek = await db.collection('treks').findOne({ _id: new ObjectId(body._id) });
    if (!existingTrek) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }
    
    const duplicateTrek = await db.collection('treks').findOne({
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') },
      regionId: existingTrek.regionId,
      _id: { $ne: new ObjectId(body._id) }
    });
    
    if (duplicateTrek) {
      return NextResponse.json({ 
        error: 'A trek with this name already exists in this region' 
      }, { status: 409 });
    }
    
    // Delete old main image if it has changed
    if (existingTrek.image && body.image && existingTrek.image !== body.image) {
      const oldPublicId = getPublicIdFromUrl(existingTrek.image);
      if (oldPublicId) {
        await deleteCloudinaryImage(oldPublicId);
      }
    }
    
    // Delete old gallery images that are no longer in the updated gallery
    if (existingTrek.gallery && Array.isArray(existingTrek.gallery) && body.gallery && Array.isArray(body.gallery)) {
      const oldImageUrls = existingTrek.gallery.map(item => item.src);
      const newImageUrls = body.gallery.map(item => item.src);
      const imagesToDelete = oldImageUrls.filter(url => !newImageUrls.includes(url));
      
      for (const url of imagesToDelete) {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) {
          await deleteCloudinaryImage(publicId);
        }
      }
    }
    
    const { _id, ...updateData } = body;
    
    updateData.name = updateData.name.trim();
    updateData.description = updateData.description.trim();
    updateData.slug = updateData.name.toLowerCase().replace(/\s+/g, '-');
    
    if (updateData.overview) {
      updateData.overview = updateData.overview.map(item => ({
        ...item,
        icon: item.icon?.trim(),
        heading: item.heading?.trim(),
        description: item.description?.trim()
      }));
    }
    
    if (updateData.itinerary) {
      updateData.itinerary = updateData.itinerary.map(item => ({
        ...item,
        heading: item.heading?.trim(),
        description: item.description?.trim()
      }));
    }
    
    if (updateData.inclusions) {
      updateData.inclusions = updateData.inclusions.map(item => item.trim());
    }
    
    if (updateData.exclusions) {
      updateData.exclusions = updateData.exclusions.map(item => item.trim());
    }
    
    if (updateData.gallery) {
      updateData.gallery = updateData.gallery.map(item => ({
        ...item,
        src: item.src?.trim(),
        alt: item.alt?.trim(),
        caption: item.caption?.trim()
      }));
    }
    
    if (updateData.faqs) {
      updateData.faqs = updateData.faqs.map(item => ({
        ...item,
        question: item.question?.trim(),
        answer: item.answer?.trim()
      }));
    }
    
    if (updateData.keywords) {
      updateData.keywords = updateData.keywords.map((keyword: string) => keyword.trim());
    }
    
    const result = await db.collection('treks').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Trek updated successfully', result });
  } catch (error) {
    console.error('Error updating trek:', error);
    return NextResponse.json({ 
      error: `Failed to update trek: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ region: string; trek: string }> }) {
  try {
    const { trek } = await context.params;
    const client = await clientPromise;
    const db = client.db('trekking');
    
    const trekDoc = await db.collection('treks').findOne({ slug: trek });
    if (!trekDoc) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }
    
    if (trekDoc.image) {
      const mainImagePublicId = getPublicIdFromUrl(trekDoc.image);
      if (mainImagePublicId) {
        await deleteCloudinaryImage(mainImagePublicId);
      }
    }
    
    if (trekDoc.gallery && Array.isArray(trekDoc.gallery)) {
      for (const item of trekDoc.gallery) {
        if (item.src) {
          const galleryImagePublicId = getPublicIdFromUrl(item.src);
          if (galleryImagePublicId) {
            await deleteCloudinaryImage(galleryImagePublicId);
          }
        }
      }
    }
    
    const result = await db.collection('treks').deleteOne({ slug: trek });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Trek and associated images deleted successfully', result });
  } catch (error) {
    console.error('Error deleting trek:', error);
    return NextResponse.json({ error: 'Failed to delete trek' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ region: string; trek: string }> }) {
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