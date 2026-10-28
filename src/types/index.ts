export type TabType = 'chat' | 'characters' | 'voices' | 'prompts' | 'media_studio' | 'stories' | 'explorer' | 'customizer';

export interface ScannedFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: 'image' | 'video' | 'archive' | 'character' | 'document' | 'voice' | 'model' | 'other';
  extension: string;
  tags: string[];
  previewUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  modelUrl?: string;
  source: 'chromebook_drive' | 'google_drive' | 'zip' | 'local_folder' | 'local_drive' | 'bookmark' | 'internet';
  dateModified?: string;
  resolution?: string;
  bookmarkFolder?: string;
  originalUrl?: string;
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  role: string;
  age: number;
  appearance: {
    hair: string;
    body: string;
    ethnicity: string;
    style: string;
    eyes: string;
  };
  personality: string;
  kinks: string[];
  triggerKeywords: string[];
  systemInstruction: string;
  voiceStyle: string;
  defaultPromptStyle: 'photorealistic' | 'anime' | 'render3d';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'character' | 'system';
  characterId?: string;
  text: string;
  timestamp: string;
  generatedMedia?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    videoUrl?: string;
    promptUsed: string;
    model: string;
  };
}

export interface KinkCategory {
  category: string;
  description: string;
  items: {
    id: string;
    label: string;
    tags: string[];
    description: string;
    intensity: 'soft' | 'medium' | 'hard';
  }[];
}

export interface StudioSettings {
  theme: 'artanis_neon' | 'cyber_violet' | 'emerald_noir' | 'midnight_gold';
  openRouterApiKey: string;
  remoteApiUrl: string;
  autoGenerateMedia: boolean;
  mediaTypeDefault: 'image' | 'video';
  censorshipFilter: 'uncensored_max' | 'balanced';
  layoutDensity: 'comfortable' | 'compact';
}
