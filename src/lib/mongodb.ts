// src/lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("❌ Please add your Mongo URI to .env.local");

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

async function connectMongo(): Promise<MongoClient> {
  try {
    client = new MongoClient(uri, options); // uri is guaranteed string now
    await client.connect();
    console.log("✅ Connected to MongoDB successfully");
    return client;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ MongoDB connection error:", message);
    throw new Error("MongoDB connection failed: " + message);
  }
}

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectMongo();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  clientPromise = connectMongo();
}

export default clientPromise;
