import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";

const CATS = { BUS: "Bus", RULES: "Rules", EXAM: "Exams", GENERAL: "General" };
const list = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);

function refresh() {
  revalidatePath("/helpdesk");
  revalidatePath("/admin/helpdesk");
  revalidatePath("/");
}

export default async function AdminHelpdeskPage() {
  await requireAdmin();
  const [faqs, routes] = await Promise.all([
    prisma.faq.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.busRoute.findMany({ orderBy: { name: "asc" } }),
  ]);

  async function addFaq(formData) {
    "use server";
    await requireAdmin();
    await prisma.faq.create({
      data: {
        category: formData.get("category"),
        question: formData.get("question"),
        answer: formData.get("answer"),
      },
    });
    refresh();
  }

  async function deleteFaq(formData) {
    "use server";
    await requireAdmin();
    await prisma.faq.delete({ where: { id: formData.get("id") } });
    refresh();
  }

  async function addRoute(formData) {
    "use server";
    await requireAdmin();
    await prisma.busRoute.create({
      data: {
        name: formData.get("name"),
        stops: list(formData.get("stops")),
        departures: list(formData.get("departures")).filter((t) => /^\d{2}:\d{2}$/.test(t)),
        notes: formData.get("notes") || null,
      },
    });
    refresh();
  }

  async function deleteRoute(formData) {
    "use server";
    await requireAdmin();
    await prisma.busRoute.delete({ where: { id: formData.get("id") } });
    refresh();
  }

  const inputClass =
    "w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition duration-200";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 animate-slide-up">
      {/* Page Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-xs font-semibold text-red-400 border border-red-900/40 bg-red-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Admin Control
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
          Helpdesk & Campus Transport Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage system FAQs, academic guidelines, and active campus bus schedules.
        </p>
      </div>

      {/* FAQs Management Section */}
      <section className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Manage FAQs</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add new frequently asked questions and official guidelines.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {faqs.length} {faqs.length === 1 ? "Entry" : "Entries"}
          </span>
        </div>

        <form action={addFaq} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Category <span className="text-red-500">*</span>
              </label>
              <select name="category" required className={`${inputClass} cursor-pointer`}>
                {Object.entries(CATS).map(([k, v]) => (
                  <option key={k} value={k} className="bg-slate-900 text-slate-100">
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                name="question"
                placeholder="e.g. What is the policy for exam retakes?"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              name="answer"
              placeholder="Provide a clear and detailed resolution..."
              required
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider transition duration-200 shadow-lg shadow-red-950/40 active:scale-[0.98]"
          >
            ➕ Add FAQ
          </button>
        </form>

        {/* FAQs List */}
        <div className="pt-4 border-t border-slate-800/80">
          {faqs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No FAQs published yet.</p>
          ) : (
            <ul className="space-y-3">
              {faqs.map((f) => (
                <li
                  key={f.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-slate-700/80 transition duration-200"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {CATS[f.category] || f.category}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-100">{f.question}</h3>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 pl-0.5">{f.answer}</p>
                  </div>

                  <form action={deleteFaq} className="shrink-0">
                    <input type="hidden" name="id" value={f.id} />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 text-xs font-semibold border border-red-900/40 transition duration-200"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Bus Routes Management Section */}
      <section className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Manage Bus Routes</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure transportation routes, major stops, and departure schedules.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {routes.length} {routes.length === 1 ? "Route" : "Routes"}
          </span>
        </div>

        <form action={addRoute} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Route Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              placeholder="e.g. Route 4: Campus to Gazipur"
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Stops <span className="text-slate-500 font-normal">(Comma separated)</span>{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="stops"
                placeholder="Campus, Airport, Uttara, Gazipur"
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Departures 24h <span className="text-slate-500 font-normal">(HH:MM format)</span>{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="departures"
                placeholder="07:00, 08:30, 16:00"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Notes <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              name="notes"
              placeholder="e.g. Runs only on working days during semesters"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider transition duration-200 shadow-lg shadow-red-950/40 active:scale-[0.98]"
          >
            🚌 Add Bus Route
          </button>
        </form>

        {/* Bus Routes List */}
        <div className="pt-4 border-t border-slate-800/80">
          {routes.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No bus routes configured.</p>
          ) : (
            <ul className="space-y-3">
              {routes.map((r) => (
                <li
                  key={r.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-slate-700/80 transition duration-200"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-900/40">
                        Active Route
                      </span>
                      <h3 className="text-sm font-bold text-slate-100">{r.name}</h3>
                    </div>

                    <p className="text-xs text-slate-300">
                      <span className="text-slate-500">Stops:</span> {r.stops.join(" ➔ ")}
                    </p>

                    <p className="text-xs text-slate-400 font-mono">
                      <span className="text-slate-500 font-sans">Departures:</span>{" "}
                      {r.departures.join(", ")}
                    </p>

                    {r.notes && (
                      <p className="text-[11px] text-slate-500 italic">Note: {r.notes}</p>
                    )}
                  </div>

                  <form action={deleteRoute} className="shrink-0">
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 text-xs font-semibold border border-red-900/40 transition duration-200"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}