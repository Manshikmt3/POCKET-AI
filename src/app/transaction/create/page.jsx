import React from "react";
import { AddTransactionForm } from "@/components/add-transaction-form";
import { getAccounts } from "@/actions/accounts";

export default async function AddTransactionPage() {
  const res = await getAccounts();
  const accounts = res.success ? res.data : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-5xl md:text-6xl gradient-title mb-8">Add Transaction</h1>
      {accounts.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/50 text-muted-foreground">
          You need to create an account before adding a transaction.
        </div>
      ) : (
        <AddTransactionForm accounts={accounts} />
      )}
    </div>
  );
}
