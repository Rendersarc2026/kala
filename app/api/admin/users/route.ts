import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/app/api/auth/login/route";

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

    // Check if email already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existing) {
      const response = NextResponse.json({ error: "An admin user with this email already exists" }, { status: 409 });
      return addSecurityHeaders(response);
    }

    // Set a default username from email prefix
    const emailPrefix = sanitizedEmail.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
    let username = emailPrefix || "admin_user";
    
    // Check for username collisions and append random numbers if needed
    const usernameConflict = await prisma.adminUser.findUnique({ where: { username } });
    if (usernameConflict) {
      username = `${username}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const admin = await prisma.adminUser.create({
      data: {
        email: sanitizedEmail,
        username,
        hashedPassword: "passwordless", // Passwordless model requires a dummy hashedPassword since schema requires it
        role: "ADMIN",
        mustChangePassword: false,
      },
    });

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
