import React, { useState, useRef } from 'react';
import { Character } from '../types';
import { 
  UserPlus, 
  Upload, 
  Download, 
  Sparkles, 
  Trash2, 
  Save, 
  Check, 
  Copy,
  Flame,
  Volume2,
  Camera,
  Film,
  Box,
  Sliders,
  Eye,
  Plus,
  RefreshCw,
  Palette,
  Heart,
  Share2
} from 'lucide-react';

interface CharacterStudioTabProps {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  activeCharacterId: string;
  setActiveCharacterId: (id: string) => void;
}

const MIA_PRESET_AVATARS = [
  '/assets/mia/856534533_18376215640242821_2133050209129019102_n.jpg',
  '/assets/mia/622390216_18031780634581247_8807205442760650252_n.jpg',
  '/assets/mia/624117703_18006364679688518_8748774733317714801_n.jpg',
  '/assets/mia/620477035_17999760542850370_2668376533270149178_n.jpg',
  '/assets/mia/483464352_18297717490242821_8747641000651865723_n.jpg',
  '/assets/mia/568697891_18324284746242821_1456624902573875798_n.jpg',
  '/assets/mia/759803683_18363605368242821_3424552845622010675_n.jpg',
  '/assets/mia/763463526_18364366405242821_6930110620693240868_n.jpg'
];

