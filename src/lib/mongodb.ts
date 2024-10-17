import { Collection, MongoClient } from 'mongodb';

import { HospitalProps } from '@/app/hospitals/interfaces';

const uri: string = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let clientPromise: Promise<MongoClient> | null = null;

// Reuse MongoClient connection across requests
export const connectToDatabase = async (): Promise<MongoClient> => {
  if (!clientPromise) {
    clientPromise = client.connect();
  }
  return clientPromise;
};

// Function to get the hospitals collection
export const getHospitalsCollection = async (): Promise<Collection<HospitalProps>> => {
  const client = await connectToDatabase();
  const database = client.db('hospital_search');
  return database.collection<HospitalProps>('hospitals');
};
