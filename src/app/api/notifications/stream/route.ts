import { NextRequest } from 'next/server';
import { redis, NOTIF_QUEUE_KEY } from '@/lib/redis';

const POLL_INTERVAL_MS = 2000;
const SESSION_DURATION_MS = 25_000;

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid');
  if (!uid) return new Response('uid required', { status: 400 });

  const encoder = new TextEncoder();
  let cancelled = false;

  const body = new ReadableStream({
    async start(controller) {
      const deadline = Date.now() + SESSION_DURATION_MS;

      try {
        while (!cancelled && Date.now() < deadline) {
          const raw = await redis.rpop<string>(NOTIF_QUEUE_KEY(uid));
          if (raw) {
            const payload = typeof raw === 'string' ? raw : JSON.stringify(raw);
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          } else {
            // SSE comment keeps the connection alive without triggering onmessage
            controller.enqueue(encoder.encode(': heartbeat\n\n'));
          }
          await new Promise<void>(r => setTimeout(r, POLL_INTERVAL_MS));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      cancelled = true;
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
