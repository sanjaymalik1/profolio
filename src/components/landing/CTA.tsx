"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">Ready to build your portfolio?</h3>
          <p className="mt-2 text-sm sm:text-base lg:text-lg opacity-90">Start for free and publish in minutes.</p>
        </div>
        <div className="w-full md:w-auto">
          <Button onClick={() => {}} size="lg" className="w-full md:w-auto text-sm sm:text-base bg-white text-blue-600 hover:bg-gray-100">Get Started</Button>
        </div>
      </div>
    </section>
  );
}