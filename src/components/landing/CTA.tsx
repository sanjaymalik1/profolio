"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useUser } from '@clerk/nextjs';
import { motion } from "framer-motion";

export default function CTA() {
  const { user, isLoaded } = useUser();

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ y: 28, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Get started today
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-slate-900 mb-6 leading-tight">
            Ready to make your{" "}
            <span className="block sm:inline">portfolio shine?</span>
          </h2>

          <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of developers and creatives who launched their careers
            with a Profolio portfolio.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <Link href={isLoaded && user ? "/dashboard" : "/sign-up"}>
              <Button
                size="lg"
                className="w-full sm:w-auto text-sm font-semibold px-8 py-5 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                {isLoaded && user ? "Go to Dashboard" : "Build Your Portfolio Free"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <p className="text-slate-400 text-sm">
            No credit card required &nbsp;·&nbsp; Free forever
          </p>
        </motion.div>
      </div>
    </section>
  );
}