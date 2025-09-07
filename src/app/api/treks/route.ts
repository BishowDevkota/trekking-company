// src/app/api/treks/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('trekking');
    
    // Fetch all treks with specified fields
    const treks = await db.collection('treks').find(
      {},
      {
        projection: {
          _id: 1,
          name: 1,
          description: 1,
          pricing: 1,
          slug: 1,
          itinerary: 1,
          image: 1
        }
      }
    ).toArray();
    
    return NextResponse.json(treks);
  } catch (error) {
    console.error('Error fetching all treks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treks' },
      { status: 500 }
    );
  }
}