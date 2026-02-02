"use client";
import React from "react";

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
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}