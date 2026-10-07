import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/app/auth";

const links = [
  { href: "/events", label: "Events" },
  { href: "/resources", label: "Resources" },
  { href: "/helpdesk", label: "Helpdesk" },
  { href: "/lost-found", label: "Lost & Found" },
];

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  const logout = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1E293B]/85 backdrop-blur-md text-white border-b border-slate-700/80 shadow-md transition-all">
      <nav className="max-w-6xl mx-auto flex items-center gap-6 px-4 h-20">
        {/* Brand & Larger Logo */}
        <Link href="/" className="flex items-center gap-4 font-bold text-xl hover:opacity-90 transition-opacity">
          <Image
            src="/images/logo.png"
            alt="City University Logo"
            width={52}
            height={52}
            className="rounded-full bg-white object-contain shadow-sm"
            priority
          />
          <div className="flex items-center gap-2">
            <span className="tracking-tight text-white font-bold text-xl">Campus<span className="text-[#D32F2F]">OS</span></span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 ml-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right Auth Area */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm font-medium text-slate-200">{user.name}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/50 font-medium">
                {user.role}
              </span>
              <form action={logout}>
                <button className="text-sm px-3.5 py-2 rounded-md border border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium px-3.5 py-2 text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium px-4 py-2 rounded-md bg-[#D32F2F] text-white hover:bg-[#B71C1C] transition-colors shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Dropdown */}
        <details className="md:hidden ml-auto relative">
          <summary className="list-none cursor-pointer px-3.5 py-2 rounded-md border border-slate-600 text-slate-200 text-sm hover:bg-slate-800">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-56 bg-[#1E293B]/95 backdrop-blur-lg border border-slate-700 rounded-lg shadow-xl p-2 flex flex-col z-50 text-slate-200">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-md text-sm hover:bg-slate-800 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <hr className="my-2 border-slate-700" />
            {user ? (
              <>
                <span className="px-3 py-1 text-xs text-slate-400">
                  {user.name} · {user.role}
                </span>
                <form action={logout}>
                  <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-slate-800 text-red-400">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 rounded-md text-sm hover:bg-slate-800">
                  Login
                </Link>
                <Link href="/signup" className="px-3 py-2 rounded-md text-sm text-[#D32F2F] hover:bg-slate-800 font-semibold">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </details>
      </nav>
    </header>
  );
}