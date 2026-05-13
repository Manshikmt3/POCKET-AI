"use client";

import React from "react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

import { LayoutDashboard, SquarePen } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-24 items-center justify-between px-4 md:px-8 w-full">
        <Link href="/" className="flex items-center space-x-2 ml-4 md:ml-8">
          <Image 
            src="/logo.png" 
            alt="Pocket AI Logo" 
            width={225} 
            height={90} 
            className="h-18 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-10 text-lg font-bold absolute left-1/2 -translate-x-1/2">
          <a href="#features" className="transition-colors hover:text-green-600 text-foreground/70">
            Features
          </a>
          <a href="#testimonials" className="transition-colors hover:text-green-600 text-foreground/70">
            Testimonials
          </a>
        </nav>

        <div className="flex items-center space-x-4 mr-4 md:mr-8">
          <ThemeToggle />
          <Show when="signed-in">
            <Link href="/dashboard">
              <Button variant="outline" className="text-gray-600 hover:text-green-600 flex items-center gap-2 px-4 py-2 rounded-lg border-gray-200 transition-all font-bold h-10">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button className="bg-[#1a5f4d] hover:bg-[#13483a] text-white flex items-center gap-2 px-4 py-2 rounded-lg font-bold h-10 transition-all">
                <SquarePen className="h-4 w-4" />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </Show>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <span className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8 cursor-pointer text-lg font-bold border-2 hover:bg-green-50 hover:text-green-600 hover:border-green-600 transition-all")}>
                Login
              </span>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 border-2 border-white shadow-md",
                },
              }}
            />
          </Show>
        </div>


      </div>
    </header>
  );
}


