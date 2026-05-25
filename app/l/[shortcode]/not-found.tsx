import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ShortCodeNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl">Link Not Found</CardTitle>
          <CardDescription>The address you tried to reach doesn&apos;t exist or may have been removed.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Double-check the link you received and try again.</p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
