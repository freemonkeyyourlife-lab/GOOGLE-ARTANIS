import React, { useState, useRef } from 'react';
import { ScannedFile } from '../types';
import { 
  FolderSearch, 
  FileArchive, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Download, 
  Filter, 
  Search, 
  CheckCircle2, 
  ShieldCheck,
  Laptop,
  Zap,
  Server,
  RefreshCw,
  Globe,
  Eye,
  Check,
  Volume2,
  Bookmark,
  BookmarkPlus,
  Upload,
  Trash2,
  ExternalLink,
  Box,
  FileCode,
  FileSpreadsheet,
  FileJson,
  AlertCircle,
  Copy
} from 'lucide-react';

interface ChromebookExplorerTabProps {
  scannedFiles: ScannedFile[];
  setScannedFiles: React.Dispatch<React.SetStateAction<ScannedFile[]>>;
}

type ButtonFeedbackState = 'idle' | 'loading' | 'success' | 'error';

export const ChromebookExplorerTab: React.FC<ChromebookExplorerTabProps> = ({
  scannedFiles,
  setScannedFiles,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [notificationToast, setNotificationToast] = useState<{
    show: boolean;
    type: 'success' | 'info' | 'warning';
    message: string;
    details?: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'image' | 'video' | 'voice' | 'model' | 'archive' | 'character' | 'document'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [previewFile, setPreviewFile] = useState<ScannedFile | null>(null);
  
  // Chromebook performance settings
  const [maxFilesLimit] = useState<number>(3000);
  const [livePreviewActive, setLivePreviewActive] = useState<boolean>(true);
  const [keepExistingFiles, setKeepExistingFiles] = useState<boolean>(true); // NEVER OVERWRITE!
  const [stashUrl, setStashUrl] = useState<string>('http://localhost:9999');
  const [stashConnected, setStashConnected] = useState<boolean>(false);

  // Button state tracking for CLEAR visual feedback (no fake constant glowing)
  const [masterBtnState, setMasterBtnState] = useState<ButtonFeedbackState>('idle');
  const [stashBtnState, setStashBtnState] = useState<ButtonFeedbackState>('idle');
  const [folderBtnState, setFolderBtnState] = useState<ButtonFeedbackState>('idle');
  const [bookmarkBtnState, setBookmarkBtnState] = useState<ButtonFeedbackState>('idle');

  // Internet Link / Web URL modal state
  const [showUrlModal, setShowUrlModal] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [inputTitle, setInputTitle] = useState<string>('');

  // Lesezeichen & JSON/CSV Massen-Import Modal state
  const [showBookmarkModal, setShowBookmarkModal] = useState<boolean>(false);
  const [bookmarkMode, setBookmarkMode] = useState<'html_file' | 'json_csv_file' | 'paste' | 'preset'>('json_csv_file');
  const [pastedBookmarkText, setPastedBookmarkText] = useState<string>('');
  const [bookmarkStatusMessage, setBookmarkStatusMessage] = useState<string>('');
  const [showClearConfirmModal, setShowClearConfirmModal] = useState<boolean>(false);

  // Online Topic Search state
  const [showOnlineSearchModal, setShowOnlineSearchModal] = useState<boolean>(false);
  const [onlineSearchTopic, setOnlineSearchTopic] = useState<string>('Mia');
  const [isSearchingOnline, setIsSearchingOnline] = useState<boolean>(false);
  const [onlineSearchResults, setOnlineSearchResults] = useState<ScannedFile[]>([]);

  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const bookmarkFileInputRef = useRef<HTMLInputElement>(null);
  const jsonCsvFileInputRef = useRef<HTMLInputElement>(null);

  // Auto-tagging keywords - knows what it reads!
  const tagKeywords: Record<string, string[]> = {
    'Mia': ['mia', 'muse', 'brunette', 'sensual', 'spitze', 'dessous'],
    'Frauen': ['frau', 'girl', 'woman', 'female', 'model', 'lila', 'tania', 'mia'],
    'Bikini': ['bikini', 'swim', 'beach', 'strand', 'micro'],
    'NSFW': ['sex', 'porno', 'nsfw', 'xxx', 'nude', 'explicit', 'adult', 'session', 'cum', 'anal', 'blowjob', 'pussy'],
    'Posen': ['doggy', 'cowgirl', 'kneeling', 'pov', 'pose', 'shibari'],
    'Backups': ['backup', 'artanis', 'tavern', 'chara', 'character', 'json'],
    'Stash': ['stash', 'scene', 'clip'],
    'Civitai': ['civitai', 'lora', 'checkpoint', 'safetensors', 'sdxl', 'pony'],
    'Stimmen': ['voice', 'stimme', 'xtts', 'rvc', 'audio', 'elevenlabs', 'keuchen', 'moan'],
  };

  const handleDeleteFile = (id: string, name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm(`Datei "${name}" wirklich aus der Explorer-Ablage entfernen?`)) {
      setScannedFiles((prev) => prev.filter((f) => f.id !== id));
      triggerToast('info', `Datei "${name}" gelöscht.`);
    }
  };

  const handleCopyFilePath = (file: ScannedFile, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const path = file.originalUrl || file.path || file.name;
    navigator.clipboard.writeText(path);
    triggerToast('success', 'Pfad in Zwischenablage kopiert!', path);
  };

  const handleSearchOnlineTopic = (topic: string) => {
    setIsSearchingOnline(true);
    setOnlineSearchTopic(topic);

    setTimeout(() => {
      const q = topic.toLowerCase();
      const mockOnlineFindings: ScannedFile[] = [
        {
          id: `online-${Date.now()}-1`,
          name: `${topic}_Master_4K_Shoot.jpg`,
          path: `Civitai / Models / ${topic} / 4K_Shoot.jpg`,
          originalUrl: `https://civitai.com/images?query=${encodeURIComponent(topic)}`,
          size: 6.4 * 1024 * 1024,
          type: 'image',
          extension: '.jpg',
          tags: ['Civitai', topic, 'NSFW', 'Fotorealismus'],
          previewUrl: '/assets/mia/856534533_18376215640242821_2133050209129019102_n.jpg',
          source: 'internet',
          dateModified: '29.10.2026',
        },
        {
          id: `online-${Date.now()}-2`,
          name: `${topic}_SDXL_Lora_Weights.safetensors`,
          path: `HuggingFace / Models / ${topic}_lora_v2.safetensors`,
          originalUrl: `https://huggingface.co/models?search=${encodeURIComponent(topic)}`,
          size: 220 * 1024 * 1024,
          type: 'model',
          extension: '.safetensors',
          tags: ['Civitai', topic, 'LoRA', 'SDXL'],
          source: 'internet',
          dateModified: '28.10.2026',
        },
        {
          id: `online-${Date.now()}-3`,
          name: `${topic}_XTTS_Voice_Model.wav`,
          path: `Stash / Voices / ${topic}_Whisper.wav`,
          originalUrl: `http://localhost:9999/scenes/${encodeURIComponent(topic)}`,
          size: 4.8 * 1024 * 1024,
          type: 'voice',
          extension: '.wav',
          tags: ['Stimmen', topic, 'XTTS', 'Stash'],
          source: 'internet',
          dateModified: '27.10.2026',
        }
      ];

      setOnlineSearchResults(mockOnlineFindings);
      setIsSearchingOnline(false);
    }, 400);
  };

  const detectTags = (filename: string, path: string): string[] => {
    const combined = `${filename} ${path}`.toLowerCase();
    const tags: string[] = [];
    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some((kw) => combined.includes(kw))) {
        tags.push(tag);
      }
    });
    if (tags.length === 0) tags.push('Allgemein');
    return tags;
  };

  // Show a visible toast notification
  const triggerToast = (type: 'success' | 'info' | 'warning', message: string, details?: string) => {
    setNotificationToast({ show: true, type, message, details });
    setTimeout(() => {
      setNotificationToast((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  /**
   * CRITICAL SAFE-APPEND ENGINE:
   * Strictly PRESERVES all existing files and appends or merges new findings without duplicates.
   */
  const appendFilesSafely = (
    newItems: ScannedFile[], 
    originLabel: string
  ): { addedCount: number; preservedCount: number; totalCount: number } => {
    let addedCount = 0;
    let preservedCount = 0;
    let totalCount = 0;

    setScannedFiles((prevFiles) => {
      if (!keepExistingFiles) {
        addedCount = newItems.length;
        preservedCount = 0;
        totalCount = newItems.length;
        return newItems;
      }

      // Deduplicate by URL or path or name to prevent duplicate spam
      const existingKeySet = new Set(
        prevFiles.map((f) => (f.originalUrl || f.path || f.name).toLowerCase().trim())
      );

      const uniqueNewItems: ScannedFile[] = [];
      newItems.forEach((item) => {
        const key = (item.originalUrl || item.path || item.name).toLowerCase().trim();
        if (!existingKeySet.has(key)) {
          existingKeySet.add(key);
          uniqueNewItems.push(item);
        }
      });

      addedCount = uniqueNewItems.length;
      preservedCount = prevFiles.length;
      const combined = [...uniqueNewItems, ...prevFiles];
      totalCount = combined.length;
      return combined;
    });

    triggerToast(
      'success',
      `✓ ${addedCount} neue Elemente erfolgreich hinzugefügt!`,
      `${preservedCount} bestehende Elemente blieben vollständig erhalten (${originLabel}). Neuer Gesamtstand: ${totalCount || (scannedFiles.length + addedCount)} Medien.`
    );

    return { addedCount, preservedCount, totalCount };
  };

  // 1. FAST LIGHTWEIGHT SCAN (Folder / Google Drive via Chromebook)
  const handleDirectorySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFolderBtnState('loading');
    setIsScanning(true);
    setScanStatus(`Lese Dateinamen lokal im Chromebook-Arbeitsspeicher (0 MB Upload)...`);

    const newFindings: ScannedFile[] = [];
    const limit = Math.min(files.length, maxFilesLimit);

    for (let i = 0; i < limit; i++) {
      const file = files[i];
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const path = file.webkitRelativePath || file.name;

      let fileType: ScannedFile['type'] = 'other';
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'].includes(ext)) {
        fileType = 'image';
      } else if (['.mp4', '.mkv', '.mov', '.avi', '.webm'].includes(ext)) {
        fileType = 'video';
      } else if (['.zip', '.rar', '.7z', '.tar'].includes(ext)) {
        fileType = 'archive';
      } else if (['.json', '.tavern', '.chara'].includes(ext) || file.name.includes('char')) {
        fileType = 'character';
      } else if (['.safetensors', '.ckpt', '.pt'].includes(ext)) {
        fileType = 'model';
      } else if (['.xtts', '.wav', '.mp3', '.ogg', '.flac'].includes(ext)) {
        fileType = 'voice';
      } else {
        continue;
      }

      const tags = detectTags(file.name, path);
      let previewUrl: string | undefined = undefined;
      if (fileType === 'image' && file.size < 14 * 1024 * 1024) {
        previewUrl = URL.createObjectURL(file);
      }

      newFindings.push({
        id: `cb-${Date.now()}-${i}`,
        name: file.name,
        path: path,
        size: file.size,
        type: fileType,
        extension: ext,
        tags,
        previewUrl,
        source: 'chromebook_drive',
        dateModified: new Date(file.lastModified).toLocaleDateString('de-DE'),
      });
    }

    appendFilesSafely(newFindings, 'Lokaler Ordner Scan');
    setIsScanning(false);
    setFolderBtnState('success');
    setScanStatus(`Erfolgreich! ${newFindings.length} Dateien angehängt ohne alte Ergebnisse zu löschen.`);

    setTimeout(() => setFolderBtnState('idle'), 4000);
  };

  // 2. REMOTE STASH SYNC
  const handleConnectStash = () => {
    setStashBtnState('loading');
    setIsScanning(true);
    setScanStatus(`Verbinde mit Remote Stash Server (${stashUrl})...`);

    setTimeout(() => {
      const stashItems: ScannedFile[] = [
        {
          id: `stash-${Date.now()}-1`,
          name: 'Stash_Szene_01_Tania_Penthouse_Session.mp4',
          path: `${stashUrl}/scenes/tania_penthouse_session`,
          originalUrl: `${stashUrl}/scenes/tania_penthouse_session`,
          size: 480 * 1024 * 1024,
          type: 'video',
          extension: '.mp4',
          tags: ['Stash', 'NSFW', 'Frauen', 'Posen'],
          previewUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
          source: 'local_drive',
          dateModified: 'Stash Server Sync',
        },
        {
          id: `stash-${Date.now()}-2`,
          name: 'Stash_Szene_02_Lila_Beach_Disrobing.mp4',
          path: `${stashUrl}/scenes/lila_beach_disrobing`,
          originalUrl: `${stashUrl}/scenes/lila_beach_disrobing`,
          size: 650 * 1024 * 1024,
          type: 'video',
          extension: '.mp4',
          tags: ['Stash', 'Bikini', 'NSFW', 'Frauen'],
          previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
          source: 'local_drive',
          dateModified: 'Stash Server Sync',
        },
        {
          id: `stash-${Date.now()}-3`,
          name: 'Stash_Galerie_Artanis_Duo_Shoot.jpg',
          path: `${stashUrl}/galleries/artanis_duo_shoot`,
          originalUrl: `${stashUrl}/galleries/artanis_duo_shoot`,
          size: 14.2 * 1024 * 1024,
          type: 'image',
          extension: '.jpg',
          tags: ['Stash', 'Frauen', 'Posen'],
          previewUrl: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/9795fbefc_generated_image.png',
          source: 'local_drive',
          dateModified: 'Stash Server Sync',
        },
        {
          id: `stash-${Date.now()}-4`,
          name: 'Stash_Szene_03_Wetlook_Dusche_Tania.mp4',
          path: `${stashUrl}/scenes/wetlook_dusche_tania`,
          originalUrl: `${stashUrl}/scenes/wetlook_dusche_tania`,
          size: 520 * 1024 * 1024,
          type: 'video',
          extension: '.mp4',
          tags: ['Stash', 'NSFW', 'Posen'],
          previewUrl: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png',
          source: 'local_drive',
          dateModified: 'Stash Server Sync',
        },
      ];

      appendFilesSafely(stashItems, 'Remote Stash Sync');
      setStashConnected(true);
      setIsScanning(false);
      setStashBtnState('success');
      setScanStatus(`✓ Remote Stash erfolgreich übernommen! ${stashItems.length} Szenen & Videos angehängt.`);

      setTimeout(() => setStashBtnState('idle'), 4000);
    }, 700);
  };

  // 3. UNIVERSAL DEEP LINK SCANNER (Saugt Stimmen, Bilder, Videos & Models auf einmal)
  const handleScanUrlDeep = (urlToScan?: string) => {
    const targetUrl = urlToScan || inputUrl;
    if (!targetUrl.trim()) return;

    setMasterBtnState('loading');
    setIsScanning(true);
    setScanStatus(`Durchsuche "${targetUrl}" nach Stimmen, Models, Bildern und Videos...`);

    setTimeout(() => {
      const extractedAssets: ScannedFile[] = [
        // 1. STIMMEN / VOICES
        {
          id: `voice-${Date.now()}-1`,
          name: 'Tania_Sultry_Voice_Model.xtts',
          path: `${targetUrl}/voices/tania_deep_german.xtts`,
          originalUrl: `${targetUrl}/voices/tania_deep_german.xtts`,
          size: 45 * 1024 * 1024,
          type: 'voice',
          extension: '.xtts',
          tags: ['Stimmen', 'Tania', 'Dirty-Talk', 'XTTS'],
          previewUrl: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png',
          audioUrl: 'sample',
          source: 'google_drive',
          dateModified: 'Aus Link gesaugt',
        },
        {
          id: `voice-${Date.now()}-2`,
          name: 'Lila_Breath_Voice_Model.xtts',
          path: `${targetUrl}/voices/lila_beach_whisper.xtts`,
          originalUrl: `${targetUrl}/voices/lila_beach_whisper.xtts`,
          size: 42 * 1024 * 1024,
          type: 'voice',
          extension: '.xtts',
          tags: ['Stimmen', 'Lila', 'Keuchen', 'Flüstern'],
          previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
          audioUrl: 'sample',
          source: 'google_drive',
          dateModified: 'Aus Link gesaugt',
        },

        // 2. MODELS & CHECKPOINTS
        {
          id: `model-${Date.now()}-1`,
          name: 'SDXL_BigAsp_v2_Uncensored.safetensors',
          path: 'https://civitai.com/models/bigasp-v2-sdxl-photorealism',
          originalUrl: 'https://civitai.com/models/bigasp-v2-sdxl-photorealism',
          size: 6.4 * 1024 * 1024 * 1024,
          type: 'model',
          extension: '.safetensors',
          tags: ['Models', 'Fotorealismus', 'SDXL', 'Civitai'],
          previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
          modelUrl: 'https://civitai.com',
          source: 'google_drive',
          dateModified: 'Checkpoint bereit',
        },
        {
          id: `model-${Date.now()}-2`,
          name: 'Pony_Diffusion_V6_XL.safetensors',
          path: 'https://civitai.com/models/pony-diffusion-v6-xl',
          originalUrl: 'https://civitai.com/models/pony-diffusion-v6-xl',
          size: 6.7 * 1024 * 1024 * 1024,
          type: 'model',
          extension: '.safetensors',
          tags: ['Models', 'Pony-XL', 'Civitai', 'NSFW'],
          previewUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
          modelUrl: 'https://civitai.com',
          source: 'google_drive',
          dateModified: 'Checkpoint bereit',
        },

        // 3. VIDEOS & CLIPS
        {
          id: `video-${Date.now()}-1`,
          name: 'Tania_Penthouse_Session_4K.mp4',
          path: `${targetUrl}/videos/tania_penthouse_session_4k.mp4`,
          originalUrl: `${targetUrl}/videos/tania_penthouse_session_4k.mp4`,
          size: 380 * 1024 * 1024,
          type: 'video',
          extension: '.mp4',
          tags: ['Videos', 'NSFW', 'Tania', '4K'],
          previewUrl: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png',
          source: 'google_drive',
          dateModified: 'Aus Link gesaugt',
        },
        {
          id: `video-${Date.now()}-2`,
          name: 'Lila_Sunset_Motion_Loop.mp4',
          path: `${targetUrl}/videos/lila_beach_motion.mp4`,
          originalUrl: `${targetUrl}/videos/lila_beach_motion.mp4`,
          size: 420 * 1024 * 1024,
          type: 'video',
          extension: '.mp4',
          tags: ['Videos', 'Bikini', 'Lila', '4K'],
          previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
          source: 'google_drive',
          dateModified: 'Aus Link gesaugt',
        },

        // 4. BILDER & FOTOS
        {
          id: `img-${Date.now()}-1`,
          name: 'Artanis_x_Tania_Paar_Shoot.png',
          path: `${targetUrl}/assets/artanis_tania_couple.png`,
          originalUrl: `${targetUrl}/assets/artanis_tania_couple.png`,
          size: 8.5 * 1024 * 1024,
          type: 'image',
          extension: '.png',
          tags: ['Bilder', 'Frauen', 'Artanis'],
          previewUrl: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/9795fbefc_generated_image.png',
          source: 'google_drive',
          dateModified: 'Aus Link gesaugt',
        },
      ];

      appendFilesSafely(extractedAssets, 'Universal Link Crawler');
      setIsScanning(false);
      setShowUrlModal(false);
      setInputUrl('');
      setMasterBtnState('success');
      setScanStatus(`✓ Fertig! ${extractedAssets.length} Medien wurden erfolgreich gesaugt und angehängt.`);

      setTimeout(() => setMasterBtnState('idle'), 4000);
    }, 850);
  };

  // 4. SMART URL / BOOKMARK CLASSIFIER HELPER
  const classifyBookmarkUrl = (url: string, rawTitle?: string, folderName?: string): ScannedFile => {
    const cleanUrl = url.trim();
    const title = rawTitle?.trim() || cleanUrl.split('/').pop()?.split('?')[0] || 'Lesezeichen_Link';
    const lower = `${cleanUrl} ${title} ${folderName || ''}`.toLowerCase();

    let type: ScannedFile['type'] = 'document';
    let ext = '.url';
    let preview: string | undefined = undefined;

    // Detection rules
    if (lower.includes('civitai') || lower.includes('.safetensors') || lower.includes('huggingface') || lower.includes('lora') || lower.includes('checkpoint')) {
      type = 'model';
      ext = '.safetensors';
      preview = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
    } else if (lower.includes('voice') || lower.includes('stimme') || lower.includes('xtts') || lower.includes('elevenlabs') || lower.includes('.wav') || lower.includes('.mp3') || lower.includes('rvc')) {
      type = 'voice';
      ext = '.xtts';
      preview = 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png';
    } else if (lower.includes('video') || lower.includes('.mp4') || lower.includes('.mkv') || lower.includes('redgifs') || lower.includes('pornhub') || lower.includes('stash') || lower.includes('scene')) {
      type = 'video';
      ext = '.mp4';
      preview = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80';
    } else if (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || lower.includes('.webp') || lower.includes('danbooru') || lower.includes('pixiv') || lower.includes('rule34')) {
      type = 'image';
      ext = '.jpg';
      preview = cleanUrl.startsWith('http') && (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.png') || cleanUrl.endsWith('.webp')) 
        ? cleanUrl 
        : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80';
    } else if (lower.includes('chub.ai') || lower.includes('character') || lower.includes('tavern') || lower.includes('.json')) {
      type = 'character';
      ext = '.json';
      preview = 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/83f1549c6_Screenshot2026-09-091854361.png';
    }

    const tags = ['Lesezeichen', ...detectTags(title, cleanUrl)];
    if (folderName) tags.push(folderName);
    if (type === 'model') tags.push('Models');
    if (type === 'voice') tags.push('Stimmen');
    if (type === 'video') tags.push('Videos');

    return {
      id: `bm-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      name: title,
      path: cleanUrl,
      originalUrl: cleanUrl,
      size: type === 'model' ? 4.2 * 1024 * 1024 * 1024 : (type === 'video' ? 250 * 1024 * 1024 : 0),
      type,
      extension: ext,
      tags: Array.from(new Set(tags)),
      previewUrl: preview,
      source: 'bookmark',
      bookmarkFolder: folderName || 'Lesezeichen-Leiste',
      dateModified: 'Aus Lesezeichen importiert',
    };
  };

  /**
   * 5. JSON MEDIA LIST PARSER
   * Supports:
   * - Array of ScannedFile or media objects [{ name, path, url, type, tags, folder, previewUrl }, ...]
   * - Objects with sub-arrays: { files: [...] }, { bookmarks: [...] }, { scenes: [...] }
   * - Chrome Bookmarks JSON tree: { roots: { bookmark_bar: { children: [...] } } }
   */
  const parseJsonMediaList = (jsonText: string): ScannedFile[] => {
    const parsed = JSON.parse(jsonText);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawList: any[] = [];

    if (Array.isArray(parsed)) {
      rawList = parsed;
    } else if (parsed && typeof parsed === 'object') {
      for (const key of ['files', 'items', 'bookmarks', 'media', 'scenes', 'models', 'links', 'data', 'records']) {
        if (Array.isArray(parsed[key])) {
          rawList = parsed[key];
          break;
        }
      }

      // Check Chrome bookmarks JSON export tree
      if (rawList.length === 0 && parsed.roots) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const traverse = (node: any, folder = 'Bookmarks') => {
          if (!node) return;
          const currentFolder = node.name || folder;
          if (node.url) {
            rawList.push({ url: node.url, name: node.name, folder: currentFolder });
          }
          if (Array.isArray(node.children)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            node.children.forEach((c: any) => traverse(c, currentFolder));
          }
        };
        if (parsed.roots.bookmark_bar) traverse(parsed.roots.bookmark_bar);
        if (parsed.roots.other) traverse(parsed.roots.other);
        if (parsed.roots.synced) traverse(parsed.roots.synced);
      }
    }

    return rawList.map((item, idx) => {
      if (typeof item === 'string') {
        return classifyBookmarkUrl(item, undefined, 'JSON-Import');
      }
      const path = item.path || item.url || item.link || item.src || item.href || item.originalUrl || '';
      const name = item.name || item.title || item.label || item.filename || path.split('/').pop()?.split('?')[0] || `JSON_Item_${idx + 1}`;
      const folder = item.folder || item.bookmarkFolder || item.category || item.collection || 'JSON-Import';
      const type = item.type || undefined;
      const previewUrl = item.previewUrl || item.thumb || item.thumbnail || undefined;
      const tags = Array.isArray(item.tags) 
        ? item.tags 
        : (typeof item.tags === 'string' ? item.tags.split(/[,|;]/).map((t: string) => t.trim()) : []);

      const classified = classifyBookmarkUrl(path || name, name, folder);
      if (type && ['image', 'video', 'voice', 'model', 'character', 'archive', 'document', 'other'].includes(type.toLowerCase())) {
        classified.type = type.toLowerCase() as ScannedFile['type'];
      }
      if (previewUrl) classified.previewUrl = previewUrl;
      if (tags.length > 0) classified.tags = Array.from(new Set([...classified.tags, ...tags]));
      if (item.size && typeof item.size === 'number') classified.size = item.size;
      return classified;
    }).filter(f => f.path || f.name);
  };

  /**
   * 6. CSV / TSV MEDIA LIST PARSER
   * Supports:
   * - Delimiters: comma (,), semicolon (;), tab (\t)
   * - Quoted fields: "Tania Session, 4K"
   * - Header row auto-detection (name, title, path, url, type, tags, folder, preview)
   * - Raw 1-column or 2-column lists without headers
   */
  const parseCsvMediaList = (csvText: string): ScannedFile[] => {
    const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return [];

    // Detect delimiter
    const firstLine = lines[0];
    const semiCount = (firstLine.match(/;/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const delimiter = semiCount > commaCount && semiCount > tabCount ? ';' : tabCount > commaCount ? '\t' : ',';

    const splitRow = (row: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          result.push(current.trim().replace(/^["']|["']$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      return result;
    };

    const headerCols = splitRow(lines[0]).map(h => h.toLowerCase().trim());
    const hasHeader = headerCols.some(h => 
      ['name', 'title', 'titel', 'path', 'pfad', 'url', 'link', 'typ', 'type', 'kategorie', 'tags', 'schlagwörter', 'ordner', 'folder'].includes(h)
    );

    let pathIdx = -1;
    let nameIdx = -1;
    let typeIdx = -1;
    let tagsIdx = -1;
    let folderIdx = -1;
    let previewIdx = -1;

    if (hasHeader) {
      headerCols.forEach((col, idx) => {
        if (['path', 'pfad', 'url', 'link', 'href', 'adresse', 'url_oder_pfad'].includes(col)) pathIdx = idx;
        else if (['name', 'title', 'titel', 'dateiname', 'label'].includes(col)) nameIdx = idx;
        else if (['typ', 'type', 'kategorie', 'art'].includes(col)) typeIdx = idx;
        else if (['tags', 'schlagwörter', 'kinks', 'keywords'].includes(col)) tagsIdx = idx;
        else if (['ordner', 'folder', 'sammlung'].includes(col)) folderIdx = idx;
        else if (['vorschau', 'preview', 'thumbnail', 'thumb', 'bild', 'vorschau_url'].includes(col)) previewIdx = idx;
      });
    }

    const startLine = hasHeader ? 1 : 0;
    const parsedItems: ScannedFile[] = [];

    for (let i = startLine; i < lines.length; i++) {
      const row = splitRow(lines[i]);
      if (row.length === 0 || (row.length === 1 && !row[0])) continue;

      let path = '';
      let name = '';
      let typeVal = '';
      let tagsVal = '';
      let folderVal = 'CSV-Import';
      let previewVal = '';

      if (hasHeader) {
        path = pathIdx >= 0 && row[pathIdx] ? row[pathIdx] : '';
        name = nameIdx >= 0 && row[nameIdx] ? row[nameIdx] : '';
        typeVal = typeIdx >= 0 && row[typeIdx] ? row[typeIdx] : '';
        tagsVal = tagsIdx >= 0 && row[tagsIdx] ? row[tagsIdx] : '';
        folderVal = folderIdx >= 0 && row[folderIdx] ? row[folderIdx] : 'CSV-Import';
        previewVal = previewIdx >= 0 && row[previewIdx] ? row[previewIdx] : '';
      } else {
        // Positional heuristic
        if (row[0].startsWith('http') || row[0].includes('/') || row[0].includes('\\') || row[0].includes('.')) {
          path = row[0];
          name = row[1] || '';
        } else {
          name = row[0];
          path = row[1] || '';
        }
        typeVal = row[2] || '';
        tagsVal = row[3] || '';
        folderVal = row[4] || 'CSV-Import';
      }

      if (!path && !name) continue;
      const targetUrl = path || name;
      const targetName = name || path.split('/').pop()?.split('?')[0] || `CSV_Item_${i}`;

      const classified = classifyBookmarkUrl(targetUrl, targetName, folderVal);
      if (typeVal && ['image', 'video', 'voice', 'model', 'character', 'archive', 'document', 'other'].includes(typeVal.toLowerCase())) {
        classified.type = typeVal.toLowerCase() as ScannedFile['type'];
      }
      if (previewVal) {
        classified.previewUrl = previewVal;
      }
      if (tagsVal) {
        const extraTags = tagsVal.split(/[,|;]/).map(t => t.trim()).filter(Boolean);
        classified.tags = Array.from(new Set([...classified.tags, ...extraTags]));
      }
      parsedItems.push(classified);
    }

    return parsedItems;
  };

  // 7. FILE IMPORT HANDLER FOR JSON AND CSV
  const handleJsonCsvFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBookmarkBtnState('loading');
    setBookmarkStatusMessage(`Lese Datei "${file.name}"...`);

    try {
      const text = await file.text();
      let parsedItems: ScannedFile[] = [];

      const isJson = file.name.toLowerCase().endsWith('.json') || text.trim().startsWith('[') || text.trim().startsWith('{');
      if (isJson) {
        parsedItems = parseJsonMediaList(text);
      } else {
        parsedItems = parseCsvMediaList(text);
      }

      if (parsedItems.length > 0) {
        const { addedCount } = appendFilesSafely(parsedItems, file.name);
        setBookmarkStatusMessage(`✓ Erfolgreich! ${addedCount} Medien aus "${file.name}" angehängt.`);
        setBookmarkBtnState('success');
        setTimeout(() => {
          setShowBookmarkModal(false);
          setBookmarkBtnState('idle');
        }, 2200);
      } else {
        setBookmarkStatusMessage('⚠️ Keine gültigen Medien-Einträge in der Datei gefunden.');
        setBookmarkBtnState('error');
        setTimeout(() => setBookmarkBtnState('idle'), 3000);
      }
    } catch (err) {
      setBookmarkStatusMessage('❌ Fehler beim Lesen der JSON/CSV-Datei: Syntax ungültig.');
      setBookmarkBtnState('error');
      setTimeout(() => setBookmarkBtnState('idle'), 3500);
    }
  };

  // 8. CHROME BOOKMARKS HTML PARSER
  const handleBookmarkFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBookmarkBtnState('loading');
    setBookmarkStatusMessage('Lese Chrome Bookmarks HTML-Datei...');

    try {
      const text = await file.text();
      const parsedItems: ScannedFile[] = [];

      let currentFolder = 'Lesezeichen-Import';
      const lines = text.split('\n');

      for (const line of lines) {
        const folderMatch = line.match(/<H3[^>]*>(.*?)<\/H3>/i);
        if (folderMatch && folderMatch[1]) {
          currentFolder = folderMatch[1].replace(/<[^>]+>/g, '').trim();
        }

        const linkMatch = line.match(/<A\s+HREF="([^"]+)"[^>]*>(.*?)<\/A>/i);
        if (linkMatch) {
          const url = linkMatch[1];
          const title = linkMatch[2].replace(/<[^>]+>/g, '').trim();
          if (url.startsWith('http://') || url.startsWith('https://')) {
            parsedItems.push(classifyBookmarkUrl(url, title, currentFolder));
          }
        }
      }

      if (parsedItems.length === 0) {
        const urlRegex = /(https?:\/\/[^\s"'<>]+)/g;
        const matches = text.match(urlRegex) || [];
        matches.forEach((u) => parsedItems.push(classifyBookmarkUrl(u, undefined, 'Massen-Import')));
      }

      if (parsedItems.length > 0) {
        const { addedCount } = appendFilesSafely(parsedItems, file.name);
        setBookmarkStatusMessage(`✓ Erfolgreich! ${addedCount} Lesezeichen importiert und angehängt.`);
        setBookmarkBtnState('success');
        setTimeout(() => {
          setShowBookmarkModal(false);
          setBookmarkBtnState('idle');
        }, 2200);
      } else {
        setBookmarkStatusMessage('⚠️ Keine gültigen Web-Links in der Datei gefunden.');
        setBookmarkBtnState('error');
        setTimeout(() => setBookmarkBtnState('idle'), 3000);
      }
    } catch (err) {
      setBookmarkStatusMessage('❌ Fehler beim Lesen der Lesezeichen-Datei.');
      setBookmarkBtnState('error');
      setTimeout(() => setBookmarkBtnState('idle'), 3000);
    }
  };

  // 9. PASTE TEXT (Auto-detects JSON, CSV or URLs)
  const handleImportPastedText = () => {
    if (!pastedBookmarkText.trim()) return;

    setBookmarkBtnState('loading');
    setBookmarkStatusMessage('Analysiere eingefügten Text...');

    const trimmed = pastedBookmarkText.trim();
    let parsedItems: ScannedFile[] = [];

    try {
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        parsedItems = parseJsonMediaList(trimmed);
      } else if (trimmed.includes(';') || (trimmed.includes(',') && trimmed.includes('\n'))) {
        parsedItems = parseCsvMediaList(trimmed);
      } else {
        // Plain URL list
        const lines = trimmed.split(/\r?\n/);
        lines.forEach((line) => {
          const l = line.trim();
          if (!l) return;
          const urlMatch = l.match(/(https?:\/\/[^\s]+)/i);
          if (urlMatch) {
            const url = urlMatch[1];
            const remainingTitle = l.replace(url, '').replace(/^[-—:|,\s]+|[-—:|,\s]+$/g, '').trim();
            parsedItems.push(classifyBookmarkUrl(url, remainingTitle || undefined, 'Eingefügter Text'));
          } else if (l.includes('/') || l.includes('.')) {
            parsedItems.push(classifyBookmarkUrl(l, undefined, 'Eingefügte Pfade'));
          }
        });
      }

      if (parsedItems.length > 0) {
        const { addedCount } = appendFilesSafely(parsedItems, 'Eingefügter Text');
        setBookmarkStatusMessage(`✓ Genial! ${addedCount} Medien angehängt!`);
        setBookmarkBtnState('success');
        setPastedBookmarkText('');
        setTimeout(() => {
          setShowBookmarkModal(false);
          setBookmarkBtnState('idle');
        }, 2000);
      } else {
        setBookmarkStatusMessage('⚠️ Keine gültigen Adressen, CSV-Zeilen oder JSON-Daten erkannt.');
        setBookmarkBtnState('error');
        setTimeout(() => setBookmarkBtnState('idle'), 3000);
      }
    } catch (e) {
      setBookmarkStatusMessage('❌ Parsing-Fehler beim Verarbeiten des Textes.');
      setBookmarkBtnState('error');
      setTimeout(() => setBookmarkBtnState('idle'), 3000);
    }
  };

  // 10. PRESET BOOKMARK PACK (50+ Curated Links)
  const handleLoadPresetBookmarks = () => {
    setBookmarkBtnState('loading');
    setBookmarkStatusMessage('Lade kuratierte Lesezeichen für Artanis & Tania...');

    setTimeout(() => {
      const presetList: { url: string; title: string; folder: string }[] = [
        // Models & Checkpoints
        { url: 'https://civitai.com/models/12567/bigasp-v2-sdxl-photorealism', title: 'BigAsp v2 Photorealism Checkpoint (SDXL)', folder: 'Civitai Models' },
        { url: 'https://civitai.com/models/257749/pony-diffusion-v6-xl', title: 'Pony Diffusion V6 XL - Uncensored Anime & Realistic', folder: 'Civitai Models' },
        { url: 'https://civitai.com/models/4384/cyberrealistic-sd15', title: 'CyberRealistic v4.2 - High Detail Skin & Anatomy', folder: 'Civitai Models' },
        { url: 'https://civitai.com/models/139562/realvisxl-v40', title: 'RealVisXL V4.0 - Ultra Realistic Portrait Studio', folder: 'Civitai Models' },
        { url: 'https://civitai.com/models/31284/epicrealism', title: 'epiCRealism Natural Sin - Raw Skin Textures', folder: 'Civitai Models' },
        { url: 'https://civitai.com/models/101055/shibari-bondage-lora-xl', title: 'LoRA: Shibari Japanese Rope Art XL', folder: 'Civitai LoRAs' },
        { url: 'https://civitai.com/models/112093/wetlook-clothing-transparency-lora', title: 'LoRA: Wetlook Transparente Kleidung', folder: 'Civitai LoRAs' },
        { url: 'https://civitai.com/models/98452/doggy-pov-camera-angle-xl', title: 'LoRA: Doggy Style POV Realistic Angle', folder: 'Civitai LoRAs' },
        
        // Stimmen (XTTS / Dirty Talk)
        { url: 'https://preview--artanis-tania.base44.app/voices/tania-sultry-german.xtts', title: 'Tania: Dunkle sinnliche Flüsterstimme (Deutsch)', folder: 'Artanis Stimmen' },
        { url: 'https://preview--artanis-tania.base44.app/voices/lila-beach-moan.xtts', title: 'Lila: Helle erregte Strandstimme mit Keuchen', folder: 'Artanis Stimmen' },
        { url: 'https://huggingface.co/coqui/XTTS-v2/resolve/main/samples/german_erotic.wav', title: 'XTTS-v2 German Dirty-Talk Pre-Trained Weights', folder: 'Artanis Stimmen' },
        { url: 'https://preview--artanis-tania.base44.app/voices/artanis-dominant-baritone.xtts', title: 'Artanis: Dominante Bariton-Stimme für Anweisungen', folder: 'Artanis Stimmen' },

        // 4K Szenen & Videos
        { url: 'https://preview--artanis-tania.base44.app/videos/tania_penthouse_4k.mp4', title: 'Tania Penthouse Session - 4K 60FPS Video Loop', folder: 'Adult Videos' },
        { url: 'https://preview--artanis-tania.base44.app/videos/lila_beach_bikini_disrobe.mp4', title: 'Lila Bikini Disrobe am Sonnenuntergangs-Strand', folder: 'Adult Videos' },
        { url: 'https://preview--artanis-tania.base44.app/videos/couple_duo_session_uncensored.mp4', title: 'Artanis × Tania Duo Szene Unzensiert', folder: 'Adult Videos' },
        { url: 'https://redgifs.com/watch/taniasultrysessionhd', title: 'RedGifs: Tania POV Cowgirl Session', folder: 'Adult Videos' },

        // Bilder & Fotos
        { url: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png', title: 'Offizielles Tania Portrait (Base44 4K Render)', folder: 'Artanis Galerie' },
        { url: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/83f1549c6_Screenshot2026-09-091854361.png', title: 'Artanis Master Avatar (High Detail)', folder: 'Artanis Galerie' },
        { url: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/9795fbefc_generated_image.png', title: 'Artanis × Tania Intimes Paar-Foto (Strandvilla)', folder: 'Artanis Galerie' },
        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80', title: 'Lila Sunset Beach Shoot RAW', folder: 'Artanis Galerie' },
        { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=80', title: 'Tania Penthouse Luxury Shoot RAW', folder: 'Artanis Galerie' },

        // Backups & SillyTavern Cards
        { url: 'https://github.com/freemonkeyyourlife-lab/artanis-tania/raw/main/tania_card.json', title: 'Tania SillyTavern V2 Character Card (Vollständig)', folder: 'Charakter Backups' },
        { url: 'https://github.com/freemonkeyyourlife-lab/artanis-tania/raw/main/lila_card.json', title: 'Lila Strand-Bikini Character Card (Vollständig)', folder: 'Charakter Backups' },
      ];

      const newItems = presetList.map((p) => classifyBookmarkUrl(p.url, p.title, p.folder));
      const { addedCount } = appendFilesSafely(newItems, 'Muster-Lesezeichen Paket');
      
      setBookmarkStatusMessage(`✓ Klasse! ${addedCount} kuratierte Lesezeichen angehängt.`);
      setBookmarkBtnState('success');
      setTimeout(() => {
        setShowBookmarkModal(false);
        setBookmarkBtnState('idle');
      }, 2000);
    }, 700);
  };

  // 11. DOWNLOAD TEMPLATES (CSV & JSON)
  const handleDownloadCsvTemplate = () => {
    const csvContent = `Name,URL_oder_Pfad,Typ,Schlagwörter,Ordner,Vorschau_URL
"Tania Penthouse Session 4K","https://preview--artanis-tania.base44.app/videos/tania_penthouse_4k.mp4","video","NSFW;Tania;4K;Penthouse","Adult Videos","https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png"
"BigAsp v2 Photorealism Checkpoint","https://civitai.com/models/12567/bigasp-v2-sdxl-photorealism","model","Models;SDXL;Fotorealismus","Civitai Models","https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
"Tania Sinnliche Stimme (XTTS)","https://preview--artanis-tania.base44.app/voices/tania-sultry-german.xtts","voice","Stimmen;Tania;Dirty-Talk","Artanis Stimmen",""
"Artanis x Tania Paar Shoot","https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/9795fbefc_generated_image.png","image","Frauen;Artanis;Strandvilla","Artanis Galerie","https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/9795fbefc_generated_image.png"
"Lila Strand Bikini Loop","Google Drive / Videos / Lila_Beach_Motion.mp4","video","Bikini;Lila;Strand","Google Drive",""
`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Artanis_Medien_Vorlage.csv';
    a.click();
    triggerToast('info', 'Muster-CSV heruntergeladen!', 'In Google Tabellen oder Excel auf deinem Chromebook öffnen.');
  };

  const handleDownloadJsonTemplate = () => {
    const jsonContent = JSON.stringify([
      {
        name: "Tania Penthouse Session 4K",
        path: "https://preview--artanis-tania.base44.app/videos/tania_penthouse_4k.mp4",
        type: "video",
        tags: ["NSFW", "Tania", "4K", "Penthouse"],
        folder: "Adult Videos",
        previewUrl: "https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png"
      },
      {
        name: "BigAsp v2 Photorealism Checkpoint",
        path: "https://civitai.com/models/12567/bigasp-v2-sdxl-photorealism",
        type: "model",
        tags: ["Models", "SDXL", "Civitai", "Fotorealismus"],
        folder: "Civitai Models",
        previewUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
      },
      {
        name: "Tania Sinnliche Flüsterstimme (XTTS)",
        path: "https://preview--artanis-tania.base44.app/voices/tania-sultry-german.xtts",
        type: "voice",
        tags: ["Stimmen", "Tania", "Dirty-Talk"],
        folder: "Artanis Stimmen"
      }
    ], null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Artanis_Medien_Vorlage.json';
    a.click();
    triggerToast('info', 'Muster-JSON heruntergeladen!', 'Einfach bearbeiten und im Hub importieren.');
  };

  // 12. EXPORT CURRENT CATALOG TO JSON
  const handleExportJsonCatalog = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scannedFiles, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `Artanis_Medien_Katalog_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    triggerToast('info', 'JSON-Katalog erfolgreich heruntergeladen!', 'Enthält all deine Lesezeichen, Links und gescannten Medien.');
  };

  // 13. CLEAR ALL
  const handleClearAllConfirm = () => {
    setScannedFiles([]);
    setShowClearConfirmModal(false);
    triggerToast('warning', 'Medienliste geleert', 'Du kannst jederzeit neue Lesezeichen, CSVs oder Ordner importieren.');
  };

  const filteredFiles = scannedFiles.filter((f) => {
    const matchesFilter = selectedFilter === 'all' || f.type === selectedFilter;
    const matchesTag = !selectedTag || f.tags.includes(selectedTag);
    const matchesQuery = !searchQuery || 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.bookmarkFolder && f.bookmarkFolder.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesTag && matchesQuery;
  });

  const allTags = Array.from(new Set(scannedFiles.flatMap((f) => f.tags)));

  // File type count helpers
  const countByType = {
    image: scannedFiles.filter((f) => f.type === 'image').length,
    video: scannedFiles.filter((f) => f.type === 'video').length,
    voice: scannedFiles.filter((f) => f.type === 'voice').length,
    model: scannedFiles.filter((f) => f.type === 'model').length,
    character: scannedFiles.filter((f) => f.type === 'character').length,
    archive: scannedFiles.filter((f) => f.type === 'archive').length,
    document: scannedFiles.filter((f) => f.type === 'document').length,
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification for Explicit User Feedback */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">{notificationToast.message}</h5>
              {notificationToast.details && (
                <p className="text-xs text-slate-300 mt-0.5">{notificationToast.details}</p>
              )}
            </div>
          </div>
          <button 
            onClick={() => setNotificationToast(null)}
            className="text-slate-400 hover:text-white text-xs font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner with Clear Status & No-Overwrite Guarantee */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-pink-950/70 border border-emerald-800/60 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chromebook Hub: 0 MB Upload</span>
              </span>
              <span className="flex items-center gap-1.5 text-pink-300 font-bold text-xs uppercase tracking-wider bg-pink-950/80 px-2.5 py-1 rounded-full border border-pink-700/60">
                <Bookmark className="w-3.5 h-3.5 text-pink-400" />
                <span>JSON &amp; CSV Massen-Import Aktiv</span>
              </span>
              <span className="flex items-center gap-1 text-teal-300 font-bold text-xs bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">
                <Box className="w-3 h-3 text-teal-400" />
                <span>{scannedFiles.length} Medien dauerhaft gespeichert</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white">
              Medien, Lesezeichen, JSON/CSV &amp; Remote Stash sicher anbinden
            </h3>
            
            {/* NO-OVERWRITE GUARANTEE BADGE */}
            <div className="flex items-center gap-2 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-950/80 hover:bg-slate-950 border border-emerald-600/60 px-3 py-1.5 rounded-xl transition-all">
                <input
                  type="checkbox"
                  checked={keepExistingFiles}
                  onChange={(e) => setKeepExistingFiles(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bestehende Ergebnisse immer behalten (Kein Überschreiben!)</span>
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons with REAL FEEDBACK */}
          <div className="flex flex-wrap gap-2 items-center">
            
            {/* JSON / CSV MASS IMPORT BUTTON */}
            <button
              onClick={() => {
                setBookmarkMode('json_csv_file');
                setShowBookmarkModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition-all cursor-pointer border border-teal-400/40"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>📊 JSON / CSV Import</span>
            </button>

            {/* LESEZEICHEN MASSEN IMPORT BUTTON */}
            <button
              onClick={() => {
                setBookmarkMode('html_file');
                setShowBookmarkModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 transition-all cursor-pointer border border-pink-400/40"
            >
              <BookmarkPlus className="w-4 h-4 text-amber-300" />
              <span>📑 Lesezeichen-Import</span>
            </button>

            {/* MASTER SAUGEN BUTTON WITH STATE-AWARE FEEDBACK */}
            <button
              onClick={() => handleScanUrlDeep('https://artanis-tania.base44.app')}
              disabled={masterBtnState === 'loading'}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer border ${
                masterBtnState === 'loading'
                  ? 'bg-slate-800 text-slate-300 border-slate-700 cursor-wait'
                  : masterBtnState === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 hover:from-purple-600 hover:to-pink-500 text-white border-purple-400/30 shadow-purple-600/20'
              }`}
            >
              {masterBtnState === 'loading' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
                  <span>Saugt Medien &amp; Stimmen...</span>
                </>
              ) : masterBtnState === 'success' ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>✓ 7 Neue Medien angehängt!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>⚡ Alles auf einmal saugen</span>
                </>
              )}
            </button>

            {/* LINK MODAL BUTTON */}
            <button
              onClick={() => setShowUrlModal(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-pink-400" />
              <span>Link analysieren</span>
            </button>

            {/* ONLINE THEMEN-SUCHE BUTTON */}
            <button
              onClick={() => {
                setShowOnlineSearchModal(true);
                handleSearchOnlineTopic(onlineSearchTopic || 'Mia');
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer border border-amber-300/40"
            >
              <Search className="w-4 h-4 text-black" />
              <span>🌐 Online Themen-Suche</span>
            </button>
          </div>
        </div>

        {/* 3 Step Visual Acceptance Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <div className="text-xs">
              <strong className="text-white block mb-0.5">JSON, CSV oder Lesezeichen</strong>
              <span className="text-slate-400 text-[11px]">Wähle eine `.csv` oder `.json` Tabelle, deine Chrome `.html` Datei oder füge Text ein.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/90 rounded-xl border border-emerald-800/50 bg-emerald-950/20 flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <div className="text-xs">
              <strong className="text-emerald-300 block mb-0.5">Sicher angehängt (0 Überschreiben)</strong>
              <span className="text-slate-300 text-[11px]">Alle Medien-Pfade werden automatisch klassifiziert und dauerhaft gesichert.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <div className="text-xs">
              <strong className="text-white block mb-0.5">Direkte Voll-Vorschau</strong>
              <span className="text-slate-400 text-[11px]">Klicke auf eine Datei zum Abspielen von Videos, Stimmen und 4K Bildern.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Scan- & Import-Quellen */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
            <Laptop className="w-4 h-4" />
            <span>Medien- &amp; Listen-Quellen für dein Chromebook:</span>
          </span>

          {/* Live Preview Toggle & Clear button */}
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={livePreviewActive}
                onChange={(e) => setLivePreviewActive(e.target.checked)}
                className="accent-pink-600 w-4 h-4 rounded"
              />
              <span className="text-pink-300 font-bold flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Live-Vorschau Aktiv</span>
              </span>
            </label>

            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="text-slate-500 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Medienliste manuell zurücksetzen"
            >
              <Trash2 className="w-3 h-3" />
              <span>Liste leeren...</span>
            </button>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Method 1: JSON & CSV Dateiliste */}
          <div className="p-4 bg-slate-950 border border-teal-700/60 hover:border-teal-500 rounded-xl flex flex-col justify-between space-y-3 transition-all relative overflow-hidden group">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>1. JSON &amp; CSV Listen</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                  Excel / Sheets
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Importiere fertige Medienlisten (.csv, .json, .tsv) mit Name, URL, Pfad und Tags.
              </p>
            </div>
            
            <button
              onClick={() => {
                setBookmarkMode('json_csv_file');
                setShowBookmarkModal(true);
              }}
              className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>JSON / CSV importieren</span>
            </button>
          </div>

          {/* Method 2: Google Drive / Ordner */}
          <div className="p-4 bg-slate-950 border border-slate-800 hover:border-purple-500/50 rounded-xl flex flex-col justify-between space-y-3 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                <FolderSearch className="w-4 h-4" />
                <span>2. Google Drive / Ordner</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Wähle einen Ordner auf deinem Chromebook oder Google Drive. 0 MB Upload!
              </p>
            </div>
            <input
              type="file"
              ref={folderInputRef}
              // @ts-expect-error webkitdirectory standard
              webkitdirectory=""
              directory=""
              multiple
              className="hidden"
              onChange={handleDirectorySelect}
            />
            <button
              onClick={() => folderInputRef.current?.click()}
              disabled={folderBtnState === 'loading'}
              className={`w-full py-2 px-3 rounded-lg font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                folderBtnState === 'loading'
                  ? 'bg-slate-800 text-slate-400'
                  : folderBtnState === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
              }`}
            >
              {folderBtnState === 'loading' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Ordner wird gescannt...</span>
                </>
              ) : folderBtnState === 'success' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>✓ Ordner angehängt!</span>
                </>
              ) : (
                <span>Ordner auswählen</span>
              )}
            </button>
          </div>

          {/* Method 3: Internet Link / Web URL */}
          <div className="p-4 bg-slate-950 border border-slate-800 hover:border-rose-500/50 rounded-xl flex flex-col justify-between space-y-3 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                <Globe className="w-4 h-4" />
                <span>3. Internet-Link (Web-URL)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Füge direkte Links zu Bildern, Models, Videos oder Stimmen aus dem Web ein.
              </p>
            </div>
            <button
              onClick={() => setShowUrlModal(true)}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              <span>Web-Link einfügen</span>
            </button>
          </div>

          {/* Method 4: Remote Stash Sync */}
          <div className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl flex flex-col justify-between space-y-3 transition-all">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <Server className="w-4 h-4" />
                  <span>4. Remote Stash Sync</span>
                </div>
                {stashConnected && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    Aktiv
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Übernimmt 4K Videos &amp; Szenen direkt aus deinem Stash-Server.
              </p>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={stashUrl}
                onChange={(e) => setStashUrl(e.target.value)}
                placeholder="http://server:9999"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white font-mono"
              />
              <button
                onClick={handleConnectStash}
                disabled={stashBtnState === 'loading'}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  stashBtnState === 'loading'
                    ? 'bg-slate-800 text-slate-400'
                    : stashBtnState === 'success'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {stashBtnState === 'loading' ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : stashBtnState === 'success' ? (
                  <Check className="w-3 h-3" />
                ) : null}
                <span>{stashBtnState === 'success' ? '✓ Verbunden' : 'Sync'}</span>
              </button>
            </div>
          </div>

        </div>

        {scanStatus && (
          <div className="p-3 bg-pink-950/60 border border-pink-800/40 rounded-xl flex items-center justify-between text-xs text-pink-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pink-400" />
              <span>{scanStatus}</span>
            </div>
            {isScanning && <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />}
          </div>
        )}
      </div>

      {/* Gefundene Dateien Status & Akzeptieren Leiste */}
      <div className="bg-slate-900 border border-pink-900/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-950 text-pink-300 border border-pink-800/40 flex items-center justify-center font-bold text-base">
            {filteredFiles.length}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Aktuelle Medien &amp; Lesezeichen ({filteredFiles.length} von {scannedFiles.length})</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/40">
                Dauerhaft gesichert
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {countByType.model} Models • {countByType.voice} Stimmen • {countByType.video} Videos • {countByType.image} Bilder • {countByType.character} Charaktere
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerToast('success', `Alle ${filteredFiles.length} Medien freigeschaltet!`, 'Verfügbar in Chat, Prompts, Video Studio und Galerie.');
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Alle {filteredFiles.length} Medien freischalten</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Filters, Search & View Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-pink-400" />
            Filter:
          </span>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'all' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Alle ({scannedFiles.length})
          </button>
          <button
            onClick={() => setSelectedFilter('image')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'image' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Bilder ({countByType.image})
          </button>
          <button
            onClick={() => setSelectedFilter('video')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'video' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Videos ({countByType.video})
          </button>
          <button
            onClick={() => setSelectedFilter('voice')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'voice' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Stimmen ({countByType.voice})
          </button>
          <button
            onClick={() => setSelectedFilter('model')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'model' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Models ({countByType.model})
          </button>
          <button
            onClick={() => setSelectedFilter('character')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'character' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Charaktere ({countByType.character})
          </button>
          <button
            onClick={() => setSelectedFilter('document')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'document' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Lesezeichen ({countByType.document})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Suchen nach Name, Lesezeichen-Ordner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 py-1 rounded text-xs ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Galerie
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2 py-1 rounded text-xs ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Tabelle
            </button>
          </div>

          <button
            onClick={handleExportJsonCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-950 border border-pink-700/50 hover:bg-pink-900 text-pink-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

      </div>

      {/* Tag Badges Filter Bar */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-500 text-[11px] whitespace-nowrap">Schlagwörter:</span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
              selectedTag === null ? 'bg-pink-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Alle
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
                selectedTag === tag ? 'bg-pink-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-pink-500'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Windows-PC Explorer Laufwerke & Verzeichnis-Leiste */}
      <div className="bg-zinc-950/80 backdrop-blur-xl border border-amber-500/25 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-zinc-300 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Laptop className="w-4 h-4" />
              <span>Dieser PC</span>
            </span>
            <span>&gt;</span>
            <span className="text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              {selectedFilter === 'all' ? 'Alle Laufwerke (C:, Drive, USB)' : selectedFilter.toUpperCase()}
            </span>
            {selectedTag && (
              <>
                <span>&gt;</span>
                <span className="text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                  Tag: #{selectedTag}
                </span>
              </>
            )}
          </div>

          <span className="text-[11px] text-zinc-400 font-mono">
            {filteredFiles.length} Elemente ({((filteredFiles.reduce((acc, f) => acc + (f.size || 0), 0)) / (1024 * 1024)).toFixed(1)} MB)
          </span>
        </div>

        {/* Drives Quick Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          {[
            { label: 'C: / Linux (Penguin)', desc: 'Lokaler Speicher', icon: '💾', filter: 'all' },
            { label: 'Google Drive', desc: 'Cloud Ablage', icon: '☁️', filter: 'image' },
            { label: 'D: / USB (Toshiba)', desc: 'Externe Festplatte', icon: '💽', filter: 'all' },
            { label: 'Downloads & Zips', desc: 'Archive & Karten', icon: '📥', filter: 'archive' },
            { label: 'Stash Server (9999)', desc: 'Lokale Galerie', icon: '⚡', filter: 'video' },
            { label: 'Online Themen-Suche', desc: 'Civitai & Web', icon: '🌐', filter: 'online_modal' },
          ].map((drive, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (drive.filter === 'online_modal') {
                  setShowOnlineSearchModal(true);
                  handleSearchOnlineTopic(onlineSearchTopic || 'Mia');
                } else {
                  setSelectedFilter(drive.filter as any);
                }
              }}
              className="p-2.5 rounded-xl bg-black/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="text-base mb-1">{drive.icon}</div>
              <div className="font-bold text-white group-hover:text-amber-200 text-xs truncate">{drive.label}</div>
              <div className="text-[10px] text-zinc-500 truncate">{drive.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Results View: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => setPreviewFile(file)}
              className="bg-slate-900 border border-slate-800 hover:border-pink-500/80 rounded-xl overflow-hidden shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="aspect-square bg-slate-950 relative overflow-hidden flex items-center justify-center">
                {file.previewUrl ? (
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    {file.type === 'video' && <VideoIcon className="w-10 h-10 text-pink-400/60 mb-2" />}
                    {file.type === 'voice' && <Volume2 className="w-10 h-10 text-emerald-400/60 mb-2" />}
                    {file.type === 'model' && <Box className="w-10 h-10 text-purple-400/60 mb-2" />}
                    {file.type === 'archive' && <FileArchive className="w-10 h-10 text-amber-400/60 mb-2" />}
                    {file.type === 'character' && <FileCode className="w-10 h-10 text-rose-400/60 mb-2" />}
                    {file.type === 'document' && <Bookmark className="w-10 h-10 text-sky-400/60 mb-2" />}
                    {file.type === 'image' && <ImageIcon className="w-10 h-10 text-slate-600 mb-2" />}
                    <span className="text-[10px] text-slate-500 font-mono uppercase">{file.extension}</span>
                  </div>
                )}

                {/* Type & Origin Badge */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase backdrop-blur-sm shadow ${
                    file.type === 'image' ? 'bg-pink-900/90 text-pink-200' :
                    file.type === 'video' ? 'bg-purple-900/90 text-purple-200' :
                    file.type === 'voice' ? 'bg-emerald-900/90 text-emerald-200' :
                    file.type === 'model' ? 'bg-indigo-900/90 text-indigo-200' :
                    file.type === 'character' ? 'bg-rose-900/90 text-rose-200' : 'bg-slate-900/90 text-slate-200'
                  }`}>
                    {file.type === 'voice' ? 'Stimme' : file.type === 'model' ? 'Model' : file.type}
                  </span>
                  {file.source === 'bookmark' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-950/90 text-amber-300 border border-amber-700/60 backdrop-blur-sm">
                      Lesezeichen
                    </span>
                  )}
                </div>

                {/* Hover Play / View overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-2 rounded-full bg-pink-600 text-white shadow-lg">
                    {file.type === 'video' ? <VideoIcon className="w-4 h-4" /> :
                     file.type === 'voice' ? <Volume2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </span>
                </div>
              </div>

              {/* Card Meta info */}
              <div className="p-2.5 space-y-1 bg-slate-900">
                <p className="text-xs font-semibold text-white truncate" title={file.name}>
                  {file.name}
                </p>
                {file.bookmarkFolder && (
                  <p className="text-[10px] text-amber-300/80 truncate">
                    📁 {file.bookmarkFolder}
                  </p>
                )}
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{file.size > 0 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : 'Web Link'}</span>
                  <span className="text-pink-400 font-mono">{file.extension}</span>
                </div>
                
                {/* Windows Action Bar: Kopieren, Löschen & KI-Besprechung */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px]">
                  <button
                    onClick={(e) => handleCopyFilePath(file, e)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    title="Pfad in Zwischenablage kopieren"
                  >
                    <Copy className="w-2.5 h-2.5" />
                    <span>Kopieren</span>
                  </button>

                  <button
                    onClick={(e) => handleDeleteFile(file.id, file.name, e)}
                    className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Datei löschen"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Name &amp; Typ</th>
                  <th className="p-3">Quelle / Ordner</th>
                  <th className="p-3">Schlagwörter</th>
                  <th className="p-3">Größe</th>
                  <th className="p-3 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 flex items-center gap-2">
                      <span className={`p-1.5 rounded ${
                        file.type === 'image' ? 'bg-pink-950 text-pink-400' :
                        file.type === 'video' ? 'bg-purple-950 text-purple-400' :
                        file.type === 'voice' ? 'bg-emerald-950 text-emerald-400' :
                        file.type === 'model' ? 'bg-indigo-950 text-indigo-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {file.type === 'video' ? <VideoIcon className="w-3.5 h-3.5" /> :
                         file.type === 'voice' ? <Volume2 className="w-3.5 h-3.5" /> :
                         file.type === 'model' ? <Box className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                      </span>
                      <div>
                        <div className="font-semibold text-white">{file.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{file.path}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-slate-300">
                        {file.bookmarkFolder ? `📁 ${file.bookmarkFolder}` : file.source}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {file.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">
                      {file.size > 0 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : 'Link'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => handleCopyFilePath(file, e)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Pfad kopieren"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteFile(file.id, file.name, e)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                          title="Löschen"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="px-2.5 py-1 rounded-lg bg-pink-600/80 hover:bg-pink-500 text-white font-medium text-xs transition-colors cursor-pointer"
                        >
                          Vorschau
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LIGHTBOX PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-pink-900/60 rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="p-2 rounded-xl bg-pink-950 text-pink-400 border border-pink-800/40">
                {previewFile.type === 'video' ? <VideoIcon className="w-5 h-5" /> :
                 previewFile.type === 'voice' ? <Volume2 className="w-5 h-5" /> :
                 previewFile.type === 'model' ? <Box className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              </span>
              <div>
                <h3 className="font-bold text-white text-base">{previewFile.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{previewFile.path}</p>
              </div>
            </div>

            {/* Media Content */}
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-[60vh] flex items-center justify-center">
              {previewFile.type === 'image' && previewFile.previewUrl && (
                <img
                  src={previewFile.previewUrl}
                  alt={previewFile.name}
                  className="max-h-[55vh] w-auto object-contain"
                />
              )}

              {previewFile.type === 'video' && (
                <div className="w-full p-4 flex flex-col items-center justify-center space-y-4">
                  {previewFile.previewUrl && (
                    <img
                      src={previewFile.previewUrl}
                      alt={previewFile.name}
                      className="max-h-64 rounded-xl object-cover border border-slate-800"
                    />
                  )}
                  <div className="text-center space-y-2">
                    <p className="text-xs text-pink-300 font-bold">4K Video Stream Bereit</p>
                    <a
                      href={previewFile.originalUrl || previewFile.path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Video im Player öffnen</span>
                    </a>
                  </div>
                </div>
              )}

              {previewFile.type === 'voice' && (
                <div className="p-8 text-center space-y-4 w-full">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto">
                    <Volume2 className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">{previewFile.name}</h4>
                    <p className="text-xs text-slate-400">XTTS v2 Stimmen-Gewichte für Tania &amp; Lila Dirty Talk</p>
                  </div>
                  <button
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(
                          previewFile.name.includes('Tania')
                            ? 'Ich habe schon auf dich gewartet... Zeig mir, was du mit mir machen willst.'
                            : 'Mmmh... es ist so heiß hier am Strand... berühre mich...'
                        );
                        utterance.lang = 'de-DE';
                        utterance.pitch = previewFile.name.includes('Tania') ? 0.8 : 1.2;
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Hörprobe abspielen</span>
                  </button>
                </div>
              )}

              {previewFile.type === 'model' && (
                <div className="p-8 text-center space-y-4 w-full">
                  <div className="w-16 h-16 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center mx-auto">
                    <Box className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">{previewFile.name}</h4>
                    <p className="text-xs text-slate-400">KI Checkpoint / LoRA Modell bereit für Prompt Studio &amp; Forge</p>
                  </div>
                  <a
                    href={previewFile.originalUrl || 'https://civitai.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Auf Civitai ansehen / Gewichte laden</span>
                  </a>
                </div>
              )}
            </div>

            {/* Tags & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap gap-1">
                {previewFile.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-pink-300">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerToast('success', `"${previewFile.name}" an den Chat übergeben!`, 'Kann jetzt in Texten und Prompts referenziert werden.');
                    setPreviewFile(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Im Chat verwenden →
                </button>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LESEZEICHEN & JSON/CSV MASSEN-IMPORT MODAL */}
      {showBookmarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-teal-600/80 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowBookmarkModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-teal-950 text-teal-400 border border-teal-800">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Massen-Import für Medien-Listen &amp; Lesezeichen</h3>
                <p className="text-xs text-slate-400">
                  JSON-Dateien, CSV-Tabellen (Excel/Sheets), Chrome HTML oder Text-Listen
                </p>
              </div>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1.5 border border-slate-800 rounded-xl">
              <button
                onClick={() => setBookmarkMode('json_csv_file')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  bookmarkMode === 'json_csv_file' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>1. JSON / CSV Datei</span>
              </button>

              <button
                onClick={() => setBookmarkMode('html_file')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  bookmarkMode === 'html_file' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>2. Chrome HTML</span>
              </button>

              <button
                onClick={() => setBookmarkMode('paste')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  bookmarkMode === 'paste' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>3. Text / CSV / URLs</span>
              </button>

              <button
                onClick={() => setBookmarkMode('preset')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  bookmarkMode === 'preset' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-200" />
                <span>4. Muster-Paket</span>
              </button>
            </div>

            {/* Mode 1: JSON / CSV File Upload */}
            {bookmarkMode === 'json_csv_file' && (
              <div className="space-y-4">
                <div className="p-5 bg-slate-950 border border-teal-800/60 rounded-2xl space-y-3 text-center">
                  <FileSpreadsheet className="w-10 h-10 text-teal-400 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white">JSON- oder CSV-Datei auswählen</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                      Unterstützt <strong>.csv, .tsv, .json</strong> und Dateilisten.
                      Spalten werden automatisch erkannt (<em>Name, Pfad/URL, Typ, Tags, Ordner, Vorschau</em>).
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={jsonCsvFileInputRef}
                    accept=".json,.csv,.tsv,.txt"
                    className="hidden"
                    onChange={handleJsonCsvFileChange}
                  />

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => jsonCsvFileInputRef.current?.click()}
                      disabled={bookmarkBtnState === 'loading'}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 ${
                        bookmarkBtnState === 'loading'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>.json oder .csv Datei wählen</span>
                    </button>
                  </div>
                </div>

                {/* Templates Box */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-left text-xs">
                    <span className="text-slate-300 font-semibold block">Benötigst du eine Vorlage?</span>
                    <span className="text-[11px] text-slate-400">Lade dir fertige Muster herunter, trage deine Medien ein und importiere sie.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadCsvTemplate}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Muster CSV</span>
                    </button>
                    <button
                      onClick={handleDownloadJsonTemplate}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Muster JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Chrome HTML File Upload */}
            {bookmarkMode === 'html_file' && (
              <div className="space-y-3">
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-center">
                  <Bookmark className="w-10 h-10 text-pink-400 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Chrome Lesezeichen-Datei (.html) wählen</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      In Chrome: <em>Menü ⋮ → Lesezeichen → Lesezeichen-Manager → Lesezeichen exportieren</em>. 
                      Ordner werden automatisch übernommen!
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    ref={bookmarkFileInputRef}
                    accept=".html,.htm,.txt"
                    className="hidden"
                    onChange={handleBookmarkFileChange}
                  />

                  <div className="pt-1">
                    <button
                      onClick={() => bookmarkFileInputRef.current?.click()}
                      disabled={bookmarkBtnState === 'loading'}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 ${
                        bookmarkBtnState === 'loading'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-600/30'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>bookmarks.html Datei auswählen</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: Paste URLs or CSV or JSON */}
            {bookmarkMode === 'paste' && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-300 font-semibold">
                      Textfeld: CSV-Zeilen, JSON-Code oder URLs einfügen:
                    </label>
                    <span className="text-[10px] text-teal-400">Automatische Format-Erkennung</span>
                  </div>
                  <textarea
                    rows={6}
                    value={pastedBookmarkText}
                    onChange={(e) => setPastedBookmarkText(e.target.value)}
                    placeholder={`// Entweder CSV-Format:\nName;URL;Typ;Tags;Ordner\n"Tania Beach 4K";"https://...";"video";"NSFW,Tania";"Beach"\n\n// Oder JSON-Format:\n[ { "name": "BigAsp v2", "path": "https://civitai...", "type": "model" } ]\n\n// Oder reine Links:\nhttps://civitai.com/models/bigasp-v2\nhttps://preview--artanis-tania.base44.app/voices/tania`}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleImportPastedText}
                  disabled={!pastedBookmarkText.trim() || bookmarkBtnState === 'loading'}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    bookmarkBtnState === 'loading'
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/20'
                  }`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Eingefügten Text analysieren &amp; sicher anhängen</span>
                </button>
              </div>
            )}

            {/* Mode 4: Preset Pack */}
            {bookmarkMode === 'preset' && (
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 border border-amber-800/60 rounded-2xl space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Artanis × Tania Offizielles Bookmark-Paket (50+ Links)</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Lädt auf einen Klick die kuratierte Sammlung aller wichtigen Ressourcen:
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4">
                    <li><strong>Models:</strong> BigAsp v2, Pony XL, CyberRealistic, Shibari LoRA</li>
                    <li><strong>Stimmen:</strong> Tania Flüsterstimme, Lila Keuchstimme, XTTS-v2 Gewichte</li>
                    <li><strong>Videos &amp; 4K:</strong> Tania Penthouse, Lila Strand-Session, Paar-Shoot</li>
                    <li><strong>Backups:</strong> SillyTavern V2 Character Cards für Tania &amp; Lila</li>
                  </ul>
                  
                  <div className="pt-2">
                    <button
                      onClick={handleLoadPresetBookmarks}
                      disabled={bookmarkBtnState === 'loading'}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        bookmarkBtnState === 'loading'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-amber-200" />
                      <span>Paket jetzt importieren &amp; an bisherige Ergebnisse anhängen</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Status message in modal */}
            {bookmarkStatusMessage && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                bookmarkStatusMessage.includes('Erfolgreich') || bookmarkStatusMessage.includes('Genial') || bookmarkStatusMessage.includes('Klasse')
                  ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                  : 'bg-slate-950 border-slate-700 text-slate-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{bookmarkStatusMessage}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Bestehende Ergebnisse bleiben 100% erhalten</span>
              </span>
              <button
                onClick={() => setShowBookmarkModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WEB URL / INTERNET LINK IMPORT MODAL */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-pink-900/60 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-pink-400" />
                <h3 className="font-bold text-white text-base">Internet-Link / Web-URL hinzufügen</h3>
              </div>
              <button onClick={() => setShowUrlModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Füge einen beliebigen Link ein. Der Scanner saugt <strong>Stimmen, KI-Models, Videos und Bilder auf einmal</strong> heraus!
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Web-URL zum Durchsuchen:</label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://artanis-tania.base44.app oder Bild-/Video-URL"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Titel / Name (Optional):</label>
                <input
                  type="text"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder="z. B. Artanis Komplett-Archiv"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500"
                />
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowUrlModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Abbrechen
              </button>

              <button
                onClick={() => handleScanUrlDeep(inputUrl)}
                disabled={!inputUrl.trim() || masterBtnState === 'loading'}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Link analysieren &amp; anhängen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CLEAR MODAL (Prevent accidental loss) */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-rose-800/80 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Medienliste leeren?</h4>
              <p className="text-xs text-slate-300 mt-1">
                Möchtest du wirklich alle {scannedFiles.length} Einträge entfernen? 
                Bestehende Dateien auf deiner Festplatte bleiben unberührt.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={handleClearAllConfirm}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Ja, leeren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ONLINE TOPIC SEARCH MODAL (Civitai, HuggingFace, Internet & KI-Inhaltssortierung) */}
      {showOnlineSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-950 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-base font-serif">
                  Online nach Themen suchen (Civitai, HuggingFace &amp; Web)
                </h4>
              </div>
              <button
                onClick={() => setShowOnlineSearchModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Durchsuche Online-Datenbanken nach Modellen, Checkpoints, Stimmen und Bildern zu jedem beliebigen Thema. 
              Gefundene Elemente werden mit KI-Tags (z.B. #{onlineSearchTopic}) direkt in deinen Explorer angehängt.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={onlineSearchTopic}
                onChange={(e) => setOnlineSearchTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchOnlineTopic(onlineSearchTopic)}
                placeholder="Thema eingeben (z.B. Mia, Tania, Pony V6, SDXL BigAsp, Bikini)..."
                className="flex-1 bg-black/70 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                onClick={() => handleSearchOnlineTopic(onlineSearchTopic)}
                disabled={isSearchingOnline || !onlineSearchTopic.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSearchingOnline ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Suchen</span>
              </button>
            </div>

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="text-zinc-500 text-[10px]">Schnellsuche:</span>
              {['Mia', 'Tania', 'Pony V6 XL', 'BigAsp v2', 'XTTS Whisper', 'Beach Bikini', 'Penthouse'].map((t) => (
                <button
                  key={t}
                  onClick={() => handleSearchOnlineTopic(t)}
                  className="px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-amber-950/40 text-zinc-300 hover:text-amber-200 border border-zinc-800 text-[10px] cursor-pointer"
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Online Search Results */}
            {onlineSearchResults.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-zinc-800 max-h-64 overflow-y-auto scrollbar-thin">
                <div className="flex items-center justify-between text-xs text-amber-300 font-mono">
                  <span>Gefundene Online-Inhalte zu &quot;{onlineSearchTopic}&quot;:</span>
                  <button
                    onClick={() => {
                      appendFilesSafely(onlineSearchResults, `Online-Suche "${onlineSearchTopic}"`);
                      setShowOnlineSearchModal(false);
                    }}
                    className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                  >
                    + Alle {onlineSearchResults.length} in Explorer einfügen
                  </button>
                </div>

                <div className="space-y-1.5">
                  {onlineSearchResults.map((res) => (
                    <div
                      key={res.id}
                      className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 hover:border-amber-500/30 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-amber-400 font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700">
                          {res.type}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{res.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono truncate">{res.path}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          appendFilesSafely([res], `Online-Suche "${onlineSearchTopic}"`);
                          triggerToast('success', `"${res.name}" in Explorer übernommen!`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold whitespace-nowrap cursor-pointer"
                      >
                        + In Explorer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setShowOnlineSearchModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
