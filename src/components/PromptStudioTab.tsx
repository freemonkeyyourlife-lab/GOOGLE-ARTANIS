import React, { useState } from 'react';
import { Character } from '../types';
import { KINKS_DATABASE } from '../data/kinksData';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Sliders, 
  ShieldAlert, 
  Layers, 
  Camera, 
  Zap, 
  User,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface PromptStudioTabProps {
  characters: Character[];
  activeCharacterId: string;
}

export const PromptStudioTab: React.FC<PromptStudioTabProps> = ({
  characters,
  activeCharacterId,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<'photorealism' | 'pony_anime' | 'render_3d'>('photorealism');
  const [selectedCharId, setSelectedCharId] = useState<string>(activeCharacterId);
  const [selectedKinkTags, setSelectedKinkTags] = useState<string[]>([
    'micro_bikini',
    'tropical_beach',
    'golden_hour',
    'wet_skin',
  ]);
  const [cameraAngle, setCameraAngle] = useState('medium_shot');
  const [lightingPreset, setLightingPreset] = useState('golden_hour');
  const [explicitLevel, setExplicitLevel] = useState<'suggestive' | 'semi_nude' | 'explicit_nude'>('semi_nude');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  // Toggle kink tag
  const handleToggleTag = (tag: string) => {
    if (selectedKinkTags.includes(tag)) {
      setSelectedKinkTags(selectedKinkTags.filter((t) => t !== tag));
    } else {
      setSelectedKinkTags([...selectedKinkTags, tag]);
    }
  };

  // Build the positive prompt
  const buildPositivePrompt = (): string => {
    const parts: string[] = [];

    // Quality prefixes based on style
    if (selectedStyle === 'photorealism') {
      parts.push('score_9, score_8_up, masterpiece, raw photo, ultra-high resolution, 8k uhd, photorealistic, intricate skin texture, detailed pores, softbox rim lighting');
    } else if (selectedStyle === 'pony_anime') {
      parts.push('score_9, score_8_up, score_7_up, source_anime, masterpiece, aesthetic, highly detailed lineart, vibrant anime shading, pony diffusion xl');
    } else {
      parts.push('octane render, unreal engine 5 render, raytracing, cinematic subsurface scattering, 3d hyperrealism, 8k resolution');
    }

    // Character description
    if (selectedChar) {
      if (selectedChar.id === 'lila') {
        parts.push(`1girl, beautiful 23yo blonde woman, sun-kissed tanned skin, athletic toned body, amber eyes, long wavy blonde hair`);
      } else if (selectedChar.id === 'tania') {
        parts.push(`1girl, stunning 27yo brunette woman, smooth pale skin, hourglass figure, emerald green eyes, shoulder-length jet black hair`);
      } else {
        parts.push(`1girl, ${selectedChar.name}, ${selectedChar.appearance.hair}, ${selectedChar.appearance.body}`);
      }
    }

    // Explicit Level
    if (explicitLevel === 'explicit_nude') {
      parts.push('completely nude, explicit nudity, detailed uncensored anatomy, bare breasts, nipples, exposed hips');
    } else if (explicitLevel === 'semi_nude') {
      parts.push('semi nude, tiny micro string bikini, exposed cleavage, bikini pulled down, sun lines');
    } else {
      parts.push('alluring outfit, seductive clothing, tasteful tease');
    }

    // Camera & Lighting
    parts.push(`camera: ${cameraAngle.replace('_', ' ')}`);
    parts.push(`lighting: ${lightingPreset.replace('_', ' ')}`);

    // Selected Kinks & Poses
    if (selectedKinkTags.length > 0) {
      parts.push(selectedKinkTags.join(', '));
    }

    return parts.join(', ');
  };

  // Build negative prompt
  const buildNegativePrompt = (): string => {
    if (selectedStyle === 'photorealism') {
      return 'deformed, bad anatomy, bad hands, missing limbs, extra limbs, fused fingers, distorted face, blurry, low quality, oversaturated, drawing, illustration, cartoon, anime, text, watermark, signature, grainy';
    } else if (selectedStyle === 'pony_anime') {
      return 'score_4, score_5, score_6, low quality, bad anatomy, extra fingers, 3d render, realistic photo, blurry, bad eyes, poorly drawn hands, duplicate, mutated limbs';
    } else {
      return 'low polygon, bad shading, flat lighting, 2d, hand drawn, bad anatomy, deformed fingers, artifacts, noise, blur';
    }
  };

  const positivePrompt = buildPositivePrompt();
  const negativePrompt = buildNegativePrompt();

  const handleCopyPositive = () => {
    navigator.clipboard.writeText(positivePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyNegative = () => {
    navigator.clipboard.writeText(negativePrompt);
    setCopiedNegative(true);
    setTimeout(() => setCopiedNegative(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 text-xs font-semibold mb-1 border border-pink-800/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt-Skelett & Kink-Generator</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Perfekte Prompts für Forge, ComfyUI & Chat-Trigger
            </h2>
            <p className="text-xs text-slate-400">
              Keine verzerrten Gliedmaßen, perfekte Anatomie und maximale Flexibilität zwischen Fotorealismus & Anime
            </p>
          </div>

          {/* Quick Style Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedStyle('photorealism')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStyle === 'photorealism'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fotorealismus (BigAsp v2)
            </button>
            <button
              onClick={() => setSelectedStyle('pony_anime')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStyle === 'pony_anime'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Anime / Pony V6
            </button>
            <button
              onClick={() => setSelectedStyle('render_3d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStyle === 'render_3d'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Render (Octane)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Live Prompt Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Kinks & Parameter Matrix */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Character Target Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Ziel-Figur einbetten</span>
              </span>
              <span className="text-xs text-slate-400">
                Aktiv: <strong className="text-white">{selectedChar.name}</strong> ({selectedChar.role})
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharId(char.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedCharId === char.id
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <img src={char.avatar} alt={char.name} className="w-5 h-5 rounded-full object-cover" />
                  <span>{char.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Explicit Nudity Level */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>Enthüllungsgrad / Nacktheit</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setExplicitLevel('suggestive')}
                className={`p-3 rounded-xl text-xs font-medium text-left border transition-all ${
                  explicitLevel === 'suggestive'
                    ? 'bg-pink-950/80 border-pink-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold mb-0.5">Teasing / Reizvoll</div>
                <div className="text-[10px] text-slate-400">Bikini, Sommerkleid, Andeutungen</div>
              </button>

              <button
                onClick={() => setExplicitLevel('semi_nude')}
                className={`p-3 rounded-xl text-xs font-medium text-left border transition-all ${
                  explicitLevel === 'semi_nude'
                    ? 'bg-pink-950/80 border-pink-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold mb-0.5">Semi-Nude / Micro</div>
                <div className="text-[10px] text-slate-400">Micro-Bikini, Ausziehen, Wetlook</div>
              </button>

              <button
                onClick={() => setExplicitLevel('explicit_nude')}
                className={`p-3 rounded-xl text-xs font-medium text-left border transition-all ${
                  explicitLevel === 'explicit_nude'
                    ? 'bg-pink-950/80 border-pink-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold mb-0.5">Explicit Nude</div>
                <div className="text-[10px] text-slate-400">Vollständig nackt, detailliert</div>
              </button>
            </div>
          </div>

          {/* Kinks & Poses Database Matrix */}
          <div className="space-y-4">
            {KINKS_DATABASE.map((category) => (
              <div key={category.category} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-pink-300">
                    {category.category}
                  </h3>
                  <span className="text-[11px] text-slate-400">{category.description}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.items.map((item) => {
                    const isSelected = item.tags.some((t) => selectedKinkTags.includes(t));
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          const primaryTag = item.tags[0];
                          handleToggleTag(primaryTag);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-pink-950/60 border-pink-500 ring-1 ring-pink-500/30'
                            : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">{item.label}</span>
                            {item.intensity === 'hard' && (
                              <span className="text-[9px] px-1 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                                Intensiv
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isSelected ? 'bg-pink-600 text-white' : 'border border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Camera Angles & Lighting Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-pink-400" />
                <span>Kamerawinkel / Bildausschnitt</span>
              </label>
              <select
                value={cameraAngle}
                onChange={(e) => setCameraAngle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500"
              >
                <option value="close_up_portrait">Nahaufnahme (Porträt & Mimik)</option>
                <option value="medium_shot">Halbnahe Aufnahme (Körper & Silhouette)</option>
                <option value="full_body_shot">Ganzkörper-Aufnahme</option>
                <option value="pov_first_person">POV (Egoperspektive)</option>
                <option value="from_below_dramatic">Von unten (Dramatischer Winkel)</option>
                <option value="looking_over_shoulder">Blick über die Schulter</option>
              </select>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Beleuchtungs-Atmosphäre</span>
              </label>
              <select
                value={lightingPreset}
                onChange={(e) => setLightingPreset(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500"
              >
                <option value="golden_hour">Goldene Stunde (Warme Abendsonne)</option>
                <option value="studio_softbox">Studio-Softbox mit Randschimmer</option>
                <option value="dim_penthouse_neon">Gedämpftes Penthouse & Neon-Akzente</option>
                <option value="steamy_spa_glow">Dampfbad & Kerzenschein</option>
                <option value="high_contrast_cinematic">Dramatischer Kinolook</option>
              </select>
            </div>

          </div>

        </div>

        {/* Column 3: Live Prompt Output & 1-Click Copy */}
        <div className="space-y-4">
          
          <div className="sticky top-20 space-y-4">
            
            {/* Positive Prompt Card */}
            <div className="bg-slate-900 border border-pink-900/50 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Positiver Prompt (Fertig)</span>
                </span>
                <button
                  onClick={handleCopyPositive}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-md shadow-pink-600/30 transition-all cursor-pointer"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Kopiert!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopieren</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed max-h-56 overflow-y-auto scrollbar-thin">
                {positivePrompt}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-pink-400" />
                <span>Optimiert für {selectedStyle === 'photorealism' ? 'SDXL BigAsp v2' : 'Pony V6'}</span>
              </div>
            </div>

            {/* Negative Prompt Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Negativer Prompt (Filter)</span>
                </span>
                <button
                  onClick={handleCopyNegative}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all cursor-pointer"
                >
                  {copiedNegative ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Kopiert!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopieren</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 font-mono leading-relaxed max-h-40 overflow-y-auto scrollbar-thin">
                {negativePrompt}
              </div>
            </div>

            {/* Generation Parameters Cheat Sheet */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-400">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Empfohlene Forge / WebUI Einstellungen:
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[9px]">SAMPLER</span>
                  <span className="text-white">DPM++ 2M Karras</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[9px]">STEPS</span>
                  <span className="text-white">25 - 30</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[9px]">CFG SCALE</span>
                  <span className="text-white">5.5 - 7.0</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[9px]">CLIP SKIP</span>
                  <span className="text-white">2 (für Pony) / 1 (SDXL)</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
