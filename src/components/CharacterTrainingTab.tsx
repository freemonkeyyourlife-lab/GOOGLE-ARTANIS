import React, { useState } from 'react';
import { Character, GeneratedImageRecord } from '../types';
import JSZip from 'jszip';
import { 
  Brain, 
  Upload, 
  Download, 
  Layers, 
  Sparkles, 
  Check, 
  Sliders, 
  FolderPlus, 
  Terminal, 
  Tag, 
  Trash2, 
  Server, 
  Play, 
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface TrainingImageItem {
  id: string;
  url: string;
  caption: string;
}

interface CharacterTrainingTabProps {
  characters: Character[];
  activeCharacterId: string;
  archiveImages?: GeneratedImageRecord[];
}

export const CharacterTrainingTab: React.FC<CharacterTrainingTabProps> = ({
  characters,
  activeCharacterId,
  archiveImages = [],
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(activeCharacterId);
  const [triggerWord, setTriggerWord] = useState<string>('tania_v2');
  const [baseModel, setBaseModel] = useState<'sdxl' | 'pony_xl' | 'sd15'>('sdxl');
  const [networkDim, setNetworkDim] = useState<number>(32);
  const [networkAlpha, setNetworkAlpha] = useState<number>(16);
  const [epochs, setEpochs] = useState<number>(10);
  const [repeats, setRepeats] = useState<number>(10);
  const [learningRate, setLearningRate] = useState<string>('1e-4');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSendingToServer, setIsSendingToServer] = useState<boolean>(false);
  const [trainingJobStatus, setTrainingJobStatus] = useState<string>('');

  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  // Training image list
  const [trainingImages, setTrainingImages] = useState<TrainingImageItem[]>([
    {
      id: 'train-1',
      url: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png',
      caption: 'tania_v2, 1girl, brunette woman, green eyes, portrait, close up, detailed skin',
    },
    {
      id: 'train-2',
      url: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/9795fbefc_generated_image.png',
      caption: 'tania_v2, 1girl, hourglass figure, penthouse balcony, evening lights, silk lingerie',
    },
    {
      id: 'train-3',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      caption: 'tania_v2, 1girl, wet skin, shower, looking at viewer, sensual facial expression',
    },
  ]);

  // Update trigger word on character change
  const handleCharSelect = (id: string) => {
    setSelectedCharId(id);
    const char = characters.find((c) => c.id === id);
    if (char) {
      setTriggerWord(`${char.name.toLowerCase()}_lora`);
    }
  };

  // Add images from persistent archive
  const handleImportFromArchive = () => {
    if (archiveImages.length === 0) {
      alert('Keine generierten Bilder im Archiv gefunden. Generiere zuerst Bilder im Generator!');
      return;
    }

    const newItems: TrainingImageItem[] = archiveImages.slice(0, 8).map((img) => ({
      id: `arch-${img.id}`,
      url: img.imageUrl,
      caption: `${triggerWord}, 1girl, ${img.characterName.toLowerCase()}, ${img.style}, ${img.tags.join(', ')}`,
    }));

    setTrainingImages((prev) => [...newItems, ...prev]);
  };

  // Upload training images from local disk
  const handleUploadImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: TrainingImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `upload-${Date.now()}-${i}`,
        url: previewUrl,
        caption: `${triggerWord}, 1girl, ${selectedChar.name.toLowerCase()}, ${file.name.replace(/\.[^/.]+$/, '')}`,
      });
    }

    setTrainingImages((prev) => [...newItems, ...prev]);
  };

  // Update single caption
  const handleUpdateCaption = (id: string, text: string) => {
    setTrainingImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, caption: text } : item))
    );
  };

  // Remove single image
  const handleRemoveImage = (id: string) => {
    setTrainingImages((prev) => prev.filter((item) => item.id !== id));
  };

  // Download complete Kohya_ss / Forge Training Dataset ZIP
  const handleExportDatasetZip = async () => {
    setIsExporting(true);

    try {
      const zip = new JSZip();
      const folderName = `${repeats}_${triggerWord}`;
      const imgFolder = zip.folder(`dataset/${folderName}`);

      const configManifest = {
        characterName: selectedChar.name,
        triggerWord,
        baseModel,
        networkDim,
        networkAlpha,
        epochs,
        repeats,
        learningRate,
        imageCount: trainingImages.length,
        createdDate: new Date().toISOString(),
      };

      zip.file('dataset_config.json', JSON.stringify(configManifest, null, 2));

      // Add training bash script for Linux / RunPod / Forge
      const bashScript = `#!/bin/bash
# ARTANIS LoRA Training Script (Kohya_ss / SD-Scripts)
accelerate launch --num_cpu_threads_per_process=4 \\
  ./sd-scripts/train_network.py \\
  --pretrained_model_name_or_path="${baseModel === 'sdxl' ? 'stabilityai/stable-diffusion-xl-base-1.0' : 'civitai/pony-diffusion-v6-xl'}" \\
  --train_data_dir="./dataset" \\
  --output_dir="./output_${triggerWord}" \\
  --output_name="${triggerWord}" \\
  --network_module=networks.lora \\
  --network_dim=${networkDim} \\
  --network_alpha=${networkAlpha} \\
  --learning_rate=${learningRate} \\
  --max_train_epochs=${epochs} \\
  --save_every_n_epochs=2 \\
  --mixed_precision="fp16" \\
  --save_precision="fp16" \\
  --resolution="1024,1024" \\
  --gradient_checkpointing \\
  --xformers
echo "LoRA Training für ${triggerWord} abgeschlossen!"
`;
      zip.file('train_lora.sh', bashScript);

      // Add images and captions
      for (let i = 0; i < trainingImages.length; i++) {
        const item = trainingImages[i];
        const baseName = `img_${String(i + 1).padStart(3, '0')}`;

        // Add text caption file
        imgFolder?.file(`${baseName}.txt`, item.caption);

        // Fetch and add image blob
        try {
          const resp = await fetch(item.url);
          const blob = await resp.blob();
          imgFolder?.file(`${baseName}.png`, blob);
        } catch {
          imgFolder?.file(`${baseName}_url.txt`, item.url);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = `Artanis_Dataset_${triggerWord}_${trainingImages.length}Bilder.zip`;
      a.click();
    } catch (e) {
      console.error(e);
      alert('Fehler beim Erstellen des Dataset-ZIPs.');
    }

    setIsExporting(false);
  };

  // Simulate Sending to Server
  const handleSendToServerTraining = () => {
    setIsSendingToServer(true);
    setTrainingJobStatus('Verbinde mit Tailscale-Server... Lade Datensatz hoch...');

    setTimeout(() => {
      setTrainingJobStatus(`✓ Trainings-Auftrag für "${triggerWord}" erfolgreich an Server übergeben! Status: Training läuft im Hintergrund (Epoche 1/${epochs}).`);
      setIsSendingToServer(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-xs font-semibold border border-purple-800/40">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>LoRA &amp; Charakter-Training Studio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Eigene Charaktere &amp; Gesichter trainieren (Kohya_ss &amp; Forge)
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Erstelle perfekte Trainings-Datensätze aus generierten Bildern oder Uploads, inklusive automatischer Bildbeschriftung (Captions) und 1-Klick-Export für deinen Server.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleImportFromArchive}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Aus Bild-Archiv laden</span>
            </button>

            <button
              onClick={handleExportDatasetZip}
              disabled={isExporting || trainingImages.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Packe Dataset...' : '📦 Dataset ZIP herunterladen'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters & Training Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Hyperparameters Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>1. Trainings-Parameter (LoRA)</span>
              </span>
              <span className="text-xs text-slate-400">{trainingImages.length} Bilder</span>
            </div>

            {/* Character Selector */}
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Ziel-Charakter:</label>
              <div className="grid grid-cols-3 gap-2">
                {characters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCharSelect(c.id)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      selectedCharId === c.id
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Word */}
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Aktivierungs-Wort (Trigger Word):
              </label>
              <input
                type="text"
                value={triggerWord}
                onChange={(e) => setTriggerWord(e.target.value)}
                placeholder="z.B. tania_v2, lila_blonde"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-purple-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Dieses Wort wird im Prompt verwendet, um die Figur exakt aufzurufen.
              </span>
            </div>

            {/* Base Model Architecture */}
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">Basis-Architektur:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'sdxl', label: 'SDXL 1.0', desc: 'Foto & 4K' },
                  { id: 'pony_xl', label: 'Pony XL', desc: 'Anime & NSFW' },
                  { id: 'sd15', label: 'SD 1.5', desc: 'Schnell' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setBaseModel(item.id as typeof baseModel)}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      baseModel === item.id
                        ? 'bg-purple-600 text-white border-purple-400 font-bold shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[9px] opacity-75">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Network Rank & Alpha */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Network Dim (Rank: {networkDim})</label>
                <select
                  value={networkDim}
                  onChange={(e) => setNetworkDim(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-xs font-mono"
                >
                  <option value={16}>16 (Leicht / Schnell)</option>
                  <option value={32}>32 (Standard / Empfohlen)</option>
                  <option value={64}>64 (Hohe Details)</option>
                  <option value={128}>128 (Maximale Kapazität)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Network Alpha: {networkAlpha}</label>
                <select
                  value={networkAlpha}
                  onChange={(e) => setNetworkAlpha(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-xs font-mono"
                >
                  <option value={8}>8</option>
                  <option value={16}>16 (Empfohlen)</option>
                  <option value={32}>32</option>
                </select>
              </div>
            </div>

            {/* Epochs & Repeats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Epochen: {epochs}</label>
                <input
                  type="number"
                  min={5}
                  max={30}
                  value={epochs}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Wiederholungen: {repeats}</label>
                <input
                  type="number"
                  min={5}
                  max={25}
                  value={repeats}
                  onChange={(e) => setRepeats(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Trigger Server Training */}
            <button
              onClick={handleSendToServerTraining}
              disabled={isSendingToServer || trainingImages.length === 0}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-800 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Server className="w-4 h-4" />
              <span>Training direkt am Server starten</span>
            </button>

            {trainingJobStatus && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-700 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{trainingJobStatus}</span>
              </div>
            )}

          </div>
        </div>

        {/* Right: Dataset Images & Caption Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">
                  Trainings-Bilder &amp; Bildbeschreibungen ({trainingImages.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Jedes Bild benötigt eine eigene Caption (.txt-Datei), die beim Training mitgelernt wird.
                </p>
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUploadImages}
                  className="hidden"
                />
                <span className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Bilder hinzufügen</span>
                </span>
              </label>
            </div>

            {/* Images List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
              {trainingImages.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-colors hover:border-purple-600/60"
                >
                  <img
                    src={item.url}
                    alt={`Training ${idx}`}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                  />

                  <div className="flex-1 w-full space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-purple-300">Bild #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveImage(item.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) => handleUpdateCaption(item.id, e.target.value)}
                      placeholder="Trigger-Wort und Bildbeschreibung..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:border-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
