import React, { useState, useRef } from 'react';
import { ScannedFile } from '../types';
import { 
  FolderSearch, 
  FileArchive, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  HardDrive, 
  Download, 
  Filter, 
  Search, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Tag,
  AlertCircle,
  FileCode2,
  Eye,
  RefreshCw
} from 'lucide-react';
import JSZip from 'jszip';
import { generatePythonDriveScanner, generateWindowsBatchScanner } from '../utils/scannerScript';

interface ScannerTabProps {
  scannedFiles: ScannedFile[];
  setScannedFiles: React.Dispatch<React.SetStateAction<ScannedFile[]>>;
}

export const ScannerTab: React.FC<ScannerTabProps> = ({
  scannedFiles,
  setScannedFiles,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'image' | 'video' | 'archive' | 'character'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [previewFile, setPreviewFile] = useState<ScannedFile | null>(null);

  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  // Auto-tagging keywords
  const tagKeywords: Record<string, string[]> = {
    'Frauen': ['frau', 'girl', 'woman', 'female', 'model', 'lila', 'tania'],
    'Bikini': ['bikini', 'swim', 'beach', 'strand', 'micro'],
    'NSFW': ['sex', 'porno', 'nsfw', 'xxx', 'nude', 'explicit', 'adult'],
    'Posen': ['doggy', 'cowgirl', 'kneeling', 'pov', 'pose'],
    'Backups': ['backup', 'artanis', 'tavern', 'chara', 'character', 'json'],
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

  // 1. Scan via HTML5 Webkit Directory (Browser Native)
  const handleDirectorySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsScanning(true);
    setScanStatus(`Durchsuche ${files.length} Dateien...`);

    const newFindings: ScannedFile[] = [];

    for (let i = 0; i < files.length; i++) {
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
      } else {
        continue; // Non-media skipped
      }

      const tags = detectTags(file.name, path);

      // Create preview url for smaller images
      let previewUrl: string | undefined = undefined;
      if (fileType === 'image' && file.size < 5 * 1024 * 1024) {
        previewUrl = URL.createObjectURL(file);
      }

      newFindings.push({
        id: `scanned-${Date.now()}-${i}`,
        name: file.name,
        path: path,
        size: file.size,
        type: fileType,
        extension: ext,
        tags,
        previewUrl,
        source: 'local_drive',
        dateModified: new Date(file.lastModified).toLocaleDateString('de-DE'),
      });
    }

    setScannedFiles((prev) => [...newFindings, ...prev]);
    setIsScanning(false);
    setScanStatus(`Fertig! ${newFindings.length} relevante Medien und Archive indiziert.`);
  };

  // 2. Scan ZIP Archives directly in browser using JSZip
  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsScanning(true);
    setScanStatus(`Lese ZIP-Archive ein...`);

    const newFindings: ScannedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const zipFile = files[i];
      try {
        const zip = await JSZip.loadAsync(zipFile);
        
        // Add the zip itself
        newFindings.push({
          id: `zip-${Date.now()}-${i}`,
          name: zipFile.name,
          path: zipFile.name,
          size: zipFile.size,
          type: 'archive',
          extension: '.zip',
          tags: ['ZIP-Archiv', ...detectTags(zipFile.name, '')],
          source: 'zip',
          dateModified: new Date().toLocaleDateString('de-DE'),
        });

        // Inspect contents
        const zipEntries = Object.keys(zip.files);
        for (const filename of zipEntries) {
          const entry = zip.files[filename];
          if (entry.dir) continue;

          const ext = `.${filename.split('.').pop()?.toLowerCase()}`;
          let fileType: ScannedFile['type'] = 'other';

          if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
            fileType = 'image';
          } else if (['.mp4', '.mkv', '.mov', '.avi'].includes(ext)) {
            fileType = 'video';
          } else if (['.json', '.tavern', '.chara'].includes(ext)) {
            fileType = 'character';
          } else {
            continue;
          }

          newFindings.push({
            id: `zip-item-${Date.now()}-${Math.random()}`,
            name: filename.split('/').pop() || filename,
            path: `${zipFile.name} ➔ ${filename}`,
            size: 0,
            type: fileType,
            extension: ext,
            tags: detectTags(filename, zipFile.name),
            source: 'zip',
            dateModified: 'Im Archiv',
          });
        }
      } catch (err) {
        console.error('Fehler beim Entpacken:', err);
      }
    }

    setScannedFiles((prev) => [...newFindings, ...prev]);
    setIsScanning(false);
    setScanStatus(`Fertig! ZIP-Inhalte analysiert (${newFindings.length} Dateien).`);
  };

  // 3. Download Standalone Python Script
  const handleDownloadPythonScanner = () => {
    const script = generatePythonDriveScanner();
    const blob = new Blob([script], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OmniForge_Festplatten_Scanner.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 4. Download Standalone Windows .bat Script
  const handleDownloadBatchScanner = () => {
    const script = generateWindowsBatchScanner();
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OmniForge_Schnell_Scanner.bat';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 5. Export Inhaltsverzeichnis (JSON)
  const handleExportJsonCatalog = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scannedFiles, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'OmniForge_Inhaltsverzeichnis.json';
    a.click();
  };

  // Filtering
  const filteredFiles = scannedFiles.filter((f) => {
    const matchesFilter = selectedFilter === 'all' || f.type === selectedFilter;
    const matchesTag = !selectedTag || f.tags.includes(selectedTag);
    const matchesQuery = !searchQuery || 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesTag && matchesQuery;
  });

  const allTags = Array.from(new Set(scannedFiles.flatMap((f) => f.tags)));

  return (
    <div className="space-y-6">
      {/* Hero Action Box for Scanning Drive & Photos */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950/40 to-slate-900 border border-pink-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-pink-900/50 border border-pink-700/50 text-pink-300 text-xs font-semibold">
              <HardDrive className="w-3.5 h-3.5 text-pink-400" />
              <span>Festplatten, Google Drive & ZIP-Finder</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Alle Festplatten, Fotos & Archive automatisch durchsuchen
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Finde verstreute Frauen-Fotos, Videos, Pornos, ZIPs und Charakter-Backups. 
              Du kannst Ordner direkt hier im Browser durchsuchen oder das 1-Klick Windows-Skript ausführen, das deine gesamten Laufwerke (C:, D:, E:) lokal indiziert.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Folder Scanner Input */}
            <input
              type="file"
              ref={folderInputRef}
              // @ts-expect-error webkitdirectory is standard in Chrome/Edge/Firefox
              webkitdirectory=""
              directory=""
              multiple
              className="hidden"
              onChange={handleDirectorySelect}
            />
            <button
              onClick={() => folderInputRef.current?.click()}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
            >
              <FolderSearch className="w-4 h-4" />
              <span>Ordner / Festplatte scannen</span>
            </button>

            {/* ZIP Scanner Input */}
            <input
              type="file"
              ref={zipInputRef}
              accept=".zip,.rar,.7z"
              multiple
              className="hidden"
              onChange={handleZipUpload}
            />
            <button
              onClick={() => zipInputRef.current?.click()}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              <FileArchive className="w-4 h-4 text-purple-400" />
              <span>ZIP-Dateien scannen</span>
            </button>
          </div>
        </div>

        {/* Scan Status Feedback */}
        {scanStatus && (
          <div className="mt-4 p-3 bg-pink-950/60 border border-pink-800/40 rounded-xl flex items-center justify-between text-xs text-pink-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pink-400" />
              <span>{scanStatus}</span>
            </div>
            {isScanning && <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />}
          </div>
        )}
      </div>

      {/* 3 Ways to Scan Local Drives Card Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Method 1: Browser Native */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <FolderSearch className="w-4 h-4" />
              <span>Weg 1: Direkt im Browser</span>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">
              Browser-Ordnerauswahl
            </h3>
            <p className="text-xs text-slate-400 leading-normal mb-3">
              Klicke oben auf &quot;Ordner / Festplatte scannen&quot; und wähle deinen Foto-Ordner, Downloads oder eine externe Festplatte. 100% lokal ohne Upload ins Internet.
            </p>
          </div>
          <button
            onClick={() => folderInputRef.current?.click()}
            className="w-full text-xs font-medium py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-pink-300 border border-pink-900/30 transition-all text-center"
          >
            Ordner jetzt auswählen
          </button>
        </div>

        {/* Method 2: Standalone Windows Batch & Python */}
        <div className="bg-slate-900/80 border border-pink-900/40 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] bg-pink-950 text-pink-300 border border-pink-800/50 font-bold">
            Empfohlen
          </div>
          <div>
            <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <HardDrive className="w-4 h-4" />
              <span>Weg 2: Gesamte Festplatten (C:, D:, E:)</span>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">
              1-Klick Windows Scanner
            </h3>
            <p className="text-xs text-slate-400 leading-normal mb-3">
              Lade die Datei herunter und mache einen Doppelklick. Das Skript sucht alle Laufwerke rekursiv nach Medien ab und speichert ein HTML-Inhaltsverzeichnis auf deinem Desktop!
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadBatchScanner}
              className="flex-1 text-xs font-medium py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.bat (1-Klick)</span>
            </button>
            <button
              onClick={handleDownloadPythonScanner}
              className="flex-1 text-xs font-medium py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
              <span>.py (Python)</span>
            </button>
          </div>
        </div>

        {/* Method 3: Stash & Google Drive Guide */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Weg 3: Stash & Google Drive</span>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">
              Stash & Cloud Sync
            </h3>
            <p className="text-xs text-slate-400 leading-normal mb-3">
              Nutze Stash für automatische Gesichtserkennung und Scrapen von Metadaten. Für Google Drive: Exportiere Drive-Ordner als ZIP oder synchronisiere mit Google Drive Desktop.
            </p>
          </div>
          <a
            href="https://github.com/stashapp/stash"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-xs font-medium py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-900/30 transition-all flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Stash Guide öffnen</span>
          </a>
        </div>

      </div>

      {/* Control Bar: Filters, Search & View Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-pink-400" />
            Filter:
          </span>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Alle ({scannedFiles.length})
          </button>
          <button
            onClick={() => setSelectedFilter('image')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'image'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Bilder ({scannedFiles.filter(f => f.type === 'image').length})
          </button>
          <button
            onClick={() => setSelectedFilter('video')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'video'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Videos ({scannedFiles.filter(f => f.type === 'video').length})
          </button>
          <button
            onClick={() => setSelectedFilter('archive')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'archive'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ZIPs ({scannedFiles.filter(f => f.type === 'archive').length})
          </button>
          <button
            onClick={() => setSelectedFilter('character')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'character'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Charaktere ({scannedFiles.filter(f => f.type === 'character').length})
          </button>
        </div>

        {/* Search Input & Export */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Suchen nach Namen, Tag, Pfad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 py-1 rounded text-xs ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              title="Galerie-Ansicht"
            >
              Galerie
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2 py-1 rounded text-xs ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              title="Tabellen-Ansicht"
            >
              Tabelle
            </button>
          </div>

          <button
            onClick={handleExportJsonCatalog}
            title="Inhaltsverzeichnis exportieren"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-950 border border-pink-700/50 hover:bg-pink-900 text-pink-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
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
            Alle Tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                selectedTag === tag
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Tag className="w-2.5 h-2.5" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* Results Display */}
      {filteredFiles.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-pink-950/50 border border-pink-800/40 text-pink-400 flex items-center justify-center mx-auto">
            <FolderSearch className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-white">Keine Dateien in der aktuellen Auswahl</h3>
            <p className="text-xs text-slate-400">
              Klicke oben auf &quot;Ordner / Festplatte scannen&quot; oder ziehe deine ZIP-Archive hierher, um dein Inhaltsverzeichnis zu generieren.
            </p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Gallery View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => setPreviewFile(file)}
              className="group bg-slate-900 border border-slate-800 hover:border-pink-500/60 rounded-xl overflow-hidden shadow-md hover:shadow-pink-500/10 transition-all cursor-pointer flex flex-col"
            >
              {/* Media Thumbnail or Icon */}
              <div className="aspect-square bg-slate-950 relative overflow-hidden flex items-center justify-center">
                {file.previewUrl ? (
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : file.type === 'video' ? (
                  <div className="flex flex-col items-center gap-2 text-rose-400">
                    <VideoIcon className="w-10 h-10" />
                    <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800/40">
                      Video / Clip
                    </span>
                  </div>
                ) : file.type === 'archive' ? (
                  <div className="flex flex-col items-center gap-2 text-purple-400">
                    <FileArchive className="w-10 h-10" />
                    <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/40">
                      ZIP Archiv
                    </span>
                  </div>
                ) : file.type === 'character' ? (
                  <div className="flex flex-col items-center gap-2 text-amber-400">
                    <Sparkles className="w-10 h-10" />
                    <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/40">
                      Charakter Backup
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-pink-400">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-pink-950/80 border border-pink-800/40">
                      Foto
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="p-1 rounded-md bg-slate-900/80 text-pink-300 border border-pink-700/50 flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-pink-300 transition-colors" title={file.name}>
                    {file.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate" title={file.path}>
                    {file.path}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {file.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-900/50">
                      {t}
                    </span>
                  ))}
                  {file.size > 0 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono ml-auto">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Typ</th>
                  <th className="py-3 px-4">Dateiname</th>
                  <th className="py-3 px-4">Pfad / Ordner</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4">Größe</th>
                  <th className="py-3 px-4 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono uppercase text-[10px] text-pink-400">
                      {file.type}
                    </td>
                    <td className="py-3 px-4 font-medium text-white max-w-xs truncate" title={file.name}>
                      {file.name}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-sm truncate text-[11px]" title={file.path}>
                      {file.path}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {file.tags.map((t) => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800/40">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {file.size > 0 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="text-pink-400 hover:text-pink-300 text-xs font-medium underline"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-pink-900/50 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base truncate">{previewFile.name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {previewFile.previewUrl && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                <img src={previewFile.previewUrl} alt={previewFile.name} className="max-h-full object-contain" />
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Dateityp:</span>
                <span className="font-mono uppercase text-pink-400">{previewFile.type} ({previewFile.extension})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Dateigröße:</span>
                <span className="font-mono">{previewFile.size > 0 ? `${(previewFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Archiv-Inhalt'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Speicherort / Pfad:</span>
                <span className="font-mono text-[11px] text-right truncate max-w-[280px]" title={previewFile.path}>{previewFile.path}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-1">Erkannte Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {previewFile.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800/40 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
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
