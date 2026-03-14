import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Terms of Service — Profolio",
  description: "Read the terms governing your use of the Profolio platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-slate-400 mb-3">Last updated: March 2026</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Terms of Service</h1>
          <p className="text-slate-500 mb-12 text-base leading-relaxed">
            By accessing or using Profolio, you agree to be bound by these terms. Please read them
            carefully before using the service.
          </p>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of the Profolio platform
              ("Service"). By creating an account or using Profolio in any way, you agree to these Terms.
              If you do not agree, do not use the Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">2. Eligibility</h2>
            <p className="text-slate-600 leading-relaxed">
              You must be at least 16 years old to use Profolio. By using the Service, you represent
              that you meet this requirement and have the legal capacity to enter into a binding
              agreement.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">3. Your Account</h2>
            <p className="text-slate-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your login credentials and for
              all activity that occurs under your account. You agree to notify us immediately of any
              unauthorized use of your account. We are not liable for any loss resulting from
              unauthorized use of your credentials.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">4. User Content</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              You retain ownership of the content you create and publish through Profolio ("User
              Content"). By publishing content, you grant Profolio a non-exclusive, worldwide,
              royalty-free license to host, display, and distribute that content solely for the purpose
              of operating the Service.
            </p>
            <p className="text-slate-600 leading-relaxed">
              You are solely responsible for your User Content. You represent and warrant that your
              content does not infringe any third-party intellectual property rights, violate any laws,
              or constitute harassment, defamation, or harmful material.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">5. Prohibited Uses</h2>
            <p className="text-slate-600 leading-relaxed mb-4">You agree not to use Profolio to:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-slate-600">
              <li>Upload, publish, or transmit content that is unlawful, harmful, or offensive</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation</li>
              <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure</li>
              <li>Scrape, crawl, or systematically extract data from the platform without written permission</li>
              <li>Transmit spam, viruses, or any code of a destructive nature</li>
              <li>Use the Service for any commercial purpose that competes directly with Profolio</li>
              <li>Violate any applicable local, national, or international law or regulation</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">6. Service Availability</h2>
            <p className="text-slate-600 leading-relaxed">
              We strive to keep Profolio available at all times but do not guarantee uninterrupted
              access. The Service may be temporarily unavailable due to maintenance, upgrades, or
              circumstances beyond our control. We reserve the right to modify, suspend, or discontinue
              any part of the Service at any time with reasonable notice where practicable.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">7. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">
              All platform features, designs, logos, and code that are not User Content remain the
              exclusive property of Profolio. Nothing in these Terms grants you any right to use our
              trademarks, logos, or branding without prior written consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">8. Disclaimer of Warranties</h2>
            <p className="text-slate-600 leading-relaxed">
              The Service is provided "as is" and "as available" without any warranties of any kind,
              express or implied, including but not limited to warranties of merchantability, fitness for
              a particular purpose, or non-infringement. We do not warrant that the Service will be
              error-free or that defects will be corrected.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">9. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              To the maximum extent permitted by law, Profolio and its operators shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages arising from your use
              of or inability to use the Service, even if advised of the possibility of such damages.
              Our total liability for any claim arising out of these Terms shall not exceed the amount
              you paid us in the twelve months preceding the claim, or $50, whichever is greater.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">10. Termination</h2>
            <p className="text-slate-600 leading-relaxed">
              We may suspend or terminate your access to Profolio at any time for conduct that we
              believe violates these Terms or is harmful to other users, the Service, or third parties.
              You may delete your account at any time. Upon termination, your right to use the Service
              ceases immediately.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">11. Changes to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We may revise these Terms at any time. When we do, we will update the "Last updated" date
              at the top of this page. Continued use of the Service after changes are posted constitutes
              your acceptance of the updated Terms. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">12. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              Questions about these Terms? Contact us at{" "}
              <a
                href="mailto:sambhav7717@gmail.com"
                className="text-slate-800 underline underline-offset-2 hover:text-slate-600 transition-colors"
              >
                sambhav7717@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
