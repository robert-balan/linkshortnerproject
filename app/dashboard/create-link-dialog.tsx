"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLinkAction } from "./actions";
import { useRouter } from "next/navigation";

interface CreateLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLinkDialog({ open, onOpenChange }: CreateLinkDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      setOriginalUrl("");
      setShortCode("");
      setError(null);
    }
    onOpenChange(isOpen);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createLinkAction({
        originalUrl,
        shortCode: shortCode.trim() || undefined,
      });

      if ("error" in result) {
        setError(result.error);
      } else {
        handleClose(false);
        router.refresh();
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create short link</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="originalUrl">Destination URL</Label>
            <Input
              id="originalUrl"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortCode">
              Custom short code <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="shortCode"
              type="text"
              placeholder="my-link"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              disabled={isPending}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