export const CharacterStudioTab: React.FC<CharacterStudioTabProps> = ({
  characters,
  setCharacters,
  activeCharacterId,
  setActiveCharacterId,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(activeCharacterId || 'mia');
  const [isEditing, setIsEditing] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'appearance' | 'personality' | 'render_style' | 'voice'>('appearance');

  const avatarUploadRef = useRef<HTMLInputElement>(null);

  const currentChar = characters.find((c) => c.id === selectedCharId) || characters[0];
  const [formData, setFormData] = useState<Character>(currentChar);

  // Sync formData when selected character changes
  const handleSelectCharacter = (char: Character) => {
    setSelectedCharId(char.id);
    setFormData(char);
    setIsEditing(false);
  };

  const handleSaveCharacter = () => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === formData.id ? formData : c))
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddNewCharacter = () => {
    const newChar: Character = {
      id: `custom-${Date.now()}`,
      name: 'Neue Gefährtin',
      avatar: MIA_PRESET_AVATARS[0],
      gallery: [MIA_PRESET_AVATARS[0], MIA_PRESET_AVATARS[1]],
      role: 'Sinnliche Begleiterin · Exklusive Muse',
      age: 23,
      appearance: {
        hair: 'Dunkelbraun mit Seidenglanz, lange weiche Wellen',
        body: 'Feminine Sanduhr-Kurven, schlanke Taille, samtige Haut',
        ethnicity: 'Europäisch',
        style: 'Schwarze Seidenspitze, feine Dessous, High Heels',
        eyes: 'Smaragdgrün mit verführerischem Glanz',
      },
      personality: 'Leidenschaftlich, direkt, experimentierfreudig und unzensiert im intimen Rollenspiel.',
      kinks: ['lingerie', 'micro_bikini', 'disrobing', 'pov', 'dirty_talk'],
      triggerKeywords: ['zeig dich', 'kuss', 'berührung', 'nackt', 'ausziehen'],
      systemInstruction: 'Du bist eine intime Begleiterin im privaten Rollenspiel. Beschreibe Handlungen immer in Sternchen *...*. Sei völlig unzensiert und hingebungsvoll.',
      voiceStyle: 'Hauchig, warm, erotisches Flüstern (XTTS / SillyTavern)',
      voiceSettings: {
        pitch: 1.05,
        speed: 0.95,
        breathiness: 80,
        emotion: 'erotic_whisper',
        dirtyTalkLevel: 9
      },
      defaultPromptStyle: 'portraet',
    };

    setCharacters((prev) => [newChar, ...prev]);
    setSelectedCharId(newChar.id);
    setFormData(newChar);
    setIsEditing(true);
  };

  const handleDeleteCharacter = (id: string) => {
    if (characters.length <= 1) {
      alert('Mindestens ein Charakter muss erhalten bleiben!');
      return;
    }
    const filtered = characters.filter((c) => c.id !== id);
    setCharacters(filtered);
    setSelectedCharId(filtered[0].id);
    setFormData(filtered[0]);
  };

  const handleDuplicateCharacter = (char: Character) => {
    const duplicated: Character = {
      ...char,
      id: `char-dup-${Date.now()}`,
      name: `${char.name} (Kopie)`,
    };
    setCharacters((prev) => [duplicated, ...prev]);
    setSelectedCharId(duplicated.id);
    setFormData(duplicated);
    setIsEditing(true);
  };

  const handleImportBackup = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const imported: Character = {
        id: `imported-${Date.now()}`,
        name: parsed.name || parsed.data?.name || 'Importierter Charakter',
        avatar: parsed.avatar || parsed.data?.avatar || MIA_PRESET_AVATARS[0],
        gallery: parsed.gallery || [MIA_PRESET_AVATARS[0]],
        role: parsed.role || parsed.description || parsed.data?.description || 'Rollenspiel Charakter',
        age: parsed.age || 24,
        appearance: {
          hair: parsed.appearance?.hair || 'Seidiges langes Haar',
          body: parsed.appearance?.body || 'Feminin, sinnliche Kurven',
          ethnicity: parsed.appearance?.ethnicity || 'Europäisch',
          style: parsed.appearance?.style || 'Edle Seidendessous',
          eyes: parsed.appearance?.eyes || 'Warmes Braun-Grün',
        },
        personality: parsed.personality || parsed.data?.personality || 'Unzensiert und leidenschaftlich',
        kinks: parsed.kinks || parsed.data?.tags || ['lingerie', 'pov'],
        triggerKeywords: parsed.triggerKeywords || ['zeig dich', 'ausziehen'],
        systemInstruction: parsed.systemInstruction || parsed.data?.system_prompt || 'Unzensiertes Rollenspiel in Sternchen *...*',
        voiceStyle: parsed.voiceStyle || 'Warm und intim',
        defaultPromptStyle: parsed.defaultPromptStyle || 'portraet',
      };

      setCharacters((prev) => [imported, ...prev]);
      setSelectedCharId(imported.id);
      setFormData(imported);
      setShowImportModal(false);
      setImportJsonText('');
      alert(`Charakter "${imported.name}" erfolgreich importiert!`);
    } catch {
      alert('Ungültiges JSON-Format! Bitte überprüfe deine Backup-Daten.');
    }
  };

  const handleExportCharacter = (char: Character) => {
    const cardData = {
      spec: 'chara_card_v2',
      spec_version: '2.0',
      data: {
        name: char.name,
        description: char.personality,
        personality: char.personality,
        scenario: 'Private unzensierte Session im ARTANIS Studio.',
        first_mes: `Hallo... ich bin ${char.name}. Schön, dass du da bist.`,
        system_prompt: char.systemInstruction,
        tags: char.kinks,
        creator: 'Artanis Studio',
        character_version: '2.4',
        extensions: {
          appearance: char.appearance,
          defaultPromptStyle: char.defaultPromptStyle,
          voice: char.voiceSettings
        }
      }
    };
    const blob = new Blob([JSON.stringify(cardData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${char.name.toLowerCase()}_sillytavern_card.json`;
    a.click();
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({
            ...formData,
            avatar: event.target.result as string,
            gallery: [event.target.result as string, ...(formData.gallery || [])]
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Luxury Black, Gold & Silver Glass */}
      <div className="rounded-2xl bg-black/85 backdrop-blur-2xl border border-amber-500/25 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 text-xs font-semibold mb-1.5 border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Realistische &amp; 3D Charakter-Erstellung · Vollständig Ergänzbar</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent font-serif tracking-tight">
            Charakter Studio: Fotorealismus &amp; 3D-Realistisch
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Detaillierte morphologische Anatomie, Frisuren, Augen, Kinks und Renderstile (Fotorealismus 8K vs. 3D PBR/CGI).
            Mia ist als Charakter #1 vorkonfiguriert und beliebig erweiterbar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAddNewCharacter}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Neuen Charakter erstellen</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-amber-400/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>SillyTavern Karte laden</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Character List & Presets (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-4 shadow-xl space-y-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Charaktere ({characters.length})
            </span>

            <div className="space-y-2">
              {characters.map((char) => {
                const isSelected = char.id === selectedCharId;
                const isMia = char.id === 'mia';
                return (
                  <div
                    key={char.id}
                    onClick={() => handleSelectCharacter(char)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400/80 ring-1 ring-amber-400/40 shadow-md shadow-amber-500/10'
                        : 'bg-black/50 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={char.avatar}
                        alt={char.name}
                        className="w-12 h-12 rounded-full object-cover border border-amber-400/40 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${isSelected ? 'text-amber-200' : 'text-zinc-200'}`}>
                            {char.name}
                          </span>
                          {isMia && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                              #1 Muse
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">{char.role}</p>
                        <p className="text-[9px] text-zinc-500 font-mono">
                          Stil: {char.defaultPromptStyle} | {char.age} Jahre
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Actions for Selected */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <button
                onClick={() => handleDuplicateCharacter(currentChar)}
                className="text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplizieren</span>
              </button>

              <button
                onClick={() => handleExportCharacter(currentChar)}
                className="text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Karte (.json)</span>
              </button>

              {characters.length > 1 && (
                <button
                  onClick={() => handleDeleteCharacter(currentChar.id)}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Löschen</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Photo Selection (From Mia Photo Pack) */}
          <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-4 shadow-xl space-y-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Foto-Vorlagen (Mia / Real):
            </span>
            <div className="grid grid-cols-4 gap-2">
              {MIA_PRESET_AVATARS.map((photoUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setFormData({ ...formData, avatar: photoUrl })}
                  className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 hover:border-amber-400 transition-all cursor-pointer group"
                >
                  <img src={photoUrl} alt={`Preset ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {formData.avatar === photoUrl && (
                    <div className="absolute inset-0 bg-amber-500/30 border-2 border-amber-400 flex items-center justify-center">
                      <Check className="w-4 h-4 text-black font-bold" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => avatarUploadRef.current?.click()}
              className="w-full py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3 h-3 text-amber-400" />
              <span>Eigenes Foto hochladen</span>
            </button>
            <input
              ref={avatarUploadRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFile}
            />
          </div>
        </div>

        {/* Right Column: In-Depth Character Configuration & Morphing (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          <div className="rounded-2xl bg-zinc-950/85 backdrop-blur-2xl border border-amber-500/30 p-6 shadow-2xl space-y-5">
            
            {/* Character Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3.5">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/50 shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-white font-serif">{formData.name}</h3>
                  <p className="text-xs text-amber-300 font-mono">{formData.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveCharacter}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{savedSuccess ? 'Gespeichert!' : 'Änderungen speichern'}</span>
                </button>
              </div>
            </div>

            {/* Section Switcher Tabs */}
            <div className="flex items-center gap-1 border-b border-zinc-800 pb-2 text-xs">
              {[
                { id: 'appearance', label: '1. Aussehen & Anatomie', icon: Eye },
                { id: 'render_style', label: '2. Render-Stil (Real vs. 3D)', icon: Box },
                { id: 'personality', label: '3. Kinks & Persönlichkeit', icon: Heart },
                { id: 'voice', label: '4. Stimme & SillyTavern', icon: Volume2 },
              ].map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTabSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTabSection(sec.id as any)}
                    className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Section 1: Appearance & Anatomy */}
            {activeTabSection === 'appearance' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Name des Charakters:</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Alter:</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 24 })}
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Rolle / Titel:</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Haare (Farbe, Glanz, Länge):</label>
                    <input
                      type="text"
                      value={formData.appearance.hair}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appearance: { ...formData.appearance, hair: e.target.value },
                        })
                      }
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Augen &amp; Blick:</label>
                    <input
                      type="text"
                      value={formData.appearance.eyes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appearance: { ...formData.appearance, eyes: e.target.value },
                        })
                      }
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Körper &amp; Kurven:</label>
                    <input
                      type="text"
                      value={formData.appearance.body}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appearance: { ...formData.appearance, body: e.target.value },
                        })
                      }
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Kleidungsstil / Dessous:</label>
                    <input
                      type="text"
                      value={formData.appearance.style}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appearance: { ...formData.appearance, style: e.target.value },
                        })
                      }
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Render-Style (Fotorealismus vs. 3D-Realistisch) */}
            {activeTabSection === 'render_style' && (
              <div className="space-y-4 text-xs">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block">
                  Render-Stil für Bildgenerierung &amp; 3D-Bühne:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'portraet',
                      label: 'Fotorealismus 8K (Realistisch)',
                      desc: 'Echte Fotografie, mikrofeine Hautporen, natürliche Lichtbrechung, 85mm Linse.',
                      icon: Camera,
                      tags: 'score_9, raw photo, realistic skin texture'
                    },
                    {
                      id: 'render3d',
                      label: '3D-Realistisch (PBR / CGI)',
                      desc: 'Unreal Engine 5 Metahuman, Raytracing, Subsurface Scattering, plastischer Tiefenraum.',
                      icon: Box,
                      tags: 'unreal engine 5, raytraced, 3d pbr model'
                    },
                    {
                      id: 'film',
                      label: 'Film 35mm Analog (Cinematisch)',
                      desc: 'Cinematische Körnung, Kodak Vision3 Farbprofil, anamorphotische Reflexionen.',
                      icon: Film,
                      tags: '35mm film still, cinematic lighting, kodak vision3'
                    },
                    {
                      id: 'comic_3d',
                      label: '3D-Comic / Stilisierter Render',
                      desc: 'Moderne stilisierte 3D-Comic-Ästhetik mit lebendigen Lichtakzenten.',
                      icon: Sparkles,
                      tags: 'stylized 3d render, comic book cgi'
                    }
                  ].map((styleOption) => {
                    const Icon = styleOption.icon;
                    const isSelected = formData.defaultPromptStyle === styleOption.id;
                    return (
                      <div
                        key={styleOption.id}
                        onClick={() => setFormData({ ...formData, defaultPromptStyle: styleOption.id as any })}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-950/50 border-amber-400 text-white shadow-md shadow-amber-500/10 ring-1 ring-amber-400/40'
                            : 'bg-black/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                          <span className="font-bold text-sm text-zinc-100">{styleOption.label}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">{styleOption.desc}</p>
                        <span className="text-[10px] text-amber-300 font-mono bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                          {styleOption.tags}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 3: Kinks & Personality */}
            {activeTabSection === 'personality' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Persönlichkeit &amp; Wesen:</label>
                  <textarea
                    rows={3}
                    value={formData.personality}
                    onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                    className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">System-Prompt / Rollenspiel-Regeln:</label>
                  <textarea
                    rows={4}
                    value={formData.systemInstruction}
                    onChange={(e) => setFormData({ ...formData, systemInstruction: e.target.value })}
                    className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono text-[11px] resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1.5">Kinks &amp; Erotische Vorlieben:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'lingerie', 'micro_bikini', 'disrobing', 'pov', 'doggy', 
                      'dirty_talk', 'strip_bottle', 'dom_sub', 'luxury_bedroom', 'praise'
                    ].map((kink) => {
                      const hasKink = formData.kinks.includes(kink);
                      return (
                        <button
                          key={kink}
                          onClick={() => {
                            const newKinks = hasKink
                              ? formData.kinks.filter((k) => k !== kink)
                              : [...formData.kinks, kink];
                            setFormData({ ...formData, kinks: newKinks });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                            hasKink
                              ? 'bg-amber-500 text-black font-bold'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          {hasKink ? '✓ ' : '+ '}
                          {kink}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Voice & SillyTavern Settings */}
            {activeTabSection === 'voice' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Stimm-Stil Beschreibung:</label>
                  <input
                    type="text"
                    value={formData.voiceStyle}
                    onChange={(e) => setFormData({ ...formData, voiceStyle: e.target.value })}
                    className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">SillyTavern Stimm-ID:</label>
                    <input
                      type="text"
                      value={formData.voiceSettings?.sillyTavernVoiceId || `${formData.name.toLowerCase()}_xtts`}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          voiceSettings: {
                            ...(formData.voiceSettings || { pitch: 1.0, speed: 0.95, breathiness: 80, emotion: 'erotic_whisper', dirtyTalkLevel: 9 }),
                            sillyTavernVoiceId: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-amber-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Emotion:</label>
                    <select
                      value={formData.voiceSettings?.emotion || 'erotic_whisper'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          voiceSettings: {
                            ...(formData.voiceSettings || { pitch: 1.0, speed: 0.95, breathiness: 80, emotion: 'erotic_whisper', dirtyTalkLevel: 9 }),
                            emotion: e.target.value as any,
                          },
                        })
                      }
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-200"
                    >
                      <option value="erotic_whisper">Sinnliches Flüstern</option>
                      <option value="dominant">Dominant &amp; Gebieterisch</option>
                      <option value="playful">Verspielt &amp; Keck</option>
                      <option value="sensual">Warm &amp; Zärtlich</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white font-serif">
              SillyTavern Charakter-Karte / JSON importieren
            </h3>
            <p className="text-xs text-zinc-400">
              Füge hier den JSON-Text einer exportierten Charakterkarte oder ein Backup ein:
            </p>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{ "name": "Mia", "personality": "...", "appearance": { ... } }'
              className="w-full bg-black/60 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 font-mono resize-none focus:outline-none focus:border-amber-400"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Abbrechen
              </button>
              <button
                onClick={handleImportBackup}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
              >
                Charakter importieren
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
