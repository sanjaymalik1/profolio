"use client";
import React from "react";
import Link from "next/link";
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, isLoaded } = useUser();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b landing-divider bg-[#f5f1ea]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="landing-serif text-[1.55rem] font-semibold tracking-tight cursor-pointer leading-none">
              Profolio
            </Link>
            <nav className="hidden md:flex gap-6 text-[0.8rem] font-medium uppercase tracking-[0.15em] text-[#5c554d]">
              <a className="hover:text-[#2d2a26] transition-colors" href="#templates">Templates</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {!isLoaded ? null : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:block text-[0.78rem] font-medium uppercase tracking-[0.14em] text-[#5c554d] hover:text-[#2d2a26] transition-colors px-2 py-1"
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
                  className="hidden sm:block text-[0.78rem] font-medium uppercase tracking-[0.14em] text-[#5c554d] hover:text-[#2d2a26] transition-colors px-2 py-1"
                >
                  Log in
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="landing-btn-secondary text-[0.76rem] uppercase tracking-[0.12em] px-4"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
    </header>
  );
}