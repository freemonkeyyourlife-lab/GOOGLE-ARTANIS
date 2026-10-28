import React, { useState, useEffect } from 'react';
import { TabType, ScannedFile, Character, StudioSettings } from './types';
import { INITIAL_CHARACTERS } from './data/mockCharacters';
import { Header } from './components/Header';
import { ChatTab } from './components/ChatTab';
import { CharacterStudioTab } from './components/CharacterStudioTab';
import { PromptStudioTab } from './components/PromptStudioTab';
import { MediaStudioTab } from './components/MediaStudioTab';
import { ChromebookExplorerTab } from './components/ChromebookExplorerTab';
import { VoicesStudioTab } from './components/VoicesStudioTab';
import { StoriesArchiveTab } from './components/StoriesArchiveTab';
import { CustomizerTab } from './components/CustomizerTab';
import { KinksMatrixModal } from './components/KinksMatrixModal';

const DEFAULT_SCANNED_FILES: ScannedFile[] = [
  {
    id: 'cb-1',
    name: 'Lila_Strand_Bikini_01.jpg',
    path: 'Google Drive / Meine Ablage / Fotos / Strand / Lila_Strand_Bikini_01.jpg',
    size: 4.8 * 1024 * 1024,
    type: 'image',
    extension: '.jpg',
    tags: ['Frauen', 'Bikini', 'Strand'],
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    source: 'google_drive',
    dateModified: '27.10.2026',
  },
  {
    id: 'cb-2',
    name: 'Artanis_Tania_Full_Backup.zip',
    path: 'Downloads / Artanis_Tania_Full_Backup.zip',
    size: 42.1 * 1024 * 1024,
    type: 'archive',
    extension: '.zip',
    tags: ['Backups', 'Artanis', 'ZIP-Archiv'],
    source: 'zip',
    dateModified: '24.10.2026',
  },
  {
    id: 'cb-3',
    name: 'Lila_Sunset_Motion_Clip.mp4',
    path: 'Google Drive / Videos / Lila_Sunset_Motion_Clip.mp4',
    size: 180.5 * 1024 * 1024,
    type: 'video',
    extension: '.mp4',
    tags: ['NSFW', 'Posen', 'Video'],
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    source: 'google_drive',
    dateModified: '20.10.2026',
  },
  {
    id: 'cb-4',
    name: 'Tania_Penthouse_Shoot_4K.jpg',
    path: 'Google Drive / Tania_Penthouse_Shoot_4K.jpg',
    size: 8.2 * 1024 * 1024,
    type: 'image',
    extension: '.jpg',
    tags: ['Frauen', 'NSFW', 'Posen'],
    previewUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    source: 'google_drive',
    dateModified: '25.10.2026',
  },
  {
    id: 'cb-5',
    name: 'Lila_Character_Card.json',
    path: 'Downloads / Backups / Lila_Character_Card.json',
    size: 0.1 * 1024 * 1024,
    type: 'character',
    extension: '.json',
    tags: ['Backups', 'Frauen'],
    source: 'chromebook_drive',
    dateModified: '26.10.2026',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [activeCharacterId, setActiveCharacterId] = useState<string>('lila');
  const [isKinksModalOpen, setIsKinksModalOpen] = useState(false);

  // Studio live customizer settings
  const [settings, setSettings] = useState<StudioSettings>({
    theme: 'artanis_neon',
    openRouterApiKey: '',
    remoteApiUrl: 'http://localhost:7860',
    autoGenerateMedia: true,
    mediaTypeDefault: 'image',
    censorshipFilter: 'uncensored_max',
    layoutDensity: 'comfortable',
  });

  // Persistent scannedFiles so Chromebook user never loses findings or bookmarks
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>(() => {
    try {
      const stored = localStorage.getItem('artanis_scanned_files_v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved scannedFiles', e);
    }
    return DEFAULT_SCANNED_FILES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('artanis_scanned_files_v3', JSON.stringify(scannedFiles));
    } catch (e) {
      console.warn('Could not persist scannedFiles', e);
    }
  }, [scannedFiles]);

  // Dynamic theme wrapper
  const themeClasses = {
    artanis_neon: 'selection:bg-pink-600',
    cyber_violet: 'selection:bg-purple-600',
    emerald_noir: 'selection:bg-emerald-600',
    midnight_gold: 'selection:bg-amber-600',
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans ${themeClasses[settings.theme] || 'selection:bg-pink-600'} selection:text-white`}>
      {/* Top Header with authentic Artanis × Tania branding */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenKinksModal={() => setIsKinksModalOpen(true)}
        scannedCount={scannedFiles.length}
        settings={settings}
      />

      {/* Main Artanis Modules */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 ${settings.layoutDensity === 'compact' ? 'py-4' : 'py-6'}`}>
        
        {/* Module 1: Chat Modul (Roleplay with In-Chat Images & Videos) */}
        {activeTab === 'chat' && (
          <ChatTab
            characters={characters}
            activeCharacterId={activeCharacterId}
            setActiveCharacterId={setActiveCharacterId}
          />
        )}

        {/* Module 2: Charakter Studio (Lila, Tania, Artanis & Backup Manager) */}
        {activeTab === 'characters' && (
          <CharacterStudioTab
            characters={characters}
            setCharacters={setCharacters}
            activeCharacterId={activeCharacterId}
            setActiveCharacterId={setActiveCharacterId}
          />
        )}

        {/* Module 3: Stimmen Studio (Voice Clones & Dirty Talk) */}
        {activeTab === 'voices' && (
          <VoicesStudioTab
            characters={characters}
            activeCharacterId={activeCharacterId}
          />
        )}

        {/* Module 4: Prompt Studio (Visual Prompt Matrix & Kinks) */}
        {activeTab === 'prompts' && (
          <PromptStudioTab
            characters={characters}
            activeCharacterId={activeCharacterId}
          />
        )}

        {/* Module 5: Media & Video Studio (Image-to-Video, SVD, FaceFusion) */}
        {activeTab === 'media_studio' && (
          <MediaStudioTab
            characters={characters}
            activeCharacterId={activeCharacterId}
          />
        )}

        {/* Module 6: Storys & Sessions Archive */}
        {activeTab === 'stories' && <StoriesArchiveTab />}

        {/* Module 7: Dateien & Drive (Chromebook & Google Drive Explorer) */}
        {activeTab === 'explorer' && (
          <ChromebookExplorerTab
            scannedFiles={scannedFiles}
            setScannedFiles={setScannedFiles}
          />
        )}

        {/* Module 8: Daran basteln (Live Studio Customizer) */}
        {activeTab === 'customizer' && (
          <CustomizerTab
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </main>

      {/* Clarification & Kinks Matrix Modal */}
      <KinksMatrixModal
        isOpen={isKinksModalOpen}
        onClose={() => setIsKinksModalOpen(false)}
        onNavigateToTab={(tab) => {
          setIsKinksModalOpen(false);
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
