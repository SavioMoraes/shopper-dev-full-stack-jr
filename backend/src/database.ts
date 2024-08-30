import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URI as string;
const client = new MongoClient(url);
const dbName = process.env.DB_NAME as string;

export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    throw error;
  }
};