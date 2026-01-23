import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight } from 'lucide-react';

interface TerminalInputProps {
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ onSubmit, isLoading }) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      {/* Background Glow */}
      <div 
        className={`absolute -inset-1 bg-electricCyan rounded-lg opacity-0 transition duration-500 blur-md group-hover:opacity-20 ${isFocused ? 'opacity-30' : ''}`} 
      />
      
      <form onSubmit={handleSubmit} className="relative z-10 flex items-center bg-slate-900 border border-deepSapphire/50 rounded-lg overflow-hidden shadow-2xl">
        <div className="pl-4 pr-2 text-electricCyan/70">
          <Terminal size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter target market or industry..."
          className="w-full bg-transparent py-4 px-2 text-lg text-electricCyan font-mono focus:outline-none placeholder-slate-600"
          autoFocus
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={!value || isLoading}
          className={`mr-2 p-2 rounded-md transition-all duration-300 ${value ? 'text-electricCyan hover:bg-deepSapphire/30' : 'text-slate-700'}`}
        >
          <ArrowRight size={20} />
        </button>

        {/* Scanline effect */}
        {isLoading && (
          <motion.div 
            className="absolute bottom-0 left-0 h-0.5 bg-electricCyan shadow-[0_0_10px_#22D3EE]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </form>

      <div className="mt-2 flex justify-between text-xs font-mono text-slate-500">
        <span>STATUS: {isLoading ? 'DIALECTIC ENGINE ACTIVE' : 'AWAITING QUERY'}</span>
        {/* Removed CMD+K instruction as per request */}
        <span></span>
      </div>
    </div>
  );
};