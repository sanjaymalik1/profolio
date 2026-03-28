"use client";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  const { user, isLoaded } = useUser();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b landing-divider bg-[var(--landing-bg)] shadow-[0_14px_28px_-20px_rgba(107,122,82,0.42)]">
      <div className="mx-auto w-full max-w-[88rem] px-3 sm:px-6">
        <div className="grid h-[4.25rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-8">
          <nav className="flex md:hidden items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-[#5c554d]">
            <a className="transition-colors hover:text-[#6b7a52]" href="#templates">Templates</a>
            <Link href="/contact" className="transition-colors hover:text-[#6b7a52]">Contact</Link>
          </nav>

          <nav className="hidden md:flex items-center gap-7 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#5c554d]">
            <a className="transition-colors hover:text-[#6b7a52]" href="#templates">Templates</a>
            <Link href="/contact" className="transition-colors hover:text-[#6b7a52]">Contact</Link>
          </nav>

          <Link
            href="/"
            className="landing-serif shrink-0 text-[2.05rem] font-semibold uppercase leading-none tracking-[-0.01em] text-[#6B7A52]"
          >
            PROFOLIO
          </Link>

          <div className="ml-auto flex items-center justify-end gap-3">
            {!isLoaded ? null : user ? (
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#5c554d] transition-colors hover:text-[#6b7a52]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden sm:inline-flex text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#5c554d] transition-colors hover:text-[#6b7a52]"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex rounded-lg border border-[#1f1a16] bg-[#1f1a16] px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[#f6f2e8] transition-colors hover:border-[#35302a] hover:bg-[#35302a]"
                >
                  Get Started
                </Link>
              </>
            )}

            {isLoaded && user ? (
              <div className="hidden sm:block">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 border border-[#b2a588]",
                    },
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}