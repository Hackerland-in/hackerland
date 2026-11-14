import { MongoClient } from 'mongodb';
import { MissingDatabaseUrlError } from './connection';

declare global {
  var __hackerlandMongoClient: MongoClient | undefined;
}

export function getMongoClient(
  uri: string | undefined = process.env.MONGODB_URI,
): MongoClient {
  if (!uri) {
    throw new MissingDatabaseUrlError();
  }

  if (!globalThis.__hackerlandMongoClient) {
    globalThis.__hackerlandMongoClient = new MongoClient(uri);
  }

  return globalThis.__hackerlandMongoClient;
}
