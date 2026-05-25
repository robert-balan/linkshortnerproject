'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { EditLinkDialog } from './edit-link-dialog';
import { DeleteLinkDialog } from './delete-link-dialog';

interface LinkCardProps {
  link: {
    id: number;
    shortCode: string;
    originalUrl: string;
    createdAt: Date;
  };
}

export function LinkCard({ link }: LinkCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-base font-bold">
                {link.shortCode}
              </CardTitle>
              <p className="text-sm break-all">{link.originalUrl}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit link"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete link"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Created {link.createdAt.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <EditLinkDialog open={editOpen} onOpenChange={setEditOpen} link={link} />
      <DeleteLinkDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        link={link}
      />
    </>
  );
}
