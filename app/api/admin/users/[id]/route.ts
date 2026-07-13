import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin, isSuperAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

// Validation schema for target ID in URL
const uuidParamSchema = z.string().uuid("Invalid user ID format");

// Validation schema for updating user profile
const updateProfileSchema = z.object({
  email: z.string().email("Invalid email format").max(100).optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores")
    .optional(),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET: Retrieve a specific admin user's profile with authorization checks
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // 1. Authenticate the acting admin from session cookie
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const actingAdmin = authResult.admin;

    // 2. Validate URL parameter ID
    const { id: rawTargetId } = await context.params;
    const targetIdResult = uuidParamSchema.safeParse(rawTargetId);

    if (!targetIdResult.success) {
      const response = NextResponse.json({ error: "Invalid resource identifier" }, { status: 400 });
      return addSecurityHeaders(response);
    }

    const targetId = targetIdResult.data;

    // 3. Authorization Check (IDOR Prevention)
    // A user can only access their OWN record, unless they are the super admin
    const isOwner = actingAdmin.id === targetId;

    if (!isOwner && !isSuperAdmin(actingAdmin)) {
      const response = NextResponse.json(
        { error: "Access Denied: You do not have permission to view this resource." },
        { status: 403 }
      );
      return addSecurityHeaders(response);
    }

    // 4. Fetch resource
    const targetAdmin = await prisma.adminUser.findFirst({
      where: { id: targetId, is_active: true },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!targetAdmin) {
      const response = NextResponse.json({ error: "Resource not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const response = NextResponse.json({ success: true, data: targetAdmin });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("GET admin user resource error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

// PATCH: Update a specific admin user's profile with authorization checks
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // 1. Authenticate the acting admin from session cookie
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const actingAdmin = authResult.admin;

    // 2. Validate URL parameter ID
    const { id: rawTargetId } = await context.params;
    const targetIdResult = uuidParamSchema.safeParse(rawTargetId);

    if (!targetIdResult.success) {
      const response = NextResponse.json({ error: "Invalid resource identifier" }, { status: 400 });
      return addSecurityHeaders(response);
    }

    const targetId = targetIdResult.data;

    // 3. Authorization Check (IDOR Prevention)
    // A user can only modify their OWN record, unless they are the super admin
    const isOwner = actingAdmin.id === targetId;

    if (!isOwner && !isSuperAdmin(actingAdmin)) {
      const response = NextResponse.json(
        { error: "Access Denied: You do not have permission to modify this resource." },
        { status: 403 }
      );
      return addSecurityHeaders(response);
    }

    // 4. Validate body inputs
    const body = await request.json().catch(() => ({}));
    const parseResult = updateProfileSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid update data", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const updateData = parseResult.data;

    // Ensure there is something to update
    if (Object.keys(updateData).length === 0) {
      const response = NextResponse.json({ error: "No fields to update provided" }, { status: 400 });
      return addSecurityHeaders(response);
    }

    // A deactivated admin is not editable — it is gone as far as the API is concerned.
    const target = await prisma.adminUser.findFirst({
      where: { id: targetId, is_active: true },
      select: { id: true },
    });

    if (!target) {
      const response = NextResponse.json({ error: "Resource not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    // Sanitization of inputs
    if (updateData.email) {
      updateData.email = updateData.email.trim().toLowerCase();
    }
    if (updateData.username) {
      updateData.username = updateData.username.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    }

    // If changing email/username, check if it's already taken
    if (updateData.email || updateData.username) {
      const conflicts = await prisma.adminUser.findFirst({
        where: {
          id: { not: targetId },
          OR: [
            ...(updateData.email ? [{ email: updateData.email }] : []),
            ...(updateData.username ? [{ username: updateData.username }] : []),
          ],
        },
      });

      if (conflicts) {
        const field = conflicts.email === updateData.email ? "email" : "username";
        const response = NextResponse.json(
          { error: `This ${field} is already taken by another user.` },
          { status: 409 }
        );
        return addSecurityHeaders(response);
      }
    }

    // 5. Update resource
    const updatedAdmin = await prisma.adminUser.update({
      where: { id: targetId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedAdmin,
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("PATCH admin user resource error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

// DELETE: Delete a specific admin user with strict authorization checks
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // 1. Authenticate the acting admin from session cookie
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const actingAdmin = authResult.admin;

    // 2. Strict Authorization Check: Only the Super Admin can delete.
    // The configured super-admin address is not echoed back — an unauthorised
    // caller has no need to learn it.
    if (!isSuperAdmin(actingAdmin)) {
      const response = NextResponse.json(
        { error: "Access Denied: Only the Super Admin can remove other admins." },
        { status: 403 }
      );
      return addSecurityHeaders(response);
    }

    // 3. Validate URL parameter ID
    const { id: rawTargetId } = await context.params;
    const targetIdResult = uuidParamSchema.safeParse(rawTargetId);

    if (!targetIdResult.success) {
      const response = NextResponse.json({ error: "Invalid resource identifier" }, { status: 400 });
      return addSecurityHeaders(response);
    }

    const targetId = targetIdResult.data;

    // 4. Prevent self-deletion
    if (actingAdmin.id === targetId) {
      const response = NextResponse.json(
        { error: "Access Denied: You cannot delete your own admin account." },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    // 5. Check if the target admin exists
    const targetAdmin = await prisma.adminUser.findFirst({
      where: { id: targetId, is_active: true },
    });

    if (!targetAdmin) {
      const response = NextResponse.json({ error: "Admin user not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    // 6. Deactivate the admin user. Their sessions and OTPs are destroyed rather
    // than deactivated: those are live credentials, and a soft delete used to be
    // covered by the cascade on a real DELETE. Without this the removed admin
    // keeps a working refresh token until it expires.
    await prisma.$transaction([
      prisma.adminUser.update({
        where: { id: targetId },
        data: { is_active: false },
      }),
      prisma.session.deleteMany({ where: { adminId: targetId } }),
      prisma.otp.deleteMany({ where: { adminId: targetId } }),
    ]);

    const response = NextResponse.json({
      success: true,
      message: "Admin user removed successfully.",
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("DELETE admin user error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

