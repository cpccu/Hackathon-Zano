import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/auth";
import { formatDate } from "@/app/lib/format";

export default async function LostFoundPage({ searchParams }) {
  const { q = "", type = "" } = await searchParams;
  const session = await auth();
  const user = session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  const items = await prisma.lostFoundItem.findMany({
    where: {
      status: "OPEN",
      ...(type && { type }),
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    include: { reporter: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  async function resolve(formData) {
    "use server";
    const s = await auth();
    if (!s?.user) return;
    const id = formData.get("id");
    const item = await prisma.lostFoundItem.findUnique({ where: { id } });
    if (!item) return;
    if (item.reporterId !== s.user.id && s.user.role !== "ADMIN") return;
    await prisma.lostFoundItem.update({ where: { id }, data: { status: "RESOLVED" } });
    revalidatePath("/lost-found");
  }

  const inputClass =
    "bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition duration-200";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Campus Lost & Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Report misplaced items or help reconnect lost belongings with their owners.
          </p>
        </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {user && (
            <Link
              href={user?.role === "ADMIN" ? "/admin/complaints" : "/complaints"}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs tracking-wide border border-slate-700/60 transition-all duration-200 active:scale-[0.98]"
              >
              {user?.role === "ADMIN" ? "📋 Manage Complaints" : "📝 File a Complaint"}
            </Link>
            )}
            {isAdmin && (
            <Link
              href="/lost-found/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold text-xs tracking-wide transition-all duration-200 shadow-lg shadow-red-950/40 active:scale-[0.98]"
            >
              ➕ Post New Item
            </Link>
            )}     
          </div>
      </div>

      {/* Search & Filter Form */}
      <form className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search items (e.g. ID card, keys, library)..."
            className={`${inputClass} w-full`}
          />
        </div>

        <select name="type" defaultValue={type} className={`${inputClass} cursor-pointer`}>
          <option value="" className="bg-slate-900 text-slate-100">
            All Status (Lost & Found)
          </option>
          <option value="LOST" className="bg-slate-900 text-slate-100">
            Lost Items
          </option>
          <option value="FOUND" className="bg-slate-900 text-slate-100">
            Found Items
          </option>
        </select>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs tracking-wide border border-slate-700/60 transition duration-200"
        >
          Search
        </button>
      </form>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-12 text-center text-slate-400 text-sm backdrop-blur-xl">
          📦 No active lost or found items posted matching your criteria.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <div
              key={i.id}
              className="bg-slate-900/80 border border-slate-800/90 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col justify-between group hover:border-slate-700 transition duration-300"
            >
              <div>
                {/* Optional Image Banner */}
                {i.imageUrl ? (
                  <div className="relative h-48 w-full overflow-hidden border-b border-slate-800">
                    <img
                      src={i.imageUrl}
                      alt={i.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-24 bg-gradient-to-br from-slate-950 to-slate-900 border-b border-slate-800/80 flex items-center justify-center text-slate-700 text-2xl font-bold">
                    🔍
                  </div>
                )}

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                        i.type === "LOST"
                          ? "bg-red-950/40 text-red-400 border-red-900/40"
                          : "bg-emerald-950/40 text-emerald-400 border-emerald-900/40"
                      }`}
                    >
                      {i.type === "LOST" ? "LOST ITEM" : "FOUND ITEM"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      📅 {formatDate(i.date).split(",")[0]}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-red-400 transition-colors line-clamp-1">
                    {i.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {i.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <span>📍</span>
                      <span className="text-slate-200 font-medium">{i.location}</span>
                    </p>
                    {i.contact && (
                      <p className="flex items-center gap-1.5">
                        <span>📞</span>
                        <span className="text-slate-200 font-mono">{i.contact}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer / Reporter & Resolve CTA */}
              <div className="px-5 py-3.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 truncate max-w-[150px]">
                  Posted by <span className="text-slate-300 font-medium">{i.reporter.name}</span>
                </span>

                {user && (user.id === i.reporterId || user.role === "ADMIN") && (
                  <form action={resolve}>
                    <input type="hidden" name="id" value={i.id} />
                    <button
                      type="submit"
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition"
                    >
                      ✓ Mark Resolved
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}