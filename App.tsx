import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalInput } from './components/TerminalInput';
import { ThreeHeatmap } from './components/ThreeHeatmap';
import { IntelligenceSidebar } from './components/IntelligenceSidebar';
import { DossierView } from './components/DossierView';
import { AppPhase, LogEntry, AnalysisResult } from './types';
import { APP_NAME } from './constants';
import { analyzeMarket } from './services/geminiService';
import { Layers, Command, Database, User } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showCmd, setShowCmd] = useState(false);

  // Keyboard shortcut for Command Center
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCmd(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addLog = useCallback((agent: LogEntry['agent'], message: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      agent,
      message,
      timestamp: Date.now()
    }]);
  }, []);

  const handleTerminalSubmit = (query: string) => {
    executeAnalysis(query);
  };

  const executeAnalysis = async (query: string) => {
    setPhase(AppPhase.SCANNING);
    setLogs([]);
    setAnalysis(null);

    try {
      // Simulate/Real execution steps
      addLog('SYSTEM', `Initiating dialectic sequence for target: "${query}"`);

      // Step 1: Consensus
      setTimeout(() => addLog('CONSENSUS', 'Scanning global knowledge graph for dominant narratives...'), 500);
      setTimeout(() => addLog('CONSENSUS', 'Identifying high-frequency mimetic patterns...'), 1500);

      // Call Gemini API
      const result = await analyzeMarket(query);

      // Simulate real-time stream of the "thought process" based on result
      addLog('CONSENSUS', `Consensus identified: "${result.consensus?.theme || 'Data unavailable'}"`);

      const rawSaturation = result.consensus?.marketSaturation ?? 0;
      const saturationVal = rawSaturation <= 1 && rawSaturation > 0 ? Math.round(rawSaturation * 100) : Math.round(rawSaturation);

      addLog('CONSENSUS', `Market Saturation detected at ${saturationVal}%`);

      setPhase(AppPhase.SKEPTIC);
      addLog('SKEPTIC', 'Engaging adversarial neural nets...');
      await new Promise(r => setTimeout(r, 1000));

      if (result.skeptic?.fallacies && Array.isArray(result.skeptic.fallacies)) {
        result.skeptic.fallacies.forEach((f, i) => {
          setTimeout(() => addLog('SKEPTIC', `Logical Fallacy detected: ${f}`), i * 800);
        });
      }
      setTimeout(() => addLog('SKEPTIC', `CRITICAL: Stagnation point found at "${result.skeptic?.stagnationPoint || 'Unknown'}"`), 2500);

      await new Promise(r => setTimeout(r, 3000));

      setPhase(AppPhase.SYNTHESIS);
      addLog('SYNTHESIZER', 'Resolving dialectic conflict...');
      addLog('SYNTHESIZER', 'Calculating vertical monopoly potential...');

      await new Promise(r => setTimeout(r, 1500));
      setAnalysis(result);
      setPhase(AppPhase.COMPLETE);
      addLog('SYSTEM', 'Dossier generated. Authorization granted.');

    } catch (error) {
      console.error(error);
      addLog('SYSTEM', 'CRITICAL ERROR: Connection severed or data malformed.');
      setPhase(AppPhase.IDLE);
    }
  };

  return (
    <div className="h-screen w-full bg-obsidian text-slate-200 font-sans selection:bg-electricCyan/30 selection:text-white relative overflow-hidden flex flex-col print:h-auto print:overflow-visible">

      {/* --- GLOBAL ORGANIC BACKGROUND LAYER --- */}
      {/* Grid Pattern (Fixed) */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none z-0 print:hidden" />

      {/* Radial Gradient Glow (Fixed) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-deepSapphire/20 blur-[120px] rounded-full pointer-events-none z-0 print:hidden" />

      {/* 3D Heatmap (Fixed Fullscreen) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60 print:hidden">
        <ThreeHeatmap
          intensity={phase === AppPhase.SCANNING ? 80 : phase === AppPhase.SKEPTIC ? 40 : 20}
          phase={phase}
        />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col h-full print:h-auto print:overflow-visible">
        {/* Header */}
        <header className="w-full border-b border-deepSapphire/20 bg-obsidian/60 backdrop-blur-md sticky top-0 z-50 print:hidden">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-electricCyan/10 border border-electricCyan rounded flex items-center justify-center">
                <Layers size={18} className="text-electricCyan" />
              </div>
              <span className="font-bold tracking-tight text-white">{APP_NAME}</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono border border-slate-700">BETA</span>
            </div>

            <div className="flex items-center gap-6 text-sm font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                SYSTEM ONLINE
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden print:h-auto print:overflow-visible">

          {/* Left Sidebar - Intelligence Stream */}
          <AnimatePresence>
            {phase !== AppPhase.IDLE && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden lg:block border-r border-deepSapphire/20 bg-obsidian/40 backdrop-blur-sm relative z-20 print:hidden"
              >
                <IntelligenceSidebar logs={logs} />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Center Canvas / Scrollable View */}
          <div className="flex-1 relative flex flex-col overflow-y-auto custom-scrollbar scroll-smooth print:h-auto print:overflow-visible print:block">

            <div className="flex-1 flex flex-col items-center p-6 w-full max-w-7xl mx-auto min-h-full print:p-0 print:block">

              {/* Vertical Spacer for vertical centering when idle */}
              {phase === AppPhase.IDLE && <div className="flex-1 print:hidden" />}

              {/* Phase: IDLE / SCANNING (Input View) */}
              <AnimatePresence mode='wait'>
                {phase === AppPhase.IDLE && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="w-full text-center space-y-8 my-auto print:hidden"
                  >
                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                        The Signal in the <span className="text-slate-600 line-through decoration-electricCyan/50">Noise</span>.
                      </h1>
                      <p className="text-slate-400 max-w-xl mx-auto text-lg">
                        Identify the zero-to-one truths your competitors are too afraid to admit.
                      </p>
                    </div>
                    <TerminalInput onSubmit={handleTerminalSubmit} isLoading={false} />

                    {/* Stats REMOVED as per request */}
                    <div className="pb-12" />
                  </motion.div>
                )}

                {/* Loading State Overlay */}
                {phase !== AppPhase.IDLE && phase !== AppPhase.COMPLETE && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none print:hidden"
                  >
                    <div className="text-center space-y-4 bg-obsidian/80 p-8 rounded-xl backdrop-blur-md border border-deepSapphire/30 shadow-2xl">
                      <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-t-2 border-electricCyan rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-r-2 border-deepSapphire rounded-full animate-spin reverse"></div>
                      </div>
                      <h2 className="text-xl font-mono text-electricCyan animate-pulse">
                        {phase === AppPhase.SCANNING ? 'MAPPING CONSENSUS' :
                          phase === AppPhase.SKEPTIC ? 'STRESS-TESTING LOGIC' : 'SYNTHESIZING TRUTH'}
                      </h2>
                      <p className="text-slate-500 text-sm font-mono">
                        Neural Dialectic Engine Active...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Results View */}
                {phase === AppPhase.COMPLETE && analysis && (
                  <motion.div
                    key="complete"
                    className="w-full pb-20 pt-10 print:pb-0 print:pt-0"
                  >
                    <div className="flex justify-center mb-6 print:hidden">
                      <button
                        onClick={() => setPhase(AppPhase.IDLE)}
                        className="text-xs text-slate-500 hover:text-electricCyan flex items-center gap-2 transition-colors bg-obsidian/50 px-4 py-2 rounded-full border border-slate-800"
                      >
                        <Database size={12} /> NEW QUERY
                      </button>
                    </div>
                    <DossierView data={analysis} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Vertical Spacer for vertical centering when idle */}
              {phase === AppPhase.IDLE && <div className="flex-1 print:hidden" />}

            </div>

            {/* Footer inside scrolling container */}
            {phase !== AppPhase.COMPLETE && (
              <footer className="border-t border-deepSapphire/20 bg-obsidian/60 backdrop-blur text-xs text-slate-600 py-3 px-6 flex justify-between shrink-0 print:hidden">
                <span>Aletheia Intelligence Terminal v1.0</span>
                <div className="flex gap-4">
                  {/* Links Removed */}
                </div>
              </footer>
            )}
          </div>
        </main>
      </div>

      {/* Command K Modal */}
      <AnimatePresence>
        {showCmd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCmd(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden relative z-[101]"
            >
              <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                <Command size={20} className="text-slate-400" />
                <input className="bg-transparent w-full focus:outline-none text-white placeholder-slate-500" placeholder="Type a command..." autoFocus />
              </div>
              <div className="p-2 space-y-1">
                {['New Analysis', 'Export History', 'System Diagnostics', 'Switch Model (Gemini 3 Pro)'].map((item, i) => (
                  <div key={i} className="px-3 py-2 hover:bg-slate-800 rounded cursor-pointer text-slate-300 text-sm flex justify-between group">
                    <span>{item}</span>
                    <span className="text-slate-600 group-hover:text-slate-400">Jump</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}