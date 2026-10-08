import { signIn } from "@/app/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;

  async function login(formData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/",
      });
    } catch (err) {
      if (err instanceof AuthError) redirect("/login?error=1");
      throw err;
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent" />

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-white ring-2 ring-[#D32F2F] p-0.5 mb-3 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="City University Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to your CampusOS account</p>
        </div>

        {/* Form */}
        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="student@cu.edu"
              required
              className="w-full bg-slate-800/90 border border-slate-700 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-slate-800/90 border border-slate-700 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800/50 text-red-300 text-xs rounded-lg text-center">
              Invalid email or password. Please try again.
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-red-900/20 text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#D32F2F] hover:underline font-semibold ml-1">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}