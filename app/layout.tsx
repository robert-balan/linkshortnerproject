import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from '@clerk/nextjs';
import { shadcn } from '@clerk/ui/themes';
import { Button } from '@/components/ui/button';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Link Shortener',
    template: '%s | Link Shortener',
  },
  description:
    'A fast, simple link shortener. Create clean, shareable short URLs in seconds.',
  openGraph: {
    title: 'Link Shortener',
    description:
      'A fast, simple link shortener. Create clean, shareable short URLs in seconds.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider
          signInForceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
          appearance={{
            theme: shadcn,
          }}
        >
          <header className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-xl font-semibold hover:opacity-80 transition-opacity"
              >
                Link Shortener
              </Link>
              <nav aria-label="Site navigation">
                <div className="flex items-center gap-4">
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm">
                        Sign in
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button variant="default" size="sm">
                        Sign up
                      </Button>
                    </SignUpButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>
              </nav>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
