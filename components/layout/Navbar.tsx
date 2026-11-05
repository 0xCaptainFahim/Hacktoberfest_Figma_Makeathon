"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            NexusGuard AI
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/#features" className="text-neutral-400 hover:text-white transition-colors">Features</Link>
          <Link href="/#pricing" className="text-neutral-400 hover:text-white transition-colors">Pricing</Link>
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="text-neutral-400 hover:text-white transition-colors">
                Logout
              </button>
              <Link href="/dashboard" className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
                {session.user?.name?.[0]?.toUpperCase() || 'U'}
              </Link>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-neutral-950 shadow-sm hover:bg-neutral-200 transition-colors"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
