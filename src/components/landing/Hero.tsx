"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useUser } from '@clerk/nextjs';

export default function Hero() {
  const { user, isLoaded } = useUser();

  return (
    <section className="pt-12 sm:pt-16 pb-8 bg-white relative overflow-hidden">
      {/* Radial background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-25 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">

          {/* Headline */}
          <motion.h1
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-[82px] font-semibold tracking-tight text-slate-900 mb-6 leading-[1.04]"
          >
            Your portfolio,
            <br />
            <span className="text-slate-400">beautifully crafted.</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Design, customize, and launch a stunning portfolio in minutes.
            Import your resume with AI and let your work do the talking.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
          >
            <Link href={isLoaded && user ? "/dashboard" : "/sign-up"}>
              <Button
                size="lg"
                className="w-full sm:w-auto text-sm font-semibold px-7 py-5 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                {isLoaded && user ? "Go to Dashboard" : "Start Building Free"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#templates">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-sm font-medium px-7 py-5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-300"
              >
                Browse Templates
              </Button>
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-16"
          >
            <Users className="w-4 h-4" />
            <span>
              Trusted by{" "}
              <strong className="text-slate-600 font-semibold">1,200+</strong>{" "}
              developers &amp; designers
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
