"use client";
import React from "react";
import Link from "next/link";
import { useUser, useClerk } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut(() => {
      window.location.href = '/';
    });
  };

  return (
    <header className="py-4 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900">ProFolio</Link>
          <nav className="hidden md:flex gap-4 lg:gap-6 text-sm lg:text-base text-gray-700">
            <a className="hover:text-gray-900 transition-colors" href="#templates">Templates</a>
            <a className="hover:text-gray-900 transition-colors" href="#features">Features</a>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {!isLoaded ? (
            <div className="text-xs sm:text-sm text-gray-500">Loading...</div>
          ) : user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                href="/dashboard" 
                className="text-xs sm:text-sm text-gray-700 hover:underline hidden md:inline"
              >
                Dashboard
              </Link>
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline max-w-[150px] truncate">
                {user.firstName || user.emailAddresses[0]?.emailAddress}
              </span>
              <Button onClick={handleSignOut} variant="secondary" size="sm" className="text-xs sm:text-sm">Sign Out</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                href="/sign-in" 
                className="text-xs sm:text-sm text-gray-700 hover:underline hidden sm:inline"
              >
                Log in
              </Link>
              <Link href="/sign-up">
                <Button onClick={() => {}} size="sm" className="text-xs sm:text-sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}