"use client";
import React from "react";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import TemplatesCarousel from "@/components/landing/TemplatesCarousel";
import Testimonials from "@/components/landing/TestimonialsNew";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main>
        <Hero />
        <Features />
        <TemplatesCarousel />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
