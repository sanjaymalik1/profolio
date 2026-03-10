"use client";
import React from "react";
import Link from "next/link";
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, isLoaded } = useUser();

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-12 px-5 bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-2xl shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-base font-bold text-slate-900 tracking-tight cursor-pointer">
              Profolio
            </Link>
            <nav className="hidden md:flex gap-5 text-sm text-slate-500">
              <a className="hover:text-slate-900 transition-colors" href="#templates">Templates</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {!isLoaded ? null : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:block text-sm text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5"
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden sm:block text-sm text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5"
                >
                  Log in
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="text-sm bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-4"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}