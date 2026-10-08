import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";
import { formatDate } from "@/app/lib/format";

const STATUS_BADGES = {
  RECEIVED: "bg-amber-950/60 text-amber-400 border border-amber-900/50",
  IN_PROGRESS: "bg-blue-950/60 text-blue-400 border border-blue-900/50",
  RESOLVED: "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50",
};

export default async function AdminComplaintsPage() {
  await requireAdmin();
  const complaints = await prisma.complaint.findMany({
    include: { user: { select: { name: true, studentId: true } } },
    orderBy: { createdAt: "desc" },
  });

  async function update(formData) {
    "use server";
    await requireAdmin();
    await prisma.complaint.update({
      where: { id: formData.get("id") },
      data: {
        status: formData.get("status"),
        adminNote: formData.get("adminNote") || null,
      },
    });
    revalidatePath("/admin/complaints");
  }

  const inputClass =
    "bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition duration-200";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
      {/* Page Header */}
      <div className="border-b border-slate-800/80 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-red-400 border border-red-900/40 bg-red-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Admin Panel
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            All Student Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review, update status, and attach official resolution notes for student filings.
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl hidden sm:block">
          {complaints.length} {complaints.length === 1 ? "Complaint" : "Complaints"}
        </span>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.map((c) => (
          <form
            key={c.id}
            action={update}
            className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4 hover:border-slate-700/80 transition duration-200"
          >
            <input type="hidden" name="id" value={c.id} />

            {/* Title & Badge Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">{c.subject}</h3>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                  STATUS_BADGES[c.status] || "bg-slate-800 text-slate-300"
                }`}
              >
                {c.status.replace("_", " ")}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{c.description}</p>

            {/* Student Meta Info */}
            <div className="text-[11px] text-slate-500 font-mono flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-sans font-semibold">
                👤 {c.user.name}
                {c.user.studentId ? ` (${c.user.studentId})` : ""}
              </span>
              <span>·</span>
              <span>📅 {formatDate(c.createdAt)}</span>
              <span>·</span>
              <span>Ref #{c.id.slice(-6)}</span>
            </div>

            {/* Admin Form Controls */}
            <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select
                name="status"
                defaultValue={c.status}
                className={`${inputClass} cursor-pointer font-semibold shrink-0`}
              >
                <option value="RECEIVED" className="bg-slate-900 text-amber-400">
                  Received
                </option>
                <option value="IN_PROGRESS" className="bg-slate-900 text-blue-400">
                  In progress
                </option>
                <option value="RESOLVED" className="bg-slate-900 text-emerald-400">
                  Resolved
                </option>
              </select>

              <input
                name="adminNote"
                defaultValue={c.adminNote || ""}
                placeholder="Attach resolution note to student..."
                className={`${inputClass} flex-1`}
              />

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider transition duration-200 shadow-md shadow-red-950/40 active:scale-[0.98] shrink-0"
              >
                Save Changes
              </button>
            </div>
          </form>
        ))}

        {complaints.length === 0 && (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-10 text-center text-slate-500 text-xs">
            No complaints submitted by students yet.
          </div>
        )}
      </div>
    </div>
  );
}