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
        <div className="min-h-screen bg-slate-50/30 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Something went wrong</h2>
                <p className="text-sm text-slate-500 mb-6">
                    {error.message || 'An unexpected error occurred loading the dashboard.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={reset}
                        className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
