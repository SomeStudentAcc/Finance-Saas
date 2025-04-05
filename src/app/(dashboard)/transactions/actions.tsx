"use client";
import { useDeleteTransaction } from "@/app/features/transactions/api/use-delete-transaction";
import { useOpenTransaction } from "@/app/features/transactions/hooks/use-open-transaction";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UseConfirm from "@/hooks/use-confirm";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import React from "react";

type Props = {
  id: string;
};

export default function Actions({ id }: Props) {
  const { onOpen } = useOpenTransaction();
  const deleteMutation = useDeleteTransaction(id);
  const [ConfirmDialog, confirm] = UseConfirm(
    "Are you sure?",
    "You are about to delete this transaction"
  );
  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {});
    }
  };
  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              onOpen(id);
            }}
            disabled={deleteMutation.isPending}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} disabled={deleteMutation.isPending}>
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
