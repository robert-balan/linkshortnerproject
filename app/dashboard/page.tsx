import { auth } from "@clerk/nextjs/server";
import { getUserLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { Link2 } from "lucide-react";
import { CreateLinkButton } from "./create-link-button";
import { LinkCard } from "./link-card";

export default async function DashboardPage() {
  const { userId } = await auth();
  const links = userId ? await getUserLinks(userId) : [];

  return (
    <main className="w-4/5 mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Links</h1>
        <CreateLinkButton />
      </div>

      {links.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Link2 className="mb-4 size-10" />
            <p>No links yet. Create your first short link to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
            />
          ))}
        </div>
      )}
    </main>
  );
}
