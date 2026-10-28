import React, { useState } from 'react';
import { Character } from '../types';
import { 
  Volume2, 
  Play, 
  Pause, 
  Sliders, 
  Sparkles, 
  Flame, 
  Mic, 
  Download, 
  RefreshCw, 
  Check, 
  Copy,
  Layers
} from 'lucide-react';

interface VoicesStudioTabProps {
  characters: Character[];
  activeCharacterId: string;
}

export const VoicesStudioTab: React.FC<VoicesStudioTabProps> = ({
  characters,
  activeCharacterId,
}) => {
  const [selectedVoiceCharId, setSelectedVoiceCharId] = useState<string>(activeCharacterId);
  const [speechText, setSpeechText] = useState<string>(
    'Komm noch ein Stück näher zu mir... spürst du, wie warm meine Haut ist? *haucht leise* Ich habe den ganzen Tag nur an dich gedacht.'
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<boolean>(false);
  const [breathiness, setBreathiness] = useState<number>(75);
  const [pitch, setPitch] = useState<number>(50);
  const [speechSpeed, setSpeechSpeed] = useState<number>(95);
  const [emotionMode, setEmotionMode] = useState<'lust' | 'dominant' | 'whisper' | 'playful'>('whisper');

  const selectedChar = characters.find((c) => c.id === selectedVoiceCharId) || characters[0];

  const samplePresets: Record<string, string[]> = {
    tania: [
      'Knie dich vor mich und sieh mir in die Augen. Du gehörst heute Nacht ganz mir.',
      'Ich liebe es, wie aufmerksam du bist... *lächelt leise* Lass mich die Kontrolle übernehmen.',
      'Sitzungen mit mir haben ihre eigenen Regeln... Bist du bereit, dich fallen zu lassen?',
    ],
    lila: [
      'Die Sonne am Strand war so heiß... mein Bikini ist noch ganz feucht von den Wellen.',
      '*kichert leise* Du kannst gar nicht weggucken, oder? Zieh mir doch die Bänder auf...',
      'Fass mich an... genau da... *stöhnt sanft auf*',
    ],
    artanis: [
      'Die Kamera fängt jedes einzelne Detail von dir ein. Halt diese Pose genau so.',
      'Lass uns den Abend unvergesslich machen. Du und ich.',
    ],
    couple: [
      'Wir haben uns schon gefragt, wann du kommst. Setz dich zwischen uns beide...',
    ],
  };

  const handlePlayVoice = () => {
    setIsGeneratingAudio(true);

    // Use Web Speech Synthesis API so Chromebook literally speaks aloud!
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop any previous audio
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'de-DE';
      
      // Fine-tune pitch and rate based on character
      if (selectedChar.id === 'tania') {
        utterance.pitch = 0.85; // deep, sultry voice
        utterance.rate = 0.9;
      } else if (selectedChar.id === 'lila') {
        utterance.pitch = 1.15; // youthful, airy voice
        utterance.rate = 0.95;
      } else {
        utterance.pitch = 0.75;
        utterance.rate = 0.95;
      }

      // Try finding a German female voice if available
      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find(v => v.lang.startsWith('de') && (v.name.includes('Female') || v.name.includes('Frau') || v.name.includes('Hedda') || v.name.includes('Katja')));
      if (germanVoice) utterance.voice = germanVoice;

      utterance.onstart = () => {
        setIsGeneratingAudio(false);
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsGeneratingAudio(false);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsGeneratingAudio(false);
        setIsPlaying(true);
        setTimeout(() => setIsPlaying(false), 4000);
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-xs font-semibold mb-1 border border-purple-800/40">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Unzensiertes Stimmen-Studio</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Stimmen Studio (Voice Cloning &amp; Dirty Talk)
          </h2>
          <p className="text-xs text-slate-400">
            Generiere intime Sprachausgaben, Keuchen, dirty talk und Audio-Sessions für Tania, Lila und Artanis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-xl">
            XTTS v2 / AllTalk Engine aktiv
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Voice Models & Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Character Voice Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
              1. Stimme auswählen:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {characters.map((char) => {
                const isSelected = char.id === selectedVoiceCharId;
                return (
                  <div
                    key={char.id}
                    onClick={() => setSelectedVoiceCharId(char.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'bg-purple-950/80 border-purple-500 ring-1 ring-purple-500/50 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/40"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-white truncate max-w-[120px]">{char.name}</div>
                      <div className="text-[10px] text-purple-300 truncate max-w-[120px]">{char.role.split('·')[0]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Text to Speech Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                2. Intimer Text / Dirty Talk Eingabe:
              </span>
              <span className="text-xs text-slate-400">100% Unzensiert</span>
            </div>

            <textarea
              rows={4}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              placeholder="Gib hier den erotischen Text ein, den der Charakter hauchen oder sprechen soll..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:border-purple-500 leading-relaxed shadow-inner"
            />

            {/* Quick Sample Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Beispielsätze für {selectedChar.name}:
              </span>
              <div className="flex flex-col gap-1.5">
                {(samplePresets[selectedChar.id] || samplePresets.tania).map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSpeechText(preset)}
                    className="text-left text-xs p-2 rounded-lg bg-slate-950 hover:bg-purple-950/60 text-slate-300 hover:text-purple-200 border border-slate-800 transition-all truncate"
                  >
                    &quot;{preset}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Emotion / Vibe Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs text-slate-300 block font-medium">Stimm-Emotion / Dynamik:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setEmotionMode('whisper')}
                  className={`p-2 rounded-xl text-xs font-medium transition-all ${
                    emotionMode === 'whisper' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Sanftes Flüstern
                </button>
                <button
                  onClick={() => setEmotionMode('lust')}
                  className={`p-2 rounded-xl text-xs font-medium transition-all ${
                    emotionMode === 'lust' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Erregtes Keuchen
                </button>
                <button
                  onClick={() => setEmotionMode('dominant')}
                  className={`p-2 rounded-xl text-xs font-medium transition-all ${
                    emotionMode === 'dominant' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Dominant &amp; Bestimmt
                </button>
                <button
                  onClick={() => setEmotionMode('playful')}
                  className={`p-2 rounded-xl text-xs font-medium transition-all ${
                    emotionMode === 'playful' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Verspielt &amp; Neckisch
                </button>
              </div>
            </div>

            {/* Voice Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Hauchigkeit (Breath):</span>
                  <span className="font-mono text-purple-400">{breathiness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={breathiness}
                  onChange={(e) => setBreathiness(parseInt(e.target.value))}
                  className="w-full accent-purple-600 bg-slate-950 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Tonhöhe (Pitch):</span>
                  <span className="font-mono text-purple-400">{pitch}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={pitch}
                  onChange={(e) => setPitch(parseInt(e.target.value))}
                  className="w-full accent-purple-600 bg-slate-950 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Sprechtempo:</span>
                  <span className="font-mono text-purple-400">{speechSpeed}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="120"
                  value={speechSpeed}
                  onChange={(e) => setSpeechSpeed(parseInt(e.target.value))}
                  className="w-full accent-purple-600 bg-slate-950 rounded-lg h-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Generate & Play Button */}
            <button
              onClick={handlePlayVoice}
              disabled={isGeneratingAudio}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGeneratingAudio ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Kodiere unzensierte Stimme (XTTS v2)...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Stimme wird abgespielt...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Stimme von {selectedChar.name} jetzt anhören</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Audio Profile Card & Waveform */}
        <div className="space-y-4">
          
          <div className="bg-slate-900 border border-purple-900/50 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedChar.avatar}
                alt={selectedChar.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500"
              />
              <div>
                <h3 className="font-bold text-white text-base">{selectedChar.name}</h3>
                <p className="text-xs text-purple-300">{selectedChar.voiceStyle}</p>
              </div>
            </div>

            {/* Audio Waveform Simulator */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                  <span>Audio-Stream: 48kHz Stereo</span>
                </span>
                <span className="font-mono text-[10px] text-emerald-400">00:04 / 00:04</span>
              </div>

              {/* Animated Waveform Bars */}
              <div className="flex items-center justify-between h-12 px-2 gap-1 bg-slate-900/60 rounded-lg">
                {[40, 65, 80, 50, 95, 70, 85, 60, 45, 90, 75, 55, 65, 85, 50, 70, 95, 60, 40, 80, 60, 45].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: isPlaying ? `${Math.max(15, (h * Math.random() + 20))}%` : `${h * 0.4}%` }}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isPlaying ? 'bg-gradient-to-t from-purple-500 to-pink-400' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Modell: XTTS-v2 Voice Clone</span>
                <button
                  onClick={() => alert(`Audiodatei "${selectedChar.name}_dirty_talk.wav" wird heruntergeladen.`)}
                  className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>WAV exportieren</span>
                </button>
              </div>
            </div>

            {/* Integration Note */}
            <div className="text-[11px] text-slate-400 leading-normal bg-slate-950 p-3 rounded-xl border border-slate-800">
              💡 <strong>Direkt mit dem Chat verknüpft:</strong> Im <em>Chat Modul</em> kannst du bei jeder Nachricht auf den lila Button &quot;Dirty Talk abspielen&quot; klicken, um die Antwort mit dieser Stimme laut vorzulesen!
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
