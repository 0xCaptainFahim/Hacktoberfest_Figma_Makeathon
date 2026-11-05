"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState("dark");
  const [deepseekKey, setDeepseekKey] = useState("");

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "light") {
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
      document.documentElement.style.backgroundColor = "#fafafa";
    } else {
      document.documentElement.style.filter = "none";
      document.documentElement.style.backgroundColor = "#050505";
    }

    // Load API Key
    const savedKey = localStorage.getItem("deepseek_key") || "";
    setDeepseekKey(savedKey);
  }, []);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
      document.documentElement.style.backgroundColor = "#fafafa";
    } else {
      document.documentElement.style.filter = "none";
      document.documentElement.style.backgroundColor = "#050505";
    }
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setDeepseekKey(newKey);
    localStorage.setItem("deepseek_key", newKey);
  };

  if (status === "loading") {
    return <div className="p-10 text-white font-mono animate-pulse">Loading Profile...</div>;
  }

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-transparent relative z-10">
      <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h2 className="text-3xl font-bold mb-2 text-white">Account Profile</h2>
        <p className="text-neutral-400">Manage your AppSec workspace settings and subscriptions.</p>
      </header>

      <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Profile Card */}
        <div className="p-8 rounded-2xl bg-neutral-900/80 backdrop-blur border border-neutral-800 shadow-xl flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-indigo-500/20">
            {session?.user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1">{session?.user?.name || 'Unknown User'}</h3>
            <p className="text-neutral-400 font-mono mb-4">{session?.user?.email || 'admin@nexusguard.ai'}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wide">
              Role: Security Engineer
            </div>
          </div>
          <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded transition-colors border border-neutral-700">
            Edit Profile
          </button>
        </div>

        {/* AI Integrations Section */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 relative overflow-hidden group shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h2 className="text-xl font-bold text-white mb-4 relative z-10">AI Integrations</h2>
          <div className="space-y-4 relative z-10">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">DeepSeek API Key (Optional)</label>
              <input 
                type="password" 
                value={deepseekKey}
                onChange={handleKeyChange}
                placeholder="sk-..." 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
              <p className="text-xs text-neutral-500 mt-2">Enter your DeepSeek API key for a much faster and more reliable Security Copilot experience. If left blank, it falls back to the free community proxy.</p>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="p-8 rounded-2xl bg-neutral-900/80 backdrop-blur border border-neutral-800 shadow-xl">
          <h4 className="text-lg font-bold text-white mb-6 border-b border-neutral-800 pb-4">Current Plan</h4>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xl font-bold text-indigo-400 mb-1">Developer Tier (Free)</p>
              <p className="text-sm text-neutral-400 mb-4">Includes basic vulnerability scanning and community API models.</p>
              
              <div className="space-y-2 mt-4">
                <p className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider mb-2">🚀 Upgrade to Pro to unlock:</p>
                <ul className="text-sm text-neutral-300 space-y-1 list-disc list-inside">
                  <li>Unlimited AI Scanning & Copilot Chat</li>
                  <li>Access to premium GPT-4/Claude 3.5 Models</li>
                  <li>CI/CD Pipeline Integration (GitHub/GitLab)</li>
                  <li>Team Collaboration & PDF Reporting</li>
                </ul>
              </div>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2">
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="p-8 rounded-2xl bg-neutral-900/80 backdrop-blur border border-neutral-800 shadow-xl">
          <h4 className="text-lg font-bold text-white mb-6 border-b border-neutral-800 pb-4">Workspace Preferences</h4>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Theme</p>
                <p className="text-sm text-neutral-400">Switch between light and dark terminal mode.</p>
              </div>
              <select 
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none cursor-pointer"
              >
                <option value="dark">Hacker Dark (Default)</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
              <div>
                <p className="font-medium text-white">AI Analysis Engine</p>
                <p className="text-sm text-neutral-400">Select the default model for vulnerability scanning.</p>
              </div>
              <select className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none">
                <option value="deepseek">DeepSeek/Pollinations Proxy</option>
                <option value="gpt4" disabled>GPT-4 (Pro Only)</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
