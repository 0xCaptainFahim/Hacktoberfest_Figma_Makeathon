"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500/30 flex flex-col md:flex-row">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-neutral-950 to-neutral-950 pointer-events-none"></div>
      
      {/* Sidebar */}
      <aside className="relative z-20 w-full md:w-64 border-r border-neutral-800 bg-neutral-950/50 backdrop-blur-xl flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              NexusGuard
            </h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Code Scanner
          </Link>
          <Link 
            href="/dashboard/history" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/dashboard/history' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Scan History
          </Link>
          <Link 
            href="/dashboard/profile" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/dashboard/profile' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-800 space-y-4">
          <button 
            onClick={handleCheckout} 
            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Upgrade to Pro
          </button>
          
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-medium text-neutral-300">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-neutral-300 truncate max-w-[100px]">
                  {session?.user?.name || 'User'}
                </span>
             </div>
             <button onClick={() => signOut()} className="p-2 text-neutral-500 hover:text-white transition-colors" title="Logout">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
             </button>
          </div>
          <div className="text-center pt-2 border-t border-neutral-800/50">
             <p className="text-[10px] text-neutral-600">Developer name Nothacker-Fahim</p>
             <p className="text-[9px] text-neutral-700 mt-0.5">Project Version 1.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-16 border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="text-sm px-4 py-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium hover:bg-indigo-500/20 transition-colors">
              Upgrade to Pro
            </button>
          </div>
        </header>
        {children}
      </main>
      <ParticlesBackground />
    </div>
  );
}
