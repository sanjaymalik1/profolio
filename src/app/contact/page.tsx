import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Contact — Profolio",
  description: "Get in touch with the Profolio team for support, questions, or feedback.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-slate-500 text-base leading-relaxed mb-12">
            For support, questions, or feedback, reach out to us via email. We read every message and
            will get back to you as soon as we can.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50">
              <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-500"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  General Support
                </p>
                <a
                  href="mailto:sambhav7717@gmail.com"
                  className="text-slate-800 font-medium hover:text-slate-600 transition-colors"
                >
                  sambhav7717@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50">
              <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-500"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  General Support
                </p>
                <a
                  href="mailto:msanjay31103@gmail.com"
                  className="text-slate-800 font-medium hover:text-slate-600 transition-colors"
                >
                  msanjay31103@gmail.com
                </a>
              </div>
            </div>
          </div>

          <p className="mt-10 text-sm text-slate-400">
            We typically respond within 1–2 business days.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
