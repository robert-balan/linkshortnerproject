import { getLinkByShortCode } from '@/data/links';
import { notFound, redirect } from 'next/navigation';

const ALLOWED_PROTOCOLS = ['http:', 'https:'];

function isSafeUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    if (!ALLOWED_PROTOCOLS.includes(protocol)) return false;

    // Block loopback / unspecified hostnames
    if (
      hostname === 'localhost' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '[::1]'
    ) {
      return false;
    }

    // Block IPv4 private/reserved ranges
    const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4) {
      const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
      if (a === 0 || a === 10 || a === 127) return false;
      if (a === 169 && b === 254) return false;
      if (a === 172 && b >= 16 && b <= 31) return false;
      if (a === 192 && b === 168) return false;
    }

    return true;
  } catch {
    return false;
  }
}

export default async function ShortCodeRedirectPage({
  params,
}: {
  params: Promise<{ shortcode: string }>;
}) {
  const { shortcode } = await params;
  const link = await getLinkByShortCode(shortcode);

  if (!link) {
    notFound();
  }

  if (!isSafeUrl(link.originalUrl)) {
    notFound();
  }

  redirect(link.originalUrl);
}
