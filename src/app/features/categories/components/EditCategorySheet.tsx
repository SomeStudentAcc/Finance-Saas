import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import { insertCategoriesSchema } from "../../../../../db/schema";
import { z } from "zod";
import { useOpenCategory } from "../hooks/use-open-category";
import { UseGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import { useEditCategories } from "../api/use-edit-categories";
import { useDeleteCategory } from "../api/use-delete-category";
import UseConfirm from "@/hooks/use-confirm";
import CategoryForm from "./CategoryForm";

const formSchema = insertCategoriesSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export default function EditCategorySheet() {
  const { isOpen, onClose, id } = useOpenCategory();
  const [ConfirmDialog, confirm] = UseConfirm(
    "Are you sure?",
    "You are about to delete category"
  );
  const categoryQuery = UseGetCategory(id);
  const editMutation = useEditCategories(id);
  const deleteMutation = useDeleteCategory(id);
  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = categoryQuery.isLoading;
  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
      }
    : {
        name: "",
      };
  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <p>Edit a category to track your transactions</p>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
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
