import { describe, expect, it } from 'vitest';
import { MissingDatabaseUrlError, connectDb, getMongoClient } from './index';

describe('database connection helpers', () => {
  it('throws MissingDatabaseUrlError when uri is empty for connectDb', async () => {
    await expect(connectDb('')).rejects.toThrow(MissingDatabaseUrlError);
  });

  it('throws MissingDatabaseUrlError when uri is empty for getMongoClient', () => {
    expect(() => getMongoClient('')).toThrow(MissingDatabaseUrlError);
  });
});
