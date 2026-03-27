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
    <section className="py-24 sm:py-32 relative overflow-hidden">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ y: 28, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="landing-eyebrow mb-6">
            Get started today
          </p>

          <h2 className="landing-serif text-[2.7rem] sm:text-[4.15rem] lg:text-[5.1rem] font-semibold mb-6 leading-[0.96]">
            Ready to make your{" "}
            <span className="block sm:inline"><span className="text-[#6B7A52]">portfolio</span> shine?</span>
          </h2>

          <p className="landing-body text-[1.02rem] mb-10 max-w-xl mx-auto">
            Join thousands of developers and creatives who launched their careers
            with a Profolio portfolio.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <Link href={isLoaded && user ? "/dashboard" : "/sign-up"}>
              <Button
                size="lg"
                className="landing-btn-primary w-full sm:w-auto text-[0.8rem] uppercase tracking-[0.12em] px-8 py-5"
              >
                {isLoaded && user ? "Go to Dashboard" : "Build Your Portfolio Free"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <p className="text-[#5C554D] text-[0.82rem] uppercase tracking-[0.1em]">
            No credit card required &nbsp;·&nbsp; Free forever
          </p>
        </motion.div>
      </div>
    </section>
  );
}