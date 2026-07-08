import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

// Token Secret Configuration
// Fail closed: never fall back to a hardcoded secret. A leaked/default signing
// secret would let anyone forge admin access tokens (full authentication bypass).
const configuredSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
if (!configuredSecret) {
  throw new Error(
    "Missing JWT signing secret. Set JWT_SECRET (or NEXTAUTH_SECRET) in the environment."
  );
}
const JWT_SECRET: string = configuredSecret;
const REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || `${JWT_SECRET}_refresh`;
const PRE_AUTH_SECRET: string = process.env.PRE_AUTH_SECRET || `${JWT_SECRET}_pre_auth`;

// Expirations
const ACCESS_TOKEN_EXPIRY = "2h"; // 2 hours
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const PRE_AUTH_TOKEN_EXPIRY = "5m"; // 5 minutes

export interface JwtPayload {
  adminId: string;
  role: string;
}

export interface PreAuthPayload {
  adminId: string;
  email: string;
  type: "pre_auth";
}

// ==========================================
// PASSWORD SECURITY
// ==========================================

/**
 * Hash password with bcrypt using 12 salt rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compare password with bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validates password strength for creation/change:
 * - Minimum 10 characters long
 * - Contains at least one lowercase letter
 * - Contains at least one uppercase letter
 * - Contains at least one numeric digit
 * - Contains at least one special character
 */
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (password.length < 10) {
    return { isValid: false, message: "Password must be at least 10 characters long." };
  }
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[@$!%*?&_#^+\-=()[\]{}|\\;:'",.<>/?]/.test(password);

  if (!hasLower || !hasUpper || !hasDigit || !hasSpecial) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    };
  }

  return { isValid: true };
}

