"use client";
import React from "react";

export default function Footer() {
  const [year, setYear] = React.useState(2025);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-8 bg-white border-t">
      <div className="max-w-6xl mx-auto px-6 text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {year} Profolio — All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}