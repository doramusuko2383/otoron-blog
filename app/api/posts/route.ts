import { NextResponse } from 'next/server';
import { getPaginatedPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = Number(searchParams.get('offset') ?? '0');
  const limit = Math.min(Number(searchParams.get('limit') ?? '10'), 50);

  const page = await getPaginatedPosts(offset, limit);
  return NextResponse.json(page, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
