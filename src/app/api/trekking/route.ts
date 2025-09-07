// src/app/api/trekking/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Region } from '@/types/trekking';
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

// Validation function for regions
function validateRegion(region: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!region.name || typeof region.name !== 'string' || region.name.trim().length === 0) {
    errors.push('Region name is required and must be a non-empty string');
  }
  
  if (!region.description || typeof region.description !== 'string' || region.description.trim().length === 0) {
    errors.push('Region description is required and must be a non-empty string');
  }
  
  if (!region.image || typeof region.image !== 'string' || region.image.trim().length === 0) {
    errors.push('Region image is required and must be a non-empty string');
  }
  
  if (region.keywords && Array.isArray(region.keywords)) {
    region.keywords.forEach((keyword: any, index: number) => {
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

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('trekking');
    const regions = await db.collection('regions').find({}).toArray();
    return NextResponse.json(regions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('trekking');
    const body: Region = await request.json();
    
    const validation = validateRegion(body);
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }
    
    const existingRegion = await db.collection('regions').findOne({
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') }
    });
    
    if (existingRegion) {
      return NextResponse.json({ 
        error: 'A region with this name already exists' 
      }, { status: 409 });
    }
    
    body.slug = body.name.toLowerCase().replace(/\s+/g, '-');
    body.keywords = body.keywords ? body.keywords.map((keyword: string) => keyword.trim()) : [];
    
    const result = await db.collection('regions').insertOne(body);
    return NextResponse.json({ ...body, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating region:', error);
    return NextResponse.json({ error: 'Failed to create region' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('trekking');
    const body: Region = await request.json();
    
    if (!body._id) {
      return NextResponse.json({ error: 'Region ID is required' }, { status: 400 });
    }
    
    const validation = validateRegion(body);
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }
    
    const existingRegion = await db.collection('regions').findOne({
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') },
      _id: { $ne: new ObjectId(body._id) }
    });
    
    if (existingRegion) {
      return NextResponse.json({ 
        error: 'A region with this name already exists' 
      }, { status: 409 });
    }
    
    const currentRegion = await db.collection('regions').findOne({ _id: new ObjectId(body._id) });
    if (!currentRegion) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }
    
    if (currentRegion.image && body.image && currentRegion.image !== body.image) {
      const oldPublicId = getPublicIdFromUrl(currentRegion.image);
      if (oldPublicId) {
        await deleteCloudinaryImage(oldPublicId);
      }
    }
    
    body.slug = body.name.toLowerCase().replace(/\s+/g, '-');
    body.keywords = body.keywords ? body.keywords.map((keyword: string) => keyword.trim()) : [];
    
    const result = await db.collection('regions').updateOne(
      { _id: new ObjectId(body._id) },
      { $set: { name: body.name, slug: body.slug, description: body.description, image: body.image, keywords: body.keywords } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Region updated successfully', result });
  } catch (error) {
    console.error('Error updating region:', error);
    return NextResponse.json({ error: 'Failed to update region' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('trekking');
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Region ID is required' }, { status: 400 });
    }
    
    const trekCount = await db.collection('treks').countDocuments({ regionId: id });
    
    if (trekCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete region. It has ${trekCount} associated trek(s). Delete all treks first.` 
      }, { status: 409 });
    }
    
    const region = await db.collection('regions').findOne({ _id: new ObjectId(id) });
    if (!region) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }
    
    if (region.image) {
      const publicId = getPublicIdFromUrl(region.image);
      if (publicId) {
        await deleteCloudinaryImage(publicId);
      }
    }
    
    const result = await db.collection('regions').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Region and associated image deleted successfully', result });
  } catch (error) {
    console.error('Error deleting region:', error);
    return NextResponse.json({ error: 'Failed to delete region' }, { status: 500 });
  }
}