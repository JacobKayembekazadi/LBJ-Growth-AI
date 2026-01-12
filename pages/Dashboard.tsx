
import React from 'react';
import { 
  Plus, 
  ChevronRight, 
  ArrowUpRight, 
  Zap, 
  Target, 
  FileText 
} from 'lucide-react';
import { GrowthAnalysis } from '../types';

interface DashboardProps {
  analyses: GrowthAnalysis[];
  onStartAnalyze: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ analyses, onStartAnalyze }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-white mb-2">Strategic Overview</h1>
          <p className="text-zinc-400 text-lg">Harnessing intelligence to drive qualified demand.</p>
        </div>
        <button 
          onClick={onStartAnalyze}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
        >
          <Plus size={20} />
          New Intelligence
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Zap className="text-indigo-400" />
          </div>
          <div className="text-3xl font-bold mb-1">{analyses.length}</div>
          <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Reports Generated</div>
        </div>
        <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Target className="text-emerald-400" />
          </div>
          <div className="text-3xl font-bold mb-1">High</div>
          <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Strategic Alignment</div>
        </div>
        <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
            <FileText className="text-amber-400" />
          </div>
          <div className="text-3xl font-bold mb-1">Refined</div>
          <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Brand Voice Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            Recent Intelligence
          </h2>
          <div className="space-y-4">
            {analyses.length > 0 ? (
              analyses.slice(0, 4).map(item => (
                <div key={item.id} className="group p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-zinc-300 font-medium line-clamp-1">{item.input.text}</p>
                    <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    {item.input.hasImage && (
                      <span className="px-2 py-0.5 bg-zinc-800 text-[9px] text-zinc-400 rounded uppercase tracking-tighter">Visual Asset</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-500 italic mb-4">No strategic reports recorded yet.</p>
                <button onClick={onStartAnalyze} className="text-white font-medium hover:underline text-sm">Initiate first analysis</button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 text-white">The Digital CMO Methodology</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              LBJ-Growth-AI leverages premium storytelling to bridge the gap between completed projects and future revenue. Every recommendation is vetted for brand alignment.
            </p>
            <div className="space-y-3">
              {[
                'Contextual Project Analysis',
                'Brand Voice Protection',
                'Demand Generation Mapping',
                'Asset Lifecycle Extension'
              ].map(point => (
                <div key={point} className="flex items-center gap-3 text-sm text-zinc-300">
                  <ChevronRight size={14} className="text-zinc-500" />
                  {point}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors duration-700"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
