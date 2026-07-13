import path from "path";
import crypto from "crypto";

// Raster images and select video formats. SVG is intentionally excluded: it can embed
// <script>/onload handlers and become a stored-XSS vector.
const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/ogg": ".ogg",
};

// Leading bytes for each accepted format. `file.type` is supplied by the client
// and cannot be trusted on its own, so the declared type must agree with the
// actual content before we hand the bytes to storage.
const MAGIC_BYTES: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) =>
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  "image/gif": (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46,
  "image/webp": (b) =>
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && // "RIFF"
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50, // "WEBP"
  "video/mp4": (b) =>
    (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) || // "ftyp"
    (b[0] === 0x00 && b[1] === 0x00 && b[2] === 0x00 && (b[3] === 0x14 || b[3] === 0x18 || b[3] === 0x20)),
  "video/webm": (b) =>
    b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3, // EBML
  "video/ogg": (b) =>
    b[0] === 0x4f && b[1] === 0x67 && b[2] === 0x67 && b[3] === 0x53, // "OggS"
};

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export interface UploadFailure {
  ok: false;
  status: number;
  error: string;
}

export interface UploadSuccess {
  ok: true;
  url: string;
  /** Object key within the bucket, e.g. `banner-hero-1700000000-1234.png`. */
  objectName: string;
}

export type UploadResult = UploadSuccess | UploadFailure;

interface SupabaseConfig {
  url: string;
  serviceKey: string;
  bucket: string;
  encodedBucket: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  const bucket = process.env.SUPABASE_BUCKET_NAME || "kala images";
  return { url, serviceKey, bucket, encodedBucket: encodeURIComponent(bucket) };
}

/**
 * Build a storage object name that is safe regardless of what the client called
 * the file: the extension is derived from the validated MIME type (never from
 * the submitted name), and the base name is reduced to a known-safe charset.
 */
function buildObjectName(originalName: string, mimeType: string, prefix: string): string {
  const extension = MIME_TO_EXTENSION[mimeType];

  const safeBaseName = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 60);

  const suffix = crypto.randomBytes(6).toString("hex");
  return `${prefix}${safeBaseName || "media"}-${Date.now()}-${suffix}${extension}`;
}

/**
 * Validates an uploaded image or video and streams it to Supabase Storage.
 * Callers must have already authenticated the request.
 */
export async function uploadImage(
  file: File,
  options: { prefix?: string; allowVideo?: boolean } = {}
): Promise<UploadResult> {
  const { prefix = "", allowVideo = false } = options;

  const isVideo = file.type.startsWith("video/");
  if (isVideo && !allowVideo) {
    return {
      ok: false,
      status: 400,
      error: "Video uploads are not allowed for this field.",
    };
  }

  if (!MIME_TO_EXTENSION[file.type]) {
    return {
      ok: false,
      status: 400,
      error: allowVideo
        ? "Invalid file type. Only JPG, PNG, GIF, WEBP images, and MP4, WebM, Ogg videos are allowed."
        : "Invalid file type. Only JPG, PNG, GIF, and WEBP images are allowed.",
    };
  }

  const maxLimit = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  if (file.size > maxLimit) {
    return {
      ok: false,
      status: 400,
      error: `File size exceeds the ${isVideo ? "100MB" : "10MB"} limit.`,
    };
  }

  const config = getSupabaseConfig();
  if (!config) {
    return { ok: false, status: 500, error: "Supabase storage is not configured on the server." };
  }

  const buffer = await file.arrayBuffer();

  // Confirm the bytes match the declared type before storing them.
  const header = new Uint8Array(buffer.slice(0, 12));
  if (header.length < 12 || !MAGIC_BYTES[file.type](header)) {
    return {
      ok: false,
      status: 400,
      error: "File content does not match its declared media type.",
    };
  }

  const objectName = buildObjectName(file.name, file.type, prefix);
  const uploadUrl = `${config.url}/storage/v1/object/${config.encodedBucket}/${objectName}`;

  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.serviceKey}`,
      "Content-Type": file.type,
      // Prevent the object from ever being served as active content.
      "x-upsert": "false",
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    console.error("Supabase Storage upload failed:", await uploadRes.text());
    return { ok: false, status: 502, error: "Media upload failed." };
  }

  return {
    ok: true,
    url: `${config.url}/storage/v1/object/public/${config.encodedBucket}/${objectName}`,
    objectName,
  };
}

/**
 * Best-effort removal of a previously stored object. Never throws.
 */
export async function deleteImage(objectName: string): Promise<void> {
  const config = getSupabaseConfig();
  if (!config) return;

  try {
    const res = await fetch(`${config.url}/storage/v1/object/${config.encodedBucket}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${config.serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: [objectName] }),
    });
    if (!res.ok) {
      console.warn("Failed to delete old image from Supabase:", await res.text());
    }
  } catch (error) {
    console.error("Failed to delete old image from Supabase:", error);
  }
}
