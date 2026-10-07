"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const form = Object.fromEntries(new FormData(e.target));
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Signup failed");
    router.push("/login");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto mt-10 flex flex-col gap-3">
      <h1 className="text-2xl font-bold">Sign up</h1>
      <input name="name" placeholder="Full name" required className="border p-2 rounded" />
      <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />
      <input name="studentId" placeholder="Student ID" className="border p-2 rounded" />
      <input name="department" placeholder="Department" className="border p-2 rounded" />
      <input name="password" type="password" placeholder="Password" required className="border p-2 rounded" />
      {error && <p className="text-red-600">{error}</p>}
      <button className="bg-black text-white p-2 rounded">Create account</button>
      <Link href="/login" className="text-sm underline">Already have an account?</Link>
    </form>
  );
}