import { searchGlobalPlatform } from '@/lib/search/search-index';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const results = await searchGlobalPlatform(q);
  return Response.json({ results });
}
