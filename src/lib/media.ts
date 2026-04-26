const ABSOLUTE_URL_PATTERN = /^(?:https?:)?\/\//i;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function trimLeadingSlash(value: string) {
  return value.replace(/^\/+/, '');
}

export function getApiOrigin() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return '';
  }

  try {
    return new URL(apiUrl).origin;
  } catch {
    return '';
  }
}

export function resolveMediaUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  if (ABSOLUTE_URL_PATTERN.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
    ? trimTrailingSlash(process.env.NEXT_PUBLIC_APP_URL)
    : '';
  const apiOrigin = trimTrailingSlash(getApiOrigin());
  const base = appUrl || apiOrigin;

  if (!base) {
    return url;
  }

  return `${base}/${trimLeadingSlash(url)}`;
}

export function getEmbeddedVideoUrl(url?: string | null) {
  const resolved = resolveMediaUrl(url);

  if (!resolved) {
    return null;
  }

  try {
    const parsed = new URL(resolved);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = parsed.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : resolved;
    }

    if (host === 'youtu.be') {
      const videoId = trimLeadingSlash(parsed.pathname);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : resolved;
    }

    if (host === 'vimeo.com') {
      const videoId = trimLeadingSlash(parsed.pathname);
      return videoId ? `https://player.vimeo.com/video/${videoId}` : resolved;
    }

    return resolved;
  } catch {
    return resolved;
  }
}

export function isEmbeddableVideo(url?: string | null) {
  const embedded = getEmbeddedVideoUrl(url);
  return Boolean(embedded && embedded !== resolveMediaUrl(url));
}

export function normalizeMediaKey(value?: string | null) {
  if (!value) {
    return '';
  }

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
