import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center px-4">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">Link Shortener</h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Shorten, manage, and track your links in one place.
        </p>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <Button variant="default">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline">Sign Up</Button>
          </SignUpButton>
        </div>
      </main>
    </div>
  );
}
