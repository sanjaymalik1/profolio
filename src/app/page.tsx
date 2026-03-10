import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import EditorPreview from "@/components/landing/EditorPreview";
import ImportResume from "@/components/landing/ImportResume";
import TemplatesShowcase from "@/components/landing/TemplatesShowcase";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
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
