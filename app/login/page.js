import { signIn } from "@/app/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;

  async function login(formData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/",
      });
    } catch (err) {
      if (err instanceof AuthError) redirect("/login?error=1");
      throw err;
    }
  }

  return (
    <form action={login} className="max-w-sm mx-auto mt-10 flex flex-col gap-3">
      <h1 className="text-2xl font-bold">Log in</h1>
      <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />
      <input name="password" type="password" placeholder="Password" required className="border p-2 rounded" />
      {error && <p className="text-red-600">Wrong email or password</p>}
      <button className="bg-black text-white p-2 rounded">Log in</button>
      <Link href="/signup" className="text-sm underline">Create an account</Link>
    </form>
  );
}