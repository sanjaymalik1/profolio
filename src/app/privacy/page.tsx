import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Privacy Policy — Profolio",
  description: "Learn how Profolio collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-slate-400 mb-3">Last updated: March 2026</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-slate-500 mb-12 text-base leading-relaxed">
            This policy explains what data Profolio collects, how it is used, and the choices you have.
          </p>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">1. Who We Are</h2>
            <p className="text-slate-600 leading-relaxed">
              Profolio is a SaaS platform that allows individuals to create and publish professional
              portfolio websites. By using Profolio you agree to the collection and use of information
              described in this policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">2. Information We Collect</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We collect only what is necessary to provide the service:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-slate-600">
              <li>
                <span className="font-medium text-slate-700">Account information</span> — name, email
                address, and profile data provided when you sign up. Authentication is handled by{" "}
                <span className="font-medium text-slate-700">Clerk</span>, a third-party identity
                provider. We do not store your password directly.
              </li>
              <li>
                <span className="font-medium text-slate-700">Portfolio content</span> — text, links,
                project descriptions, and other content you add to your portfolio.
              </li>
              <li>
                <span className="font-medium text-slate-700">Usage data</span> — pages visited,
                actions taken within the editor, and general interaction patterns, used to improve the
                product.
              </li>
              <li>
                <span className="font-medium text-slate-700">Technical data</span> — IP address,
                browser type, device type, and session identifiers collected automatically through
                standard server logs.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc list-outside ml-5 space-y-2 text-slate-600">
              <li>To create and manage your account</li>
              <li>To render and publish your portfolio to the public URL you choose</li>
              <li>To communicate service updates, security notices, and support responses</li>
              <li>To diagnose errors and improve platform performance</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">4. Authentication via Clerk</h2>
            <p className="text-slate-600 leading-relaxed">
              Sign-in and session management are powered by{" "}
              <span className="font-medium text-slate-700">Clerk</span>. When you log in, Clerk
              handles credential verification and issues a session token. Clerk's own privacy policy
              governs how they process authentication data. We receive basic identity information (name,
              email) from Clerk after a successful login.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">5. Data Storage and Security</h2>
            <p className="text-slate-600 leading-relaxed">
              Your portfolio content and account data are stored in a securely managed database. We
              apply industry-standard measures including encryption in transit (HTTPS/TLS) and access
              controls to protect your data. No method of transmission over the internet is 100% secure;
              we cannot guarantee absolute security but take reasonable precautions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">6. Public Portfolio Content</h2>
            <p className="text-slate-600 leading-relaxed">
              When you publish a portfolio, its content becomes publicly accessible at your chosen URL.
              You are responsible for ensuring that publicly published content does not violate any
              applicable laws or the rights of third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">7. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Depending on your location, you may have rights to access, correct, or delete the personal
              data we hold about you. To exercise these rights, contact us at:
            </p>
            <p className="text-slate-700 font-medium">sambhav7717@gmail.com</p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">8. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              We use cookies and similar technologies to maintain your session and remember preferences.
              Session cookies are strictly necessary and cannot be disabled while using the service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">9. Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this policy from time to time. When we do, we will revise the "Last updated"
              date at the top of this page. Continued use of Profolio after changes are posted
              constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">10. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have questions about this privacy policy, please reach out at{" "}
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
