"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAccount } from "@/actions/accounts";
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CURRENT", "SAVINGS"]),
  balance: z.string().min(1, "Initial balance is required"),
  isDefault: z.boolean().default(false),
});

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const type = watch("type");
  const isDefault = watch("isDefault");

  const onSubmit = async (data) => {
    try {
      const res = await createAccount(data);
      if (res.success) {
        setOpen(false);
        reset();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create account:", error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children || <Button>Create Account</Button>}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-gray-800">
              Create New Account
            </DrawerTitle>
            <DrawerDescription>
              Add a new account to track your finances in Pocket AI.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-gray-700">
                  Account Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Checking"
                  {...register("name")}
                  className="h-12 border-gray-200 rounded-xl"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-bold text-gray-700">
                  Account Type
                </Label>
                <Select
                  onValueChange={(val) => setValue("type", val)}
                  defaultValue={type}
                >
                  <SelectTrigger id="type" className="h-12 border-gray-200 rounded-xl text-left">
                    {type === "CURRENT" ? "Current" : 
                     type === "SAVINGS" ? "Savings" : "Select type"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CURRENT">Current</SelectItem>
                    <SelectItem value="SAVINGS">Savings</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="balance"
                  className="text-sm font-bold text-gray-700"
                >
                  Initial Balance
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    ₹
                  </span>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("balance")}
                    className="h-12 pl-8 border-gray-200 rounded-xl"
                  />
                </div>
                {errors.balance && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.balance.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="space-y-0.5">
                  <Label htmlFor="isDefault" className="text-sm font-bold text-gray-800">
                    Set as Default
                  </Label>
                  <p className="text-xs text-gray-500">
                    This account will be pre-selected for new transactions.
                  </p>
                </div>
                <Switch
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={(val) => setValue("isDefault", val)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-gray-200 font-bold"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
                <Button
                  type="submit"
                  className="flex-1 h-12 rounded-xl bg-green-800 hover:bg-green-900 text-white font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
