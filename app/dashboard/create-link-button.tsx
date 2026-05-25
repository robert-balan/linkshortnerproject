"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateLinkDialog } from "./create-link-dialog";

export function CreateLinkButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 size-4" />
        Create link
      </Button>
      <CreateLinkDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
