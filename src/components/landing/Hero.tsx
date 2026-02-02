"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import InteractiveDemo from "./InteractiveDemo";

export default function Hero() {
  return (
    <section className="pt-8 sm:pt-12 pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12">
        <div className="flex-1 w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-gray-900">Build a portfolio that gets you hired — without writing code.</h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-gray-600">Drag, drop, and publish a professional portfolio in minutes. Export the code or deploy instantly to Vercel.</p>
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button onClick={() => {}} size="lg" className="w-full sm:w-auto text-sm sm:text-base">Get Started — It's Free</Button>
            <Button onClick={() => {}} variant="secondary" size="lg" className="w-full sm:w-auto text-sm sm:text-base">Explore Templates</Button>
          </div>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <span className="whitespace-nowrap">Trusted by students & freelancers</span>
            <div className="h-px bg-gray-200 flex-1 hidden sm:block" />
            <div className="flex gap-3 sm:gap-4">
              <div className="w-8 sm:w-10 h-5 sm:h-6 bg-gray-100 rounded" />
              <div className="w-8 sm:w-10 h-5 sm:h-6 bg-gray-100 rounded" />
              <div className="w-8 sm:w-10 h-5 sm:h-6 bg-gray-100 rounded" />
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