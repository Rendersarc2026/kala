import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // If already logged in, skip login page and redirect to dashboard
  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#121212] border border-white/5 p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold tracking-widest text-white mb-2">KALA.</h1>
          <span className="text-[9px] tracking-[0.3em] text-white/40 uppercase font-bold">
            STUDIO CONTROL PANEL
          </span>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
