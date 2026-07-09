import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";
import { prisma } from "@/lib/prisma";
import { deleteImage, getSupabaseConfig, uploadImage } from "@/lib/upload";

/**
 * Extracts the storage object name from a previously stored public URL, or null
 * if the URL does not point into our own bucket.
 */
function objectNameFromPublicUrl(url: string): string | null {
  const config = getSupabaseConfig();
  if (!config) return null;

  const marker = `/storage/v1/object/public/${config.encodedBucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;

  return url.substring(index + marker.length) || null;
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      const response = NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      return addSecurityHeaders(response);
    }

    // Note the current banner before replacing it, so the old object can be
    // reclaimed once the new upload has succeeded.
    let previousObjectName: string | null = null;
    try {
      const currentHero = await prisma.heroContent.findUnique({ where: { id: "hero" } });
      if (currentHero?.backgroundImageUrl) {
        previousObjectName = objectNameFromPublicUrl(currentHero.backgroundImageUrl);
      }
    } catch (dbErr) {
      console.error("Failed to query current hero for old image:", dbErr);
    }

    const result = await uploadImage(file, { prefix: "banner-" });
    if (!result.ok) {
      const response = NextResponse.json({ error: result.error }, { status: result.status });
      return addSecurityHeaders(response);
    }

    if (previousObjectName && previousObjectName !== result.objectName) {
      await deleteImage(previousObjectName);
    }

    const response = NextResponse.json({
      success: true,
      url: result.url,
      name: file.name,
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Hero Supabase upload error:", error);
    const response = NextResponse.json({ error: "Internal server error during upload." }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
