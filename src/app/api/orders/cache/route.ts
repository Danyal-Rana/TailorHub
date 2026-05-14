import { NextRequest, NextResponse } from 'next/server';
import { redis, CACHE_TTL_SECONDS } from '@/lib/redis';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json({ data: null }, { status: 400 });

  const cached = await redis.get<unknown[]>(key);
  return NextResponse.json({ data: cached ?? null });
}

export async function POST(req: NextRequest) {
  const { key, data } = await req.json() as { key: string; data: unknown[] };
  if (!key || !data) return NextResponse.json({ ok: false }, { status: 400 });

  await redis.set(key, data, { ex: CACHE_TTL_SECONDS });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json({ ok: false }, { status: 400 });

  await redis.del(key);
  return NextResponse.json({ ok: true });
}
