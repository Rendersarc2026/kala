"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-900/50 text-red-200 text-xs tracking-wider uppercase font-medium">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="block text-[10px] tracking-widest text-white/50 uppercase font-medium">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-colors duration-300 font-light"
          placeholder="admin@kala.design"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-[10px] tracking-widest text-white/50 uppercase font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-colors duration-300 font-light"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-500 disabled:cursor-not-allowed transition-all duration-300 text-xs tracking-widest font-bold uppercase mt-8"
      >
        {isLoading ? "AUTHENTICATING..." : "SIGN IN"}
      </button>
    </form>
  );
}
