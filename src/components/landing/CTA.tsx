"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold">Ready to build your portfolio?</h3>
          <p className="mt-1 text-sm opacity-90">Start for free and publish in minutes.</p>
        </div>
        <div>
          <Button onClick={() => {}}>Get Started</Button>
        </div>
      </div>
    </section>
  );
}