import React, { useState } from 'react';
import { StudioSettings } from '../types';
import { 
  Sliders, 
  Palette, 
  ShieldAlert, 
  Server, 
  Sparkles, 
  Save, 
  Check, 
  Laptop, 
  Zap, 
  Globe, 
  RefreshCw,
  EyeOff
} from 'lucide-react';

interface CustomizerTabProps {
  settings: StudioSettings;
  setSettings: React.Dispatch<React.SetStateAction<StudioSettings>>;
}

export const CustomizerTab: React.FC<CustomizerTabProps> = ({
  settings,
  setSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<StudioSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSettings(localSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 text-xs font-semibold mb-1 border border-pink-800/40">
            <Sliders className="w-3.5 h-3.5 text-pink-400" />
            <span>Artanis × Tania Studio Konfigurator</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Daran basteln &amp; anpassen
          </h2>
          <p className="text-xs text-slate-400">
            Passe das Artanis-Layout, Farbschemata, unzensierte Trigger und Server-Verbindungen für dein Chromebook an
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Einstellungen aktiv!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Anpassungen speichern</span>
            </>
          )}
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Artanis Theme & Layout Tuning */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
            <Palette className="w-4 h-4" />
            <span>1. Artanis Farbschema &amp; Design</span>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-slate-300 block font-medium">Design-Stil auswählen:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLocalSettings({ ...localSettings, theme: 'artanis_neon' })}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  localSettings.theme === 'artanis_neon'
                    ? 'bg-pink-950/80 border-pink-500 ring-1 ring-pink-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span>Artanis Neon Rose</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Originales Tania-Design (Rosa/Obsidian)</div>
              </button>

              <button
                onClick={() => setLocalSettings({ ...localSettings, theme: 'cyber_violet' })}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  localSettings.theme === 'cyber_violet'
                    ? 'bg-purple-950/80 border-purple-500 ring-1 ring-purple-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Cyber Violet</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Dunkles Lila &amp; Neon-Akzente</div>
              </button>

              <button
                onClick={() => setLocalSettings({ ...localSettings, theme: 'emerald_noir' })}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  localSettings.theme === 'emerald_noir'
                    ? 'bg-emerald-950/80 border-emerald-500 ring-1 ring-emerald-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Emerald Noir</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Tania Smaragd &amp; Kohlenstoff</div>
              </button>

              <button
                onClick={() => setLocalSettings({ ...localSettings, theme: 'midnight_gold' })}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  localSettings.theme === 'midnight_gold'
                    ? 'bg-amber-950/80 border-amber-500 ring-1 ring-amber-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Midnight Gold</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Luxus-Penthouse Look</div>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="text-xs text-slate-300 block mb-1">Layout-Dichte:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLocalSettings({ ...localSettings, layoutDensity: 'comfortable' })}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
                  localSettings.layoutDensity === 'comfortable' ? 'bg-pink-600 text-white' : 'bg-slate-950 text-slate-400'
                }`}
              >
                Komfortabel (Viel Raum für Bilder)
              </button>
              <button
                onClick={() => setLocalSettings({ ...localSettings, layoutDensity: 'compact' })}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
                  localSettings.layoutDensity === 'compact' ? 'bg-pink-600 text-white' : 'bg-slate-950 text-slate-400'
                }`}
              >
                Kompakt (Schnelles Arbeiten)
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Unzensierte Filter & Chat-Trigger */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>2. Unzensierte Chat- &amp; Mediengenerierung</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-rose-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Sicherheitsfilter-Modus:</span>
                <span className="text-[11px] text-slate-400">100% Unzensiert für private Erwachsenen-Rollenspiele</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50 text-xs font-bold font-mono">
                UNCENSORED MAX
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">Automatische Medien-Erzeugung im Chat:</label>
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.autoGenerateMedia}
                    onChange={(e) => setLocalSettings({ ...localSettings, autoGenerateMedia: e.target.checked })}
                    className="accent-pink-600 w-4 h-4 rounded"
                  />
                  <span>Automatisch bei Sternchen-Aktionen (*zieht Bikini aus*) auslösen</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Standard-Generierungstyp im Chat:</label>
              <select
                value={localSettings.mediaTypeDefault}
                onChange={(e) => setLocalSettings({ ...localSettings, mediaTypeDefault: e.target.value as 'image' | 'video' })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="image">Bilder (Schnell &amp; Hohe Auflösung)</option>
                <option value="video">Videos &amp; animierte Clips (SVD-XT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Chromebook & Server Brücke */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Laptop className="w-4 h-4" />
              <span>3. Chromebook Cloud- &amp; Server-Brücke (RunPod / Vast.ai / Heimserver)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
              Chromebook Ready
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Auf einem Chromebook läuft deine App im Browser. Für rechenintensive Bild- und Videorenderings kannst du hier deine Remote-IP (z. B. Stable Diffusion Forge, ComfyUI oder Tailscale-Tunnel) eintragen:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">Stable Diffusion Forge / ComfyUI Server IP oder Tunnel:</label>
              <input
                type="text"
                value={localSettings.remoteApiUrl}
                onChange={(e) => setLocalSettings({ ...localSettings, remoteApiUrl: e.target.value })}
                placeholder="http://192.168.1.100:7860 oder https://dein-tunnel.trycloudflare.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">OpenRouter API Key (Optional für Llama-3.1-70B unzensiert):</label>
              <input
                type="password"
                value={localSettings.openRouterApiKey}
                onChange={(e) => setLocalSettings({ ...localSettings, openRouterApiKey: e.target.value })}
                placeholder="sk-or-v1-..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-pink-500"
              />
            </div>
          </div>

          {/* GitHub Repository & Base44 Webhook Integration */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">
                  Artanis × Tania GitHub &amp; Base44 Webhook-Code
                </h4>
                <p className="text-[11px] text-slate-400">
                  Verknüpft mit deinem Repository <code>freemonkeyyourlife-lab/artanis-tania</code> und deiner Base44 App
                </p>
              </div>
              <a
                href="https://github.com/freemonkeyyourlife-lab/artanis-tania"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-pink-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>GitHub Repo öffnen</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
              <pre className="text-pink-300">// In deine Base44 Functions einfügen für In-Chat Generierung:</pre>
              <pre>{`async function handleIncomingChatAndMedia(messageData, characterId) {
  // 1. Text an unzensiertes Modell (Llama 3.1 70B)
  const aiResponse = await base44.functions.openRouter({
    model: "meta-llama/llama-3.1-70b-instruct",
    prompt: messageData.text,
    systemInstruction: "Du bist Lila. Beschreibe intime Handlungen in Sternchen *.*"
  });

  const replyText = aiResponse.data.text;

  // 2. Automatische Bild- / Video-Generierung bei Sternchen
  if (replyText.includes("*") || messageData.text.toLowerCase().includes("zeig dich")) {
    const imgGen = await fetch('http://dein-server:7860/sdapi/v1/txt2img', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: "score_9, score_8_up, explicit, blonde woman in micro bikini, 8k uhd photorealism",
        negative_prompt: "deformed, bad anatomy, low quality",
        steps: 25, cfg_scale: 7
      })
    });
    const result = await imgGen.json();
    return { text: replyText, media: result.images[0] };
  }
  return { text: replyText };
}`}</pre>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
