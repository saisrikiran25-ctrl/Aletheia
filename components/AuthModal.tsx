import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ChevronRight, Fingerprint } from 'lucide-react';

interface AuthModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay for dramatic effect
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-md bg-slate-900 border border-deepSapphire/50 rounded-xl shadow-2xl relative z-[101] overflow-hidden"
      >
        {/* Top bar decoration */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-electricCyan to-transparent opacity-50" />
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-deepSapphire/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-deepSapphire/30 text-electricCyan">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Restricted Access</h2>
            <p className="text-slate-400 text-sm mt-2">Identify yourself to access the terminal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-electricCyan uppercase tracking-wider ml-1">Agent ID / Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electricCyan transition-colors"
                placeholder="agent@aletheia.ai"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-mono text-electricCyan uppercase tracking-wider ml-1">Passcode</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electricCyan transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-deepSapphire/20 hover:bg-deepSapphire/40 border border-deepSapphire text-electricCyan font-bold py-3 rounded-lg mt-6 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Fingerprint className="animate-pulse" size={18} />
                  VERIFYING CREDENTIALS...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  AUTHENTICATE
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer decoration */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
          <span>Encrypted Connection</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Secure
          </span>
        </div>
      </motion.div>
    </div>
  );
};