import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ status: "forbidden" }, { status: 403 });

  const { token } = await req.json();
  const reg = await prisma.registration.findUnique({
    where: { qrToken: token },
    include: { user: true, event: true },
  });
  if (!reg) return NextResponse.json({ status: "invalid" });

  const info = { name: reg.user.name, event: reg.event.title };
  if (reg.checkedInAt) return NextResponse.json({ status: "already", ...info });

  await prisma.registration.update({
    where: { id: reg.id },
    data: { checkedInAt: new Date() },
  });
  return NextResponse.json({ status: "ok", ...info });
}