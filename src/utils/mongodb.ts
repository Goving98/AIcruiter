import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
    if (cachedClient) {
        return {
            client: cachedClient,
            db: cachedClient.db(DB_NAME),
        };
    }

    const client = await MongoClient.connect(MONGODB_URI || '');
    cachedClient = client;

    return {
        client,
        db: client.db(DB_NAME),
    };
}