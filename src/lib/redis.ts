import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const CACHE_TTL_SECONDS = 60;

export const ORDER_CACHE_KEYS = {
  all: 'orders:all',
  customer: (uid: string) => `orders:customer:${uid}`,
  delivery: (uid: string) => `orders:delivery:${uid}`,
} as const;

export const NOTIF_QUEUE_KEY = (uid: string) => `notif:${uid}`;
export const NOTIF_QUEUE_TTL_SECONDS = 3600;
