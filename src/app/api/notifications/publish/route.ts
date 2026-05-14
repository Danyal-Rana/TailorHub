import { NextRequest, NextResponse } from 'next/server';
import { redis, NOTIF_QUEUE_KEY, NOTIF_QUEUE_TTL_SECONDS } from '@/lib/redis';

export async function POST(req: NextRequest) {
  const { uid, notification } = await req.json() as { uid: string; notification: unknown };
  if (!uid || !notification) return NextResponse.json({ ok: false }, { status: 400 });

  const key = NOTIF_QUEUE_KEY(uid);
  await redis.lpush(key, JSON.stringify(notification));
  await redis.expire(key, NOTIF_QUEUE_TTL_SECONDS);

  return NextResponse.json({ ok: true });
}
