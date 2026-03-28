function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizeSlug(slug: string): string {
  return slug.replace(/^\/+/, '');
}

export function getSiteUrlFromEnv(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return envUrl ? trimTrailingSlash(envUrl) : '';
}

export function getClientSiteUrl(): string {
  const envUrl = getSiteUrlFromEnv();
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimTrailingSlash(window.location.origin);
  }

  return '';
}

export function buildPortfolioUrl(slug: string): string {
  const safeSlug = normalizeSlug(slug);
  const baseUrl = getClientSiteUrl();
  return baseUrl ? `${baseUrl}/p/${safeSlug}` : `/p/${safeSlug}`;
}

export function buildPortfolioUrlServer(slug: string): string {
  const safeSlug = normalizeSlug(slug);
  const baseUrl = getSiteUrlFromEnv();
  return baseUrl ? `${baseUrl}/p/${safeSlug}` : `/p/${safeSlug}`;
}