
import React, { useState, useRef } from 'react';
import { analyzeGrowth } from '../services/geminiService';
import { 
  Camera, 
  Upload, 
  Send, 
  Loader2, 
  Info,
  ChevronRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface AnalyzeProps {
  onAnalyzeComplete: (input: { text: string; hasImage: boolean }, output: string) => void;
}

const Analyze: React.FC<AnalyzeProps> = ({ onAnalyzeComplete }) => {
  const [inputText, setInputText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeGrowth(inputText, image || undefined);
      onAnalyzeComplete({ 
        text: inputText, 
        hasImage: !!image 
      }, result);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
      setIsAnalyzing(false);
    }
  };

  const triggerDeliverable = () => {
    const trigger = "Based on our discussion, let's move forward and create a full action plan document.";
    setInputText(prev => prev ? `${prev}\n\n${trigger}` : trigger);
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-white mb-6">Strategic Intelligence</h1>
        <p className="text-zinc-500 text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Provide project context, visual assets, or campaign performance to generate refined marketing intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Main Input Area */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative">
            <div className="absolute top-8 right-10">
               <button 
                onClick={triggerDeliverable}
                className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
                title="Switch to Deliverable Mode"
              >
                <FileCheck size={14} />
                Request Deliverable
              </button>
            </div>
            
            <div className="mb-8">
              <label className="block text-[10px] font-bold text-zinc-600 mb-4 uppercase tracking-[0.3em]">
                Strategic Input
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste case details, project goals, or performance data..."
                className="w-full h-64 bg-zinc-950 text-white rounded-3xl p-8 focus:ring-1 focus:ring-zinc-700 outline-none transition-all border border-zinc-900/50 resize-none text-lg font-light leading-relaxed placeholder:text-zinc-800 shadow-inner"
                disabled={isAnalyzing}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-full text-sm font-medium transition-all border border-zinc-800 shadow-lg active:scale-95"
                  disabled={isAnalyzing}
                >
                  <Upload size={18} />
                  {image ? 'Replace Asset' : 'Attach Visual Asset'}
                </button>
                {image && (
                  <button
                    onClick={() => setImage(null)}
                    className="px-6 py-3 text-zinc-600 hover:text-red-400 text-sm font-medium transition-colors"
                    disabled={isAnalyzing}
                  >
                    Discard
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <button
                onClick={runAnalysis}
                disabled={isAnalyzing || !inputText.trim()}
                className={`
                  flex items-center gap-3 px-10 py-4 rounded-full font-bold transition-all text-sm uppercase tracking-widest
                  ${isAnalyzing || !inputText.trim()
                    ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-zinc-800'
                    : 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-[0_10px_40px_rgba(255,255,255,0.1)]'}
                `}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    Generate Intelligence
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl text-red-400 text-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Info size={18} />
              </div>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Visual Preview */}
          {image && (
            <div className="relative rounded-[2.5rem] overflow-hidden border border-zinc-900 aspect-video shadow-2xl group animate-in zoom-in-95 duration-500">
              <img src={image} alt="Input source" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Camera size={14} className="text-white" />
                </div>
                <span className="text-sm font-medium text-white tracking-widest uppercase">Asset Analysis Enabled</span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Help */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] shadow-xl">
            <h3 className="font-bold text-white mb-8 flex items-center gap-3 text-lg">
              <ShieldCheck size={22} className="text-zinc-400" />
              Intelligence Protocol
            </h3>
            <ul className="space-y-8">
              <li className="flex gap-5">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-zinc-500">01</div>
                <div>
                  <h4 className="text-zinc-200 text-sm font-bold mb-1 uppercase tracking-wider">Quality Curation</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">Intelligence prioritizes strategic depth over volume. Noise is filtered out.</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-zinc-500">02</div>
                <div>
                  <h4 className="text-zinc-200 text-sm font-bold mb-1 uppercase tracking-wider">Asset Extension</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">Turn dormant projects into active growth drivers through narrative mapping.</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-zinc-500">03</div>
                <div>
                  <h4 className="text-zinc-200 text-sm font-bold mb-1 uppercase tracking-wider">Deliverable Focus</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">Request an Action Document to receive a board-ready implementation strategy.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="p-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
            <h3 className="font-bold text-zinc-100 mb-3 text-lg">CMO Insight</h3>
            <p className="text-sm text-zinc-400 leading-relaxed relative z-10 font-light italic">
              "Consistency is the hallmark of luxury. Every interaction should reinforce the brand's premium stance, never deviate from it."
            </p>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/5 blur-2xl rounded-full group-hover:bg-white/10 transition-colors duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
