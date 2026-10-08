import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { DEPARTMENTS, CATEGORIES } from "@/app/lib/constants";
import { formatDate } from "@/app/lib/format";
import { auth } from "@/app/auth";

export default async function ResourcesPage({ searchParams }) {
  const { q = "", dept = "", category = "" } = await searchParams;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const resources = await prisma.resource.findMany({
    where: {
      ...(dept && { department: dept }),
      ...(category && { category }),
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { course: { code: { contains: q, mode: "insensitive" } } },
          { course: { title: { contains: q, mode: "insensitive" } } },
        ],
      }),
    },
    include: { course: true, uploader: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const inputClass =
    "bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition duration-200";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Academic Resource Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse course materials, lecture notes, lab sheets, and past examination papers.
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/resources/upload"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold text-xs tracking-wide transition-all duration-200 shadow-lg shadow-red-950/40 active:scale-[0.98]"
          >
            📤 Upload Resource
          </Link>
        )}
      </div>

      {/* Search & Filter Controls */}
      <form className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title or course code (e.g. CSE201)..."
            className={`${inputClass} w-full`}
          />
        </div>

        <select name="dept" defaultValue={dept} className={`${inputClass} cursor-pointer`}>
          <option value="" className="bg-slate-900 text-slate-100">
            All Departments
          </option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d} className="bg-slate-900 text-slate-100">
              {d}
            </option>
          ))}
        </select>

        <select name="category" defaultValue={category} className={`${inputClass} cursor-pointer`}>
          <option value="" className="bg-slate-900 text-slate-100">
            All Categories
          </option>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <option key={k} value={k} className="bg-slate-900 text-slate-100">
              {v}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs tracking-wide border border-slate-700/60 transition duration-200"
        >
          Search
        </button>
      </form>

      {/* Resource Grid */}
      {resources.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-12 text-center text-slate-400 text-sm backdrop-blur-xl">
          📚 No academic resources found matching your search filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <a
              key={r.id}
              href={r.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="group bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-red-400 bg-red-950/40 border border-red-900/40 px-2.5 py-0.5 rounded-full">
                    {CATEGORIES[r.category] || r.category}
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-red-400 transition-colors">
                    Download ↗
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-red-400 transition-colors line-clamp-2">
                  {r.title}
                </h2>

                <p className="text-xs text-slate-400 font-medium">
                  {r.department}
                  {r.course ? ` · ${r.course.code}` : ""}
                  {r.semester ? ` · ${r.semester}` : ""}
                </p>

                {r.description && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 pt-1">
                    {r.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>By {r.uploader.name}</span>
                <span>{formatDate(r.createdAt)}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}