import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CampusOS",
  description: "A Smart Digital Campus Hub for City University",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-animated-mesh relative antialiased min-h-screen flex flex-col">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="animate-float-1 absolute -top-20 -left-20 w-96 h-96 bg-[#D32F2F]/20 rounded-full blur-3xl" />
          <div className="animate-float-2 absolute top-1/2 -right-20 w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
