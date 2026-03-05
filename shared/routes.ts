import { z } from 'zod';
import { dummyTable } from './schema';

export const api = {
  dummy: {
    list: {
      method: 'GET' as const,
      path: '/api/dummy' as const,
      responses: {
        200: z.array(z.custom<typeof dummyTable.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
