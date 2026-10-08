import Scanner from "@/app/components/Scanner";
import { requireAdmin } from "@/app/lib/session";

export default async function CheckinPage() {
  await requireAdmin();
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Event Check-in</h1>
      <Scanner />
    </div>
  );
}