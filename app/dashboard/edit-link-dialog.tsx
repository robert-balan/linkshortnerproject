"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLinkAction } from "./actions";
import { useRouter } from "next/navigation";

interface EditLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: {
    id: number;
    shortCode: string;
    originalUrl: string;
  };
}

export function EditLinkDialog({ open, onOpenChange, link }: EditLinkDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [originalUrl, setOriginalUrl] = useState(link.originalUrl);
  const [shortCode, setShortCode] = useState(link.shortCode);
  const [error, setError] = useState<string | null>(null);

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      setOriginalUrl(link.originalUrl);
      setShortCode(link.shortCode);
      setError(null);
    }
    onOpenChange(isOpen);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateLinkAction({
        id: link.id,
        originalUrl,
        shortCode,
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
          <DialogTitle>Edit short link</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-originalUrl">Destination URL</Label>
            <Input
              id="edit-originalUrl"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-shortCode">Short code</Label>
            <Input
              id="edit-shortCode"
              type="text"
              placeholder="my-link"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              required
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
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
