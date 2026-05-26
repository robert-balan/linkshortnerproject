import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FeatureCards } from './feature-cards';

export const metadata: Metadata = {
  title: 'Shorten Links, Share Instantly',
  description:
    'A fast, simple link shortener that gives you clean, shareable URLs — no friction, no fuss.',
};

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center px-4 py-24 max-w-3xl w-full">
        <Badge variant="secondary" className="text-sm">
          Free to use · No credit card required
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight">
          Shorten links.
          <br />
          <span className="text-fuchsia-500">Share instantly.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          A fast, simple link shortener that gives you clean, shareable URLs —
          no friction, no fuss.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg">Get Started — It&apos;s Free</Button>
          </SignUpButton>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl px-4 pb-24">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Everything you need
        </h2>
        <FeatureCards />
      </section>

      {/* CTA */}
      <section className="w-full border-t border-border">
        <div className="flex flex-col items-center gap-4 text-center px-4 py-16 max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold">
            Ready to <span className="text-fuchsia-500">get started?</span>
          </h2>
          <p className="text-muted-foreground">
            Create your free account and shorten your first link today.
          </p>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg">Create Free Account</Button>
          </SignUpButton>
        </div>
      </section>
    </main>
  );
}
