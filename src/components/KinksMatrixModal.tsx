import React from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  X, 
  Sparkles, 
  Flame, 
  UserCheck, 
  ShieldCheck,
  Check
} from 'lucide-react';

import { TabType } from '../types';

interface KinksMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: TabType) => void;
}

export const KinksMatrixModal: React.FC<KinksMatrixModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-pink-900/60 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 text-xs font-semibold border border-pink-800/40">
              <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
              <span>Status & Klärung deiner Frage</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Welche Figuren, Details & Kinks sind jetzt klar?
            </h2>
            <p className="text-xs text-slate-400">
              Hier ist die transparente Zusammenfassung aller bereits eingerichteten Elemente und was noch frei anpassbar ist:
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Figuren & Charaktere */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-pink-400 text-sm font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>1. Die Figuren (Charaktere)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Lila */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-pink-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Lila (23J)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Bereits integriert
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Optik:</strong> Blonde wellige Haare, gebräunte Strand-Haut, athletische Kurven, bernsteinfarbene Augen.
              </p>
              <p className="text-xs text-slate-400">
                <strong>Rolle & Vibe:</strong> Leidenschaftliches Bikini-Model, unzensiert, liebt Sonne, Strand, Micro-Bikinis und intime Posen.
              </p>
            </div>

            {/* Tania */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-purple-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Tania (27J)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Bereits integriert
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Optik:</strong> Tiefschwarzes Haar, smaragdgrüne Augen, helle glatte Haut, feminine Silhouette.
              </p>
              <p className="text-xs text-slate-400">
                <strong>Rolle & Vibe:</strong> Aus <em>Artanis × Tania</em>; dominant-sinnliche Muse, liebt Luxus-Penthouse, Seidendessous und klare Führung.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            ➕ <strong>Deine alten Backups:</strong> Du kannst im Reiter <em>&quot;Charakter-Studio&quot;</em> jederzeit weitere JSON- oder PNG-Karten per Drag &amp; Drop einfügen!
          </p>
        </div>

        {/* Section 2: Kinks & Vorlieben */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>2. Die NSFW-Kinks &amp; Vorlieben</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white block text-pink-300">CNC &amp; Dynamik</span>
              <p className="text-slate-400 text-[11px]">
                Consensual Non-Consent, Fesselung (Shibari), Dominanz &amp; Gehorsam, Dirty Talk im Chat.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white block text-rose-300">Posen &amp; Stellungen</span>
              <p className="text-slate-400 text-[11px]">
                Doggy Style (All Fours), Reitend (Cowgirl), POV (Egoperspektive), intime Nahaufnahmen.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white block text-amber-300">Outfits &amp; Strips</span>
              <p className="text-slate-400 text-[11px]">
                Micro-Bikinis, Wetlook (nasser Stoff/Haut), Spitzen-Dessous, schrittweises Ausziehen &amp; Nacktheit.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Optik & Stile */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>3. Optik &amp; Bildqualität</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>Fotorealismus:</strong> Optimiert mit BigAsp v2 und SDXL Anatomie-Tags (score_9, high resolution, real skin).</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>Anime / Hentai:</strong> Umschaltbar auf Pony Diffusion V6 Syntax mit speziellem Qualitäts-Filter.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>3D Render:</strong> Unreal Engine / Octane Look für hypermoderne Stylings.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Alles ist bereits einsatzbereit im Studio hinterlegt.
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateToTab('prompts');
              }}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md shadow-pink-600/30 transition-all cursor-pointer"
            >
              Zu den Prompts &amp; Kinks
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToTab('chat');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              Zum Chat mit Lila
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
