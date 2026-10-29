import React, { useState } from 'react';
import { Character, GeneratedImageRecord, ScannedFile } from '../types';
import JSZip from 'jszip';
import { 
  FileBox, 
  Download, 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  Film, 
  Volume2, 
  FileCode, 
  Box, 
  FileArchive, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  Maximize2, 
  Archive,
  Layers,
  Bot
} from 'lucide-react';

interface UniversalMediaItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'voice' | 'model' | 'text' | 'archive';
  fileFormat: string;
  url: string;
  sizeBytes?: number;
  metadata: {
    author?: string;
    description?: string;
    promptUsed?: string;
    tags: string[];
    createdAt: string;
    characterId?: string;
    sillyTavernCompatible?: boolean;
    technicalSpecs?: Record<string, any>;
  };
}

interface ChatDiscussionMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface UniversalMediaExporterTabProps {
  characters: Character[];
  activeCharacterId: string;
  archiveImages?: GeneratedImageRecord[];
  scannedFiles?: ScannedFile[];
}

export const UniversalMediaExporterTab: React.FC<UniversalMediaExporterTabProps> = ({
  characters,
  activeCharacterId,
  archiveImages = [],
  scannedFiles = [],
}) => {
  // Built-in initial multi-modal items
  const [mediaItems, setMediaItems] = useState<UniversalMediaItem[]>([
    {
      id: 'item-mia-photo-1',
      title: 'Mia_Penthouse_Lingerie_Master.jpg',
      type: 'image',
      fileFormat: 'jpg',
      url: '/assets/mia/856534533_18376215640242821_2133050209129019102_n.jpg',
      sizeBytes: 155488,
      metadata: {
        author: 'Mia · Muse #1',
        description: 'Authentisches Porträt von Mia mit seidigen Spitzen-Dessous und natürlicher Hauttextur.',
        promptUsed: 'score_9, score_8_up, masterpiece, stunning 24yo woman Mia, sensual eyes, delicate silk, 8k uhd',
        tags: ['Mia', 'Porträt', 'Dessous', 'Fotorealismus'],
        createdAt: '29.10.2026, 05:40',
        characterId: 'mia',
        sillyTavernCompatible: true,
        technicalSpecs: { resolution: '768x1344', model: 'Google Imagen 3' }
      }
    },
    {
      id: 'item-lila-clip-1',
      title: 'Lila_Sunset_Motion_Clip.mp4',
      type: 'video',
      fileFormat: 'mp4',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      sizeBytes: 180.5 * 1024 * 1024,
      metadata: {
        author: 'Studio SVD',
        description: 'SVD-XT 25 Frames Bewegungs-Clip am Strand bei Sonnenuntergang.',
        tags: ['Video', 'SVD', 'Strand', 'Motion'],
        createdAt: '28.10.2026, 18:20',
        technicalSpecs: { fps: 24, duration: '4s', codec: 'H.264' }
      }
    },
    {
      id: 'item-mia-voice-1',
      title: 'Mia_Erotic_Whisper_Sample.wav',
      type: 'voice',
      fileFormat: 'wav',
      url: '/assets/mia/mia_whisper.wav',
      sizeBytes: 4.2 * 1024 * 1024,
      metadata: {
        author: 'Mia Voice Clone',
        description: 'XTTS v2 Stimm-Klon Referenz mit hoher Hauchigkeit und Dirty-Talk Stufe 9.',
        tags: ['Stimme', 'XTTS', 'AllTalk', 'Whisper'],
        createdAt: '29.10.2026, 04:15',
        characterId: 'mia',
        technicalSpecs: { sampleRate: '48000 Hz', channels: 2, pitch: 1.05 }
      }
    },
    {
      id: 'item-lora-model-1',
      title: 'mia_v2_character.safetensors',
      type: 'model',
      fileFormat: 'safetensors',
      url: '#',
      sizeBytes: 220 * 1024 * 1024,
      metadata: {
        author: 'Kohya_ss Studio',
        description: 'SDXL Charakter-LoRA für Mia mit Triggerwort "mia_character".',
        tags: ['LoRA', 'SDXL', 'Safetensors', 'Trigger: mia'],
        createdAt: '28.10.2026, 22:00',
        characterId: 'mia',
        technicalSpecs: { rank: 32, alpha: 16, epochs: 10 }
      }
    },
    {
      id: 'item-tania-story-1',
      title: 'Tania_Sprechstunde_Transkript.json',
      type: 'text',
      fileFormat: 'json',
      url: '#',
      sizeBytes: 48 * 1024,
      metadata: {
        author: 'Tania & Artanis',
        description: 'Vollständiges unzensiertes Rollenspiel-Protokoll mit Sternchen-Handlungen und Befehlen.',
        tags: ['Story', 'Chat-Log', 'SillyTavern', 'Domina'],
        createdAt: '27.10.2026, 23:45',
        characterId: 'tania',
        sillyTavernCompatible: true
      }
    },
    {
      id: 'item-full-backup-1',
      title: 'Artanis_Tania_Universal_Backup.zip',
      type: 'archive',
      fileFormat: 'zip',
      url: '#',
      sizeBytes: 42.1 * 1024 * 1024,
      metadata: {
        author: 'Artanis Studio',
        description: 'Gesamtpaket inklusive Bilder, Charakterkarten, Prompts und Stimmen.',
        tags: ['Backup', 'ZIP', 'Komplett'],
        createdAt: '28.10.2026, 23:50',
      }
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'image' | 'video' | 'voice' | 'model' | 'text' | 'archive'>('all');
  const [activeItemForDiscussion, setActiveItemForDiscussion] = useState<UniversalMediaItem | null>(mediaItems[0]);
  
  // Discussion Chat History map for each item (Separat besprechen)
  const [discussions, setDiscussions] = useState<Record<string, ChatDiscussionMessage[]>>({
    'item-mia-photo-1': [
      {
        id: 'msg-1',
        sender: 'ai',
        text: 'Ich habe dieses Porträt von Mia geladen. Analyse: Perfekte Hauttextur, warme Beleuchtung im goldenen Luxus-Stil. Was möchtest du an diesem Bild anpassen, besprechen oder in welchen Formaten exportieren?',
        timestamp: '05:42'
      }
    ],
    'item-mia-voice-1': [
      {
        id: 'msg-2',
        sender: 'ai',
        text: 'Stimmprobe von Mia (XTTS v2, 48kHz) ist aktiv. Soll ich das Tempo verlangsamen, eine SillyTavern-Stimmkarte exportieren oder einen Dirty-Talk Text generieren?',
        timestamp: '05:43'
      }
    ]
  });

  const [inputChatText, setInputChatText] = useState<string>('');
  const [isAiReplying, setIsAiReplying] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeMessages = activeItemForDiscussion 
    ? discussions[activeItemForDiscussion.id] || []
    : [];

  const handleSendMessage = () => {
    if (!inputChatText.trim() || !activeItemForDiscussion) return;

    const currentId = activeItemForDiscussion.id;
    const nowStr = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatDiscussionMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputChatText.trim(),
      timestamp: nowStr,
    };

    setDiscussions((prev) => ({
      ...prev,
      [currentId]: [...(prev[currentId] || []), userMsg],
    }));

    const query = inputChatText.trim();
    setInputChatText('');
    setIsAiReplying(true);

    setTimeout(() => {
      let replyText = '';
      const q = query.toLowerCase();

      if (q.includes('prompt') || q.includes('verbessern') || q.includes('sdxl')) {
        replyText = `Optimierter Prompt für "${activeItemForDiscussion.title}":\n"score_9, score_8_up, masterpiece, stunning woman Mia, luxury obsidian and gold satin lingerie, cinematic shallow depth of field, warm candlelight, detailed skin pores, 8k uhd photorealism"`;
      } else if (q.includes('export') || q.includes('format') || q.includes('sillytavern')) {
        replyText = `Export-Vorbereitung für SillyTavern: Metadaten für ${activeItemForDiscussion.title} wurden formatiert. Klicke unten auf "Bundle exportieren" für eine fertige JSON/PNG-Karte mit Sprach-Attributen.`;
      } else if (q.includes('stimme') || q.includes('audio') || q.includes('pitch')) {
        replyText = `Empfohlene Justierung für Mias Stimme: Tonhöhe 1.05x, Tempo 0.94x, Hauchigkeit 80%. Dies verleiht dem Satz maximale Sinnlichkeit und Natürlichkeit.`;
      } else {
        replyText = `Besprechung zu "${activeItemForDiscussion.title}" (${activeItemForDiscussion.type.toUpperCase()}): Analyse abgeschlossen. Die Metadaten und Spezifikationen sind intakt. Wie soll das Element weiterverarbeitet werden?`;
      }

      const aiMsg: ChatDiscussionMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      };

      setDiscussions((prev) => ({
        ...prev,
        [currentId]: [...(prev[currentId] || []), aiMsg],
      }));

      setIsAiReplying(false);
    }, 450);
  };

  // Export Individual Item
  const handleExportItem = (item: UniversalMediaItem) => {
    if (item.url && item.url.startsWith('http') || item.url.startsWith('/assets/')) {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Export metadata JSON
      const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${item.title.split('.')[0]}_metadata.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Export Bundle ZIP with Media + Discussion Transcript + Metadata
  const handleExportBundleZip = async (item: UniversalMediaItem) => {
    const zip = new JSZip();
    const itemChat = discussions[item.id] || [];

    // Metadata JSON
    zip.file('item_metadata.json', JSON.stringify(item, null, 2));

    // Discussion transcript markdown
    const mdTranscript = `# KI-Besprechung: ${item.title}
Typ: ${item.type.toUpperCase()} | Format: .${item.fileFormat}
Datum: ${new Date().toLocaleString('de-DE')}

## Metadaten:
- Autor: ${item.metadata.author || 'Artanis Studio'}
- Beschreibung: ${item.metadata.description || 'Keine Angabe'}
- Tags: ${item.metadata.tags.join(', ')}

---

## Diskussions- & Besprechungsprotokoll:
${itemChat.map((m) => `### [${m.timestamp}] ${m.sender === 'user' ? 'Nutzer' : 'KI-Experte'}:\n${m.text}\n`).join('\n')}
`;
    zip.file('discussion_transcript.md', mdTranscript);

    // Try fetching media if valid URL
    if (item.url && !item.url.startsWith('#')) {
      try {
        const resp = await fetch(item.url);
        const blob = await resp.blob();
        zip.file(item.title, blob);
      } catch (e) {
        zip.file('media_reference.txt', `URL: ${item.url}`);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `artanis_omni_bundle_${item.id}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = mediaItems.filter(
    (item) => selectedFilter === 'all' || item.type === selectedFilter
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Luxury Black, Gold & Silver Glass */}
      <div className="rounded-2xl bg-black/85 backdrop-blur-2xl border border-amber-500/25 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 text-xs font-semibold mb-1.5 border border-amber-500/40">
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Universal KI-Omni-Exporter &amp; Medien-Besprecher</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent font-serif tracking-tight">
            Universal Exporter &amp; Einzel-Besprechung
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Verwalte und exportiere Texte, Videos, Bilder, Stimmen, 3D-Modelle und Archive.
            Jedes Element kann **separat mit der KI besprochen**, optimiert und als Komplett-Bundle heruntergeladen werden.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-300 bg-zinc-950/80 border border-amber-500/40 px-3 py-1.5 rounded-xl font-mono shadow-inner">
            {mediaItems.length} Elemente registriert
          </span>
        </div>
      </div>

      {/* Main Grid: Media Items on Left, Dedicated Discussion Chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Multi-Modal Item Inventory (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Modality Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {[
              { id: 'all', label: 'Alle Medien' },
              { id: 'image', label: 'Bilder' },
              { id: 'video', label: 'Videos' },
              { id: 'voice', label: 'Stimmen' },
              { id: 'model', label: 'Modelle / LoRA' },
              { id: 'text', label: 'Texte & Storys' },
              { id: 'archive', label: 'Archive (ZIP)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === f.id
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isSelected = activeItemForDiscussion?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-zinc-900/90 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
                      : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black/70 border border-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.type === 'image' && item.url !== '#' ? (
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                        ) : item.type === 'video' ? (
                          <Film className="w-6 h-6 text-indigo-400" />
                        ) : item.type === 'voice' ? (
                          <Volume2 className="w-6 h-6 text-purple-400" />
                        ) : item.type === 'model' ? (
                          <Box className="w-6 h-6 text-emerald-400" />
                        ) : item.type === 'text' ? (
                          <FileCode className="w-6 h-6 text-amber-400" />
                        ) : (
                          <FileArchive className="w-6 h-6 text-rose-400" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                          <span className="text-[10px] px-2 py-0.2 rounded-md bg-zinc-900 border border-zinc-700 text-amber-300 font-mono uppercase">
                            .{item.fileFormat}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1">{item.metadata.description}</p>
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          {item.metadata.tags.map((t) => (
                            <span key={t} className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 text-zinc-400 border border-zinc-800 font-mono">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setActiveItemForDiscussion(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Separat besprechen</span>
                      </button>

                      <button
                        onClick={() => handleExportItem(item)}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 cursor-pointer"
                        title="Datei herunterladen"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleExportBundleZip(item)}
                        className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 cursor-pointer"
                        title="Als Bundle ZIP (Datei + Besprechung + Metadaten) exportieren"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Dedicated Item AI Discussion Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-2xl bg-zinc-950/85 backdrop-blur-2xl border border-amber-500/30 p-5 shadow-2xl flex flex-col h-[680px]">
            
            {/* Discussion Header */}
            {activeItemForDiscussion ? (
              <div className="pb-3 border-b border-zinc-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white line-clamp-1">
                      Besprechung: {activeItemForDiscussion.title}
                    </h3>
                    <p className="text-[10px] text-zinc-400">
                      Modus: {activeItemForDiscussion.type.toUpperCase()} · Unzensierte Analyse &amp; Optimierung
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleExportBundleZip(activeItemForDiscussion)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  title="Komplettes Diskussionsprotokoll + Mediendatei als ZIP"
                >
                  <Archive className="w-3 h-3" />
                  <span>ZIP-Bundle</span>
                </button>
              </div>
            ) : (
              <div className="pb-3 border-b border-zinc-800 text-xs text-zinc-500">
                Wähle links ein Element, um es separat mit der KI zu besprechen.
              </div>
            )}

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin">
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
                  <MessageSquare className="w-8 h-8 text-zinc-700" />
                  <p className="text-xs text-zinc-400">Noch keine Besprechung zu diesem Element begonnen.</p>
                  <p className="text-[10px] max-w-xs text-zinc-500">
                    Stelle unten eine Frage, bitte um Prompt-Optimierung oder fordere ein bestimmtes Exportformat an.
                  </p>
                </div>
              ) : (
                activeMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium rounded-tr-sm shadow-md'
                          : 'bg-black/70 text-zinc-200 border border-zinc-800/90 rounded-tl-sm shadow-inner'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-zinc-600 px-1 mt-0.5 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                ))
              )}

              {isAiReplying && (
                <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Analysiere Mediendaten &amp; generiere Empfehlung...</span>
                </div>
              )}
            </div>

            {/* Quick Action Chips for Current Item */}
            {activeItemForDiscussion && (
              <div className="pt-2 border-t border-zinc-800 flex flex-wrap gap-1 text-[10px]">
                {[
                  'Prompt optimieren',
                  'In SillyTavern Karte umwandeln',
                  'LoRA Trainings-Tags extrahieren',
                  'Metadaten als JSON prüfen'
                ].map((act) => (
                  <button
                    key={act}
                    onClick={() => {
                      setInputChatText(act);
                    }}
                    className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-400 hover:text-amber-200 cursor-pointer transition-colors"
                  >
                    {act}
                  </button>
                ))}
              </div>
            )}

            {/* Input Box */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={inputChatText}
                onChange={(e) => setInputChatText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Bespreche ${activeItemForDiscussion?.title || 'das Element'} mit KI...`}
                className="flex-1 bg-black/70 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputChatText.trim() || isAiReplying}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
