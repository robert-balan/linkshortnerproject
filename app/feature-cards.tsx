'use client';

import {
  Clipboard,
  Globe,
  Infinity,
  Link2,
  Shield,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'Instant Shortening',
    description:
      'Paste any long URL and get a clean short link in seconds — no friction, no fuss.',
    detail:
      'Paste any URL — no matter how long or complex — and get a clean, shareable short link in seconds. No extra steps, no settings to configure. Just paste and share.',
  },
  {
    icon: Clipboard,
    title: 'Link Management',
    description:
      'View, edit, and organise all your shortened links from one simple dashboard.',
    detail:
      'Your personal dashboard gives you full control over every link you have created. Update the destination URL or short code at any time, remove links you no longer need, and keep everything organised in one place.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description:
      'Share short links on social media, emails, or any platform — they just work.',
    detail:
      'Short links work on every platform without any extra software. Share them on social media, in emails, SMS messages, or embed them in QR codes — visitors simply click and arrive.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description:
      'Every link is stored securely. Your data stays yours, always.',
    detail:
      'Only https:// and http:// destination URLs are accepted. Private network addresses are blocked automatically to protect you and your audience. Your links and data are stored on a resilient, always-on cloud database.',
  },
  {
    icon: Link2,
    title: 'Custom Slugs',
    description:
      'Choose a memorable slug for your links instead of a random string.',
    detail:
      'Instead of a random string, pick something meaningful — like my-portfolio or summer-sale. Custom slugs are checked for uniqueness instantly, and you can always update them later from your dashboard.',
  },
  {
    icon: Infinity,
    title: 'Links That Last',
    description:
      'Your short links never expire. Create once and share forever — no time limits, ever.',
    detail:
      'There is no expiry date on your short links. Once created, they will keep redirecting visitors for as long as your account exists — no subscriptions, no renewals, no link rot.',
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map(({ icon: Icon, title, description, detail }) => (
        <Dialog key={title}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer transition-colors hover:border-fuchsia-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Icon
                  className="size-5 text-primary shrink-0"
                  aria-hidden="true"
                />
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md border-t-4 border-t-fuchsia-500">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-fuchsia-500/10">
                  <Icon
                    className="size-5 text-fuchsia-500"
                    aria-hidden="true"
                  />
                </div>
                <DialogTitle>{title}</DialogTitle>
              </div>
              <hr className="border-orange-400/50 my-1" />
              <DialogDescription className="text-sm leading-relaxed pt-1">
                {detail}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
