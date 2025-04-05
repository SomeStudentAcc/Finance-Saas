"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransaction } from "@/app/features/transactions/hooks/use-new-transaction";
import { UseGetTransactions } from "@/app/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/app/features/transactions/api/use-bulk-delete-transactions";
import UploadButton from "./upload-button";
import ImportCard from "./import-card";
import { transactions as transactionSchema } from "../../../../db/schema";
import UseSelectAccount from "@/app/features/accounts/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/app/features/transactions/api/use-bulk-create-transactions copy";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

export default function TransactionsPage() {
  const [AccountDialog, confirm]= UseSelectAccount()
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions()
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionsQuery = UseGetTransactions();
  const transactions = transactionsQuery.data || [];

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log(results);

    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const onSubmitImport = async (
    values: (typeof transactionSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm()

    if(!accountId){
      return toast.error("Please select an account")
    }

    const data = values.map((value)=>({
      ...value,
      accountId: accountId as string
    }))
    createTransactions.mutate(data, {
      onSuccess: ()=>{
        onCancelImport()
      }
    })
  };

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  if (transactionsQuery.isLoading) {
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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
      <AccountDialog/>
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-cl line-clamp-1">
            Transactions history
          </CardTitle>
          <div className="flex flex-col lg:flex-row items-center gap-x-2">
            <Button
              className="w-full lg:w-auto"
              onClick={newTransaction.onOpen}
              size={"sm"}
            >
              <Plus size={4} className="mr-2" />
              Add New
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            filterKey="payee"
            columns={columns}
            data={transactions}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
}
