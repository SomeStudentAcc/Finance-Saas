"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewCategory } from "@/app/features/categories/hooks/use-new-category";
import { useBulkDeleteCategories } from "@/app/features/categories/api/use-bulk-delete-categories";
import { UseGetCategories } from "@/app/features/categories/api/use-get-categories";

export default function CategoriesPage() {
  const newCategory = useNewCategory();
  const deleteCategories = useBulkDeleteCategories()
  const categoriesQuery = UseGetCategories();
  const categories = categoriesQuery.data || [];

  const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending

  if (categoriesQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-cl line-clamp-1">Categories Page</CardTitle>
          <Button onClick={newCategory.onOpen} size={"sm"}>
            <Plus size={4} className="mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(row) => {
              const ids = row.map((r)=> r.original.id)
              deleteCategories.mutate({ids})
            }}
            filterKey="name"
            columns={columns}
            data={categories}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
}
