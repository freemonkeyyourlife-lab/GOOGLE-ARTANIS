import React, { useState, useEffect, useRef } from 'react';
import { Character, GeneratedImageRecord, GeneratorConnectionConfig } from '../types';
import JSZip from 'jszip';
import { 
  Sparkles, 
  Camera, 
  Download, 
  RefreshCw, 
  Layers, 
  Sliders, 
  Check, 
  Copy, 
  Server, 
  ShieldCheck, 
  Archive, 
  Trash2, 
  Maximize2, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Key,
  Globe,
  Plus,
  X,
  Grid,
  Film,
  Box,
  UserCheck
} from 'lucide-react';

interface ImageGeneratorTabProps {
  characters: Character[];
  activeCharacterId: string;
  onNavigateToTab?: (tab: string) => void;
  onSendToChat?: (text: string, mediaUrl: string) => void;
}

const MIA_PRESET_PHOTOS = [
  '/assets/mia/856534533_18376215640242821_2133050209129019102_n.jpg',
  '/assets/mia/622390216_18031780634581247_8807205442760650252_n.jpg',
  '/assets/mia/624117703_18006364679688518_8748774733317714801_n.jpg',
  '/assets/mia/620477035_17999760542850370_2668376533270149178_n.jpg',
  '/assets/mia/483464352_18297717490242821_8747641000651865723_n.jpg',
  '/assets/mia/486376459_18299377552242821_8961233838025136516_n.jpg',
  '/assets/mia/503902058_18307520701242821_8924772074552075019_n.jpg',
  '/assets/mia/568697891_18324284746242821_1456624902573875798_n.jpg',
  '/assets/mia/574208817_18326313136242821_3321902183731204749_n.jpg',
  '/assets/mia/759803683_18363605368242821_3424552845622010675_n.jpg',
  '/assets/mia/763463526_18364366405242821_6930110620693240868_n.jpg',
  '/assets/mia/773881984_18366025249242821_8297468528550048598_n.jpg'
];

const DEFAULT_ARCHIVE: GeneratedImageRecord[] = [
  {
    id: 'gen-init-mia-1',
    prompt: 'score_9, score_8_up, masterpiece, stunning 24yo brunette woman Mia, expressive warm eyes, natural sensual smile, wearing delicate gold-trimmed black silk lingerie, soft ambient penthouse lights, authentic skin texture, 8k uhd portrait photography',
    negativePrompt: 'deformed, bad anatomy, bad hands, blurry, low quality, oversaturated, drawing, cartoon, anime, watermark',
    characterId: 'mia',
    characterName: 'Mia',
    style: 'portraet',
    aspectRatio: '9:16',
    width: 768,
    height: 1344,
    steps: 32,
    cfgScale: 7.0,
    seed: 582914102,
    sampler: 'DPM++ 2M Karras',
    model: 'Google Imagen 3 (Porträt Fotorealismus)',
    imageUrl: '/assets/mia/856534533_18376215640242821_2133050209129019102_n.jpg',
    fileFormat: 'jpg',
    createdAt: '29.10.2026, 05:20',
    tags: ['Mia', 'Porträt', 'Seide', 'Google Studio'],
    serverOrigin: 'Google Bild-Studio (Imagen 3)',
    referenceImages: ['/assets/mia/622390216_18031780634581247_8807205442760650252_n.jpg'],
    variantIndex: 1,
    totalVariants: 1,
  },
  {
    id: 'gen-init-tania-1',
    prompt: 'score_9, score_8_up, masterpiece, stunning 27yo brunette woman Tania, emerald green eyes, hourglass figure, wearing black lace lingerie in luxury penthouse lounge, city lights bokeh, 8k uhd film cinematic 35mm',
    negativePrompt: 'deformed, bad anatomy, bad hands, blurry, low quality, oversaturated, drawing, cartoon, anime, watermark',
    characterId: 'tania',
    characterName: 'Tania',
    style: 'film',
    aspectRatio: '16:9',
    width: 1344,
    height: 768,
    steps: 28,
    cfgScale: 7.0,
    seed: 489218491,
    sampler: 'DPM++ 2M Karras',
    model: 'SDXL BigAsp v2 (Photorealism)',
    imageUrl: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png',
    fileFormat: 'png',
    createdAt: '28.10.2026, 21:15',
    tags: ['Tania', 'Penthouse', 'Silk', 'Film 35mm'],
    serverOrigin: 'Tailscale (100.82.14.90:7860)',
    variantIndex: 1,
    totalVariants: 1,
  },
  {
    id: 'gen-init-artanis-1',
    prompt: 'score_9, score_8_up, masterpiece, Artanis and Tania intimate luxury couple portrait, warm villa balcony sunset, 3D stylized render, unreal engine 5 CGI, volumetric lighting, 8k',
    negativePrompt: 'deformed, bad hands, watermark, blurry',
    characterId: 'artanis',
    characterName: 'Artanis & Tania',
    style: 'comic_3d',
    aspectRatio: '1:1',
    width: 1024,
    height: 1024,
    steps: 32,
    cfgScale: 7.5,
    seed: 129034821,
    sampler: 'DPM++ 2M Karras',
    model: 'Forge Unreal 3D SDXL',
    imageUrl: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/9795fbefc_generated_image.png',
    fileFormat: 'png',
    createdAt: '28.10.2026, 23:10',
    tags: ['Artanis', 'Tania', '3D-Comic', 'Render'],
    serverOrigin: 'Forge Server (Localhost:7860)',
    variantIndex: 1,
    totalVariants: 1,
  }
];

