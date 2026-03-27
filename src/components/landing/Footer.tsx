import Link from "next/link";
import { Facebook, Instagram, Linkedin, Send } from "lucide-react";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: Linkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    icon: Instagram,
  },
  {
    label: "X",
    href: "https://x.com",
    icon: null,
  },
];

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { label: "Templates", href: "/templates" },
      { label: "Editor", href: "/editor-v2" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Help Centre",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Account", href: "/profile" },
      { label: "FAQ", href: "/templates" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#2f2922] bg-[#15120f] text-[#d9d1c4]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.05fr_1.25fr] md:gap-12">
          <div className="border-b border-[#2f2922] pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-10">
            <h2 className="landing-serif text-5xl leading-none tracking-[-0.02em] text-[#95a286] sm:text-6xl">
              PROFOLIO
            </h2>
            <p className="landing-serif mt-5 max-w-md text-[1.95rem] leading-[1.05] text-[#f1ece2] sm:text-[2.3rem]">
              Crafting digital presence
              <br />
              with timeless style.
            </p>

            <div className="mt-9 flex items-center gap-4 text-sm text-[#c6baaa]">
              <span className="text-base">Social</span>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="group flex h-9 w-9 items-center justify-center border border-[#3d362d] text-[#e8dfd2] transition-colors hover:border-[#95a286] hover:text-[#95a286]"
                  >
                    {social.icon ? (
                      <social.icon className="h-4 w-4" strokeWidth={1.9} />
                    ) : (
                      <span className="text-sm font-semibold">X</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-9">
            <div className="grid gap-8 sm:grid-cols-3">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-2xl font-medium text-[#f2ecdf]">{section.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-[0.95rem] text-[#c9beaf]">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="transition-colors hover:text-[#95a286]">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="max-w-xl">
              <p className="text-[1.75rem] font-medium leading-tight text-[#f2ecdf] sm:text-[2rem]">
                Subscribe Our Newsletter
              </p>
              <form action="#" className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Enter your email"
                  className="h-12 flex-1 border border-[#3b342c] bg-transparent px-4 text-[0.95rem] text-[#f2ecdf] outline-none transition-colors placeholder:text-[#8d8479] focus:border-[#95a286]"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 border border-[#95a286] bg-[#95a286] px-5 text-sm font-semibold uppercase tracking-[0.08em] text-[#1d1a16] transition-colors hover:border-[#a6b697] hover:bg-[#a6b697] sm:w-auto"
                >
                  <Send className="h-4 w-4" strokeWidth={2} />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#2f2922] pt-5 text-xs uppercase tracking-[0.12em] text-[#8f8579]">
          © {year} Profolio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}