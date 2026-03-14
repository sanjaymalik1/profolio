"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = React.useState(2025);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 sm:py-8 bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm sm:text-base">
          <div className="text-center md:text-left">© {year} Profolio — All rights reserved.</div>
          <div className="flex gap-4 sm:gap-6 text-sm sm:text-base">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}