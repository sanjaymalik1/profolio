import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import EditorPreview from "@/components/landing/EditorPreview";
import ImportResume from "@/components/landing/ImportResume";
import TemplatesShowcase from "@/components/landing/TemplatesShowcase";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="landing-editorial selection:bg-[#d8d0c6] selection:text-[#2D2A26]">
      <Header />
      <main className="overflow-hidden pt-20 sm:pt-24">
        <Hero />
        <EditorPreview />
        <ImportResume />
        <TemplatesShowcase />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
