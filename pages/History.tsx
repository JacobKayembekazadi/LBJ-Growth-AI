
import React, { useState } from 'react';
import { GrowthAnalysis } from '../types';
import { Search, Calendar, ChevronDown, ChevronUp, Download, Share2, FileCheck } from 'lucide-react';

interface HistoryProps {
  analyses: GrowthAnalysis[];
}

const History: React.FC<HistoryProps> = ({ analyses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(analyses[0]?.id || null);

  const filteredAnalyses = analyses.filter(a => 
    a.input.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.output.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Horizontal rules
      if (line.includes('---')) {
        let title = "";
        if (line.includes("ACTION DOCUMENT")) title = "OFFICIAL DELIVERABLE";
        if (line.includes("GROWTH INTELLIGENCE")) title = "STRATEGIC INTELLIGENCE";
        if (line.includes("WHAT TO DO WITH THIS PDF")) title = "IMPLEMENTATION GUIDE";
        
        return (
          <div key={i} className="relative flex items-center my-8">
            <div className="flex-grow border-t border-zinc-800"></div>
            {title && <span className="flex-shrink mx-4 text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">{title}</span>}
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>
        );
      }

      // Headers (e.g., "Executive Summary:", "30-Day Plan:")
      if (line.endsWith(':') && line.length < 40) {
        return (
          <h4 key={i} className="text-white font-bold text-sm uppercase tracking-widest mt-8 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
            {line.replace(':', '')}
          </h4>
        );
      }

      // List items
      if (line.trim().startsWith('- ')) {
        return (
          <div key={i} className="flex gap-4 text-zinc-400 mb-3 ml-2 group">
            <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors mt-0.5">•</span>
            <span className="flex-1 leading-relaxed">{line.trim().substring(2)}</span>
          </div>
        );
      }

      // Normal paragraphs
      if (line.trim().length > 0) {
        return <p key={i} className="mb-4 text-zinc-400 leading-relaxed font-light">{line}</p>;
      }

      return null;
    });
  };

  const isActionDocument = (content: string) => content.includes("--- ACTION DOCUMENT ---");

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h1 className="text-4xl font-serif text-white">Intelligence Archive</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-full pl-12 pr-6 py-2.5 text-white focus:ring-1 focus:ring-white outline-none w-full md:w-64 transition-all focus:md:w-80"
          />
        </div>
      </div>

      {filteredAnalyses.length > 0 ? (
        <div className="space-y-8">
          {filteredAnalyses.map((analysis) => {
            const isDeliverable = isActionDocument(analysis.output);
            return (
              <div 
                key={analysis.id} 
                className={`
                  bg-zinc-950 border transition-all duration-500 rounded-[2.5rem] overflow-hidden group/card
                  ${expandedId === analysis.id 
                    ? 'border-zinc-700 ring-1 ring-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                    : 'border-zinc-900 hover:border-zinc-800'}
                  ${isDeliverable && 'border-zinc-800/50'}
                `}
              >
                <button 
                  onClick={() => setExpandedId(expandedId === analysis.id ? null : analysis.id)}
                  className="w-full text-left p-8 md:p-10 flex items-start justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
                        <Calendar size={12} />
                        {new Date(analysis.timestamp).toLocaleDateString(undefined, { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </div>
                      {isDeliverable && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-[9px] text-emerald-400 rounded-full border border-emerald-500/20 uppercase font-bold tracking-widest">
                          <FileCheck size={10} />
                          Final Deliverable
                        </div>
                      )}
                      {analysis.input.hasImage && (
                        <span className="px-3 py-1 bg-zinc-900 text-[9px] text-zinc-500 rounded-full border border-zinc-800 uppercase font-bold tracking-widest">
                          Visual Input
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-serif text-white leading-tight group-hover/card:text-zinc-200 transition-colors">
                      {analysis.input.text.length > 80 ? analysis.input.text.substring(0, 80) + '...' : analysis.input.text}
                    </h3>
                  </div>
                  <div className="text-zinc-600 mt-2 p-2 rounded-full border border-zinc-900 group-hover/card:text-white transition-all">
                    {expandedId === analysis.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </button>

                {expandedId === analysis.id && (
                  <div className="px-8 md:px-12 pb-12 pt-0">
                    <div className={`
                      p-1 rounded-[2rem] mb-8
                      ${isDeliverable ? 'bg-gradient-to-b from-zinc-800/30 to-transparent' : 'bg-zinc-900/30'}
                    `}>
                      <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-12 rounded-[1.8rem] shadow-inner">
                        <div className="max-w-none">
                          {renderContent(analysis.output)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-900 pt-8">
                      <p className="text-xs text-zinc-600 font-medium italic">
                        Digital CMO Verified • LBJ Growth Intelligence System
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-5 py-2.5 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                          <Share2 size={16} />
                          Distribute
                        </button>
                        <button className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full text-sm font-bold transition-all hover:bg-zinc-200 active:scale-95 shadow-xl">
                          <Download size={18} />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-32 bg-zinc-900/10 border border-zinc-900 border-dashed rounded-[4rem]">
          <p className="text-zinc-600 text-xl font-serif italic">No intelligence reports currently archived.</p>
        </div>
      )}
    </div>
  );
};

export default History;