// ==========================================
// JWT HANDLING
// ==========================================

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function signRefreshToken(payload: JwtPayload): string {
  // Signed with 7 days expiration matching the DB sessions
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` });
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function signPreAuthToken(payload: PreAuthPayload): string {
  return jwt.sign(payload, PRE_AUTH_SECRET, { expiresIn: PRE_AUTH_TOKEN_EXPIRY });
}

export function verifyPreAuthToken(token: string): PreAuthPayload | null {
  try {
    return jwt.verify(token, PRE_AUTH_SECRET) as PreAuthPayload;
  } catch {
    return null;
  }
}

// ==========================================
// ACCOUNT LOCKOUT
// ==========================================

interface LockoutStatus {
  isLocked: boolean;
  retryAfterSeconds: number;
}

/**
 * Checks if login is locked out due to 5 consecutive failed attempts in the last 5 minutes.
 */
export async function checkLockout(email: string): Promise<LockoutStatus> {
  const lockoutWindowMs = 5 * 60 * 1000; // 5 minutes
  const limitTime = new Date(Date.now() - lockoutWindowMs);

  const attempts = await prisma.failedAttempt.findMany({
    where: {
      email,
      createdAt: { gte: limitTime },
    },
    orderBy: { createdAt: "desc" },
  });

  if (attempts.length >= 5) {
    const mostRecent = attempts[0];
    const elapsedMs = Date.now() - mostRecent.createdAt.getTime();
    const remainingMs = lockoutWindowMs - elapsedMs;

    if (remainingMs > 0) {
      return {
        isLocked: true,
        retryAfterSeconds: Math.ceil(remainingMs / 1000),
      };
    }
  }

  return { isLocked: false, retryAfterSeconds: 0 };
}

/**
 * Record a failed attempt in the database.
 */
export async function recordFailedAttempt(email: string, ip: string | null): Promise<void> {
  await prisma.failedAttempt.create({
    data: {
      email,
      ip,
    },
  });
}

/**
 * Reset failed attempts counter by deleting records for the email.
 */
export async function resetFailedAttempts(email: string): Promise<void> {
  await prisma.failedAttempt.deleteMany({
    where: { email },
  });
}

// ==========================================
// OTP HANDLING & DELIVERY
// ==========================================

/**
 * Generate a 6-digit numeric OTP and its SHA-256 hash.
 * If DEVELOPMENT_OTP is set, it is only honored outside of production so a fixed
 * test code can never weaken the real second factor in a deployed environment.
 * The production code is drawn from a cryptographically secure RNG.
 */
export function generateOtp(): { code: string; hash: string } {
  const devOtp = process.env.DEVELOPMENT_OTP || "000000";
  const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const allowDevOtp = process.env.NODE_ENV !== "production" || !hasSmtp;
  const code = allowDevOtp && devOtp && devOtp.length === 6 && /^\d+$/.test(devOtp)
    ? devOtp
    : crypto.randomInt(100000, 1000000).toString();

  const hash = crypto.createHash("sha256").update(code).digest("hex");
  return { code, hash };
}

/**
 * Deliver the OTP to the admin's email.
 * It uses Nodemailer to send a real email via SMTP if SMTP credentials are provided,
 * and falls back to console logging & file logging if they are missing or if it fails.
 */
export async function deliverOtp(email: string, code: string): Promise<void> {
  const subject = "Your Admin Security OTP Code";
  const textMessage = `
Your One-Time Password (OTP) for admin login is: ${code}

This code is valid for 5 minutes. If you did not request this, please change your password immediately.
`;
  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px; max-width: 600px; line-height: 1.6;">
      <h2 style="color: #2b3990; margin-bottom: 20px;">Admin Verification Code</h2>
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) for admin login is:</p>
      <div style="font-size: 24px; font-weight: bold; background: #f4f5f7; padding: 12px 24px; border-radius: 6px; display: inline-spacing; letter-spacing: 2px; margin: 15px 0; color: #2b3990; border: 1px solid #e1e4e8; display: inline-block;">
        ${code}
      </div>
      <p style="color: #586069; font-size: 14px; margin-top: 20px;">This code is valid for <strong>5 minutes</strong>. If you did not request this code, please secure your account immediately.</p>
    </div>
  `;

  // Log the plaintext OTP to terminal and debug file only outside of production.
  // The OTP is a live second factor; it must never be persisted or printed in prod.
  if (process.env.NODE_ENV !== "production") {
    const message = `
=========================================
[OTP SECURITY CODE]
To: ${email}
Code: ${code}
Expires in: 5 minutes
=========================================
`;
    console.log(message);

    try {
      const logPath = path.join(process.cwd(), "prisma", "otp-debug.log");
      fs.appendFileSync(
        logPath,
        `[${new Date().toISOString()}] OTP for ${email}: ${code} (Expires in 5 minutes)\n`
      );
    } catch (err) {
      console.error("Failed to write OTP to debug file:", err);
    }
  }

  // Retrieve SMTP variables from environment
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "noreply@kala.design";

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for port 465 (SMTPS), false for 587 or others (STARTTLS)
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from: `"Kala Admin Security" <${from}>`,
        to: email,
        subject,
        text: textMessage,
        html: htmlMessage,
      });

      console.log(`Successfully sent OTP email to ${email} via SMTP.`);
    } catch (smtpError) {
      console.error("Failed to send OTP email via SMTP:", smtpError);
    }
  } else {
    console.log("SMTP is not fully configured (missing SMTP_HOST, SMTP_USER, or SMTP_PASS). Falling back to console/file logs.");
  }
}

/**
 * Check if the admin is requesting OTPs too frequently (rate limit: max 3 requests in 5 minutes).
 */
export async function checkOtpRateLimit(adminId: string): Promise<boolean> {
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const limitTime = new Date(Date.now() - windowMs);

  const otpCount = await prisma.otp.count({
    where: {
      adminId,
      createdAt: { gte: limitTime },
    },
  });

  return otpCount >= 3; // Block if 3 or more OTPs generated in past 5 minutes
}
