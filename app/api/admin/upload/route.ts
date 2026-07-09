import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";
import { uploadImage } from "@/lib/upload";

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

    const result = await uploadImage(file);
    if (!result.ok) {
      const response = NextResponse.json({ error: result.error }, { status: result.status });
      return addSecurityHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      url: result.url,
      name: file.name,
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Upload error:", error);
    const response = NextResponse.json({ error: "Internal server error during upload." }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
