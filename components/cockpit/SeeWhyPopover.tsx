import React, { useState } from 'react';
import { Evidence } from '../../lib/mobility/types';

interface SeeWhyPopoverProps {
  evidence: Evidence[];
  buttonText?: string;
}

export default function SeeWhyPopover({ evidence, buttonText = "See Why" }: SeeWhyPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-[10px] uppercase font-bold text-[var(--tp-accent)] hover:text-[var(--tp-accent-light)] transition-[var(--tp-transition)] flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tp-accent)] rounded px-1"
      >
        <span>{buttonText}</span>
        <svg className={`w-3 h-3 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-[var(--tp-surface)] border border-[var(--tp-border-light)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 right-0 md:left-0 md:right-auto">
          <h4 className="text-[10px] font-bold text-[var(--tp-text-muted)] uppercase tracking-widest mb-3 border-b border-[var(--tp-border)] pb-2">Intelligence Chain</h4>
          <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar">
            {evidence.map((ev, i) => (
              <div key={ev.id} className="relative">
                {/* Timeline connector */}
                {i !== evidence.length - 1 && (
                  <div className="absolute left-[7px] top-5 bottom-[-16px] w-[2px] bg-[var(--tp-border)]" />
                )}
                
                <div className="flex items-start">
                  <div className={`w-3.5 h-3.5 rounded-full mt-0.5 mr-3 shrink-0 z-10 ring-4 ring-[var(--tp-surface)] ${
                    ev.dataClass === 'OBSERVED' ? 'bg-[var(--tp-accent)] shadow-[0_0_8px_var(--tp-accent)]' :
                    ev.dataClass === 'HISTORICAL' ? 'bg-purple-500 shadow-[0_0_8px_purple]' : 'bg-emerald-500 shadow-[0_0_8px_green]'
                  }`} />
                  
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-[var(--tp-text-muted)] uppercase tracking-wider">{ev.type.replace('_', ' ')}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--tp-bg)] border border-[var(--tp-border)] text-[var(--tp-text-secondary)]">{ev.dataClass}</span>
                    </div>
                    <p className="text-[13px] text-[var(--tp-text-primary)] mt-1 font-bold leading-tight">{ev.value}</p>
                    <p className="text-[11px] text-[var(--tp-text-secondary)] mt-0.5 leading-snug">{ev.contribution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
