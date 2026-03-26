"use client";

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

// Next.js convention: shown when an unhandled error occurs in the dashboard route.
export default function DashboardError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('[Dashboard] Unhandled error:', error);
    }, [error]);

    return (
        <div className="min-h-screen landing-editorial flex items-center justify-center">
            <div className="text-center max-w-md px-4">
                <h2 className="text-[2.1rem] font-semibold mb-2">Something went wrong</h2>
                <p className="text-sm text-slate-500 mb-6">
                    {error.message || 'An unexpected error occurred loading the dashboard.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={reset}
                        className="px-4 py-2 text-[0.76rem] uppercase tracking-[0.1em] font-semibold bg-[#2d2a26] text-[#f5f1ea] rounded-lg hover:bg-[#3b3732] transition-colors"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="px-4 py-2 text-[0.76rem] uppercase tracking-[0.1em] font-semibold text-[#5c554d] hover:text-[#2d2a26] transition-colors"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
