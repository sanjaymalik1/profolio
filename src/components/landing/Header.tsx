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
    <header className="py-6">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-gray-900">ProFolio</Link>
          <nav className="hidden md:flex gap-6 text-gray-700">
            <a className="hover:text-gray-900" href="#templates">Templates</a>
            <a className="hover:text-gray-900" href="#features">Features</a>
            <a className="hover:text-gray-900" href="#pricing">Pricing</a>
            {/* <Link href="/test" className="hover:text-gray-900 text-blue-600 font-medium">
              Test Components
            </Link>
            <Link href="/editor-v2" className="hover:text-gray-900 text-green-600 font-medium">
              New Editor
            </Link> */}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {status === 'loading' ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard" 
                className="text-sm text-gray-700 hover:underline hidden md:inline"
              >
                Dashboard
              </Link>
              <span className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </span>
              <Button onClick={handleSignOut} variant="secondary">Sign Out</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/auth/signin" 
                className="text-sm text-gray-700 hover:underline hidden md:inline"
              >
                Log in
              </Link>
              <Link href="/auth/signup">
                <Button onClick={() => {}}>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}