import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";
import { formatDate } from "@/app/lib/format";

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

  const input = "border border-gray-300 p-2 rounded text-sm";
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">All Complaints</h1>
      <div className="mt-4 space-y-3">
        {complaints.map((c) => (
          <form key={c.id} action={update} className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col gap-2">
            <input type="hidden" name="id" value={c.id} />
            <h3 className="font-semibold">{c.subject}</h3>
            <p className="text-sm">{c.description}</p>
            <p className="text-xs text-gray-500">
              {c.user.name}{c.user.studentId ? ` (${c.user.studentId})` : ""} · {formatDate(c.createdAt)} · #{c.id.slice(-6)}
            </p>
            <div className="flex flex-wrap gap-2">
              <select name="status" defaultValue={c.status} className={input}>
                <option value="RECEIVED">Received</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <input name="adminNote" defaultValue={c.adminNote || ""} placeholder="Note to student" className={`${input} flex-1 min-w-40`} />
              <button className="bg-gray-900 text-white px-3 py-1 rounded text-sm">Save</button>
            </div>
          </form>
        ))}
        {complaints.length === 0 && <p className="text-gray-500">No complaints yet.</p>}
      </div>
    </div>
  );
}