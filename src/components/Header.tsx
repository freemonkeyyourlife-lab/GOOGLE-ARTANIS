import React from 'react';
import { TabType, StudioSettings } from '../types';
import { 
  MessageSquareHeart, 
  UserCheck, 
  Sparkles, 
  Film, 
  FolderSearch, 
  Sliders, 
  Flame, 
  HelpCircle, 
  Laptop,
  Volume2,
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenKinksModal: () => void;
  scannedCount: number;
  settings: StudioSettings;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenKinksModal,
  scannedCount,
  settings,
}) => {
  const themeGradients = {
    artanis_neon: 'from-pink-600 via-rose-500 to-purple-600',
    cyber_violet: 'from-purple-600 via-indigo-500 to-pink-600',
    emerald_noir: 'from-emerald-600 via-teal-500 to-cyan-600',
    midnight_gold: 'from-amber-500 via-yellow-600 to-rose-600',
  };

  const activeGradient = themeGradients[settings.theme] || themeGradients.artanis_neon;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-pink-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        
        {/* Brand Logo & Artanis Info */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeGradient} flex items-center justify-center shadow-lg shadow-pink-600/20 ring-1 ring-pink-400/30 flex-shrink-0`}>
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-purple-300 bg-clip-text text-transparent tracking-wide">
                ARTANIS × TANIA
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-pink-950/80 text-pink-300 border border-pink-800/50 flex items-center gap-1">
                <Laptop className="w-3 h-3 text-pink-400" />
                <span>Chromebook</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Private Interactive Archive • Unzensiertes Creator Studio
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Artanis Modules) */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 xl:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'chat'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquareHeart className="w-3.5 h-3.5 text-rose-300" />
            <span>Chat &amp; Flaschendrehen 🍾</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'characters'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Charaktere</span>
          </button>

          <button
            onClick={() => setActiveTab('voices')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'voices'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Stimmen</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'prompts'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Prompt Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('media_studio')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'media_studio'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-indigo-300" />
            <span>Video &amp; Media</span>
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'stories'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-pink-300" />
            <span>Storys &amp; Sessions</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'explorer'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FolderSearch className="w-3.5 h-3.5 text-emerald-300" />
            <span>Dateien &amp; Drive</span>
            {scannedCount > 0 && (
              <span className="text-[10px] bg-pink-950/90 text-pink-200 border border-pink-700/50 px-1.5 py-0.2 rounded-full font-mono">
                {scannedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customizer')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'customizer'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-pink-300" />
            <span>Daran basteln</span>
          </button>
        </nav>

        {/* Quick Kinks Guide Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenKinksModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-pink-950 to-purple-950 border border-pink-700/40 text-pink-200 hover:border-pink-500 transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
            <span>Kinks &amp; Details</span>
          </button>
        </div>

      </div>
    </header>
  );
};
