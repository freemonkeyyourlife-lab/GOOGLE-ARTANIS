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
  BookOpen,
  Palette,
  Search,
  Brain,
  Box,
  Package
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
    gold_obsidian: 'from-amber-400 via-yellow-300 to-amber-600',
    silver_noir: 'from-zinc-200 via-slate-300 to-zinc-400',
    artanis_neon: 'from-pink-600 via-rose-500 to-purple-600',
    cyber_violet: 'from-purple-600 via-indigo-500 to-pink-600',
    emerald_noir: 'from-emerald-600 via-teal-500 to-cyan-600',
    midnight_gold: 'from-amber-500 via-yellow-600 to-rose-600',
  };

  const activeGradient = themeGradients[settings.theme] || themeGradients.gold_obsidian;

  return (
    <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-amber-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.85)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        
        {/* Brand Logo & Artanis Info - Black, Gold & Silver Glass */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeGradient} flex items-center justify-center shadow-lg shadow-amber-500/25 ring-1 ring-amber-300/40 flex-shrink-0`}>
            <Flame className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent tracking-wide font-serif">
                ARTANIS × TANIA
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                <Laptop className="w-3 h-3 text-amber-400" />
                <span>Chromebook Edition</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-zinc-900/90 text-zinc-300 border border-zinc-700/60">
                Mia · Muse #1
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Private Bilderwerkstatt &amp; Erotik-Studio • SillyTavern Anbindung
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Artanis Modules) */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 xl:pb-0 scrollbar-none text-xs">
          {/* 1. Bild-Generator (Erzeugen & Archivieren) */}
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-pink-300" />
            <span>Bild-Generator 🎨</span>
          </button>

          {/* 2. Rückwärtssuche / Inspector */}
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'inspector'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-cyan-300" />
            <span>Rückwärtssuche 🔍</span>
          </button>

          {/* 3. LoRA Charakter Training */}
          <button
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'training'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-amber-300" />
            <span>LoRA Training 🧠</span>
          </button>

          {/* 4. Interaktive 3D-Bühne & Audio */}
          <button
            onClick={() => setActiveTab('three3d')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'three3d'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-emerald-300" />
            <span>3D-Bühne 🌐</span>
          </button>

          {/* 5. Chat & Flaschendrehen */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'chat'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquareHeart className="w-3.5 h-3.5 text-rose-300" />
            <span>Chat &amp; Spiel 🍾</span>
          </button>

          {/* 6. Charaktere */}
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

          {/* 7. Stimmen */}
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

          {/* 8. Prompt Studio */}
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

          {/* 9. Video & Media */}
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

          {/* 10. Storys & Sessions */}
          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'stories'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-pink-300" />
            <span>Storys</span>
          </button>

          {/* 11. Windows-Explorer & Smart Explorer */}
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-md shadow-amber-500/20 border border-amber-300/40'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800'
            }`}
          >
            <FolderSearch className="w-3.5 h-3.5 text-emerald-300" />
            <span>Dateien &amp; Explorer</span>
            {scannedCount > 0 && (
              <span className="text-[10px] bg-amber-950/90 text-amber-200 border border-amber-700/50 px-1.5 py-0.2 rounded-full font-mono">
                {scannedCount}
              </span>
            )}
          </button>

          {/* 12. KI-Nachschlagewerk (Neu!) */}
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'knowledge'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-md shadow-amber-500/20 border border-amber-300/40'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>KI-Nachschlagewerk 📚</span>
          </button>

          {/* 13. Universal Exporter (Neu!) */}
          <button
            onClick={() => setActiveTab('exporter')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'exporter'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-md shadow-amber-500/20 border border-amber-300/40'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-yellow-300" />
            <span>Universal Exporter 📦</span>
          </button>

          {/* 14. Daran basteln / Einstellungen */}
          <button
            onClick={() => setActiveTab('customizer')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'customizer'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-md shadow-amber-500/20 border border-amber-300/40'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-zinc-400" />
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
