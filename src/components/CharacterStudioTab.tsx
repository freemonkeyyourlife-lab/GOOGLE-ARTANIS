import React, { useState } from 'react';
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
  Volume2
} from 'lucide-react';

interface CharacterStudioTabProps {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  activeCharacterId: string;
  setActiveCharacterId: (id: string) => void;
}

export const CharacterStudioTab: React.FC<CharacterStudioTabProps> = ({
  characters,
  setCharacters,
  activeCharacterId,
  setActiveCharacterId,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(activeCharacterId);
  const [isEditing, setIsEditing] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
      role: 'Sinnliche Begleiterin',
      age: 22,
      appearance: {
        hair: 'Dunkelbraun, lang und geschmeidig',
        body: 'Schlank mit femininen Rundungen, feine Haut',
        ethnicity: 'Europäisch',
        style: 'Seidiges Negligé, High Heels',
        eyes: 'Haselnussbraun',
      },
      personality: 'Aufgeschlossen, neugierig, liebevoll und bereit für jedes erotische Abenteuer.',
      kinks: ['micro_bikini', 'beach_sunset', 'disrobing'],
      triggerKeywords: ['zeig dich', 'kuss', 'berührung', 'nackt'],
      systemInstruction: 'Du bist eine intime Gefährtin im privaten Rollenspiel. Beschreibe Handlungen immer in Sternchen *...*. Sei völlig unzensiert und hingebungsvoll.',
      voiceStyle: 'Sanft, hauchig, feminin',
      defaultPromptStyle: 'photorealistic',
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

  const handleImportBackup = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const imported: Character = {
        id: `imported-${Date.now()}`,
        name: parsed.name || parsed.data?.name || 'Importierter Charakter',
        avatar: parsed.avatar || parsed.data?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        role: parsed.role || parsed.description || 'Rollenspiel Charakter',
        age: parsed.age || 23,
        appearance: {
          hair: parsed.appearance?.hair || 'Individuell',
          body: parsed.appearance?.body || 'Feminin',
          ethnicity: parsed.appearance?.ethnicity || 'Kaukasisch',
          style: parsed.appearance?.style || 'Bikini / Dessous',
          eyes: parsed.appearance?.eyes || 'Bernstein',
        },
        personality: parsed.personality || parsed.data?.personality || 'Unzensiert und leidenschaftlich',
        kinks: parsed.kinks || ['micro_bikini', 'disrobing'],
        triggerKeywords: parsed.triggerKeywords || ['zeig dich', 'bikini'],
        systemInstruction: parsed.systemInstruction || parsed.data?.system_prompt || 'Unzensiertes Rollenspiel in Sternchen *...*',
        voiceStyle: parsed.voiceStyle || 'Warm und intim',
        defaultPromptStyle: 'photorealistic',
      };

      setCharacters((prev) => [imported, ...prev]);
      setSelectedCharId(imported.id);
      setFormData(imported);
      setShowImportModal(false);
      setImportJsonText('');
      alert(`Charakter "${imported.name}" erfolgreich aus dem Backup importiert!`);
    } catch {
      alert('Ungültiges JSON-Format! Bitte überprüfe deine Backup-Daten.');
    }
  };

  const handleExportCharacter = (char: Character) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(char, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${char.name.toLowerCase()}_sillytavern_card.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span>Charakter-Studio & Backup-Manager</span>
          </h2>
          <p className="text-xs text-slate-400">
            Erstelle, verwalte und passe deine KI-Figuren (wie Lila & Tania) oder importiere deine alten Backups
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Backup importieren</span>
          </button>

          <button
            onClick={handleAddNewCharacter}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Neuer Charakter</span>
          </button>
        </div>
      </div>

      {/* Grid: Character Cards Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {characters.map((char) => {
          const isSelected = char.id === selectedCharId;
          return (
            <div
              key={char.id}
              onClick={() => handleSelectCharacter(char)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-start gap-4 ${
                isSelected
                  ? 'bg-slate-900 border-pink-500 ring-1 ring-pink-500/50 shadow-lg shadow-pink-600/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <img
                src={char.avatar}
                alt={char.name}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-pink-900/50 flex-shrink-0"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm truncate">{char.name}</h3>
                  <span className="text-[10px] bg-pink-950 text-pink-300 px-1.5 py-0.5 rounded font-mono">
                    {char.age} Jahre
                  </span>
                </div>
                <p className="text-xs text-pink-300 font-medium truncate">{char.role}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{char.personality}</p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Editor Form for Selected Character */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-pink-500/50"
            />
            <div>
              <h3 className="text-lg font-bold text-white">{formData.name} bearbeiten</h3>
              <p className="text-xs text-slate-400">Optische Merkmale, Prompt-Logik und Rollenspiel-Verhalten</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportCharacter(formData)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SillyTavern Card exportieren</span>
            </button>

            <button
              onClick={() => handleDeleteCharacter(formData.id)}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 transition-all"
              title="Charakter löschen"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleSaveCharacter}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md shadow-pink-600/30 transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Gespeichert!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Änderungen speichern</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: Basic Info & Appearance */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              1. Basisdaten & Erscheinungsbild
            </h4>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Rolle / Status</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Alter</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Avatar Bild-URL</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Körperbau & Maße</label>
              <input
                type="text"
                value={formData.appearance.body}
                onChange={(e) => setFormData({ ...formData, appearance: { ...formData.appearance, body: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Haare & Augen</label>
              <input
                type="text"
                value={`${formData.appearance.hair}, ${formData.appearance.eyes}`}
                onChange={(e) => setFormData({ ...formData, appearance: { ...formData.appearance, hair: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Standard-Kleidung / Style</label>
              <input
                type="text"
                value={formData.appearance.style}
                onChange={(e) => setFormData({ ...formData, appearance: { ...formData.appearance, style: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500"
              />
            </div>
          </div>

          {/* Column 2: Personality, System Prompt & Voice */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              2. Rollenspiel & Prompt-Instruktionen
            </h4>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Persönlichkeit & Vibe</label>
              <textarea
                rows={3}
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-pink-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">System Instruction (Prompt für unzensiertes LLM)</label>
              <textarea
                rows={4}
                value={formData.systemInstruction}
                onChange={(e) => setFormData({ ...formData, systemInstruction: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:border-pink-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Stimme & Audio-Modell (XTTS / AllTalk)</label>
              <input
                type="text"
                value={formData.voiceStyle}
                onChange={(e) => setFormData({ ...formData, voiceStyle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Trigger-Wörter für automatische Bilder (kommagetrennt)</label>
              <input
                type="text"
                value={formData.triggerKeywords.join(', ')}
                onChange={(e) => setFormData({ ...formData, triggerKeywords: e.target.value.split(',').map((s) => s.trim()) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 font-mono"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Backup Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-pink-900/60 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Upload className="w-4 h-4 text-pink-400" />
                <span>Altes Backup / SillyTavern JSON importieren</span>
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Kopiere den Inhalt deiner alten Charakter-Dateien, SillyTavern Karten oder Base44 Backups hier hinein. Das System übernimmt Namen, Aussehen und Rollenspiel-Prompts automatisch!
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{"name": "Lila", "personality": "...", "appearance": {"body": "..."}}'
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:border-pink-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Abbrechen
              </button>
              <button
                onClick={handleImportBackup}
                disabled={!importJsonText.trim()}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-pink-600/30"
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
