/**
 * `Project.images` and `Service.details` are stored as JSON-encoded string
 * arrays in text columns. A row written by an older migration — or by hand —
 * can hold a malformed value, and an unguarded JSON.parse there takes down the
 * whole public page. Degrade to an empty list instead.
 */
export function parseStringArray(value: string | null | undefined): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}
