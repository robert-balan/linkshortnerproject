import { getLinkByShortCode } from '@/data/links';
import { notFound, redirect } from 'next/navigation';

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

  redirect(link.originalUrl);
}
