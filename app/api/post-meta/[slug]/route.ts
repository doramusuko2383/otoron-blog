import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/posts';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const p: any = await getPostBySlug(params.slug);
  if (!p || p.draft) return new NextResponse('Not found', { status: 404 });

  return NextResponse.json({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    thumb: p.thumb,
    ogImage: p.ogImage,
  });
}
