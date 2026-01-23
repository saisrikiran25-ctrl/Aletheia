import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogEntry } from '../types';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

interface IntelligenceSidebarProps {
  logs: LogEntry[];
}

export const IntelligenceSidebar: React.FC<IntelligenceSidebarProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getIcon = (agent: string) => {
    switch (agent) {
      case 'CONSENSUS': return <Activity size={14} className="text-yellow-500" />;
      case 'SKEPTIC': return <ShieldAlert size={14} className="text-red-500" />;
      case 'SYNTHESIZER': return <Cpu size={14} className="text-electricCyan" />;
      default: return <div className="w-3 h-3 rounded-full bg-slate-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col font-mono text-xs border-r border-deepSapphire/30 bg-slate-950/80 backdrop-blur-sm">
      <div className="p-4 border-b border-deepSapphire/30 flex items-center justify-between">
        <span className="text-deepSapphire uppercase tracking-widest font-bold">Logic Stream</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-electricCyan rounded-full animate-pulse delay-75" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 items-start opacity-80 hover:opacity-100 transition-opacity"
            >
              <div className="mt-1 shrink-0 opacity-70">
                {getIcon(log.agent)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`font-bold ${
                    log.agent === 'CONSENSUS' ? 'text-yellow-500/80' :
                    log.agent === 'SKEPTIC' ? 'text-red-500/80' :
                    log.agent === 'SYNTHESIZER' ? 'text-electricCyan/80' : 'text-slate-500'
                  }`}>
                    {log.agent}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {new Date(log.timestamp).toISOString().split('T')[1].slice(0, -1)}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed font-light">
                  {log.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};