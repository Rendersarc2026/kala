/**
 * Pure validators. Deliberately free of `next/server` (and any other runtime)
 * imports so they can be used from pages, route handlers, and tests alike.
 */

/** Hosts permitted as the `src` of the contact-page map <iframe>. */
const ALLOWED_MAP_HOSTS = new Set([
  "google.com",
  "www.google.com",
  "maps.google.com",
]);

/**
 * A map embed URL is rendered into `<iframe src>`, so an attacker-controlled
 * value would be a stored-XSS sink (`javascript:` runs in this origin,
 * `data:text/html` renders attacker markup). Restrict it to https Google Maps.
 */
export function isSafeMapEmbedUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") return false;
  return ALLOWED_MAP_HOSTS.has(url.hostname.toLowerCase());
}
