"use client";

import { useSession } from "next-auth/react";

export function PricingSection() {
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
    <section id="pricing" className="py-24 bg-neutral-950 relative">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">Start for free, upgrade when you need more power.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Developer</h3>
              <p className="text-neutral-400">Perfect for individuals and hobbyists.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-neutral-500">/ forever</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-neutral-300">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Basic Vulnerability Scanning
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                10 Scans per day
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Standard AI Engine
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors">
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-3xl bg-neutral-900 border border-indigo-500/50 relative flex flex-col transform md:-translate-y-4 shadow-2xl shadow-indigo-500/10">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </span>
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2 text-indigo-400">Pro</h3>
              <p className="text-neutral-400">For professionals and serious teams.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">$29</span>
              <span className="text-neutral-500">/ month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-neutral-300">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Deep Context Analysis
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Unlimited Scans
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Auto-Fix Code Generation
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Priority Support
              </li>
            </ul>
            <button 
              onClick={handleCheckout}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              {session ? "Upgrade Now" : "Sign in to Upgrade"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
