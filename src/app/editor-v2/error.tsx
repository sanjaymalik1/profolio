"use client";

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

// Next.js convention: shown when an unhandled error occurs in the editor route.
export default function EditorError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('[Editor] Unhandled error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
                <h2 className="text-xl font-semibold text-white mb-2">Editor ran into a problem</h2>
                <p className="text-sm text-slate-400 mb-1">
                    {error.message || 'An unexpected error occurred in the editor.'}
                </p>
                <p className="text-xs text-slate-500 mb-6">Your portfolio data is saved automatically.</p>
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={reset}
                        className="px-4 py-2 text-sm font-medium bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Reload editor
                    </button>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        Back to dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
