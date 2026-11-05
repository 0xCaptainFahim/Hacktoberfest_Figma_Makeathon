"use client";

import { useState, useRef, useEffect } from "react";

const DEMO_CODES = {
  sqlInjection: "const userId = req.query.id;\n// Vulnerable SQL query\ndb.query(`SELECT * FROM users WHERE id = ${userId}`);",
  xss: "function renderUserMessage(user, message) {\n  // Vulnerable XSS\n  document.getElementById('chat').innerHTML = \n    `<div><b>${user.name}:</b> ${message}</div>`;\n}",
  jwt: "function generateToken(user) {\n  // Insecure JWT generation (no expiration, weak secret)\n  return jwt.sign({ id: user.id, role: user.role }, 'secret');\n}",
  cmdInjection: "const { exec } = require('child_process');\nconst domain = req.body.domain;\n// Vulnerable Command Injection\nexec(`ping -c 4 ${domain}`, (err, stdout) => {\n  res.send(stdout);\n});",
  deserialization: "const serialize = require('node-serialize');\n// Insecure Deserialization\nconst userObj = serialize.unserialize(req.cookies.profile);\nif (userObj.role === 'admin') {\n  grantAccess();\n}"
};

export default function DashboardPage() {
  const [code, setCode] = useState(DEMO_CODES.sqlInjection);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  // Tabs: 'report' or 'chat'
  const [activeTab, setActiveTab] = useState<'report' | 'chat'>('report');

  // Chat State
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Terminal ready. Initializing Security Copilot... \nType your questions about the code here.' }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setActiveTab('report');
    try {
      const customKey = localStorage.getItem("deepseek_key") || "";
      
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(customKey && { "x-api-key": customKey })
        },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const newMessage = { role: 'user' as const, content: chatInput };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const customKey = localStorage.getItem("deepseek_key") || "";
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(customKey && { "x-api-key": customKey })
        },
        body: JSON.stringify({
          message: newMessage.content,
          codeContext: code,
          history: chatMessages.slice(1) // omit initial greeting
        })
      });
      const data = await res.json();
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.error }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to Copilot API." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto flex flex-col h-full bg-[#050505]">
      <header className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold mb-1 font-mono text-indigo-400">~/workspace/scanner</h2>
          <p className="text-neutral-400 text-sm">AppSec Engineer Dashboard - Static Analysis & Copilot</p>
        </div>
        
        {/* Demo Injectors */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCode(DEMO_CODES.sqlInjection)} className="px-3 py-1.5 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded hover:border-red-500/50 hover:text-red-400 transition-colors">
            SQLi
          </button>
          <button onClick={() => setCode(DEMO_CODES.xss)} className="px-3 py-1.5 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded hover:border-yellow-500/50 hover:text-yellow-400 transition-colors">
            XSS
          </button>
          <button onClick={() => setCode(DEMO_CODES.jwt)} className="px-3 py-1.5 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded hover:border-blue-500/50 hover:text-blue-400 transition-colors">
            JWT
          </button>
          <button onClick={() => setCode(DEMO_CODES.cmdInjection)} className="px-3 py-1.5 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded hover:border-orange-500/50 hover:text-orange-400 transition-colors">
            Cmd Inj
          </button>
          <button onClick={() => setCode(DEMO_CODES.deserialization)} className="px-3 py-1.5 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded hover:border-purple-500/50 hover:text-purple-400 transition-colors">
            Deserialization
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0 animate-in zoom-in-95 duration-700">
        
        {/* Left: Input Panel */}
        <div className="flex flex-col rounded-xl bg-neutral-900/50 border border-neutral-800 overflow-hidden h-[calc(100vh-140px)] shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <span className="text-xs font-mono text-neutral-500">target_source.js</span>
          </div>
          <div className="flex-1 p-4 bg-[#0a0a0a]">
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm text-neutral-300 placeholder-neutral-700 focus:ring-0 custom-scrollbar"
              placeholder="Paste vulnerable code here..."
              spellCheck="false"
            ></textarea>
          </div>
          <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-950 flex justify-between items-center">
            <span className="text-xs text-neutral-500 font-mono">Status: Ready</span>
            <button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !code.trim()}
              className="px-5 py-2 bg-indigo-600/90 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-wider rounded border border-indigo-400/50 shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-all active:scale-95 flex items-center gap-2"
            >
              {isAnalyzing ? "Scanning..." : "Execute Scan"}
            </button>
          </div>
        </div>

        {/* Right: Tabs (Report / Chat) */}
        <div className="flex flex-col rounded-xl bg-neutral-900/30 border border-neutral-800 overflow-hidden h-[calc(100vh-140px)]">
          
          {/* Tab Header */}
          <div className="flex border-b border-neutral-800 bg-neutral-950 font-mono text-sm">
            <button 
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-3 px-4 border-b-2 transition-colors ${activeTab === 'report' ? 'border-indigo-500 text-indigo-400 bg-neutral-900/50' : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/20'}`}
            >
              Vulnerability Report
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 px-4 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-purple-500 text-purple-400 bg-neutral-900/50' : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/20'}`}
            >
              Security Copilot (AI)
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            
            {/* REPORT TAB */}
            {activeTab === 'report' && (
              <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-4">
                {!analysisResult && !isAnalyzing && (
                  <div className="flex-1 flex items-center justify-center text-neutral-600 font-mono text-xs">
                    [ No scan results. Click 'Execute Scan' to begin analysis ]
                  </div>
                )}
                
                {isAnalyzing && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                     <div className="text-indigo-500 font-mono text-sm animate-pulse">Running static code analysis...</div>
                     <div className="w-48 h-1 bg-neutral-800 rounded overflow-hidden">
                       <div className="h-full bg-indigo-500 w-1/2 animate-[bounce_1s_infinite]"></div>
                     </div>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-4">
                    <div className="p-4 rounded border border-neutral-800 bg-neutral-950 flex items-center justify-between">
                      <span className="font-mono text-sm text-neutral-400">Security Score</span>
                      <span className={`font-mono text-xl font-bold ${analysisResult.score < 50 ? 'text-red-500' : 'text-green-500'}`}>
                        {analysisResult.score}/100
                      </span>
                    </div>

                    {analysisResult.issues?.map((issue: any, index: number) => (
                      <div key={index} className={`p-4 rounded border ${issue.level === 'Critical' ? 'bg-red-950/20 border-red-900/50' : issue.level === 'Warning' ? 'bg-yellow-950/20 border-yellow-900/50' : 'bg-blue-950/20 border-blue-900/50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${issue.level === 'Critical' ? 'bg-red-500/20 text-red-400' : issue.level === 'Warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{issue.level}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">OWASP TOP 10</span>
                          <h4 className={`font-mono font-bold text-sm ${issue.level === 'Critical' ? 'text-red-200' : issue.level === 'Warning' ? 'text-yellow-200' : 'text-blue-200'}`}>{issue.title}</h4>
                        </div>
                        <p className="text-xs font-mono text-neutral-400 leading-relaxed">
                          {issue.description}
                        </p>
                      </div>
                    ))}
                    
                    {analysisResult.suggestion && (
                      <div className="mt-4">
                        <div className="font-mono text-xs text-indigo-400 mb-2 border-b border-indigo-900/50 pb-1">AI Remediation Suggestion:</div>
                        <pre className="p-4 rounded bg-[#0a0a0a] text-xs font-mono text-indigo-200 overflow-x-auto border border-neutral-800 custom-scrollbar">
                          <code>{analysisResult.suggestion}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col bg-[#080808]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar font-mono text-sm">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded p-3 ${msg.role === 'user' ? 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-100' : 'bg-neutral-900 border border-neutral-800 text-green-400'}`}>
                        <div className="text-[10px] opacity-50 mb-1 uppercase tracking-wider">{msg.role === 'user' ? 'You' : 'Copilot_Root'}</div>
                        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                       <div className="bg-neutral-900 border border-neutral-800 text-green-400 rounded p-3 text-xs animate-pulse">
                         &gt; computing response...
                       </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                <form onSubmit={handleSendChat} className="p-3 bg-neutral-950 border-t border-neutral-800 flex gap-2">
                  <span className="text-green-500 font-mono py-2 pl-2">&gt;</span>
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask how to fix the code..."
                    className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono text-sm placeholder-neutral-700 focus:ring-0"
                    autoComplete="off"
                  />
                  <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="px-3 font-mono text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-30">
                    [SEND]
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
