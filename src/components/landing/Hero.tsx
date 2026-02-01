"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import InteractiveDemo from "./InteractiveDemo";

export default function Hero() {
  return (
    <section className="pt-12 pb-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">Build a portfolio that gets you hired — without writing code.</h1>
          <p className="mt-4 text-lg text-gray-600">Drag, drop, and publish a professional portfolio in minutes. Export the code or deploy instantly to Vercel.</p>
          <div className="mt-6 flex gap-4">
            <Button onClick={() => {}} size="lg">Get Started — It's Free</Button>
            <Button onClick={() => {}} variant="secondary">Explore Templates</Button>
          </div>
          <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
            <span>Trusted by students & freelancers</span>
            <div className="h-px bg-gray-200 flex-1" />
            <div className="flex gap-4">
              <div className="w-10 h-6 bg-gray-100 rounded" />
              <div className="w-10 h-6 bg-gray-100 rounded" />
              <div className="w-10 h-6 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.6 }}
          >
            <InteractiveDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}