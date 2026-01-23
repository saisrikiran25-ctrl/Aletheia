import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../types';
import { Share2, AlertTriangle, Lightbulb, Lock, ExternalLink, Globe, Check } from 'lucide-react';

interface DossierViewProps {
  data: AnalysisResult;
}

export const DossierView: React.FC<DossierViewProps> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);
  const score = data.synthesis?.opportunityScore ?? 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard failed', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-1000">
      {/* Print Styles for Dark Mode PDF */}
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: #020617 !important;
            color: #f1f5f9 !important;
          }
          .glass-panel {
            background-color: #1e293b !important;
            border: 1px solid #334155 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="border-b border-deepSapphire/40 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight mb-2">
            CLASSIFIED DOSSIER
          </h1>
          <p className="text-deepSapphire font-mono text-sm uppercase tracking-widest">
            Authorization Level: FOUNDER
          </p>
        </div>
        <div className="flex gap-3 print:hidden">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-electricCyan/10 border border-electricCyan text-electricCyan rounded hover:bg-electricCyan hover:text-black transition-all text-xs uppercase tracking-wider font-bold cursor-pointer active:scale-95"
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? 'COPIED LINK' : 'SHARE'}
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Consensus Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-lg relative overflow-hidden group print:break-inside-avoid"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity print:hidden">
            <Lock size={64} />
          </div>
          <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">I. The Consensus (Mimetic)</h3>
          <div className="text-2xl font-light text-white mb-4">"{data.consensus?.theme || 'Analysis Pending...'}"</div>
          <ul className="space-y-2 mb-6">
            {(data.consensus?.points || []).map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-400">
                <span className="text-slate-600">0{i+1}.</span> {point}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-4 border-t border-slate-800">
            <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
              <span>MARKET SATURATION</span>
              <span>{data.consensus?.marketSaturation ?? 0}%</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500/70" 
                style={{ width: `${data.consensus?.marketSaturation ?? 0}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Skeptic Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-lg border-red-900/20 bg-red-950/5 relative overflow-hidden group print:break-inside-avoid"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-red-500 print:hidden">
            <AlertTriangle size={64} />
          </div>
          <h3 className="text-red-400/60 text-xs font-mono uppercase tracking-widest mb-4">II. The Skeptic (Adversarial)</h3>
          
          <div className="space-y-4">
            <div>
              <span className="text-xs text-red-500 font-bold uppercase block mb-1">Critical Failure Point</span>
              <p className="text-slate-200 text-sm leading-relaxed">{data.skeptic?.stagnationPoint || 'None detected'}</p>
            </div>
            
            <div>
              <span className="text-xs text-red-500 font-bold uppercase block mb-1">Detected Fallacies</span>
              <ul className="space-y-1">
                {(data.skeptic?.fallacies || []).map((f, i) => (
                  <li key={i} className="text-xs text-slate-400 font-mono border-l-2 border-red-900/50 pl-2">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Synthesis Card - The Secret */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2 glass-panel p-8 rounded-lg border-electricCyan/30 bg-electricCyan/5 relative overflow-hidden group print:break-inside-avoid"
        >
           <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity text-electricCyan rotate-12 print:hidden">
            <Lightbulb size={200} />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="flex-1">
              <h3 className="text-electricCyan text-xs font-mono uppercase tracking-widest mb-2">III. The Synthesis (Zero to One)</h3>
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                {data.synthesis?.secret || 'Synthesis Incomplete'}
              </h2>
              
              <div className="bg-black/30 p-4 rounded border border-electricCyan/20 mb-6">
                <span className="text-xs text-electricCyan/70 font-bold uppercase block mb-2">Execution Strategy</span>
                <p className="text-slate-300 font-mono text-sm leading-relaxed">
                  {data.synthesis?.verticalStrategy || 'Calculating strategy...'}
                </p>
              </div>

              {/* Grounding Sources */}
              {data.sources && data.sources.length > 0 && (
                <div className="mt-4 border-t border-deepSapphire/30 pt-4">
                  <h4 className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest mb-3">
                    <Globe size={12} className="text-electricCyan" /> Verified Intelligence Sources
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.sources.slice(0, 3).map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-deepSapphire/20 border border-deepSapphire/40 rounded text-xs text-slate-300 hover:text-electricCyan hover:border-electricCyan/50 transition-all max-w-[200px] truncate"
                      >
                        <ExternalLink size={10} />
                        <span className="truncate">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Score Circle - Fixed & Refined */}
            <div className="md:w-56 flex flex-col justify-center items-center border-l border-electricCyan/10 md:pl-8 pt-6 md:pt-0">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    stroke="#0f172a" 
                    strokeWidth="8" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    stroke="#1E3A8A" 
                    strokeWidth="8" 
                    fill="transparent" 
                    className="opacity-20"
                  />
                  {/* Progress Circle */}
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    stroke="#22D3EE" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold text-white block tracking-tighter">
                    {data.synthesis?.opportunityScore ?? 0}
                  </span>
                  <span className="text-[10px] text-electricCyan uppercase tracking-widest mt-1">
                    Alpha Score
                  </span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <span className="text-xs text-slate-400 block mb-1">Vertical Monopoly<br/>Potential</span>
                <div className="flex gap-1 justify-center print:hidden">
                  <span className="w-1 h-1 bg-electricCyan rounded-full animate-pulse" />
                  <span className="w-1 h-1 bg-electricCyan rounded-full animate-pulse delay-100" />
                  <span className="w-1 h-1 bg-electricCyan rounded-full animate-pulse delay-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};