import mongoose from 'mongoose';

export class MissingDatabaseUrlError extends Error {
  constructor() {
    super(
      'MONGODB_URI is not set. Copy .env.example to .env and start MongoDB with `docker compose up -d mongo`.',
    );
    this.name = 'MissingDatabaseUrlError';
  }
}

declare global {
  var __hackerlandMongoose: Promise<typeof mongoose> | undefined;
}

export async function connectDb(
  uri: string | undefined = process.env.MONGODB_URI,
): Promise<typeof mongoose> {
  if (!uri) {
    throw new MissingDatabaseUrlError();
  }

  if (!globalThis.__hackerlandMongoose) {
    globalThis.__hackerlandMongoose = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500,
      })
      .catch((error) => {
        globalThis.__hackerlandMongoose = undefined;
        throw error;
      });
  }

  return globalThis.__hackerlandMongoose;
}

export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export { mongoose };
