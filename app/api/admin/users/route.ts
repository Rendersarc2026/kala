import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin, isSuperAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

const createUserSchema = z.object({
  email: z.string().email("Invalid email format").max(100),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const admins = await prisma.adminUser.findMany({
      where: { is_active: true },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const response = NextResponse.json({ success: true, data: admins });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("GET admins error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    // Creating an admin grants standing access to every admin route, so it is
    // restricted to the super admin — matching the guard on DELETE.
    if (!isSuperAdmin(authResult.admin)) {
      const response = NextResponse.json(
        { error: "Access Denied: Only the Super Admin can create new admin users." },
        { status: 403 }
      );
      return addSecurityHeaders(response);
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = createUserSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const { email } = parseResult.data;
    const sanitizedEmail = email.trim().toLowerCase();

    // `email` is unique across every row, including deactivated ones. Only a live
    // admin is a genuine conflict; a deactivated row holding the address is
    // reactivated below, so removing and re-adding an admin keeps working.
    const existing = await prisma.adminUser.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existing?.is_active) {
      const response = NextResponse.json({ error: "An admin user with this email already exists" }, { status: 409 });
      return addSecurityHeaders(response);
    }

    let admin;

    if (existing) {
      admin = await prisma.adminUser.update({
        where: { id: existing.id },
        data: { is_active: true, role: "ADMIN" },
      });
    } else {
      // Set a default username from email prefix
      const emailPrefix = sanitizedEmail.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
      let username = emailPrefix || "admin_user";

      // Check for username collisions and append random numbers if needed
      const usernameConflict = await prisma.adminUser.findUnique({ where: { username } });
      if (usernameConflict) {
        username = `${username}_${Math.floor(100 + Math.random() * 900)}`;
      }

      admin = await prisma.adminUser.create({
        data: {
          email: sanitizedEmail,
          username,
          role: "ADMIN",
        },
      });
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    }, { status: 201 });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("POST admin user error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
