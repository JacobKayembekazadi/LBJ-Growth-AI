
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AppRoute, GrowthAnalysis } from './types';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import History from './pages/History';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [analyses, setAnalyses] = useState<GrowthAnalysis[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lbj_analyses');
    if (saved) {
      setAnalyses(JSON.parse(saved));
    }
  }, []);

  // Save to local storage when analyses change
  useEffect(() => {
    localStorage.setItem('lbj_analyses', JSON.stringify(analyses));
  }, [analyses]);

  const addAnalysis = (input: { text: string; hasImage: boolean }, output: string) => {
    const newAnalysis: GrowthAnalysis = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      input,
      output
    };
    setAnalyses(prev => [newAnalysis, ...prev]);
    setCurrentRoute(AppRoute.HISTORY);
  };

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.DASHBOARD:
        return <Dashboard 
          analyses={analyses} 
          onStartAnalyze={() => setCurrentRoute(AppRoute.ANALYZE)} 
        />;
      case AppRoute.ANALYZE:
        return <Analyze onAnalyzeComplete={addAnalysis} />;
      case AppRoute.HISTORY:
        return <History analyses={analyses} />;
      case AppRoute.SETTINGS:
        return (
          <div className="max-w-2xl mx-auto py-12">
            <h2 className="text-3xl font-serif mb-6 text-white">Brand Profile</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Define the core essence of your brand to ensure the CMO intelligence remains consistent with your long-term positioning.
            </p>
            <div className="space-y-6">
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Core Value Proposition</label>
                <textarea 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:ring-1 focus:ring-white outline-none"
                  rows={4}
                  placeholder="e.g. Bespoke architectural solutions for modern living..."
                  defaultValue="Luxury brand intelligence specializing in premium content and strategic growth for discerning clients."
                />
              </div>
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Brand Voice Guidelines</label>
                <div className="flex flex-wrap gap-2">
                  {['Refined', 'Authoritative', 'Minimalist', 'Growth-Oriented'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm border border-zinc-700">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard analyses={analyses} onStartAnalyze={() => setCurrentRoute(AppRoute.ANALYZE)} />;
    }
  };

  return (
    <Layout activeRoute={currentRoute} onNavigate={(r) => setCurrentRoute(r as AppRoute)}>
      {renderContent()}
    </Layout>
  );
};

export default App;
