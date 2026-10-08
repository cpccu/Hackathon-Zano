import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/session";
import { formatDate } from "@/app/lib/format";

const COLORS = {
  RECEIVED: "bg-yellow-50 text-yellow-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  RESOLVED: "bg-green-50 text-green-700",
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

  const input = "border border-gray-300 p-2 rounded";
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Complaint Box</h1>

      <form action={submit} className="mt-4 flex flex-col gap-3">
        <input name="subject" placeholder="Subject" required className={input} />
        <textarea name="description" placeholder="Describe the issue" required rows={4} className={input} />
        <button className="bg-indigo-600 text-white p-2 rounded">Submit complaint</button>
      </form>

      <h2 className="mt-8 text-xl font-bold">My complaints</h2>
      <div className="mt-3 space-y-3">
        {complaints.map((c) => (
          <div key={c.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{c.subject}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${COLORS[c.status]}`}>
                {c.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm mt-1">{c.description}</p>
            {c.adminNote && <p className="text-sm mt-2 bg-gray-50 p-2 rounded"><b>Admin:</b> {c.adminNote}</p>}
            <p className="text-xs text-gray-500 mt-2">Ref #{c.id.slice(-6)} · {formatDate(c.createdAt)}</p>
          </div>
        ))}
        {complaints.length === 0 && <p className="text-gray-500">No complaints filed.</p>}
      </div>
    </div>
  );
}