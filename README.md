# CampusOS: City University Digital Campus Hub

One web app that replaces the scattered Facebook groups, Messenger chats, ad hoc Google Forms and notice boards at City University with a single, searchable source of truth for campus life.

- **Live app:** https://campusos-kappa-seven.vercel.app
- **Demo video:** GOOGLE-DRIVE-LINK
- **Repository:** https://github.com/cpccu/Hackathon-Zano

---

## 1. The Problem

Useful, time-sensitive information at City University exists, but it is scattered and unsearchable. Students miss events, bus times, class changes and study material, and newcomers are hit hardest because they do not know where to look.

CampusOS gives every student one place to check what is happening, catch the bus, find study material, get answers about university rules, and recover lost belongings.

---

## 2. Modules Built (all 4, end-to-end with real data)

### Module 1: Club & Event Engine
- Unified feed of upcoming events across all clubs, with images
- Search by title and filter by club
- Event detail page: club, date and time (Bangladesh time), location, capacity, spots left
- One-click **RSVP** (capacity enforced, one registration per student per event)
- A **unique QR code per registration**, shown on "My Events"
- **Admin QR scanner** (camera) for door check-in. It reports Checked in, Already checked in, or Invalid QR
- Admins can create, edit (including image) and delete events

### Module 2: Resource Hub
- Upload notes, past question papers, lab manuals and official notices (files stored on Cloudinary)
- Organized by **department, category, course and semester**
- Search across title, description, course code and course name (for example, "CSE201")
- Filter by department and category
- Notices appear in the homepage "Latest notices" card

### Module 3: Smart Helpdesk
- FAQ accordion grouped into Bus, Rules, Exams and General, with search and topic filter
- **Bus routes table** with stops, departures and a live **"Next bus"** column computed in Bangladesh time
- Admin page to add and delete FAQs and bus routes (no code changes needed)

### Module 4: Lost & Found + Complaint Box
- Post a **lost or found** item with description, photo, location, date and contact
- Browse, search and filter by Lost or Found; owners and admins can mark an item resolved
- **Complaint box:** students file a complaint and track it as *Received → In Progress → Resolved*, with a note from the admin
- Admin page to review all complaints, update status and reply

### Homepage
Hero, featured upcoming events with images, "your next event" for logged-in students, quick links to common problems, live module counts, recent resources and lost items, and a Join Us section for new visitors.

---

## 3. Real-World Usability for a City University Student

| Everyday situation | How CampusOS solves it |
|---|---|
| A first-year has an exam tomorrow and needs last semester's paper | Opens the **Resource Hub**, searches `CSE201`, filters Category = Question Paper, and downloads it. No messaging five groups |
| A student finds out about a workshop a day late because it was posted once in a Facebook group | The **Events feed** and the homepage "Featured Events" show everything across all clubs in one list, filterable by club |
| A student wants to attend a contest and prove they registered | Registers in one click, gets a **QR pass** under My Events, and shows it at the door. The admin scans it and attendance is recorded |
| A student misses the shuttle because the timing is buried in an old Messenger thread | The homepage "Next bus" card and the Helpdesk bus table always show the next departure for every route |
| A student does not know the attendance rule or when to arrive for exams | Searches the **Helpdesk** ("attendance") and gets a direct answer |
| A student loses an ID card and the only option is a Facebook post that scrolls away | Posts it in **Lost & Found** with a photo and location. Whoever finds something can search the list. Items stay visible until resolved |
| A student has an issue (a broken projector, a late bus) and nobody responds | Files a **complaint**, gets a reference number, and watches the status change from Received to Resolved |
| A newcomer has no idea which groups or forms matter | Everything is in one URL: sign up once and the whole campus is browsable |

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), React, JavaScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL on Neon |
| ORM | Prisma 7 (with the `pg` driver adapter) |
| Authentication | Auth.js (next-auth v5), credentials login, bcrypt password hashing, JWT sessions, student and admin roles |
| File storage | Cloudinary (unsigned uploads from the browser) |
| QR codes | `qrcode` (generate), `html5-qrcode` (scan) |
| Deployment | Vercel |

---

## 5. Run Locally

**Requirements:** Node.js 20+, a Neon (or any PostgreSQL) database, a Cloudinary account.

```bash
git clone https://github.com/cpccu/Hackathon-Zano
cd campusos
npm install
```

Create a `.env` file in the project root (see section 6), then:

```bash
npx prisma migrate dev     # creates the tables
npx prisma db seed         # loads demo data
npm run dev                # http://localhost:3000
```

**Cloudinary setup (2 minutes):**
1. Copy your **Cloud name** from the Cloudinary dashboard.
2. Settings → Upload → add an upload preset named `campusos` with Signing mode **Unsigned**.
3. Settings → Security → enable **PDF and ZIP files delivery** so uploaded PDFs open.

---

## 6. Environment Variables

Create `.env` (never commit it):

```
DATABASE_URL="postgresql://...-pooler...neon.tech/neondb?sslmode=verify-full"   # pooled connection, used by the app
DIRECT_URL="postgresql://...neon.tech/neondb?sslmode=verify-full"               # direct connection, used by migrations
AUTH_SECRET="a-long-random-string"                                              # node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
AUTH_TRUST_HOST="true"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="campusos"
```

The same variables must be set in the Vercel project settings for deployment.

---

## 7. Seed Data and Demo Credentials

`npx prisma db seed` creates demo users, clubs, courses, upcoming events, resources, FAQs, bus routes, lost and found items, and sample complaints.


New students can also register at `/signup`.

- *As a student:* register for an event and open My Events to see the QR; search the Resource Hub; post a lost item; file a complaint.
- *As an admin:* create or edit an event with an image; open **Check-in** and scan a student's QR; manage FAQs and bus routes; update a complaint's status.

---

## 8. Project Structure

```
app/
  auth.js                 Auth.js config (credentials, roles)
  api/                    signup, auth handlers, QR check-in
  home/                   Hero, homepage sections
  events/                 feed, detail, RSVP
  my-events/              student registrations with QR
  resources/              browse, search, upload
  helpdesk/               FAQs and bus routes
  lost-found/             lost and found board
  complaints/             student complaint box and tracker
  admin/                  events, check-in, helpdesk, complaints
  components/             Navbar, Footer, upload field, QR scanner
  lib/                    prisma client, session guards, date and bus helpers
prisma/
  schema.prisma           data models
  seed.mjs                demo data
```

**Access control:** admin pages and actions call `requireAdmin()`, and student actions call `requireUser()`, on the server. Hiding a button is never the only protection.

---

## 9. Security Notes

- No credentials are committed. `.env` is git-ignored.
- Passwords are hashed with bcrypt.
- Admin routes and server actions are checked on the server.
- Demo credentials above are for judging only.