import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/app/api/auth/login/route";
import { prisma } from "@/lib/prisma";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate admin
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      const response = NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      return addSecurityHeaders(response);
    }

    // 3. Validate file type (raster images only).
    // SVG is intentionally excluded: it can embed <script>/onload handlers and
    // become a stored-XSS vector, and file.type here is client-controlled.
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      const response = NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, GIF, and WEBP images are allowed." },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    // 4. Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const response = NextResponse.json(
        { error: "File size exceeds the 5MB limit." },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    // 5. Get Supabase Configuration
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseBucket = process.env.SUPABASE_BUCKET_NAME || "kala images";

    if (!supabaseUrl || !supabaseServiceKey) {
      const response = NextResponse.json(
        { error: "Supabase storage is not configured on the server." },
        { status: 500 }
      );
      return addSecurityHeaders(response);
    }

    // 6. Query current hero configuration to find previous file to delete
    let oldImageFilename: string | null = null;
    try {
      const currentHero = await prisma.heroContent.findUnique({
        where: { id: "hero" },
      });
      if (currentHero && currentHero.backgroundImageUrl) {
        const url = currentHero.backgroundImageUrl;
        const bucketPathSegment = `/storage/v1/object/public/${encodeURIComponent(supabaseBucket)}/`;
        if (url.includes(bucketPathSegment)) {
          oldImageFilename = url.substring(url.indexOf(bucketPathSegment) + bucketPathSegment.length);
        }
      }
    } catch (dbErr) {
      console.error("Failed to query current hero for old image:", dbErr);
    }

    // 7. Generate a unique name for the new file
    const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
    const safeBaseName = path.basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
    const uniqueName = `banner-${safeBaseName}-${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;

    // 8. Upload to Supabase Storage REST API
    const encodedBucket = encodeURIComponent(supabaseBucket);
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${encodedBucket}/${uniqueName}`;
    const buffer = await file.arrayBuffer();

    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": file.type,
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("Supabase Storage upload failed response:", errorText);
      const response = NextResponse.json(
        { error: `Supabase upload failed: ${uploadRes.statusText}` },
        { status: 502 }
      );
      return addSecurityHeaders(response);
    }

    // 9. Safely delete the previous image file from Supabase Storage
    if (oldImageFilename) {
      try {
        const deleteUrl = `${supabaseUrl}/storage/v1/object/${encodedBucket}`;
        const deleteRes = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prefixes: [oldImageFilename] }),
        });
        if (!deleteRes.ok) {
          console.warn("Failed to delete old banner image from Supabase:", await deleteRes.text());
        }
      } catch (deleteErr) {
        console.error("Failed to delete old banner image from Supabase:", deleteErr);
      }
    }

    // 10. Return success response with file URL
    const fileUrl = `${supabaseUrl}/storage/v1/object/public/${encodedBucket}/${uniqueName}`;
    const response = NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Hero Supabase upload error:", error);
    const response = NextResponse.json({ error: "Internal server error during upload." }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
