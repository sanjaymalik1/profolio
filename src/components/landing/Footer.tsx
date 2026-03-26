"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = React.useState(2025);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-8 sm:py-10 border-t landing-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-[#5C554D]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[0.78rem] sm:text-[0.82rem] uppercase tracking-[0.11em]">
          <div className="text-center md:text-left">© {year} Profolio • All rights reserved.</div>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-[#2D2A26] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#2D2A26] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[#2D2A26] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}