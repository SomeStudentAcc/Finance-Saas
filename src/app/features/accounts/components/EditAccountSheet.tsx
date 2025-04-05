import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import AccountForm from "./AccountForm";
import { insertAccountSchema } from "../../../../../db/schema";
import { z } from "zod";
import { useOpenAccount } from "../hooks/use-open-account";
import { UseGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account";
import UseConfirm from "@/hooks/use-confirm";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export default function EditAccountSheet() {
  const { isOpen, onClose, id } = useOpenAccount();
  const [ConfirmDialog, confirm] = UseConfirm(
    "Are you sure?",
    "You are about to delete this transaction"
  );
  const accountsQuery = UseGetAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);
  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = accountsQuery.isLoading;
  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  const onDelete = async()=>{
    const ok = await confirm()
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: ()=>{
          onClose()
        }
      })
    }
  }

  const defaultValues = accountsQuery.data
    ? {
        name: accountsQuery.data.name,
      }
    : {
        name: "",
      };
  return (
    <>
    <ConfirmDialog/>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <p>Edit a account to track your transactions</p>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
