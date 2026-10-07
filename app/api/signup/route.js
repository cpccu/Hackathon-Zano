import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { name, email, password, studentId, department } = await req.json();
  if (!name || !email || !password || password.length < 6)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email already used" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, studentId, department },
  });
  return NextResponse.json({ ok: true });
}