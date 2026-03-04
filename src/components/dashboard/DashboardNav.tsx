"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

/**
 * Top navigation bar for the dashboard.
 * Extracted from dashboard/page.tsx to keep that file focused on content.
 */
export function DashboardNav() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    return (
        <nav className="bg-white border-b border-slate-200/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-lg font-bold text-slate-900 tracking-tight">
                            ProFolio
                        </Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-sm font-semibold text-slate-900">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 hidden sm:inline">
                            {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
                        </span>
                        {user?.publicMetadata?.role === 'ADMIN' && (
                            <Link href="/admin">
                                <Button variant="ghost" size="sm" className="text-xs">
                                    Admin
                                </Button>
                            </Link>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => signOut(() => router.push('/'))}
                            className="text-xs text-slate-600 hover:text-slate-900"
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
