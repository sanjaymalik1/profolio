"use client";

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

/**
 * Top navigation bar for the dashboard.
 */
export function DashboardNav() {
    const { user } = useUser();

    return (
        <nav className="editor-typography bg-[#f5f1ea]/95 border-b border-[#d8d0c6] sticky top-0 z-50 backdrop-blur-sm">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="landing-serif shrink-0 text-[2.05rem] font-semibold uppercase leading-none tracking-[-0.01em] text-[#6B7A52]"
                        >
                            PROFOLIO
                        </Link>
                        <span className="text-[#b5aa9d] select-none">/</span>
                        <span className="text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[#5c554d]">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {user?.publicMetadata?.role === 'ADMIN' && (
                            <Link href="/admin">
                                <Button variant="ghost" size="sm" className="text-[0.72rem] uppercase tracking-[0.12em] text-[#5c554d] hover:text-[#2d2a26] hover:bg-[#ece4da]">
                                    Admin
                                </Button>
                            </Link>
                        )}
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8",
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
