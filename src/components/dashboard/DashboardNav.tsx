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
        <nav className="bg-white border-b border-slate-200/60 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-base font-bold text-slate-900 tracking-tight cursor-pointer">
                            Profolio
                        </Link>
                        <span className="text-slate-300 select-none">/</span>
                        <span className="text-sm font-medium text-slate-500">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {user?.publicMetadata?.role === 'ADMIN' && (
                            <Link href="/admin">
                                <Button variant="ghost" size="sm" className="text-xs text-slate-500">
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
