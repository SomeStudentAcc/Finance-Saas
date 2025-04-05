"use client";
import EditAccountSheet from "@/app/features/accounts/components/EditAccountSheet";
import NewAccountSheet from "@/app/features/accounts/components/NewAccountSheet";
import EditCategorySheet from "@/app/features/categories/components/EditCategorySheet";
import NewCategorySheet from "@/app/features/categories/components/NewCategorySheet";
import EditTransactionSheet from "@/app/features/transactions/components/EditTransactionSheet";
import NewTransactionSheet from "@/app/features/transactions/components/NewTransactionSheet";

import React from "react";
import { useMountedState } from "react-use";

export default function SheetProvider() {
  const isMounted = useMountedState()

  if (!isMounted){
    return null
  }
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet/>

      <NewCategorySheet/>
      <EditCategorySheet/>

      <NewTransactionSheet/>
      <EditTransactionSheet/>
    </>
  );
}
