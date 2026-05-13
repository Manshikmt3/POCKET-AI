import React from "react";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { redirect } from "next/navigation";
import { checkUser } from "@/lib/checkUser";

export default async function OnboardingPage() {
  const user = await checkUser();

  if (!user) {
    redirect("/sign-in");
  }

  // If user already has accounts, redirect to dashboard? 
  // Let's assume this page just shows a welcome message and forces creating an account.

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Pocket AI!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Let&apos;s get started by creating your first account. This will help you track your transactions and budget.
      </p>
      
      <CreateAccountDrawer forceOpen={true} />
    </div>
  );
}
