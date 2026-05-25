import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, BarChart3, Zap, Shield, Globe, Clipboard } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Shortening",
    description: "Paste any long URL and get a clean short link in seconds — no friction, no fuss.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description: "Track how many times each link is clicked and see engagement in real time.",
  },
  {
    icon: Clipboard,
    title: "Link Management",
    description: "View, edit, and organise all your shortened links from one simple dashboard.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Share short links on social media, emails, or any platform — they just work.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Every link is stored securely. Your data stays yours, always.",
  },
  {
    icon: Link2,
    title: "Custom Slugs",
    description: "Choose a memorable slug for your links instead of a random string.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center px-4 py-24 max-w-3xl w-full">
        <Badge
          variant="secondary"
          className="text-sm"
        >
          Free to use · No credit card required
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight">
          Shorten links.
          <br />
          Track every click.
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          A fast, simple link shortener that gives you clean URLs and real-time analytics — all in one place.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg">Get Started — It&apos;s Free</Button>
          </SignUpButton>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button
              size="lg"
              variant="outline"
            >
              Sign In
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl px-4 pb-24">
        <h2 className="text-2xl font-semibold text-center mb-10">Everything you need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Icon className="size-5 text-primary shrink-0" />
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full border-t border-border">
        <div className="flex flex-col items-center gap-4 text-center px-4 py-16 max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold">Ready to get started?</h2>
          <p className="text-muted-foreground">Create your free account and shorten your first link today.</p>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg">Create Free Account</Button>
          </SignUpButton>
        </div>
      </section>
    </main>
  );
}
