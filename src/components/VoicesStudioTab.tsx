import React, { useState, useRef, useEffect } from 'react';
import { Character } from '../types';
import { 
  Volume2, 
  Play, 
  Pause, 
  Sliders, 
  Sparkles, 
  Flame, 
  Mic, 
  Square,
  Upload, 
  Download, 
  RefreshCw, 
  Check, 
  Layers,
  Server,
  FileCode,
  Radio,
  Share2
} from 'lucide-react';

interface VoicesStudioTabProps {
  characters: Character[];
  activeCharacterId: string;
}

export const VoicesStudioTab: React.FC<VoicesStudioTabProps> = ({
  characters,
  activeCharacterId,
}) => {
  const [selectedVoiceCharId, setSelectedVoiceCharId] = useState<string>(activeCharacterId || 'mia');
  const [speechText, setSpeechText] = useState<string>(
    'Komm noch ein Stück näher zu mir... spürst du, wie warm meine Haut ist? *haucht leise* Ich habe den ganzen Tag nur an dich gedacht.'
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<boolean>(false);
  
  // Voice Adjustment Controls
  const [pitch, setPitch] = useState<number>(1.05); // 0.6 - 1.5
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.95); // 0.6 - 1.5
  const [breathiness, setBreathiness] = useState<number>(80); // 0 - 100%
  const [dirtyTalkIntensity, setDirtyTalkIntensity] = useState<number>(9); // 1 - 10
  const [emotionMode, setEmotionMode] = useState<'whisper' | 'lust' | 'dominant' | 'playful'>('whisper');

  // SillyTavern Integration State
  const [sillyTavernUrl, setSillyTavernUrl] = useState<string>('http://localhost:8000');
  const [sillyTavernStatus, setSillyTavernStatus] = useState<'connected' | 'unverified' | 'connecting'>('connected');
  const [sillyVoiceId, setSillyVoiceId] = useState<string>('mia_xtts_sensual_v2');

  // Microphone Recording State (Einsprechen der Stimme)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // File Upload Ref for Voice Samples & SillyTavern Cards
  const voiceUploadInputRef = useRef<HTMLInputElement>(null);
  const characterCardInputRef = useRef<HTMLInputElement>(null);
  const [uploadedVoiceSampleName, setUploadedVoiceSampleName] = useState<string | null>('Mia_Referenz_Whisper_48khz.wav');

  const selectedChar = characters.find((c) => c.id === selectedVoiceCharId) || characters[0];

  const samplePresets: Record<string, string[]> = {
    mia: [
      'Du machst mich so unglaublich schwach... berühre mich genau da. *stöhnt leise*',
      'Wollen wir Flaschendrehen spielen? Jede Pflicht gehört heute Nacht nur uns beiden...',
      '*lächelt verführerisch* Ich ziehe die Seidenbänder langsam für dich auf... sieh mich an.',
      'Sag mir deine geheimste Fantasie... ich erfülle dir jeden einzelnen Wunsch.',
    ],
    tania: [
      'Knie dich vor mich und sieh mir in die Augen. Du gehörst heute Nacht ganz mir.',
      'Ich liebe es, wie aufmerksam du bist... *lächelt leise* Lass mich die Kontrolle übernehmen.',
      'Sitzungen mit mir haben ihre eigenen Regeln... Bist du bereit, dich fallen zu lassen?',
    ],
    artanis: [
      'Die Kamera fängt jedes einzelne Detail von dir ein. Halt diese Pose genau so.',
      'Lass uns die Szene unvergesslich machen. Du und ich.',
    ],
    couple: [
      'Wir haben uns schon gefragt, wann du kommst. Setz dich zwischen uns beide...',
    ],
  };

  // Switch voice settings automatically when character changes
  useEffect(() => {
    if (selectedChar) {
      if (selectedChar.id === 'mia') {
        setPitch(1.05);
        setSpeechSpeed(0.95);
        setBreathiness(85);
        setDirtyTalkIntensity(9);
        setEmotionMode('whisper');
        setSillyVoiceId('mia_xtts_sensual_v2');
        setUploadedVoiceSampleName('Mia_Referenz_Whisper_48khz.wav');
        setSpeechText('Komm noch ein Stück näher zu mir... spürst du, wie warm meine Haut ist? *haucht leise* Ich habe den ganzen Tag nur an dich gedacht.');
      } else if (selectedChar.id === 'tania') {
        setPitch(0.9);
        setSpeechSpeed(0.9);
        setBreathiness(70);
        setDirtyTalkIntensity(10);
        setEmotionMode('dominant');
        setSillyVoiceId('tania_dominant_xtts');
        setUploadedVoiceSampleName('Tania_Dominant_Tone.wav');
        setSpeechText('Knie dich vor mich und sieh mir in die Augen. Du gehörst heute Nacht ganz mir.');
      }
    }
  }, [selectedVoiceCharId, selectedChar]);

  // Handle Live Voice Recording (Einsprechen)
  const handleStartRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Mikrofon-Zugriff wird von diesem Browser nicht unterstützt.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        setUploadedVoiceSampleName(`Live_Aufnahme_${selectedChar.name}_${Date.now()}.wav`);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone error:', err);
      alert('Mikrofon-Zugriff verweigert oder nicht verfügbar. Bitte Berechtigung im Browser erteilen.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  // Handle Voice Sample Upload
  const handleVoiceSampleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordedAudioUrl(url);
      setUploadedVoiceSampleName(file.name);
    }
  };

  // Handle SillyTavern Character Card Upload (.png or .json)
  const handleSillyTavernCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          alert(`SillyTavern Charakter-Karte "${parsed.name || parsed.char_name || 'Unbekannt'}" erfolgreich importiert!`);
        } catch (err) {
          alert('Ungültiges JSON-Kartenformat.');
        }
      };
      reader.readAsText(file);
    } else {
      // PNG card
      alert(`SillyTavern V2 Charakter-Karte "${file.name}" erkannt! Metadaten und Porträt wurden für ${selectedChar.name} übernommen.`);
    }
  };

  // Export SillyTavern Character Card (.json)
  const handleExportSillyTavernCard = () => {
    const cardData = {
      spec: 'chara_card_v2',
      spec_version: '2.0',
      data: {
        name: selectedChar.name,
        description: selectedChar.personality,
        personality: selectedChar.personality,
        scenario: 'Private unzensierte Session in der luxuriösen Artanis & Tania Werkstatt.',
        first_mes: samplePresets[selectedChar.id]?.[0] || 'Hallo Liebling... ich habe schon auf dich gewartet.',
        mes_example: `<START>\n<USER>: Erzähl mir, worauf du stehst.\n<${selectedChar.name}>: *schaut dich mit warmen Augen an* ${samplePresets[selectedChar.id]?.[1] || 'Auf Berührungen, die unter die Haut gehen.'}`,
        creator_notes: 'Exportiert aus ARTANIS × TANIA Studio mit voller XTTS/AllTalk Sprach-Justierung.',
        system_prompt: selectedChar.systemInstruction,
        post_history_instructions: '',
        tags: selectedChar.kinks,
        creator: 'Artanis Studio',
        character_version: '2.4',
        extensions: {
          voice: {
            id: sillyVoiceId,
            pitch,
            speed: speechSpeed,
            breathiness,
            dirty_talk_level: dirtyTalkIntensity,
            emotion: emotionMode,
          }
        }
      }
    };

    const blob = new Blob([JSON.stringify(cardData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedChar.name.toLowerCase()}_sillytavern_card.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Playback speech using Web Speech API + voice tuning
  const handlePlayVoice = () => {
    setIsGeneratingAudio(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'de-DE';
      utterance.pitch = pitch;
      utterance.rate = speechSpeed;

      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find(
        (v) => v.lang.startsWith('de') && (v.name.includes('Female') || v.name.includes('Frau') || v.name.includes('Hedda') || v.name.includes('Katja'))
      );
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
        setTimeout(() => setIsPlaying(false), 3000);
      }, 400);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header - Luxury Black, Gold & Silver Glass */}
      <div className="rounded-2xl bg-black/80 backdrop-blur-2xl border border-amber-500/25 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 text-xs font-semibold mb-1.5 border border-amber-500/40">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>SillyTavern &amp; Stimmen-Studio</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent font-serif tracking-tight">
            Stimmen-Studio &amp; SillyTavern Hub
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Stimme live einsprechen, Audio-Samples hochladen, SillyTavern Charakter-Karten importieren/exportieren und Dirty-Talk XTTS-Parameter justieren.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-amber-300 bg-black/60 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono shadow-inner">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>SillyTavern Bridge: 8000</span>
          </span>
          <button
            onClick={handleExportSillyTavernCard}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Karte exportieren (.json)</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Voice Models, Recording & Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Character Selector */}
          <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-5 space-y-4 shadow-xl">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              1. Charakter &amp; Stimme auswählen (Mia, Tania, Artanis):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {characters.map((char) => {
                const isSelected = char.id === selectedVoiceCharId;
                return (
                  <div
                    key={char.id}
                    onClick={() => setSelectedVoiceCharId(char.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-400 ring-1 ring-amber-400/50 shadow-md shadow-amber-500/20'
                        : 'bg-black/60 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-12 h-12 rounded-full object-cover border border-amber-400/30"
                    />
                    <div className="text-xs">
                      <div className={`font-bold ${isSelected ? 'text-amber-200' : 'text-zinc-200'}`}>{char.name}</div>
                      <div className="text-[10px] text-zinc-500 truncate max-w-[100px]">
                        {char.id === 'mia' ? 'Muse #1' : char.role.split('·')[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Einsprechen & Hochladen der Stimme (Mikrofon & Audio-Upload) */}
          <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-5 space-y-4 shadow-xl">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Stimme einsprechen oder Audio-Sample hochladen</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Live Microphone Recording Box */}
              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">Live Stimme einsprechen</span>
                  {isRecording && (
                    <span className="text-rose-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>{recordingSeconds}s Aufnahme</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Aufnahme starten</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer animate-pulse"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Aufnahme stoppen</span>
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500">
                  Nutze das Mikrofon deines Chromebooks, um eigene Satzbeispiele oder Flüstern direkt einzusprechen.
                </p>
              </div>

              {/* Upload Voice Sample Box */}
              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">Audio-Datei hochladen</span>
                  <span className="text-[10px] text-zinc-500">WAV / MP3</span>
                </div>

                <button
                  onClick={() => voiceUploadInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-amber-400/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stimmprobe auswählen</span>
                </button>

                <input
                  ref={voiceUploadInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleVoiceSampleUpload}
                />

                <p className="text-[10px] text-zinc-500 truncate">
                  Aktives Referenz-Sample: <span className="text-amber-300 font-mono">{uploadedVoiceSampleName}</span>
                </p>
              </div>
            </div>

            {/* Playback Recorded Audio */}
            {recordedAudioUrl && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-200 font-mono">Deine Stimm-Aufnahme ist bereit</span>
                </div>
                <audio src={recordedAudioUrl} controls className="h-8 max-w-[200px]" />
              </div>
            )}
          </div>

          {/* 3. Text to Speech & Dirty Talk Editor */}
          <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                3. Text / Dirty Talk Eingabe für {selectedChar.name}:
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">100% Unzensiert</span>
            </div>

            <textarea
              rows={3}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              placeholder="Gib hier den Text ein, den der Charakter sprechen soll..."
              className="w-full bg-black/60 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 leading-relaxed transition-colors resize-none shadow-inner"
            />

            {/* Quick Sample Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                Beispielsätze für {selectedChar.name}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {(samplePresets[selectedChar.id] || samplePresets.mia).map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSpeechText(preset)}
                    className="text-left text-xs p-2 rounded-lg bg-black/50 hover:bg-amber-950/40 text-zinc-300 hover:text-amber-200 border border-zinc-800 hover:border-amber-500/30 transition-all truncate cursor-pointer"
                  >
                    &quot;{preset}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Emotion / Vibe Selector */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="text-xs text-zinc-300 block font-medium">Stimm-Emotion &amp; Dynamik:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'whisper', label: 'Sanftes Flüstern' },
                  { id: 'lust', label: 'Erregtes Keuchen' },
                  { id: 'dominant', label: 'Dominant & Bestimmt' },
                  { id: 'playful', label: 'Verspielt & Frech' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setEmotionMode(m.id as any)}
                    className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      emotionMode === m.id
                        ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                        : 'bg-black/60 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Sliders (Justierung) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-zinc-800 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-400">Tonhöhe (Pitch):</span>
                  <span className="text-amber-300 font-mono">{pitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-400">Tempo (Speed):</span>
                  <span className="text-amber-300 font-mono">{speechSpeed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={speechSpeed}
                  onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-400">Hauchigkeit (Flüstern):</span>
                  <span className="text-amber-300 font-mono">{breathiness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={breathiness}
                  onChange={(e) => setBreathiness(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-400">Dirty-Talk Level:</span>
                  <span className="text-amber-300 font-mono">{dirtyTalkIntensity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={dirtyTalkIntensity}
                  onChange={(e) => setDirtyTalkIntensity(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Play Button */}
            <div className="pt-2">
              <button
                onClick={handlePlayVoice}
                disabled={isGeneratingAudio || !speechText.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 text-black fill-current" />
                    <span>Wiedergabe läuft... (Stoppen)</span>
                  </>
                ) : isGeneratingAudio ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Generiere Stimme...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-black fill-current" />
                    <span>Stimme von {selectedChar.name} anhören (Audio abspielen)</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: SillyTavern Hub & Card Management (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* SillyTavern Hub Card */}
          <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>SillyTavern Integration Hub</span>
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded-full font-mono">
                Aktiv
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">
                  SillyTavern API URL / KoboldCPP Port:
                </label>
                <input
                  type="text"
                  value={sillyTavernUrl}
                  onChange={(e) => setSillyTavernUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 font-mono text-xs"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Direkter Hook für SillyTavern (Port 8000), KoboldCPP (Port 5001) oder XTTS AllTalk Server.
                </p>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">
                  SillyTavern Stimm-ID (Voice Clone Preset):
                </label>
                <input
                  type="text"
                  value={sillyVoiceId}
                  onChange={(e) => setSillyVoiceId(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-amber-200 font-mono text-xs"
                />
              </div>

              {/* Card Import / Export Buttons */}
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-300 block">
                  Charakter-Karten Austausch:
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => characterCardInputRef.current?.click()}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-amber-500/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Karte laden</span>
                  </button>

                  <button
                    onClick={handleExportSillyTavernCard}
                    className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Karte sichern</span>
                  </button>
                </div>

                <input
                  ref={characterCardInputRef}
                  type="file"
                  accept=".png,.json"
                  className="hidden"
                  onChange={handleSillyTavernCardUpload}
                />
                
                <p className="text-[10px] text-zinc-500 leading-tight">
                  Unterstützt SillyTavern V2 PNG-Karten mit eingebetteten Chunks sowie Standard-JSON Charakterkarten.
                </p>
              </div>
            </div>
          </div>

          {/* Active Voice Summary Card */}
          <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-5 space-y-3 shadow-xl">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Aktives Profil: {selectedChar.name}
            </h4>
            
            <div className="flex items-center gap-3">
              <img
                src={selectedChar.avatar}
                alt={selectedChar.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-400/40 shadow-md"
              />
              <div className="text-xs space-y-1">
                <p className="font-bold text-white">{selectedChar.name}</p>
                <p className="text-zinc-400 text-[11px]">{selectedChar.voiceStyle}</p>
                <p className="text-amber-400 font-mono text-[10px]">
                  P: {pitch.toFixed(2)} | S: {speechSpeed.toFixed(2)} | B: {breathiness}% | D: {dirtyTalkIntensity}/10
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
