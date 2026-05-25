"use client";

import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteLinkAction } from "./actions";
import { useRouter } from "next/navigation";

interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: {
    id: number;
    shortCode: string;
  };
}

export function DeleteLinkDialog({ open, onOpenChange, link }: DeleteLinkDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await deleteLinkAction({ id: link.id });
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete short link</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-medium text-foreground">{link.shortCode}</span>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
