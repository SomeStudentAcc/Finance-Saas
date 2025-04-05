import { useOpenCategory } from "@/app/features/categories/hooks/use-open-category";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import React from "react";

type Props = {
  id: string
  category: string | null;
  categoryId: string | null;
};

export default function CategoryColumn({  id, category, categoryId }: Props) {
    const {onOpen: onOpenCategory} = useOpenCategory()
    const onClick= ()=>{
      if (categoryId) {
        onOpenCategory(categoryId)
      }
    }
  return (
    <div onClick={(onClick)} className={cn("flex items-center cursor-pointer hover:underline", !category && 'text-rose-500')}>
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0"/>}
      {category || 'uncategorized'}
    </div>
  );
}
