export type TabType = 
  | 'chat' 
  | 'generator' 
  | 'inspector' 
  | 'training' 
  | 'three3d' 
  | 'characters' 
  | 'voices' 
  | 'prompts' 
  | 'media_studio' 
  | 'stories' 
  | 'explorer' 
  | 'customizer'
  | 'knowledge'
  | 'exporter';

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

export interface GeneratedImageRecord {
  id: string;
  prompt: string;
  negativePrompt: string;
  characterId: string;
  characterName: string;
  style: 'portraet' | 'film' | 'comic_3d' | 'erotic_boudoir' | 'photorealism' | 'pony_anime' | 'render_3d' | 'cyberrealistic';
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  width: number;
  height: number;
  steps: number;
  cfgScale: number;
  seed: number;
  sampler: string;
  model: string;
  imageUrl: string;
  fileFormat: 'png' | 'webp' | 'jpg';
  createdAt: string;
  tags: string[];
  serverOrigin?: string;
  referenceImages?: string[];
  variantIndex?: number;
  totalVariants?: number;
}

export interface GeneratorConnectionConfig {
  serverType: 'google_api' | 'forge_a1111' | 'comfyui' | 'tailscale_remote' | 'cloud_gpu' | 'google_gpu_studio';
  endpointUrl: string; // e.g. http://100.82.14.90:7860 or http://localhost:7860
  apiToken: string;
  password?: string;
  googleApiKey?: string;
  connected: boolean;
  latencyMs?: number;
  activeModel?: string;
  availableModels: string[];
  connectionStatus: 'unverified' | 'connecting' | 'connected' | 'failed';
  lastError?: string;
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  gallery?: string[];
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
  voiceSettings?: {
    pitch: number;
    speed: number;
    breathiness: number;
    emotion: 'erotic_whisper' | 'dominant' | 'playful' | 'sensual';
    dirtyTalkLevel: number;
    sampleAudioUrl?: string;
    recordedAudioBlob?: string;
    sillyTavernVoiceId?: string;
  };
  defaultPromptStyle: 'photorealistic' | 'anime' | 'render3d' | 'portraet' | 'film' | 'comic_3d';
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
  theme: 'gold_obsidian' | 'silver_noir' | 'artanis_neon' | 'cyber_violet' | 'emerald_noir' | 'midnight_gold';
  openRouterApiKey: string;
  remoteApiUrl: string;
  sillyTavernApiUrl?: string;
  autoGenerateMedia: boolean;
  mediaTypeDefault: 'image' | 'video';
  censorshipFilter: 'uncensored_max' | 'balanced';
  layoutDensity: 'comfortable' | 'compact';
  generatorConfig?: GeneratorConnectionConfig;
}