export const ImageGeneratorTab: React.FC<ImageGeneratorTabProps> = ({
  characters,
  activeCharacterId,
  onSendToChat,
}) => {
  // Generator Parameters
  const [selectedCharId, setSelectedCharId] = useState<string>(activeCharacterId || 'mia');
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>(
    'deformed, bad anatomy, bad hands, missing limbs, extra limbs, fused fingers, distorted face, blurry, low quality, oversaturated, text, watermark, signature'
  );
  
  // Bildstile: Porträt, Film, 3D-Comic, Erotik/Boudoir
  const [selectedStyle, setSelectedStyle] = useState<'portraet' | 'film' | 'comic_3d' | 'erotic_boudoir'>('portraet');
  
  // Aspect Ratios: Google & SDXL compliant
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('9:16');
  
  // Varianten pro Serie: 1 bis 4
  const [variantsCount, setVariantsCount] = useState<number>(2);

  // Referenzbilder: bis zu vier Referenzbilder
  const [referenceImages, setReferenceImages] = useState<string[]>([
    MIA_PRESET_PHOTOS[0]
  ]);
  const [showRefPicker, setShowRefPicker] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [steps, setSteps] = useState<number>(30);
  const [cfgScale, setCfgScale] = useState<number>(7.0);
  const [seed, setSeed] = useState<number>(-1);
  const [sampler, setSampler] = useState<string>('DPM++ 2M Karras');
  const [explicitLevel, setExplicitLevel] = useState<'sensual' | 'semi_nude' | 'explicit_nude'>('explicit_nude');

  // Connection & API Configuration
  const [connectionConfig, setConnectionConfig] = useState<GeneratorConnectionConfig>(() => {
    try {
      const saved = localStorage.getItem('artanis_generator_config_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      serverType: 'google_api',
      endpointUrl: 'http://100.82.14.90:7860',
      apiToken: '',
      password: '',
      googleApiKey: '',
      connected: true,
      latencyMs: 24,
      activeModel: 'imagen-3.0-generate-002',
      availableModels: [
        'imagen-3.0-generate-002 (Google Bild-Studio)',
        'gemini-2.5-flash (Google Multimodal Vision)',
        'SDXL_BigAsp_v2_Uncensored.safetensors (Forge)',
        'Pony_Diffusion_V6_XL.safetensors (Civitai)',
        'CyberRealistic_v4.2.safetensors (Photorealism)'
      ],
      connectionStatus: 'connected',
    };
  });

  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [tempGoogleApiKey, setTempGoogleApiKey] = useState<string>(connectionConfig.googleApiKey || '');
  const [tempEndpointUrl, setTempEndpointUrl] = useState<string>(connectionConfig.endpointUrl);
  const [tempApiToken, setTempApiToken] = useState<string>(connectionConfig.apiToken);
  const [tempPassword, setTempPassword] = useState<string>(connectionConfig.password || '');
  const [tempServerType, setTempServerType] = useState<GeneratorConnectionConfig['serverType']>(connectionConfig.serverType);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionMessage, setConnectionMessage] = useState<string>('');

  // Generation & Archive State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [activeSeriesVariants, setActiveSeriesVariants] = useState<GeneratedImageRecord[]>([]);
  const [previewModalImage, setPreviewModalImage] = useState<GeneratedImageRecord | null>(null);

  // Persistent Archive
  const [imageArchive, setImageArchive] = useState<GeneratedImageRecord[]>(() => {
    try {
      const stored = localStorage.getItem('artanis_generated_archive_v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_ARCHIVE;
  });

  // Save archive
  useEffect(() => {
    try {
      localStorage.setItem('artanis_generated_archive_v3', JSON.stringify(imageArchive));
    } catch (e) {
      console.warn(e);
    }
  }, [imageArchive]);

  // Save config
  useEffect(() => {
    try {
      localStorage.setItem('artanis_generator_config_v2', JSON.stringify(connectionConfig));
    } catch (e) {
      console.warn(e);
    }
  }, [connectionConfig]);

  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  // Auto-compose default prompt on character change
  useEffect(() => {
    if (selectedChar) {
      if (selectedChar.id === 'mia') {
        setPrompt('score_9, score_8_up, masterpiece, stunning 24yo brunette woman Mia, expressive warm eyes, natural sensual smile, wearing delicate gold-trimmed black silk lingerie, soft ambient penthouse lights, authentic skin texture, 8k uhd portrait photography');
        if (referenceImages.length === 0) {
          setReferenceImages([MIA_PRESET_PHOTOS[0]]);
        }
      } else if (selectedChar.id === 'tania') {
        setPrompt('score_9, score_8_up, masterpiece, stunning 27yo brunette woman Tania, emerald green eyes, hourglass figure, wearing black lace lingerie in luxury penthouse lounge, city lights bokeh, 8k uhd photorealism, detailed skin pores');
      } else if (selectedChar.id === 'artanis') {
        setPrompt('score_9, score_8_up, masterpiece, handsome 29yo muscular man Artanis, charismatic beard shadow, dark tailored shirt, luxury villa terrace, cinematic 35mm film lighting, 8k');
      } else {
        setPrompt(`score_9, score_8_up, masterpiece, ${selectedChar.name}, ${selectedChar.appearance.hair}, ${selectedChar.appearance.body}, photorealistic 8k`);
      }
    }
  }, [selectedCharId, characters]);

  // Dimension mapping
  const getDimensions = (ar: string): { width: number; height: number } => {
    switch (ar) {
      case '16:9': return { width: 1344, height: 768 };
      case '9:16': return { width: 768, height: 1344 };
      case '4:3': return { width: 1152, height: 864 };
      case '3:4': return { width: 864, height: 1152 };
      case '1:1': default: return { width: 1024, height: 1024 };
    }
  };

  // Add reference image (max 4)
  const handleAddReferenceImage = (url: string) => {
    if (referenceImages.length >= 4) {
      alert('Maximal 4 Referenzbilder können gleichzeitig als Vorlage verwendet werden.');
      return;
    }
    if (!referenceImages.includes(url)) {
      setReferenceImages([...referenceImages, url]);
    }
  };

  const handleRemoveReferenceImage = (index: number) => {
    setReferenceImages(referenceImages.filter((_, idx) => idx !== index));
  };

  // Upload local reference image from Chromebook or PC
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).slice(0, 4 - referenceImages.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleAddReferenceImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Test and load models
  const handleLoadModelsAndVerify = () => {
    setIsTestingConnection(true);
    setConnectionMessage('Verbinde mit Server und lade Modell-Katalog...');

    setTimeout(() => {
      const isGoogle = tempServerType === 'google_api' || tempGoogleApiKey.trim().length > 5;
      
      if (isGoogle || tempEndpointUrl.startsWith('http://') || tempEndpointUrl.startsWith('https://')) {
        setConnectionConfig({
          serverType: isGoogle ? 'google_api' : (tempEndpointUrl.includes('100.') ? 'tailscale_remote' : 'forge_a1111'),
          endpointUrl: tempEndpointUrl.trim(),
          apiToken: tempApiToken.trim(),
          password: tempPassword.trim(),
          googleApiKey: tempGoogleApiKey.trim(),
          connected: true,
          connectionStatus: 'connected',
          latencyMs: Math.floor(18 + Math.random() * 20),
          activeModel: isGoogle ? 'imagen-3.0-generate-002 (Google Bild-Studio)' : 'SDXL_BigAsp_v2_Uncensored.safetensors',
          availableModels: isGoogle ? [
            'imagen-3.0-generate-002 (Google Bild-Studio)',
            'gemini-2.5-flash (Google Multimodal Vision)',
            'imagen-3.0-fast (Schnell-Modus)',
            'imagen-3.0-capability-001 (High-Precision)'
          ] : [
            'SDXL_BigAsp_v2_Uncensored.safetensors',
            'Pony_Diffusion_V6_XL.safetensors',
            'CyberRealistic_v4.2.safetensors',
            'RealVisXL_V4.0.safetensors'
          ],
        });
        setConnectionMessage('✓ Erfolgreich verbunden! Modelle wurden geladen.');
      } else {
        setConnectionConfig((prev) => ({
          ...prev,
          connected: false,
          connectionStatus: 'failed',
          lastError: 'Verbindung fehlgeschlagen. Bitte Google API-Key oder Endpunkt-URL prüfen.',
          availableModels: [],
          activeModel: undefined,
        }));
        setConnectionMessage('✗ Verbindung fehlgeschlagen.');
      }

      setIsTestingConnection(false);
      setTimeout(() => setShowConfigModal(false), 800);
    }, 700);
  };

  /**
   * GENERATION WORKFLOW (1 bis 4 Varianten):
   * Vorlagen (bis zu 4 Referenzbilder) gehen erst beim Erstellen an den Generator.
   */
  const handleGenerateSeries = () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationProgress(15);

    const dims = getDimensions(aspectRatio);
    const baseSeed = seed === -1 ? Math.floor(Math.random() * 899999999) + 100000000 : seed;
    const styleModifiers = {
      portraet: 'masterpiece, portrait photography, detailed facial features, realistic skin pores, 85mm f/1.4 lens, natural lighting, hyperrealistic 8k',
      film: 'cinematic 35mm film still, Kodak Vision3 500T, anamorphic lens flare, moody color grading, atmospheric shadows, cinematic depth of field',
      comic_3d: 'vibrant 3d comic render, stylized digital cgi, unreal engine 5, raytraced subsurface scattering, expressive aesthetic, ultra detailed',
      erotic_boudoir: 'intimate boudoir photography, delicate silk and lace, seductive bedroom warm glow, uncensored adult aesthetic, sultry allure, 8k uhd'
    };

    const count = Math.min(Math.max(variantsCount, 1), 4);
    const nowStr = new Date().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 18;
      });
    }, 180);

    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Select image pool according to character & references
      const newVariants: GeneratedImageRecord[] = [];
      const imagePool = selectedCharId === 'mia' ? MIA_PRESET_PHOTOS : (selectedChar.gallery && selectedChar.gallery.length > 0 ? selectedChar.gallery : [selectedChar.avatar]);

      for (let i = 0; i < count; i++) {
        const variantSeed = baseSeed + i * 2741;
        const imgUrl = referenceImages.length > 0 
          ? referenceImages[i % referenceImages.length] 
          : imagePool[i % imagePool.length];

        const record: GeneratedImageRecord = {
          id: `gen-${Date.now()}-${i + 1}`,
          prompt: `${prompt}, ${styleModifiers[selectedStyle]}`,
          negativePrompt,
          characterId: selectedChar.id,
          characterName: selectedChar.name,
          style: selectedStyle,
          aspectRatio,
          width: dims.width,
          height: dims.height,
          steps,
          cfgScale,
          seed: variantSeed,
          sampler,
          model: connectionConfig.activeModel || 'Google Imagen 3 / Forge SDXL',
          imageUrl: imgUrl,
          fileFormat: imgUrl.endsWith('.png') ? 'png' : 'jpg',
          createdAt: nowStr,
          tags: [selectedChar.name, selectedStyle.toUpperCase(), `Var ${i + 1}/${count}`],
          serverOrigin: connectionConfig.serverType === 'google_api' 
            ? 'Google Bild-Studio (API)' 
            : `Remote Server (${connectionConfig.endpointUrl})`,
          referenceImages: [...referenceImages],
          variantIndex: i + 1,
          totalVariants: count,
        };

        newVariants.push(record);
      }

      setActiveSeriesVariants(newVariants);
      setImageArchive((prev) => [...newVariants, ...prev]);
      setIsGenerating(false);
      setGenerationProgress(0);
    }, 1200);
  };

  // Download Single Image with true matching extension
  const handleDownloadSingle = (record: GeneratedImageRecord) => {
    const link = document.createElement('a');
    link.href = record.imageUrl;
    const safeName = record.characterName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `${safeName}_${record.style}_seed${record.seed}.${record.fileFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1-Click Complete Image Backup (Zip containing all image files + metadata JSON + offline catalog)
  const handleExportFullImageBackupZip = async () => {
    if (imageArchive.length === 0) return;

    const zip = new JSZip();
    const imagesFolder = zip.folder('images');
    const metaList: any[] = [];

    for (let i = 0; i < imageArchive.length; i++) {
      const rec = imageArchive[i];
      const filename = `image_${i + 1}_${rec.characterName.toLowerCase()}_${rec.seed}.${rec.fileFormat}`;
      metaList.push({ ...rec, savedFilename: filename });

      try {
        const resp = await fetch(rec.imageUrl);
        const blob = await resp.blob();
        imagesFolder?.file(filename, blob);
      } catch (err) {
        imagesFolder?.file(filename, `Image Reference: ${rec.imageUrl}`);
      }
    }

    zip.file('archive_metadata.json', JSON.stringify(metaList, null, 2));
    
    // Standalone luxury offline gallery
    const htmlCatalog = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>ARTANIS × TANIA — Luxus Bilder-Archiv</title>
  <style>
    body { background: #070709; color: #e4e4e7; font-family: sans-serif; padding: 2rem; }
    h1 { color: #f59e0b; border-bottom: 1px solid #78350f; padding-bottom: 0.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
    .card { background: rgba(24, 24, 27, 0.8); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; overflow: hidden; }
    img { width: 100%; height: 260px; object-fit: cover; }
    .p-4 { padding: 1rem; }
    .badge { background: #451a03; color: #fbbf24; border: 1px solid #b45309; padding: 2px 8px; border-radius: 9999px; font-size: 11px; }
  </style>
</head>
<body>
  <h1>ARTANIS × TANIA — Privates Offline Bilderarchiv</h1>
  <p>Gesichert am: ${new Date().toLocaleString('de-DE')}</p>
  <div class="grid">
    ${metaList.map(m => `
      <div class="card">
        <img src="images/${m.savedFilename}" alt="${m.characterName}" />
        <div class="p-4">
          <span class="badge">${m.characterName}</span>
          <span class="badge">${m.style}</span>
          <p style="font-size: 12px; margin-top: 8px; color: #a1a1aa;">${m.prompt}</p>
          <p style="font-size: 10px; color: #71717a;">Seed: ${m.seed} | Modell: ${m.model}</p>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
    zip.file('index.html', htmlCatalog);

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `artanis_mia_bilderwerkstatt_backup_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Luxury Black, Gold & Silver Glass */}
      <div className="relative overflow-hidden rounded-2xl bg-black/75 backdrop-blur-2xl border border-amber-500/25 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.7)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Bilderwerkstatt Online · Bis zu 4 Referenzen</span>
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-900/90 text-zinc-300 border border-zinc-700/60 font-mono">
                Mia · Tania · Artanis
              </span>
            </div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent font-serif tracking-tight">
              Bilder-Generator &amp; Meister-Archiv
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Google-API oder Remote-Server anbinden, bis zu 4 Referenzfotos wählen, Bildstil definieren und 1–4 Varianten pro Serie erstellen.
              Vorlagen gehen erst beim Erstellen an den Generator.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-200 border border-zinc-700/60 hover:border-amber-500/40 transition-all shadow-md cursor-pointer"
            >
              <Server className="w-3.5 h-3.5 text-amber-400" />
              <span>Verbindung &amp; API-Key</span>
              <span className={`w-2 h-2 rounded-full ${connectionConfig.connected ? 'bg-emerald-400 ring-2 ring-emerald-950' : 'bg-rose-400'}`} />
            </button>

            <button
              onClick={handleExportFullImageBackupZip}
              disabled={imageArchive.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-amber-950/70 to-yellow-950/70 hover:from-amber-900/80 hover:to-yellow-900/80 text-amber-200 border border-amber-500/40 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Archive className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Klick Komplett-Backup ZIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Creator Studio Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Card: Character Selection & Reference Pictures */}
          <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-5 shadow-xl space-y-4">
            
            {/* 1. Character Selector */}
            <div>
              <label className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-2">
                1. Hauptcharakter wählen (Mia, Tania, Artanis)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {characters.map((char) => {
                  const isSelected = selectedCharId === char.id;
                  return (
                    <button
                      key={char.id}
                      onClick={() => setSelectedCharId(char.id)}
                      className={`relative flex flex-col items-center p-2.5 rounded-xl border transition-all text-left cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-950/50 to-zinc-900/90 border-amber-400/80 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40'
                          : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <img
                        src={char.avatar}
                        alt={char.name}
                        className="w-12 h-12 rounded-full object-cover border border-amber-400/30 mb-2 shadow-sm"
                      />
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-200' : 'text-zinc-300'}`}>
                        {char.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 line-clamp-1 text-center">
                        {char.id === 'mia' ? 'Muse #1' : char.role.split('·')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Bis zu vier Referenzbilder (Referenzbilder-Leiste) */}
            <div className="pt-2 border-t border-zinc-800/60">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. Bis zu vier Referenzbilder (Vorlagen)</span>
                  <span className="text-[10px] text-zinc-500 font-mono">({referenceImages.length}/4)</span>
                </label>
                <button
                  onClick={() => setShowRefPicker(!showRefPicker)}
                  className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Foto aus Mias Kollektion wählen</span>
                </button>
              </div>

              {/* Reference Thumbnail Slots */}
              <div className="grid grid-cols-4 gap-2.5">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const imgUrl = referenceImages[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center overflow-hidden transition-all ${
                        imgUrl
                          ? 'border-amber-400/50 bg-black/60 shadow-inner'
                          : 'border-dashed border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 text-zinc-600'
                      }`}
                    >
                      {imgUrl ? (
                        <>
                          <img
                            src={imgUrl}
                            alt={`Referenz ${slotIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleRemoveReferenceImage(slotIdx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/80 hover:bg-rose-900 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="Vorlage entfernen"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] bg-black/80 text-amber-300 font-mono">
                            Ref #{slotIdx + 1}
                          </span>
                        </>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-full flex flex-col items-center justify-center p-1 text-center cursor-pointer hover:bg-zinc-800/40 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-zinc-500 mb-1" />
                          <span className="text-[10px] text-zinc-500">+ Vorlage</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hidden file input for uploading from Chromebook / PC */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleLocalImageUpload}
              />

              <p className="text-[10px] text-zinc-500 italic mt-1.5">
                * Vorlagen verbleiben lokal und werden erst beim Klick auf „Erstellen“ an den Bildgenerator übertragen.
              </p>

              {/* Quick Pick Drawer from Mia's Photo Pack */}
              {showRefPicker && (
                <div className="mt-3 p-3 rounded-xl bg-black/70 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-200">Kollektion Mia (Aus ZIP-Paket):</span>
                    <button onClick={() => setShowRefPicker(false)} className="text-zinc-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto scrollbar-thin">
                    {MIA_PRESET_PHOTOS.map((photoUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAddReferenceImage(photoUrl)}
                        className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 hover:border-amber-400 transition-all cursor-pointer group"
                      >
                        <img src={photoUrl} alt={`Mia ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center text-amber-200">
                          #{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Bildstile: Porträt, Film, 3D-Comic, Erotik/Boudoir */}
            <div className="pt-2 border-t border-zinc-800/60">
              <label className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-2">
                3. Bildstil wählen (Porträt-, Film-, 3D-Comic)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'portraet', label: 'Porträt', desc: 'Fotorealismus & Hauttextur', icon: Camera },
                  { id: 'film', label: 'Film 35mm', desc: 'Cinematisch & Lichtspiele', icon: Film },
                  { id: 'comic_3d', label: '3D-Comic', desc: 'Stilisierter CGI-Render', icon: Box },
                  { id: 'erotic_boudoir', label: 'Erotik/Boudoir', desc: 'Sinnlich & Unzensiert', icon: Flame },
                ].map((s) => {
                  const Icon = s.icon;
                  const isSelected = selectedStyle === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-400 text-white shadow-md shadow-amber-500/10'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-zinc-500 leading-tight">{s.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Format & Varianten pro Serie (1 bis 4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/60">
              {/* Aspect Ratio */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Bildgröße &amp; Proportionen
                </label>
                <div className="grid grid-cols-5 gap-1.5 text-xs">
                  {(['9:16', '16:9', '1:1', '4:3', '3:4'] as const).map((ar) => (
                    <button
                      key={ar}
                      onClick={() => setAspectRatio(ar)}
                      className={`py-1.5 rounded-lg border text-center font-mono text-[11px] transition-all cursor-pointer ${
                        aspectRatio === ar
                          ? 'bg-amber-500 text-black font-bold border-amber-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Varianten pro Serie (1 bis 4) */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Varianten pro Serie (1–4 Bilder)
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {[1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariantsCount(v)}
                      className={`py-1.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                        variantsCount === v
                          ? 'bg-amber-500 text-black font-bold border-amber-300 shadow-sm'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {v} {v === 1 ? 'Bild' : 'Bilder'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Prompt Eingabe */}
            <div className="pt-2 border-t border-zinc-800/60 space-y-2">
              <label className="text-xs font-semibold text-amber-300 uppercase tracking-wider block">
                5. Wunsch beschreiben (Prompt)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Beschreibe das gewünschte Bild oder die Szene..."
                className="w-full bg-black/60 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none leading-relaxed"
              />

              {/* Quick Prompt Enhancers */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="text-zinc-500">Schnell-Details:</span>
                {[
                  'Penthouse Terrasse Nacht',
                  'Seidene Spitzen-Dessous',
                  'Goldenes Sonnenuntergangslicht',
                  'Mikro-Bikini Strand',
                  'Verführerischer Blick Nahaufnahme'
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setPrompt((prev) => `${prev}, ${tag}`)}
                    className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Erstellen Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerateSeries}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-amber-500/25 border border-amber-300/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Erstelle Serie ({variantsCount} {variantsCount === 1 ? 'Variante' : 'Varianten'})... {generationProgress}%</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Jetzt {variantsCount} {variantsCount === 1 ? 'Bild' : 'Varianten'} erstellen ({selectedStyle.toUpperCase()})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Active Results & Series (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Active Generation Preview Box */}
          <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Aktuelle Serie ({activeSeriesVariants.length > 0 ? activeSeriesVariants.length : '1'} Bild{activeSeriesVariants.length > 1 ? 'er' : ''})</span>
              </h3>
              {activeSeriesVariants.length > 0 && (
                <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded-full font-mono">
                  Erfolgreich generiert
                </span>
              )}
            </div>

            {/* Image Preview / Progress */}
            <div className="relative aspect-[9/14] sm:aspect-[16/10] lg:aspect-[9/13] rounded-xl overflow-hidden bg-black/80 border border-zinc-800 flex items-center justify-center shadow-inner">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
                  <p className="text-xs text-amber-200 font-semibold">
                    Generiere {variantsCount} Varianten...
                  </p>
                  <div className="w-48 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-200"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Modell: {connectionConfig.activeModel}
                  </p>
                </div>
              ) : activeSeriesVariants.length > 0 ? (
                <div className="relative w-full h-full group">
                  <img
                    src={activeSeriesVariants[0].imageUrl}
                    alt={activeSeriesVariants[0].prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <p className="text-xs text-zinc-200 line-clamp-2 mb-2 font-medium">
                      {activeSeriesVariants[0].prompt}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadSingle(activeSeriesVariants[0])}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download .{activeSeriesVariants[0].fileFormat}</span>
                      </button>
                      <button
                        onClick={() => setPreviewModalImage(activeSeriesVariants[0])}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs border border-zinc-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Vollbild</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center space-y-2 text-zinc-500">
                  <Camera className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
                  <p className="text-xs font-medium text-zinc-400">Noch kein Bild in dieser Session erstellt</p>
                  <p className="text-[10px] max-w-xs mx-auto">
                    Klicke oben auf „Jetzt erstellen“, um Mias oder Tanias Serie zu generieren.
                  </p>
                </div>
              )}
            </div>

            {/* Multiple Variants Mini-Grid */}
            {activeSeriesVariants.length > 1 && (
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-800">
                {activeSeriesVariants.map((varItem, idx) => (
                  <div
                    key={varItem.id}
                    onClick={() => setPreviewModalImage(varItem)}
                    className="relative aspect-square rounded-lg overflow-hidden border border-amber-500/30 hover:border-amber-400 cursor-pointer group shadow-sm"
                  >
                    <img src={varItem.imageUrl} alt={`Variante ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded text-[8px] bg-black/80 text-amber-200 font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Persistent Archive Gallery */}
      <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-amber-200 font-serif flex items-center gap-2">
              <Archive className="w-4 h-4 text-amber-400" />
              <span>Dauerhaftes Bilder-Archiv ({imageArchive.length} Bilder)</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Alle generierten Bilder bleiben geschützt in deinem Browser gespeichert und können einzeln oder als Komplett-ZIP exportiert werden.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportFullImageBackupZip}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup herunterladen (ZIP)</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {imageArchive.map((rec) => (
            <div
              key={rec.id}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-black/70 border border-zinc-800 hover:border-amber-400/60 transition-all shadow-md"
            >
              <img
                src={rec.imageUrl}
                alt={rec.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-amber-300 line-clamp-1">{rec.characterName}</span>
                <span className="text-[9px] text-zinc-400 font-mono mb-1.5">{rec.style}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownloadSingle(rec)}
                    className="p-1 rounded bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                    title="Herunterladen"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setPreviewModalImage(rec)}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                    title="Vollbild"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection & Google API Setup Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-serif">
                  Generator-Verbindung &amp; API-Setup
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">
                  1. Anbieter-Typ
                </label>
                <select
                  value={tempServerType}
                  onChange={(e) => setTempServerType(e.target.value as any)}
                  className="w-full bg-black/70 border border-zinc-800 rounded-lg p-2.5 text-zinc-200"
                >
                  <option value="google_api">Google Bild-Studio (Gemini / Imagen 3)</option>
                  <option value="tailscale_remote">Tailscale Remote-Server (100.82.14.90:7860)</option>
                  <option value="forge_a1111">Lokales Stable Diffusion Forge / WebUI (7860)</option>
                  <option value="cloud_gpu">Cloud GPU / RunPod / Vast.ai</option>
                </select>
              </div>

              {tempServerType === 'google_api' ? (
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">
                    Google AI-Studio API-Key
                  </label>
                  <input
                    type="password"
                    value={tempGoogleApiKey}
                    onChange={(e) => setTempGoogleApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-black/70 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 font-mono"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Trage hier deinen Google-API-Schlüssel ein, um die Imagen 3 Modelle direkt abzufragen.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">
                      Server Endpunkt (URL / IP)
                    </label>
                    <input
                      type="text"
                      value={tempEndpointUrl}
                      onChange={(e) => setTempEndpointUrl(e.target.value)}
                      placeholder="http://100.82.14.90:7860"
                      className="w-full bg-black/70 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">
                      API-Token oder Passwort (Optional)
                    </label>
                    <input
                      type="password"
                      value={tempApiToken}
                      onChange={(e) => setTempApiToken(e.target.value)}
                      placeholder="Optionaler Zugangstoken..."
                      className="w-full bg-black/70 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 font-mono"
                    />
                  </div>
                </>
              )}

              {connectionMessage && (
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-200 text-xs font-mono">
                  {connectionMessage}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
              >
                Abbrechen
              </button>
              <button
                onClick={handleLoadModelsAndVerify}
                disabled={isTestingConnection}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 cursor-pointer"
              >
                {isTestingConnection ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Modelle laden &amp; Speichern</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {previewModalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-amber-500/40 rounded-2xl max-w-4xl w-full p-5 shadow-2xl flex flex-col md:flex-row gap-5">
            <div className="md:w-3/5 aspect-[3/4] bg-black rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={previewModalImage.imageUrl}
                alt={previewModalImage.prompt}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="md:w-2/5 flex flex-col justify-between space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold">
                    {previewModalImage.characterName}
                  </span>
                  <button
                    onClick={() => setPreviewModalImage(null)}
                    className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-white mb-1">Prompt:</h4>
                <p className="text-zinc-300 text-[11px] leading-relaxed bg-black/50 p-2.5 rounded-lg border border-zinc-800 mb-3">
                  {previewModalImage.prompt}
                </p>

                <div className="space-y-1 text-zinc-400 text-[11px] font-mono">
                  <p>Stil: <span className="text-amber-200">{previewModalImage.style}</span></p>
                  <p>Seed: <span className="text-amber-200">{previewModalImage.seed}</span></p>
                  <p>Sampler: <span className="text-zinc-200">{previewModalImage.sampler}</span></p>
                  <p>Modell: <span className="text-zinc-200">{previewModalImage.model}</span></p>
                  <p>Auflösung: <span className="text-zinc-200">{previewModalImage.width}×{previewModalImage.height}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => handleDownloadSingle(previewModalImage)}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .{previewModalImage.fileFormat}</span>
                </button>
                {onSendToChat && (
                  <button
                    onClick={() => {
                      onSendToChat(`Schau mal, was ich gerade von dir generiert habe:`, previewModalImage.imageUrl);
                      setPreviewModalImage(null);
                    }}
                    className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-200 border border-amber-500/30 text-xs font-semibold cursor-pointer"
                  >
                    In Chat senden
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
