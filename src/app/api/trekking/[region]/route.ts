// src/app/api/trekking/[region]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Trek } from '@/types/trekking';

// Trek validation function
function validateTrek(trek: any): { isValid: boolean; errors: string[] } {
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
  
  // Validate overview
  if (trek.overview && Array.isArray(trek.overview)) {
    trek.overview.forEach((item: any, index: number) => {
      if (!item.icon || !item.heading || !item.description) {
        errors.push(`Overview item ${index + 1}: All fields (icon, heading, description) are required`);
      }
    });
  }
  
  // Validate itinerary
  if (trek.itinerary && Array.isArray(trek.itinerary)) {
    trek.itinerary.forEach((item: any, index: number) => {
      if (!item.heading || !item.description) {
        errors.push(`Itinerary item ${index + 1}: Both heading and description are required`);
      }
    });
  }
  
  // Validate pricing
  if (trek.pricing && Array.isArray(trek.pricing)) {
    trek.pricing.forEach((item: any, index: number) => {
      if (!item.minPersons || !item.maxPersons || !item.price) {
        errors.push(`Pricing item ${index + 1}: minPersons, maxPersons, and price are required`);
      }
      if (item.minPersons <= 0) {
        errors.push(`Pricing item ${index + 1}: minPersons must be greater than 0`);
      }
      if (item.maxPersons < item.minPersons) {
        errors.push(`Pricing item ${index + 1}: maxPersons must be greater than or equal to minPersons`);
      }
      if (item.price < 0) {
        errors.push(`Pricing item ${index + 1}: price must be greater than or equal to 0`);
      }
    });
  }
  
  // Validate gallery
  if (trek.gallery && Array.isArray(trek.gallery)) {
    trek.gallery.forEach((item: any, index: number) => {
      if (!item.src || !item.alt || !item.caption) {
        errors.push(`Gallery item ${index + 1}: src, alt, and caption are required`);
      }
    });
  }
  
  // Validate FAQs
  if (trek.faqs && Array.isArray(trek.faqs)) {
    trek.faqs.forEach((item: any, index: number) => {
      if (!item.question || !item.answer) {
        errors.push(`FAQ item ${index + 1}: Both question and answer are required`);
      }
    });
  }
  
  // Validate keywords
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

export async function GET(request: Request, context: { params: Promise<{ region: string }> }) {
  try {
    const { region } = await context.params;
    const client = await clientPromise;
    const db = client.db('trekking');
    const regionDoc = await db.collection('regions').findOne({ slug: region });
    
    if (!regionDoc) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }
    
    const treks = await db.collection('treks').find({ regionId: regionDoc._id.toString() }).toArray();
    return NextResponse.json(treks);
  } catch (error) {
    console.error('Error fetching treks:', error);
    return NextResponse.json({ error: 'Failed to fetch treks' }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ region: string }> }) {
  try {
    const { region } = await context.params;
    const client = await clientPromise;
    const db = client.db('trekking');
    const regionDoc = await db.collection('regions').findOne({ slug: region });
    
    if (!regionDoc) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }
    
    const body = await request.json();
    
    // Server-side validation
    const validation = validateTrek(body);
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }
    
    // Check for duplicate trek names in the same region
    const existingTrek = await db.collection('treks').findOne({
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') },
      regionId: regionDoc._id.toString()
    });
    
    if (existingTrek) {
      return NextResponse.json({ 
        error: 'A trek with this name already exists in this region' 
      }, { status: 409 });
    }
    
    const trek: Trek = {
      regionId: regionDoc._id.toString(),
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description,
      image: body.image || '',
      overview: body.overview || [],
      itinerary: body.itinerary || [],
      inclusions: body.inclusions || [],
      exclusions: body.exclusions || [],
      pricing: body.pricing || [],
      gallery: body.gallery || [],
      faqs: body.faqs || [],
      keywords: body.keywords ? body.keywords.map((keyword: string) => keyword.trim()) : []
    };
    
    const result = await db.collection('treks').insertOne(trek);
    return NextResponse.json({ ...trek, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating trek:', error);
    return NextResponse.json({ error: 'Failed to create trek' }, { status: 500 });
  }
}