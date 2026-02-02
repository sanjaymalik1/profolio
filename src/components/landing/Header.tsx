"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="py-4 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900">ProFolio</Link>
          <nav className="hidden md:flex gap-4 lg:gap-6 text-sm lg:text-base text-gray-700">
            <a className="hover:text-gray-900 transition-colors" href="#templates">Templates</a>
            <a className="hover:text-gray-900 transition-colors" href="#features">Features</a>
            <a className="hover:text-gray-900 transition-colors" href="#pricing">Pricing</a>
            {/* <Link href="/test" className="hover:text-gray-900 text-blue-600 font-medium">
              Test Components
            </Link>
            <Link href="/editor-v2" className="hover:text-gray-900 text-green-600 font-medium">
              New Editor
            </Link> */}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {status === 'loading' ? (
            <div className="text-xs sm:text-sm text-gray-500">Loading...</div>
          ) : session ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                href="/dashboard" 
                className="text-xs sm:text-sm text-gray-700 hover:underline hidden md:inline"
              >
                Dashboard
              </Link>
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline max-w-[150px] truncate">
                {session.user?.name || session.user?.email}
              </span>
              <Button onClick={handleSignOut} variant="secondary" size="sm" className="text-xs sm:text-sm">Sign Out</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                href="/auth/signin" 
                className="text-xs sm:text-sm text-gray-700 hover:underline hidden sm:inline"
              >
                Log in
              </Link>
              <Link href="/auth/signup">
                <Button onClick={() => {}} size="sm" className="text-xs sm:text-sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}