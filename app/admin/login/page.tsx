"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

type FormStep = "credentials" | "otp" | "change-password";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  // Step 1: Credentials
  const [identifier, setIdentifier] = useState("");

  // Step 2: OTP
  const [otpCode, setOtpCode] = useState("");
  const [otpSentMessage, setOtpSentMessage] = useState("");

  // Lockout State
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<number>(0);

  // Handle Lockout countdown
  useEffect(() => {
    if (lockoutTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setLockoutTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTimeLeft]);

  // Reset errors when inputs change
  useEffect(() => {
    setError(null);
    setValidationErrors({});
  }, [identifier, otpCode]);

  // Redirect to dashboard if already authenticated (handles back button after login via bfcache)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/profile");
        if (res.ok) {
          router.replace("/admin");
        }
      } catch {
        // Not authenticated, stay on login page
      }
    };

    checkAuth();

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        checkAuth();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  // Step 1 Submission: Login Credentials
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 423) {
          // Locked out
          setLockoutTimeLeft(data.retryAfter || 300);
          setError(data.error);
        } else if (data.details) {
          setValidationErrors(data.details);
          setError("Input validation failed.");
        } else {
          setError(data.error || "Invalid credentials.");
        }
        setLoading(false);
        return;
      }

      // Succeeded. If OTP is required, move to step 2.
      if (data.requireOtp) {
        setOtpSentMessage(data.message);
        setStep("otp");
      } else {
        // Fallback if OTP is bypassed (should not happen)
        router.push("/admin");
      }
    } catch (err) {
      setError(
        "Unable to connect to the authentication server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Submission: Verify OTP Code
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 423) {
          // Locked out
          setLockoutTimeLeft(data.retryAfter || 300);
          setError(data.error);
        } else {
          setError(data.error || "Verification failed.");
        }
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] px-6 py-12 relative overflow-hidden select-none font-sans">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#ffffff]/1 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#ffffff]/1 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 transition-all duration-500 transform scale-100">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-[0.3em] text-[#ffffff] mb-2 select-text font-serif">
            KALA
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#ffffff]/40 font-semibold font-sans">
            Administration Portal
          </p>
        </div>

        {/* Form Box */}
        <div className="bg-[#121212]/90 border border-[#ffffff]/10 rounded-xl p-8 backdrop-blur-md shadow-2xl relative">
          {/* Top Line Decor */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffffff]/30 to-transparent rounded-t-xl" />

          {/* Form Step Headers */}
          <div className="mb-6">
            <h2 className="text-xl font-light tracking-wide text-[#ffffff]">
              {step === "credentials" && "Sign In"}
              {step === "otp" && "Verification"}
            </h2>
            <p className="text-xs text-[#ffffff]/50 mt-1">
              {step === "credentials" &&
                "Please enter your administrative email address."}
              {step === "otp" &&
                (otpSentMessage ||
                  "A 2FA authentication code has been sent to your email.")}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-xs flex items-start gap-2.5 mb-5 animate-pulse">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Locked Out Alert */}
          {lockoutTimeLeft > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg p-3 text-xs text-center mb-5 font-semibold">
              Lockout active: Please try again in {lockoutTimeLeft}s
            </div>
          )}

          {/* STEP 1: CREDENTIALS FORM */}
          {step === "credentials" && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#ffffff]/60 font-semibold">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#ffffff]/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled={loading || lockoutTimeLeft > 0}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-[#1A1A1A] border border-[#ffffff]/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#ffffff] placeholder-[#ffffff]/20 focus:outline-none focus:border-[#ffffff]/30 transition-colors disabled:opacity-55"
                  />
                </div>
                {validationErrors.identifier && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {validationErrors.identifier[0]}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || lockoutTimeLeft > 0}
                className="w-full bg-[#ffffff] text-[#000000] font-semibold text-xs uppercase tracking-widest rounded-lg py-3 hover:bg-gray-200 transition-all cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#000000]" />
                ) : (
                  <>
                    Continue{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION FORM */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#ffffff]/60 font-semibold block text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  disabled={loading || lockoutTimeLeft > 0}
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  className="w-full bg-[#1A1A1A] border border-[#ffffff]/10 rounded-lg py-3 text-center text-xl font-bold tracking-[6px] text-[#ffffff] focus:outline-none focus:border-[#ffffff]/30 transition-colors disabled:opacity-55"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStep("credentials")}
                  className="w-1/3 bg-transparent border border-[#ffffff]/10 hover:border-[#ffffff]/20 text-[#ffffff]/70 font-semibold text-[10px] uppercase tracking-widest rounded-lg py-3 transition-all cursor-pointer text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || lockoutTimeLeft > 0 || otpCode.length !== 6
                  }
                  className="w-2/3 bg-[#ffffff] text-[#000000] font-semibold text-[10px] uppercase tracking-widest rounded-lg py-3 hover:bg-gray-200 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#000000]" />
                  ) : (
                    <>
                      Verify <ShieldCheck className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
