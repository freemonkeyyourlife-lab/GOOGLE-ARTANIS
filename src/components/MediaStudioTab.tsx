import React, { useState } from 'react';
import { Character } from '../types';
import { 
  Film, 
  Video, 
  Sparkles, 
  Camera, 
  UserCheck, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  Layers, 
  Flame, 
  Zap, 
  Download,
  RefreshCw,
  Sliders,
  Scissors
} from 'lucide-react';

interface MediaStudioTabProps {
  characters: Character[];
  activeCharacterId: string;
}

export const MediaStudioTab: React.FC<MediaStudioTabProps> = ({
  characters,
  activeCharacterId,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'img2video' | 'txt2video' | 'faceswap' | 'inpainting'>('img2video');
  const [motionIntensity, setMotionIntensity] = useState<number>(65);
  const [cameraMotion, setCameraMotion] = useState<'zoom_in' | 'pan_down' | 'slow_orbit' | 'dynamic_hips'>('dynamic_hips');
  const [fpsPreset, setFpsPreset] = useState<number>(24);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const selectedChar = characters.find((c) => c.id === activeCharacterId) || characters[0];

  // Video generation prompt
  const videoPrompt = `(masterpiece, best quality:1.2), 1girl, ${selectedChar.name}, ${selectedChar.appearance.hair}, ${selectedChar.appearance.body}, explicit, ${
    cameraMotion === 'dynamic_hips' ? 'rhythmic hip movement, sensual slow dancing' : 'slow sensual camera zoom, parted lips, glistening skin'
  }, tropical beach sunset background, warm ocean breeze blowing hair, 4k 60fps cinematic video, smooth fluid motion, SVD-XT, AnimateDiff motion LoRA`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(videoPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleSimulateGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Video-Render abgeschlossen! Das Video wurde in deine Galerie und den Chat übernommen.');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 text-xs font-semibold mb-1 border border-pink-800/40">
            <Film className="w-3.5 h-3.5 text-pink-400" />
            <span>Unzensierte Bild- & Videobearbeitung</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Media Studio (Video, FaceFusion & Inpainting)
          </h2>
          <p className="text-xs text-slate-400">
            Erzeuge animierte Clips aus Standbildern (Image-to-Video), tausche Gesichter oder generiere erotische Videoszenen
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('img2video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'img2video'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Image-to-Video
          </button>
          <button
            onClick={() => setActiveSubTab('txt2video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'txt2video'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Text-to-Video
          </button>
          <button
            onClick={() => setActiveSubTab('faceswap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'faceswap'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Face-Swap (FaceFusion)
          </button>
          <button
            onClick={() => setActiveSubTab('inpainting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'inpainting'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inpainting / Outfit
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Parameter Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Target Character & Source */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Aktive Figur für das Video</span>
              </span>
              <span className="text-xs text-slate-400">
                Fokus: <strong className="text-white">{selectedChar.name}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <img
                src={selectedChar.avatar}
                alt={selectedChar.name}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-pink-500/50"
              />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">{selectedChar.name} ({selectedChar.role})</h4>
                <p className="text-xs text-slate-400">{selectedChar.appearance.hair} • {selectedChar.appearance.style}</p>
                <span className="text-[10px] px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800/40">
                  Konsistentes Gesicht via IP-Adapter / LoRA
                </span>
              </div>
            </div>
          </div>

          {/* Sub-tab 1: Image-to-Video Settings */}
          {activeSubTab === 'img2video' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Image-to-Video Motion Controls</h3>
                <span className="text-xs text-pink-400 font-mono">Model: SVD-XT / AnimateDiff</span>
              </div>

              {/* Motion Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Bewegungsintensität (Motion Bucket / Weight):</span>
                  <span className="font-mono text-pink-400 font-bold">{motionIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={motionIntensity}
                  onChange={(e) => setMotionIntensity(parseInt(e.target.value))}
                  className="w-full accent-pink-600 bg-slate-950 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Sanft (Haar & Atmung)</span>
                  <span>Mittel (Hüften & Mimik)</span>
                  <span>Intensiv (Ganzkörper-Action)</span>
                </div>
              </div>

              {/* Camera Presets */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 block font-medium">Kamerabewegung (Camera LoRA):</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setCameraMotion('dynamic_hips')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      cameraMotion === 'dynamic_hips'
                        ? 'bg-pink-950/80 border-pink-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">Sinnliche Hüfte</div>
                    <div className="text-[10px] text-slate-400">Rhythmische Bewegung</div>
                  </button>

                  <button
                    onClick={() => setCameraMotion('zoom_in')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      cameraMotion === 'zoom_in'
                        ? 'bg-pink-950/80 border-pink-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">Langsamer Zoom</div>
                    <div className="text-[10px] text-slate-400">Fokus auf Dekolleté/Gesicht</div>
                  </button>

                  <button
                    onClick={() => setCameraMotion('pan_down')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      cameraMotion === 'pan_down'
                        ? 'bg-pink-950/80 border-pink-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">Pan nach unten</div>
                    <div className="text-[10px] text-slate-400">Vom Blick zum Körper</div>
                  </button>

                  <button
                    onClick={() => setCameraMotion('slow_orbit')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      cameraMotion === 'slow_orbit'
                        ? 'bg-pink-950/80 border-pink-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">360° Orbit</div>
                    <div className="text-[10px] text-slate-400">Rundumblick am Strand</div>
                  </button>
                </div>
              </div>

              {/* Framerate & Steps */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">FPS (Bildrate):</label>
                  <select
                    value={fpsPreset}
                    onChange={(e) => setFpsPreset(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={16}>16 FPS (Kompakt / Schnell)</option>
                    <option value={24}>24 FPS (Kino-Standard)</option>
                    <option value={60}>60 FPS (Ultra-Flüssig)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Clip-Dauer:</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option>4 Sekunden (25 Frames)</option>
                    <option>8 Sekunden (Looping)</option>
                    <option>16 Sekunden (Extended)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: FaceFusion / Roop Deepfake */}
          {activeSubTab === 'faceswap' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">FaceFusion / Deepfake Editor</h3>
                <span className="text-xs text-purple-400 font-mono">100% Privat & Unzensiert</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tausche das Gesicht deines Rollenspiel-Charakters (z. B. Lila oder Tania) nahtlos in bestehende Videos, Pornos oder Fotos ein.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-dashed border-slate-700 text-center space-y-2">
                  <span className="text-xs text-slate-400 block font-semibold">1. Quell-Gesicht (Source Face)</span>
                  <img src={selectedChar.avatar} alt="Source" className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-pink-500" />
                  <span className="text-xs text-white block">{selectedChar.name}</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-dashed border-pink-700/50 text-center space-y-2">
                  <span className="text-xs text-slate-400 block font-semibold">2. Ziel-Video / Foto (Target)</span>
                  <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-700 mx-auto flex items-center justify-center text-pink-400">
                    <Video className="w-8 h-8" />
                  </div>
                  <span className="text-[11px] text-pink-300 block">Video aus Festplatte / Drive wählen</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Inpainting / Outfit Switcher */}
          {activeSubTab === 'inpainting' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Inpainting: Kleidung & Details anpassen</h3>
                <span className="text-xs text-emerald-400 font-mono">Forge Inpaint Engine</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pinsel über beliebige Stellen im Bild (z. B. Bikini), um den Stoff schrittweise verschwinden zu lassen, nass zu machen oder durch Dessous zu ersetzen.
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => alert('Inpaint Modus "Bikini ausziehen" aktiviert')}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-500 text-xs text-slate-300 text-left transition-all"
                >
                  <div className="font-bold text-white mb-1 flex items-center gap-1">
                    <Scissors className="w-3.5 h-3.5 text-pink-400" />
                    <span>Bikini entfernen</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Ersetzt Stoff durch nackte, gebräunte Haut</div>
                </button>

                <button
                  onClick={() => alert('Inpaint Modus "Wetlook" aktiviert')}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-500 text-xs text-slate-300 text-left transition-all"
                >
                  <div className="font-bold text-white mb-1 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>Wetlook & Nässe</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Nasse Kleidung, Wassertropfen</div>
                </button>

                <button
                  onClick={() => alert('Inpaint Modus "Dessous" aktiviert')}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-500 text-xs text-slate-300 text-left transition-all"
                >
                  <div className="font-bold text-white mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Spitzen-Dessous</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Schwarze Spitze & Strapse</div>
                </button>
              </div>
            </div>
          )}

          {/* Trigger Generate Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSimulateGeneration}
              disabled={isGenerating}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Rendere Video-Frames (SVD Pipeline)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Unzensiertes Video jetzt rendern</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Live Video Player Preview & Prompt Export */}
        <div className="space-y-4">
          
          {/* Video Preview Card */}
          <div className="bg-slate-900 border border-pink-900/50 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-pink-300">
              <span className="font-bold flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-pink-400" />
                <span>Video-Vorschau</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-950 text-pink-200 border border-pink-800/40 font-mono">
                {fpsPreset} FPS • 4K
              </span>
            </div>

            <div className="relative aspect-[9/16] sm:aspect-video bg-black rounded-xl overflow-hidden group shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
                alt="Video Loop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                <div className="flex items-center justify-between text-white text-xs">
                  <span className="font-medium">{selectedChar.name} - Strand Session</span>
                  <span className="text-[10px] font-mono text-pink-300">00:04 / 00:04</span>
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg shadow-pink-600/40 hover:scale-110 transition-transform cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Status: Bereit für Streaming</span>
              <button
                onClick={handleSimulateGeneration}
                className="text-pink-400 hover:text-pink-300 text-xs font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Neu generieren</span>
              </button>
            </div>
          </div>

          {/* Generated Video Prompt */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Video-Prompt Blueprint:
              </span>
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? 'Kopiert' : 'Kopieren'}</span>
              </button>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono line-clamp-4">
              {videoPrompt}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
