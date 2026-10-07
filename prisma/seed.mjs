import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const studentHash = await bcrypt.hash("student123", 10);

  await prisma.user.upsert({
    where: { email: "admin@cu.edu" },
    update: {},
    create: { name: "CU Admin", email: "admin@cu.edu", passwordHash: adminHash, role: "ADMIN" },
  });

  await prisma.user.upsert({
    where: { email: "student@cu.edu" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@cu.edu",
      passwordHash: studentHash,
      studentId: "CU-0001",
      department: "CSE",
    },
  });

  const clubs = [
    { name: "Programming Club", category: "Technical" },
    { name: "Debate Club", category: "Debate" },
    { name: "Cultural Club", category: "Cultural" },
    { name: "Sports Club", category: "Sports" },
  ];
  for (const c of clubs) {
    await prisma.club.upsert({ where: { name: c.name }, update: {}, create: c });
  }

  const courses = [
    { code: "CSE101", title: "Intro to Programming", department: "CSE" },
    { code: "CSE201", title: "Data Structures", department: "CSE" },
    { code: "MAT101", title: "Calculus I", department: "Math" },
  ];
  for (const c of courses) {
    await prisma.course.upsert({ where: { code: c.code }, update: {}, create: c });
  }

  console.log("Seed done");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());