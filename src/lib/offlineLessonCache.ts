/**
 * Lightweight wrapper around the Cache Storage API for "save lesson offline"
 * functionality. The service worker reads from the same `staffup-lessons-v1`
 * cache and serves matching requests when the network is unavailable.
 *
 * We also store a small JSON metadata blob per lesson under a synthetic URL so
 * the app can list saved lessons without re-fetching anything.
 */

const LESSONS_CACHE = 'staffup-lessons-v1';
const META_PREFIX = '/__staffup_offline_meta__/';

export interface OfflineLessonMeta {
  /** stable identifier (we use lessonId) */
  id: string;
  courseId: string;
  courseTitle: string;
  lessonTitle: string;
  /** ISO string */
  savedAt: string;
  /** rough byte size estimate of the cached body */
  approxBytes: number;
  /** original lesson route URL we cached, if any */
  lessonRoute?: string;
  /** auxiliary URLs we also cached (transcripts, video poster, …) */
  extraUrls: string[];
}

const isCacheSupported = () =>
  typeof window !== 'undefined' && 'caches' in window && 'fetch' in window;

const metaUrl = (id: string) => `${META_PREFIX}${encodeURIComponent(id)}`;

const safeJsonParse = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const fetchSameOriginAsResponse = async (url: string): Promise<Response | null> => {
  try {
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res || !res.ok) return null;
    return res;
  } catch {
    return null;
  }
};

const ensureSameOrigin = (url: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const resolved = new URL(url, window.location.origin);
    if (resolved.origin !== window.location.origin) return null;
    return resolved.toString();
  } catch {
    return null;
  }
};

export const offlineLessonCache = {
  isSupported: isCacheSupported,

  async saveLesson(input: {
    id: string;
    courseId: string;
    courseTitle: string;
    lessonTitle: string;
    /** route to cache (e.g. /courses/detail/learning-room?courseId=…&lessonId=…) */
    lessonRoute?: string;
    /** any extra same-origin URLs (transcripts, posters, attachments) */
    extraUrls?: string[];
  }): Promise<OfflineLessonMeta> {
    if (!isCacheSupported()) {
      throw new Error('Trình duyệt không hỗ trợ lưu offline.');
    }
    const cache = await caches.open(LESSONS_CACHE);
    const cachedUrls: string[] = [];
    let approxBytes = 0;

    const cacheOne = async (rawUrl: string) => {
      const url = ensureSameOrigin(rawUrl);
      if (!url) return;
      const res = await fetchSameOriginAsResponse(url);
      if (!res) return;
      const clone = res.clone();
      try {
        const buf = await clone.arrayBuffer();
        approxBytes += buf.byteLength;
      } catch {
        // ignore — size is best-effort
      }
      await cache.put(url, res);
      cachedUrls.push(url);
    };

    if (input.lessonRoute) {
      await cacheOne(input.lessonRoute);
    }
    for (const url of input.extraUrls ?? []) {
      await cacheOne(url);
    }

    const meta: OfflineLessonMeta = {
      id: input.id,
      courseId: input.courseId,
      courseTitle: input.courseTitle,
      lessonTitle: input.lessonTitle,
      savedAt: new Date().toISOString(),
      approxBytes,
      lessonRoute: input.lessonRoute,
      extraUrls: cachedUrls.filter((u) => u !== ensureSameOrigin(input.lessonRoute ?? '')),
    };

    await cache.put(
      metaUrl(input.id),
      new Response(JSON.stringify(meta), {
        headers: { 'content-type': 'application/json' },
      }),
    );

    return meta;
  },

  async listSaved(): Promise<OfflineLessonMeta[]> {
    if (!isCacheSupported()) return [];
    const cache = await caches.open(LESSONS_CACHE);
    const requests = await cache.keys();
    const metas: OfflineLessonMeta[] = [];
    for (const req of requests) {
      const url = new URL(req.url);
      if (!url.pathname.startsWith(META_PREFIX)) continue;
      const res = await cache.match(req);
      if (!res) continue;
      const text = await res.text();
      const parsed = safeJsonParse<OfflineLessonMeta>(text);
      if (parsed) metas.push(parsed);
    }
    return metas.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  },

  async isSaved(id: string): Promise<boolean> {
    if (!isCacheSupported()) return false;
    const cache = await caches.open(LESSONS_CACHE);
    const res = await cache.match(metaUrl(id));
    return !!res;
  },

  async getSaved(id: string): Promise<OfflineLessonMeta | null> {
    if (!isCacheSupported()) return null;
    const cache = await caches.open(LESSONS_CACHE);
    const res = await cache.match(metaUrl(id));
    if (!res) return null;
    const text = await res.text();
    return safeJsonParse<OfflineLessonMeta>(text);
  },

  async remove(id: string): Promise<void> {
    if (!isCacheSupported()) return;
    const cache = await caches.open(LESSONS_CACHE);
    const meta = await this.getSaved(id);
    if (meta) {
      const urls = [meta.lessonRoute, ...(meta.extraUrls ?? [])].filter(
        (u): u is string => typeof u === 'string' && u.length > 0,
      );
      await Promise.all(urls.map((u) => cache.delete(u).catch(() => false)));
    }
    await cache.delete(metaUrl(id)).catch(() => false);
  },

  async clearAll(): Promise<void> {
    if (!isCacheSupported()) return;
    await caches.delete(LESSONS_CACHE).catch(() => false);
  },

  formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return '—';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let idx = 0;
    while (value >= 1024 && idx < units.length - 1) {
      value /= 1024;
      idx += 1;
    }
    return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
  },
};
