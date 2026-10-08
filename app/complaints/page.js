import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/session";
import { formatDate } from "@/app/lib/format";

const COLORS = {
  RECEIVED: "bg-amber-950/60 text-amber-400 border border-amber-900/50",
  IN_PROGRESS: "bg-blue-950/60 text-blue-400 border border-blue-900/50",
  RESOLVED: "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50",
};

export default async function ComplaintsPage() {
  const user = await requireUser();
  const complaints = await prisma.complaint.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  async function submit(formData) {
    "use server";
    const u = await requireUser();
    await prisma.complaint.create({
      data: {
        subject: formData.get("subject"),
        description: formData.get("description"),
        userId: u.id,
      },
    });
    revalidatePath("/complaints");
  }

  const inputClass =
    "w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition duration-200";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-xs font-semibold text-red-400 border border-red-900/40 bg-red-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Student Support
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
          Complaint Box
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Submit official complaints or feedback regarding campus services and track status in real-time.
        </p>
      </div>

      {/* Submit Form Card */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
        <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800/80 pb-3">
          File a New Complaint
        </h2>

        <form action={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              name="subject"
              placeholder="e.g. WiFi connectivity issue in Library Block B"
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Describe the issue in detail..."
              required
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider transition duration-200 shadow-lg shadow-red-950/40 active:scale-[0.98]"
          >
            📩 Submit Complaint
          </button>
        </form>
      </div>

      {/* User Complaints List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">My Filed Complaints</h2>
          <span className="text-xs text-slate-500 font-mono">
            {complaints.length} {complaints.length === 1 ? "Record" : "Records"}
          </span>
        </div>

        <div className="space-y-3">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-xl space-y-3 hover:border-slate-700/80 transition duration-200"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base">{c.subject}</h3>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                    COLORS[c.status] || "bg-slate-800 text-slate-300"
                  }`}
                >
                  {c.status.replace("_", " ")}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{c.description}</p>

              {c.adminNote && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1 text-xs">
                  <span className="font-bold text-red-400 uppercase tracking-wider text-[10px] block">
                    Admin Response
                  </span>
                  <p className="text-slate-300">{c.adminNote}</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Ref #{c.id.slice(-6)}</span>
                <span>{formatDate(c.createdAt)}</span>
              </div>
            </div>
          ))}

          {complaints.length === 0 && (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 text-xs">
              No complaints filed yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}