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
    { name: "Robotics Club", category: "Technical" },
    { name: "Photography Club", category: "Cultural" },
    { name: "Business Club", category: "Academic" },
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


  const day = 24 * 60 * 60 * 1000;
  const club = async (name) => (await prisma.club.findUnique({ where: { name } })).id;

  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();

  await prisma.event.createMany({
    data: [
      { title: "Intro to Web Dev Workshop", description: "Hands-on HTML, CSS and JS for beginners.", type: "Workshop", location: "Lab 3, Building A", startsAt: new Date(Date.now() + 2 * day), clubId: await club("Programming Club"), capacity: 40 },
      { title: "Inter-Department Debate", description: "Open debate on technology and society.", type: "Contest", location: "Auditorium", startsAt: new Date(Date.now() + 4 * day), clubId: await club("Debate Club") },
      { title: "Cultural Night", description: "Music, poetry and performances.", type: "Cultural", location: "Main Hall", startsAt: new Date(Date.now() + 7 * day), clubId: await club("Cultural Club") },
      { title: "Inter-Varsity Football Trials", description: "Open trials for the university football team.", type: "Sports", location: "University Ground", startsAt: new Date(Date.now() + 3 * day), clubId: await club("Sports Club"), capacity: 60 },
      { title: "Competitive Programming Contest", description: "Solve problems in a 3-hour team contest.", type: "Contest", location: "Lab 1, Building B", startsAt: new Date(Date.now() + 5 * day), clubId: await club("Programming Club"), capacity: 50 },
    ],
  });

  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: [
        { category: "BUS", question: "Where can I find the shuttle bus timings?", answer: "See the Bus Routes table below. It lists every route, its stops, and departure times." },
        { category: "BUS", question: "Who do I contact if a bus is late or cancelled?", answer: "Contact the Transport Office, or file a complaint through the Complaint Box." },
        { category: "RULES", question: "What is the minimum class attendance required?", answer: "Students need at least 70% attendance to sit for the final exam." },
        { category: "RULES", question: "Is the ID card mandatory on campus?", answer: "Yes. Students must carry their ID card at all times and show it at the gate and in the library." },
        { category: "EXAM", question: "How early should I arrive for an exam?", answer: "Arrive at least 15 minutes before the start time with your ID card and admit card." },
        { category: "EXAM", question: "Where do I find the exam routine?", answer: "Official exam routines are posted in the Resource Hub under Notices." },
        { category: "GENERAL", question: "How do I recover a lost item?", answer: "Check the Lost & Found page first. If it isn't listed, post it there." },
      ],
    });
  }

  if ((await prisma.busRoute.count()) === 0) {
    await prisma.busRoute.createMany({
      data: [
        { name: "Route 1: Campus to Uttara", stops: ["Campus", "Airport", "Uttara Sector 7"], departures: ["07:00", "08:30", "12:30", "16:00", "18:00"] },
        { name: "Route 2: Campus to Mirpur", stops: ["Campus", "Kazipara", "Mirpur 10"], departures: ["07:15", "09:00", "13:00", "16:30", "18:15"] },
        { name: "Route 3: Campus to Dhanmondi", stops: ["Campus", "Farmgate", "Dhanmondi 27"], departures: ["07:30", "09:30", "13:30", "17:00", "18:30"] },
      ],
    });
  }

    const admin = await prisma.user.findUnique({ where: { email: "admin@cu.edu" } });
  const student = await prisma.user.findUnique({ where: { email: "student@cu.edu" } });
  const courseId = async (code) => (await prisma.course.findUnique({ where: { code } })).id;

  // placeholder file, replace with your own Cloudinary links later
  const sampleFile = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  if ((await prisma.resource.count()) === 0) {
    await prisma.resource.createMany({
      data: [
        { title: "CSE201 Midterm Question Paper", description: "Spring 2026 midterm, Data Structures.", category: "QUESTION_PAPER", department: "CSE", semester: "Spring 2026", fileUrl: sampleFile, courseId: await courseId("CSE201"), uploaderId: student.id },
        { title: "CSE101 Final Question Paper", description: "Fall 2025 final, Intro to Programming.", category: "QUESTION_PAPER", department: "CSE", semester: "Fall 2025", fileUrl: sampleFile, courseId: await courseId("CSE101"), uploaderId: student.id },
        { title: "Data Structures Lecture Notes: Trees", description: "Binary trees, BST and traversal notes.", category: "NOTES", department: "CSE", semester: "Spring 2026", fileUrl: sampleFile, courseId: await courseId("CSE201"), uploaderId: student.id },
        { title: "Calculus I Notes: Limits", description: "Chapter 1 summary with solved examples.", category: "NOTES", department: "Math", semester: "Fall 2025", fileUrl: sampleFile, courseId: await courseId("MAT101"), uploaderId: student.id },
        { title: "CSE101 Lab Manual", description: "Lab 1 to Lab 8 instructions.", category: "LAB_MANUAL", department: "CSE", fileUrl: sampleFile, courseId: await courseId("CSE101"), uploaderId: admin.id },
        { title: "Final Exam Routine", description: "Official final exam schedule for all departments.", category: "NOTICE", department: "CSE", fileUrl: sampleFile, uploaderId: admin.id },
        { title: "Semester Fee Payment Deadline", description: "Last date to pay semester fees without fine.", category: "NOTICE", department: "BBA", fileUrl: sampleFile, uploaderId: admin.id },
      ],
    });
  }

  if ((await prisma.lostFoundItem.count()) === 0) {
    const d = (daysAgo) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    await prisma.lostFoundItem.createMany({
      data: [
        { type: "LOST", title: "Black wallet", description: "Black leather wallet with student ID card inside.", location: "Library, 2nd floor", date: d(1), contact: "01700000001", reporterId: student.id },
        { type: "LOST", title: "Casio scientific calculator", description: "Silver Casio fx-991, name written on the back.", location: "Building A, Room 301", date: d(2), contact: "student@cu.edu", reporterId: student.id },
        { type: "FOUND", title: "Blue water bottle", description: "Blue steel bottle left on a bench.", location: "Cafeteria", date: d(1), contact: "Admin Office", reporterId: admin.id },
        { type: "FOUND", title: "Student ID card", description: "ID card found near the main gate. Collect from the admin office.", location: "Main gate", date: d(3), contact: "Admin Office", reporterId: admin.id },
        { type: "FOUND", title: "Black umbrella", description: "Folding umbrella found in the auditorium after the seminar.", location: "Auditorium", date: d(2), contact: "01700000002", reporterId: student.id },
      ],
    });
  }

    if ((await prisma.complaint.count()) === 0) {
    await prisma.complaint.createMany({
      data: [
        { subject: "Shuttle bus arrived 30 minutes late", description: "The 8:30 AM Route 2 bus was late three days in a row this week, so I missed my first class.", status: "RECEIVED", userId: student.id },
        { subject: "Projector not working in Room 301", description: "The projector in Building A, Room 301 has not worked for two weeks. Lectures are being delayed.", status: "IN_PROGRESS", adminNote: "Maintenance team has been informed. Replacement expected this week.", userId: student.id },
        { subject: "Water dispenser empty on 2nd floor", description: "The dispenser near the library has been empty since Sunday.", status: "RESOLVED", adminNote: "Refilled and added to the daily checklist. Thank you for reporting.", userId: student.id },
      ],
    });
  }

  console.log("Seed done");
}


main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());