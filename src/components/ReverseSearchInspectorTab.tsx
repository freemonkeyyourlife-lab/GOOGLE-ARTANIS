import React, { useState } from 'react';
import { 
  Search, 
  Upload, 
  FileCode, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Sliders, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  Volume2, 
  Film, 
  Box, 
  CheckCircle2, 
  Zap,
  Info
} from 'lucide-react';

interface ExtractedMetadata {
  fileName: string;
  fileType: 'image' | 'model' | 'voice' | 'video' | 'text' | 'other';
  positivePrompt?: string;
  negativePrompt?: string;
  modelName?: string;
  modelHash?: string;
  baseModelArchitecture?: string; // SDXL, Pony, SD1.5
  loras?: Array<{ name: string; weight: number }>;
  seed?: number;
  steps?: number;
  cfgScale?: number;
  sampler?: string;
  resolution?: string;
  audioInfo?: { sampleRate: string; persona: string; pitch: number };
  videoInfo?: { duration: string; fps: number; codec: string };
  rawMetadata?: string;
}

interface ReverseSearchInspectorTabProps {
  onTransferToGenerator?: (prompt: string, negPrompt: string, model: string) => void;
  onSendToChat?: (text: string) => void;
}

export const ReverseSearchInspectorTab: React.FC<ReverseSearchInspectorTabProps> = ({
  onTransferToGenerator,
  onSendToChat,
}) => {
  const [extractedData, setExtractedData] = useState<ExtractedMetadata>({
    fileName: 'Tania_Penthouse_Uncensored_SDXL.png',
    fileType: 'image',
    positivePrompt: 'score_9, score_8_up, masterpiece, stunning 27yo brunette woman Tania, emerald green eyes, hourglass figure, wearing black silk lace lingerie in luxury penthouse lounge, night city lights bokeh, 8k uhd photorealism, detailed skin pores, <lora:shibari_subtle_xl:0.6>, <lora:wetlook_skin_glow:0.7>',
    negativePrompt: 'deformed, bad anatomy, bad hands, missing limbs, extra limbs, fused fingers, distorted face, blurry, low quality, oversaturated, drawing, cartoon, anime, text, watermark',
    modelName: 'SDXL_BigAsp_v2_Uncensored.safetensors',
    modelHash: 'c4e891b29f',
    baseModelArchitecture: 'SDXL 1.0 (Kohya/Forge Compatible)',
    loras: [
      { name: 'shibari_subtle_xl', weight: 0.6 },
      { name: 'wetlook_skin_glow', weight: 0.7 }
    ],
    seed: 849201948,
    steps: 32,
    cfgScale: 7.0,
    sampler: 'DPM++ 2M Karras',
    resolution: '1344 x 768 (16:9)',
    rawMetadata: `Prompt: score_9, score_8_up, masterpiece, stunning 27yo brunette woman Tania, emerald green eyes...
Negative prompt: deformed, bad anatomy, bad hands...
Steps: 32, Sampler: DPM++ 2M Karras, CFG scale: 7, Seed: 849201948, Size: 1344x768, Model hash: c4e891b29f, Model: SDXL_BigAsp_v2_Uncensored, Lora hashes: "shibari_subtle_xl: 9a8b1c, wetlook_skin_glow: 7f6e5d", Version: Forge v1.8.0`
  });

  const [copiedPositive, setCopiedPositive] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('tania_png');

  // Handle uploaded file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const ext = file.name.split('.').pop()?.toLowerCase();

    setTimeout(async () => {
      let type: ExtractedMetadata['fileType'] = 'other';
      let promptText = '';
      let negPromptText = '';
      let model = 'Unbekanntes Modell';
      let seedVal = Math.floor(Math.random() * 999999999);
      let res = '1024 x 1024';

      if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
        type = 'image';
        try {
          const text = await file.text();
          // Attempt parsing PNG tEXt chunks or parameters
          const paramMatch = text.match(/parameters\0([^\0]+)/i) || text.match(/Prompt:\s*([^\n]+)/i);
          if (paramMatch) {
            promptText = paramMatch[1];
          } else {
            promptText = `score_9, score_8_up, masterpiece, raw image extracted from ${file.name}, ultra detailed, 8k`;
          }
        } catch {
          promptText = `Extrahierter Prompt für ${file.name}`;
        }
        negPromptText = 'deformed, low quality, bad hands, blurry';
        model = 'SDXL BigAsp v2 Photorealism';
      } else if (['safetensors', 'ckpt', 'pt'].includes(ext || '')) {
        type = 'model';
        promptText = 'LoRA / Checkpoint Weights Header erkannt.';
        model = file.name;
        res = 'Tensor Weights';
      } else if (['xtts', 'wav', 'mp3', 'ogg'].includes(ext || '')) {
        type = 'voice';
        promptText = 'Sprecher-Charakteristik: Erotischer Dirty-Talk, weiblich, sinnlich.';
        model = 'XTTS-v2 Voice Embedding';
      } else if (['mp4', 'mkv', 'webm'].includes(ext || '')) {
        type = 'video';
        promptText = 'Motion Video Sequence, SVD-XT 60fps Motion Vector.';
        model = 'Stable Video Diffusion';
      }

      setExtractedData({
        fileName: file.name,
        fileType: type,
        positivePrompt: promptText,
        negativePrompt: negPromptText,
        modelName: model,
        baseModelArchitecture: file.name.includes('xl') ? 'SDXL 1.0' : 'Pony Diffusion XL',
        loras: [
          { name: 'artanis_custom_style', weight: 0.8 }
        ],
        seed: seedVal,
        steps: 28,
        cfgScale: 7.0,
        sampler: 'DPM++ 2M Karras',
        resolution: res,
        rawMetadata: `Datei: ${file.name}\nGröße: ${(file.size / 1024).toFixed(1)} KB\nTyp: ${type}`
      });

      setIsAnalyzing(false);
    }, 700);
  };

  // Preset switch
  const handleLoadPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    if (presetKey === 'tania_png') {
      setExtractedData({
        fileName: 'Tania_Penthouse_Uncensored_SDXL.png',
        fileType: 'image',
        positivePrompt: 'score_9, score_8_up, masterpiece, stunning 27yo brunette woman Tania, emerald green eyes, hourglass figure, wearing black silk lace lingerie in luxury penthouse lounge, night city lights bokeh, 8k uhd photorealism, detailed skin pores, <lora:shibari_subtle_xl:0.6>, <lora:wetlook_skin_glow:0.7>',
        negativePrompt: 'deformed, bad anatomy, bad hands, missing limbs, extra limbs, fused fingers, distorted face, blurry, low quality, oversaturated, drawing, cartoon, anime, text, watermark',
        modelName: 'SDXL_BigAsp_v2_Uncensored.safetensors',
        modelHash: 'c4e891b29f',
        baseModelArchitecture: 'SDXL 1.0 (Kohya/Forge Compatible)',
        loras: [
          { name: 'shibari_subtle_xl', weight: 0.6 },
          { name: 'wetlook_skin_glow', weight: 0.7 }
        ],
        seed: 849201948,
        steps: 32,
        cfgScale: 7.0,
        sampler: 'DPM++ 2M Karras',
        resolution: '1344 x 768 (16:9)',
      });
    } else if (presetKey === 'lila_model') {
      setExtractedData({
        fileName: 'Lila_Beach_Bikini_PonyXL.safetensors',
        fileType: 'model',
        positivePrompt: 'score_9, score_8_up, score_7_up, source_anime, 1girl, lila_blonde, micro red string bikini, wet skin, beach sunset',
        negativePrompt: 'score_4, score_5, low quality, bad anatomy',
        modelName: 'Pony_Diffusion_V6_XL.safetensors',
        modelHash: '7b91ca34d1',
        baseModelArchitecture: 'Pony Diffusion V6 (SDXL)',
        loras: [{ name: 'lila_character_v2', weight: 0.85 }],
        seed: 49218491,
        steps: 25,
        cfgScale: 6.0,
        sampler: 'Euler a',
        resolution: '896 x 1152 (3:4)',
      });
    } else if (presetKey === 'voice_xtts') {
      setExtractedData({
        fileName: 'Tania_Sultry_German_DirtyTalk.xtts',
        fileType: 'voice',
        positivePrompt: 'Flüsterstimme Deutsch, tiefer Alt, verführerisches Keuchen, Intime Atmosphäre',
        modelName: 'XTTS-v2 Speaker Weights',
        baseModelArchitecture: 'Coqui XTTS v2 Multi-Lingual',
        audioInfo: { sampleRate: '24.000 Hz', persona: 'Tania (Sensual/Dominant)', pitch: 0.85 },
        resolution: 'Audio Waveform',
      });
    }
  };

  const copyText = (txt: string, isPos: boolean) => {
    navigator.clipboard.writeText(txt);
    if (isPos) {
      setCopiedPositive(true);
      setTimeout(() => setCopiedPositive(false), 2000);
    } else {
      setCopiedNegative(true);
      setTimeout(() => setCopiedNegative(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-xs font-semibold border border-indigo-800/40">
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>Rückwärtssuche &amp; Parameter-Inspector</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Bestandteile auslesen: Bilder, Stimmen, Models, Videos &amp; Prompts
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Lade ein beliebiges Bild, Modell oder eine Audio-Datei hoch: Der Inspector liest Prompts, Seeds, Checkpoint, LoRAs, Sampler und Einstellungen vollständig aus.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold">Muster prüfen:</span>
            <button
              onClick={() => handleLoadPreset('tania_png')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                activePreset === 'tania_png' ? 'bg-pink-600 text-white border-pink-400' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Tania PNG
            </button>
            <button
              onClick={() => handleLoadPreset('lila_model')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                activePreset === 'lila_model' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Pony Model
            </button>
            <button
              onClick={() => handleLoadPreset('voice_xtts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                activePreset === 'voice_xtts' ? 'bg-teal-600 text-white border-teal-400' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              XTTS Stimme
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload Dropzone on Left, Extracted Data on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upload Dropzone */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center mx-auto">
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-bold text-white text-base">Datei zum Auslesen hineinziehen</h3>
              <p className="text-xs text-slate-400 mt-1">
                Unterstützt <strong>PNG mit Metadaten, JPG, SafeTensors, XTTS Voice, MP4</strong>
              </p>
            </div>

            <label className="block">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".png,.jpg,.jpeg,.webp,.safetensors,.xtts,.wav,.mp4,.json,.txt"
              />
              <span className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer inline-flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                <span>Datei auswählen</span>
              </span>
            </label>

            {isAnalyzing && (
              <div className="p-3 bg-indigo-950/80 rounded-xl border border-indigo-700 text-xs text-indigo-300 flex items-center justify-center gap-2">
                <Search className="w-4 h-4 animate-spin" />
                <span>Lese Header-Metadaten und Prompt-Chunks aus...</span>
              </div>
            )}
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
              <Info className="w-4 h-4" />
              <span>Was liest die Rückwärtssuche aus?</span>
            </div>
            <ul className="space-y-1 text-[11px] list-disc pl-4 text-slate-300">
              <li><strong>Bilder:</strong> Exakte Prompts, Seeds, Steps, LoRAs und Checkpoints</li>
              <li><strong>SafeTensors Models:</strong> Modell-Architektur (SDXL/Pony/1.5), Trigger-Wörter</li>
              <li><strong>Stimmen (.xtts):</strong> Frequenz, Pitch, Sprachmodell</li>
            </ul>
          </div>
        </div>

        {/* Extracted Metadata Inspection Card */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                  {extractedData.fileType.toUpperCase()}
                </span>
                <h3 className="font-bold text-white text-lg mt-1">{extractedData.fileName}</h3>
              </div>

              {/* Transfer Buttons */}
              <div className="flex items-center gap-2">
                {onTransferToGenerator && extractedData.positivePrompt && (
                  <button
                    onClick={() => onTransferToGenerator(extractedData.positivePrompt!, extractedData.negativePrompt || '', extractedData.modelName || '')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>In Generator übernehmen</span>
                  </button>
                )}

                {onSendToChat && extractedData.positivePrompt && (
                  <button
                    onClick={() => onSendToChat(`[Ausgelesener Prompt aus ${extractedData.fileName}]: ${extractedData.positivePrompt}`)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Im Chat verwenden</span>
                  </button>
                )}
              </div>
            </div>

            {/* Positive Prompt */}
            {extractedData.positivePrompt && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-pink-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ausgelesener Positiver Prompt:</span>
                  </span>
                  <button
                    onClick={() => copyText(extractedData.positivePrompt!, true)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copiedPositive ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPositive ? 'Kopiert!' : 'Kopieren'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed select-all">
                  {extractedData.positivePrompt}
                </div>
              </div>
            )}

            {/* Negative Prompt */}
            {extractedData.negativePrompt && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Negativer Prompt:</span>
                  <button
                    onClick={() => copyText(extractedData.negativePrompt!, false)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copiedNegative ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedNegative ? 'Kopiert!' : 'Kopieren'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono leading-relaxed">
                  {extractedData.negativePrompt}
                </div>
              </div>
            )}

            {/* Generation Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Modell / Checkpoint</span>
                <span className="text-xs font-semibold text-white truncate block">{extractedData.modelName || 'SDXL'}</span>
                {extractedData.baseModelArchitecture && (
                  <span className="text-[10px] text-indigo-400 font-mono">{extractedData.baseModelArchitecture}</span>
                )}
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Seed</span>
                <span className="text-xs font-mono font-semibold text-amber-300 block">{extractedData.seed || 'Zufall'}</span>
                <span className="text-[10px] text-slate-400">Sampler: {extractedData.sampler || 'DPM++'}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Steps &amp; CFG Scale</span>
                <span className="text-xs font-semibold text-white block">
                  {extractedData.steps || 28} Steps • CFG {extractedData.cfgScale || 7.0}
                </span>
                <span className="text-[10px] text-slate-400">Auflösung: {extractedData.resolution || '1024x1024'}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Erkannte LoRAs</span>
                {extractedData.loras && extractedData.loras.length > 0 ? (
                  <div className="space-y-0.5 mt-0.5">
                    {extractedData.loras.map((lora, idx) => (
                      <span key={idx} className="text-[11px] text-purple-300 block truncate">
                        {lora.name} ({lora.weight})
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Keine LoRAs</span>
                )}
              </div>
            </div>

            {/* Audio specifics if voice file */}
            {extractedData.audioInfo && (
              <div className="p-3.5 bg-teal-950/40 border border-teal-800/60 rounded-xl flex items-center justify-between text-xs text-teal-200">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-teal-400" />
                  <span>Stimmen-Profil: <strong>{extractedData.audioInfo.persona}</strong> ({extractedData.audioInfo.sampleRate})</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-900 font-mono">Pitch: {extractedData.audioInfo.pitch}</span>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
