"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { useUser } from '@clerk/nextjs';

export default function Hero() {
  const { user, isLoaded } = useUser();

  return (
    <section className="pt-14 sm:pt-20 pb-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">

          {/* <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
            className="landing-kicker mb-8"
          >
            Crafted Presence
          </motion.div> */}

          {/* Headline */}
          <motion.h1
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="landing-serif text-[2.9rem] sm:text-[4.3rem] lg:text-[6.05rem] font-semibold mb-7 leading-[0.97]"
          >
            Your portfolio,
            <br />
            <span className="text-[#6B7A52]">beautifully crafted.</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="landing-body text-[1.03rem] sm:text-[1.15rem] mb-11 max-w-2xl mx-auto"
          >
            Design, customize, and launch a stunning portfolio in minutes.
            Import your resume with AI and let your work do the talking.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
          >
            <Link href={isLoaded && user ? "/dashboard" : "/sign-up"}>
              <Button
                size="lg"
                className="landing-btn-primary w-full sm:w-auto text-[0.78rem] uppercase tracking-[0.12em] px-8 py-5"
              >
                {isLoaded && user ? "Go to Dashboard" : "Start Building Free"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#templates">
              <Button
                variant="ghost"
                size="lg"
                className="landing-btn-secondary w-full sm:w-auto text-[0.78rem] uppercase tracking-[0.12em] px-8 py-5"
              >
                Browse Templates
              </Button>
            </Link>
          </motion.div>

          {/* Trust bar */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-[0.82rem] text-[#5C554D] mb-8 uppercase tracking-[0.12em]"
          >
            <Users className="w-4 h-4 text-[#6B7A52]" />
            <span>
              Trusted by{" "}
              <strong className="text-[#2D2A26] font-semibold">1,200+</strong>{" "}
              developers &amp; designers
            </span>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}
