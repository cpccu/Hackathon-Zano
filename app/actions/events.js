"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";

// 1. Fetch filtered events
export async function getEvents({ category, search } = {}) {
  const where = {};

  if (category && category !== "ALL") {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  return await prisma.event.findMany({
    where,
    include: {
      club: { select: { name: true, logo: true } },
      _count: { select: { rsvps: true } },
    },
    orderBy: { date: "asc" },
  });
}

// 2. RSVP or Cancel RSVP
export async function toggleRSVP(eventId) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  const existing = await prisma.rSVP.findUnique({
    where: {
      userId_eventId: { userId, eventId },
    },
  });

  if (existing) {
    await prisma.rSVP.delete({
      where: { id: existing.id },
    });
  } else {
    // Generate a simple unique QR check-in code
    const qrCode = `CU-EVT-${eventId.slice(-4)}-${userId.slice(-4)}-${Date.now().toString().slice(-4)}`;
    
    await prisma.rSVP.create({
      data: {
        userId,
        eventId,
        qrCode,
      },
    });
  }

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/my-events");
}

// 3. Create Event (Admin / Club Lead)
export async function createEvent(formData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin privileges required.");
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const date = new Date(formData.get("date"));
  const location = formData.get("location");
  const category = formData.get("category");
  const clubId = formData.get("clubId");
  const banner = formData.get("banner") || null;

  await prisma.event.create({
    data: {
      title,
      description,
      date,
      location,
      category,
      banner,
      clubId: clubId || null,
      organizerId: session.user.id,
    },
  });

  revalidatePath("/events");
}