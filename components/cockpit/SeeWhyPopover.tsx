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
        className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
      >
        <span>{buttonText}</span>
        <svg className={`w-3 h-3 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-3 left-0">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b border-gray-800 pb-1">Intelligence Chain</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {evidence.map((ev, i) => (
              <div key={ev.id} className="relative">
                {/* Timeline connector */}
                {i !== evidence.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-[-12px] w-[2px] bg-gray-800" />
                )}
                
                <div className="flex items-start">
                  <div className={`w-3.5 h-3.5 rounded-full mt-0.5 mr-2 shrink-0 z-10 ring-2 ring-gray-900 ${
                    ev.dataClass === 'OBSERVED' ? 'bg-blue-500' :
                    ev.dataClass === 'HISTORICAL' ? 'bg-purple-500' : 'bg-emerald-500'
                  }`} />
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{ev.type.replace('_', ' ')}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-300">{ev.dataClass}</span>
                    </div>
                    <p className="text-xs text-white mt-0.5 font-medium">{ev.value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{ev.contribution}</p>
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
