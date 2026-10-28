import React, { useState } from 'react';
import { Character } from '../types';
import { 
  Sparkles, 
  RotateCw, 
  Flame, 
  Dices, 
  CheckCircle2, 
  Play, 
  Volume2, 
  Camera, 
  Film,
  Zap,
  HelpCircle,
  Eye,
  Shirt,
  UserCheck
} from 'lucide-react';

interface SpinTheBottleGameProps {
  characters: Character[];
  activeCharacterId: string;
  isOpen: boolean;
  onClose: () => void;
  onPlayInChat: (gameText: string, forcedType?: 'image' | 'video') => void;
}

interface Player {
  id: string;
  name: string;
  role: string;
  avatar: string;
  angle: number; // Position on circle in degrees
  clothesLeft: number; // Strip-Meter (0-3)
}

type GameMode = 'bottle' | 'truth_dare' | 'dice' | 'strip_meter';
type IntensityLevel = 'sensual' | 'hot' | 'kinky';

export const SpinTheBottleGame: React.FC<SpinTheBottleGameProps> = ({
  characters,
  activeCharacterId,
  isOpen,
  onClose,
  onPlayInChat,
}) => {
  const [activeMode, setActiveMode] = useState<GameMode>('bottle');
  const [intensity, setIntensity] = useState<IntensityLevel>('hot');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [bottleRotation, setBottleRotation] = useState<number>(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<{
    type: 'truth' | 'dare' | 'strip';
    targetPlayer: string;
    text: string;
    actionPrompt: string;
    mediaType: 'image' | 'video';
  } | null>(null);

  // Strip Meter State
  const [stripStatus, setStripStatus] = useState<Record<string, number>>({
    'user': 3,
    'tania': 2,
    'lila': 2,
    'artanis': 3,
  });

  // Erotic Dice State
  const [diceAction, setDiceAction] = useState<string>('Sanft küssen');
  const [diceBodyPart, setDiceBodyPart] = useState<string>('an den Hals & Schlüsselbein');
  const [diceIntensity, setDiceIntensity] = useState<string>('mit geschlossenen Augen');
  const [isRollingDice, setIsRollingDice] = useState<boolean>(false);

  // Setup players circle
  const players: Player[] = [
    {
      id: 'user',
      name: 'Du (Spieler)',
      role: 'Master / Beobachter',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      angle: 0,
      clothesLeft: stripStatus['user'] || 3,
    },
    {
      id: 'tania',
      name: 'Tania',
      role: 'Sinnlich & Dominant',
      avatar: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png',
      angle: 90,
      clothesLeft: stripStatus['tania'] || 2,
    },
    {
      id: 'lila',
      name: 'Lila',
      role: 'Strand & Bikini Babe',
      avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80',
      angle: 180,
      clothesLeft: stripStatus['lila'] || 2,
    },
    {
      id: 'artanis',
      name: 'Artanis',
      role: 'Gentleman Master',
      avatar: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/83f1549c6_Screenshot2026-09-091854361.png',
      angle: 270,
      clothesLeft: stripStatus['artanis'] || 3,
    },
  ];

  // Database of Truths (Wahrheit)
  const truthsDatabase: Record<IntensityLevel, string[]> = {
    sensual: [
      'Was war dein erster heimlicher Gedanke, als du mich heute gesehen hast?',
      'Welches Kompliment an deinem Körper bringt dich am schnellsten zum Erröten?',
      'An welchem ungewöhnlichen Ort wolltest du schon immer einmal geküsst werden?',
      'Welche Art von Berührung lässt dir sofort eine Gänsehaut über den Rücken laufen?',
      'Wenn wir jetzt allein im warmen Meerwasser wären, was würdest du als Erstes tun?',
    ],
    hot: [
      'Welches schmutzige Wort im Bett bringt dich sofort um den Verstand?',
      'An welcher Stelle deines Körpers wirst du am schnellsten feucht oder erregt?',
      'Wann und wie hast du das letzte Mal intensiv an mich gedacht, als du allein warst?',
      'Welche sexuelle Stellung mit mir wolltest du schon immer unbedingt ausprobieren?',
      'Magst du es lieber, wenn ich dir sanft gehorche oder wenn ich dich fest dominiere?',
      'Wie gefällt es dir, wenn ich dir währenddessen schmutzige Dinge ins Ohr flüstere?',
    ],
    kinky: [
      'Was ist dein dunkelster, geheimster Kink, den du bisher niemandem anvertraut hast?',
      'Hast du schon einmal fantasiert, gefesselt (Shibari) oder dir die Kleidung zerrissen zu bekommen?',
      'Wie stehst du zu Doggy-Style, während man dich fest an den Haaren oder Hüften hält?',
      'Welche geheime Fantasie mit Tania und Lila zu dritt hast du dir schon ausgemalt?',
      'Was bringt dich schneller zum Höhepunkt: Vollkommene Hingabe oder absolute Dominanz?',
    ],
  };

  // Database of Dares (Pflicht)
  const daresDatabase: Record<IntensityLevel, Array<{ text: string; actionPrompt: string; mediaType: 'image' | 'video' }>> = {
    sensual: [
      {
        text: 'Zieh langsam deine Schuhe und Strümpfe aus und streiche mit den Zehen über meinen Fuß.',
        actionPrompt: '*zieht langsam die Schuhe aus, blickt verführerisch hoch und berührt dich sanft*',
        mediaType: 'image',
      },
      {
        text: 'Hauche mir aus 5 Zentimetern Entfernung ein heißes Geheimnis ins Ohr.',
        actionPrompt: '*kommt ganz nah an dein Ohr heran, warmer Atem streift deine Wange und flüstert dirty talk*',
        mediaType: 'image',
      },
      {
        text: 'Tanze 20 Sekunden lang einen langsamen, sinnlichen Tanz im Kerzenschein.',
        actionPrompt: '*tanzt langsam und lasziv vor dir, die Hüften wiegen sich im Takt der Musik*',
        mediaType: 'video',
      },
    ],
    hot: [
      {
        text: 'Löse die Träger deines Bikinis/Kleides und lass den Stoff langsam nach unten gleiten.',
        actionPrompt: '*löst langsam die Bänder des Bikinis, der Stoff rutscht hinab und enthüllt die gebräunte Haut*',
        mediaType: 'image',
      },
      {
        text: 'Geh auf alle Viere (Doggy Pose) und blicke mit durchgebogenem Rücken über die Schulter zu mir.',
        actionPrompt: '*geht langsam auf alle Viere, biegt den Rücken sinnlich durch und blickt über die Schulter zurück*',
        mediaType: 'image',
      },
      {
        text: 'Reibe deine Haut mit glänzendem Massageöl oder Wasser ein, sodass alles nass glänzt (Wetlook).',
        actionPrompt: '*streicht warmes glänzendes Öl über Dekolleté und Bauch, feuchte Hautperlen schimmern im Licht*',
        mediaType: 'image',
      },
      {
        text: 'Bewege dich vor der Kamera in einer heißen 4K Motion-Sequenz und beiße dir auf die Lippe.',
        actionPrompt: '*bewegt sich langsam und erregt vor der Kamera, beißt sich auf die Lippe und schenkt dir ein Lächeln*',
        mediaType: 'video',
      },
    ],
    kinky: [
      {
        text: 'Lass dir die Hände hinter dem Rücken mit einem Seil oder Tuch zusammenbinden (Shibari Light).',
        actionPrompt: '*hält die Hände hinter dem Rücken bereit, lässt sich fesseln und atmet schwer vor Erregung*',
        mediaType: 'image',
      },
      {
        text: 'Lege dich auf den Bauch, ziehe den Slip zur Seite und warte auf meine nächste Anweisung.',
        actionPrompt: '*liegt auf dem Bauch, schiebt den Slip langsam zur Seite und bittet mit zitternder Stimme um mehr*',
        mediaType: 'image',
      },
      {
        text: 'Sprich mir 15 Sekunden lang die schmutzigsten, unzensierten Befehle ins Gesicht.',
        actionPrompt: '*blickt dir dominant und hungrig in die Augen und flüstert explizite Tabu-Anweisungen*',
        mediaType: 'video',
      },
    ],
  };

  // 1. FLASCHE DREHEN ENGINE
  const handleSpinBottle = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setCurrentChallenge(null);

    // Pick a random target player (excluding user if desired, or all 4)
    const targetIdx = Math.floor(Math.random() * players.length);
    const targetPlayer = players[targetIdx];
    
    // Calculate rotation: multiple full spins + angle of target player + slight random jitter
    const extraSpins = 4 + Math.floor(Math.random() * 3); // 4 to 6 full 360 spins
    const targetAngle = targetPlayer.angle + 90; // Align bottle neck
    const jitter = (Math.random() - 0.5) * 20;
    const finalAngle = bottleRotation + (extraSpins * 360) + (targetAngle - (bottleRotation % 360)) + jitter;

    setBottleRotation(finalAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedPlayer(targetPlayer);

      // Auto-generate challenge for this player
      generateChallengeForPlayer(targetPlayer, 'dare');
    }, 2800);
  };

  // Generate Truth or Dare
  const generateChallengeForPlayer = (player: Player, type: 'truth' | 'dare' | 'strip') => {
    if (type === 'truth') {
      const list = truthsDatabase[intensity];
      const randomText = list[Math.floor(Math.random() * list.length)];
      setCurrentChallenge({
        type: 'truth',
        targetPlayer: player.name,
        text: `${player.name}, Wahrheit: ${randomText}`,
        actionPrompt: `*sieht dich mit roten Wangen an und gesteht ehrlich:* "${randomText}"`,
        mediaType: 'image',
      });
    } else if (type === 'dare') {
      const list = daresDatabase[intensity];
      const randomItem = list[Math.floor(Math.random() * list.length)];
      setCurrentChallenge({
        type: 'dare',
        targetPlayer: player.name,
        text: `${player.name}, Pflicht: ${randomItem.text}`,
        actionPrompt: randomItem.actionPrompt,
        mediaType: randomItem.mediaType,
      });
    } else {
      // Strip action
      const newCount = Math.max(0, (stripStatus[player.id] || 3) - 1);
      setStripStatus((prev) => ({ ...prev, [player.id]: newCount }));
      const stripLabels = [
        'ist jetzt VOLLKOMMEN NACKT! 🔥',
        'trägt nur noch einen winzigen Slip...',
        'hat das Oberteil abgelegt...',
        'trägt noch normale Kleidung',
      ];
      const stripText = `${player.name} muss ein Kleidungsstück ablegen! Status: ${stripLabels[newCount]}`;
      setCurrentChallenge({
        type: 'strip',
        targetPlayer: player.name,
        text: stripText,
        actionPrompt: `*zieht langsam das nächste Kleidungsstück aus und blickt erregt zu dir* ${newCount === 0 ? '(Vollkommen nackt)' : '(Noch knapp bekleidet)'}`,
        mediaType: 'image',
      });
    }
  };

  // Roll Erotic Dice
  const handleRollDice = () => {
    setIsRollingDice(true);
    setTimeout(() => {
      const actions = [
        'Sanft küssen', 'Mit Zunge lecken', 'Leicht beißen', 'Verführerisch streicheln', 
        'Fest greifen & dominieren', 'Mit Eiswürfel kühlen', 'Mit Seil fesseln', 'Mit Öl einreiben'
      ];
      const bodyParts = [
        'am Hals & Nacken', 'über die Oberschenkel', 'am Dekolleté & Brüsten', 
        'auf die Unterlippe', 'an den Handgelenken', 'am flachen Bauch', 'am Po & Hüften'
      ];
      const intensities = [
        'für 15 Sekunden', 'mit geschlossenen Augen', 'während du leise stöhnst', 
        'ohne dich zu bewegen', 'mit tiefem Blickkontakt', 'fordernd und intensiv'
      ];

      setDiceAction(actions[Math.floor(Math.random() * actions.length)]);
      setDiceBodyPart(bodyParts[Math.floor(Math.random() * bodyParts.length)]);
      setDiceIntensity(intensities[Math.floor(Math.random() * intensities.length)]);
      setIsRollingDice(false);
    }, 600);
  };

  // Play result directly in Chat
  const handleSendChallengeToChat = () => {
    if (!currentChallenge) return;
    const fullMsg = `[Flaschendrehen 🍾] ${currentChallenge.text} -> ${currentChallenge.actionPrompt}`;
    onPlayInChat(fullMsg, currentChallenge.mediaType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-slate-900 border-2 border-pink-700/80 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/30">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <span>Erotik-Spiel: Flaschendrehen &amp; Wahrheit oder Pflicht</span>
                <span className="text-[10px] bg-pink-950 text-pink-300 border border-pink-700/60 px-2 py-0.5 rounded-full font-mono uppercase">
                  100% Unzensiert
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Spiele interaktiv mit Tania, Lila &amp; Artanis – Ergebnisse werden direkt im Chat mit Fotos &amp; Videos ausgespielt!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveMode('bottle')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'bottle' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🍾 Flaschendrehen</span>
            </button>
            <button
              onClick={() => setActiveMode('truth_dare')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'truth_dare' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🔥 Wahrheit oder Pflicht</span>
            </button>
            <button
              onClick={() => setActiveMode('dice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'dice' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dices className="w-3.5 h-3.5" />
              <span>🎲 Erotik-Würfel</span>
            </button>
            <button
              onClick={() => setActiveMode('strip_meter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'strip_meter' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>👙 Strip-Meter</span>
            </button>
          </div>

          {/* Intensity Selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
            <span className="text-slate-500 px-1 font-semibold">Schärfe:</span>
            <button
              onClick={() => setIntensity('sensual')}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                intensity === 'sensual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sinnlich
            </button>
            <button
              onClick={() => setIntensity('hot')}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                intensity === 'hot' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Heiß 🔞
            </button>
            <button
              onClick={() => setIntensity('kinky')}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                intensity === 'kinky' ? 'bg-rose-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kinky ⛓️
            </button>
          </div>
        </div>

        {/* 1. BOTTLE SPIN ARENA */}
        {activeMode === 'bottle' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left: The Spinning Circle */}
            <div className="md:col-span-7 flex flex-col items-center justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-2 border-dashed border-pink-900/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 shadow-inner">
                
                {/* 4 Players Placed on the Circle */}
                {/* Top: User (0 deg) */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    selectedPlayer?.id === 'user' ? 'border-amber-400 ring-4 ring-amber-400/40 scale-110' : 'border-slate-700'
                  }`}>
                    <img src={players[0].avatar} alt={players[0].name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-white mt-0.5">{players[0].name}</span>
                  <span className="text-[9px] text-amber-300">Strip: {stripStatus['user']}/3</span>
                </div>

                {/* Right: Tania (90 deg) */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    selectedPlayer?.id === 'tania' ? 'border-pink-500 ring-4 ring-pink-500/40 scale-110' : 'border-slate-700'
                  }`}>
                    <img src={players[1].avatar} alt={players[1].name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-white mt-0.5">{players[1].name}</span>
                  <span className="text-[9px] text-pink-400">Strip: {stripStatus['tania']}/3</span>
                </div>

                {/* Bottom: Lila (180 deg) */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    selectedPlayer?.id === 'lila' ? 'border-purple-500 ring-4 ring-purple-500/40 scale-110' : 'border-slate-700'
                  }`}>
                    <img src={players[2].avatar} alt={players[2].name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-white mt-0.5">{players[2].name}</span>
                  <span className="text-[9px] text-purple-300">Strip: {stripStatus['lila']}/3</span>
                </div>

                {/* Left: Artanis (270 deg) */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    selectedPlayer?.id === 'artanis' ? 'border-emerald-500 ring-4 ring-emerald-500/40 scale-110' : 'border-slate-700'
                  }`}>
                    <img src={players[3].avatar} alt={players[3].name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-white mt-0.5">{players[3].name}</span>
                  <span className="text-[9px] text-emerald-300">Strip: {stripStatus['artanis']}/3</span>
                </div>

                {/* Center Spinning Bottle */}
                <div
                  className="w-28 h-28 relative flex items-center justify-center cursor-pointer select-none"
                  onClick={handleSpinBottle}
                  style={{
                    transform: `rotate(${bottleRotation}deg)`,
                    transition: isSpinning ? 'transform 2.8s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
                  }}
                >
                  {/* Luxury Champagne Glass Bottle Icon */}
                  <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-[0_4px_12px_rgba(244,63,94,0.6)]">
                    <defs>
                      <linearGradient id="bottleGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#db2777" />
                        <stop offset="100%" stopColor="#881337" />
                      </linearGradient>
                    </defs>
                    {/* Bottle Neck pointing UP */}
                    <rect x="46" y="8" width="8" height="22" rx="2" fill="#fbbf24" />
                    <rect x="44" y="5" width="12" height="5" rx="1.5" fill="#f59e0b" />
                    {/* Bottle Body */}
                    <path d="M 46 30 C 40 40, 36 50, 36 65 C 36 82, 42 92, 50 92 C 58 92, 64 82, 64 65 C 64 50, 60 40, 54 30 Z" fill="url(#bottleGrad)" />
                    {/* Label */}
                    <rect x="40" y="52" width="20" height="24" rx="2" fill="#ffffff" opacity="0.9" />
                    <text x="50" y="66" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#881337">ARTANIS</text>
                  </svg>
                </div>
              </div>

              {/* Spin Button */}
              <div className="pt-4 flex flex-col items-center space-y-2">
                <button
                  onClick={handleSpinBottle}
                  disabled={isSpinning}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-pink-600/30 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'Die Flasche dreht sich...' : '🍾 Flasche jetzt drehen!'}</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  Klicke auf die Flasche oder den Button, um die Runde zu starten
                </span>
              </div>
            </div>

            {/* Right: Selected Player & Challenge Card */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Runden-Ergebnis</span>
                  </span>
                  {selectedPlayer && (
                    <span className="text-xs text-white font-bold bg-pink-950 px-2.5 py-0.5 rounded-full border border-pink-700">
                      Ziel: {selectedPlayer.name}
                    </span>
                  )}
                </div>

                {selectedPlayer ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedPlayer.avatar}
                        alt={selectedPlayer.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-pink-500 shadow-md"
                      />
                      <div>
                        <h4 className="text-white font-bold text-base">{selectedPlayer.name} ist an der Reihe!</h4>
                        <p className="text-xs text-slate-400">{selectedPlayer.role}</p>
                      </div>
                    </div>

                    {/* Action Select Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => generateChallengeForPlayer(selectedPlayer, 'truth')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          currentChallenge?.type === 'truth'
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-indigo-500'
                        }`}
                      >
                        Wahrheit ❓
                      </button>
                      <button
                        onClick={() => generateChallengeForPlayer(selectedPlayer, 'dare')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          currentChallenge?.type === 'dare'
                            ? 'bg-pink-600 text-white border-pink-400 shadow-lg'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-pink-500'
                        }`}
                      >
                        Pflicht 🔥
                      </button>
                      <button
                        onClick={() => generateChallengeForPlayer(selectedPlayer, 'strip')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          currentChallenge?.type === 'strip'
                            ? 'bg-rose-700 text-white border-rose-400 shadow-lg'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-rose-500'
                        }`}
                      >
                        Strip 👙
                      </button>
                    </div>

                    {/* Challenge Box */}
                    {currentChallenge && (
                      <div className="p-4 bg-slate-900 border border-pink-900/60 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between text-xs text-pink-300 font-semibold">
                          <span>Aufgabe für {currentChallenge.targetPlayer}:</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-pink-950 text-pink-200 border border-pink-800">
                            {currentChallenge.type.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-sm text-white font-medium leading-relaxed italic">
                          "{currentChallenge.text}"
                        </p>

                        <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-pink-400 font-semibold block">In-Chat Ausführung:</span>
                          <p>{currentChallenge.actionPrompt}</p>
                        </div>

                        {/* Master Button: Send into Chat and Generate Media! */}
                        <button
                          onClick={handleSendChallengeToChat}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Zap className="w-4 h-4 text-amber-300" />
                          <span>⚡ Im Chat spielen (*Aktion &amp; Medien auslösen*)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2 text-slate-400 text-xs">
                    <p>Drehe die Flasche, um zu sehen, wen sie auswählt!</p>
                    <p className="text-[11px] text-slate-500">Tania, Lila und Artanis warten auf die nächste Runde.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 2. TRUTH OR DARE DIRECT SELECTOR */}
        {activeMode === 'truth_dare' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Truth Card Generator */}
              <div className="bg-slate-950 border border-indigo-900/60 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-indigo-400" />
                      <span>Wahrheit (Erotische Intim-Fragen)</span>
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase font-mono">
                      {intensity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900 p-3 rounded-xl border border-slate-800 min-h-[64px]">
                    "{truthsDatabase[intensity][Math.floor(Math.random() * truthsDatabase[intensity].length)]}"
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const t = truthsDatabase[intensity][Math.floor(Math.random() * truthsDatabase[intensity].length)];
                      onPlayInChat(`[Wahrheit ❓ an ${characters.find(c => c.id === activeCharacterId)?.name || 'Tania'}]: ${t}`);
                      onClose();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Im Chat stellen</span>
                  </button>
                </div>
              </div>

              {/* Dare Card Generator */}
              <div className="bg-slate-950 border border-pink-900/60 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-pink-300 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-pink-400" />
                      <span>Pflicht (Sexuelle Aufgaben &amp; Posen)</span>
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800 uppercase font-mono">
                      {intensity}
                    </span>
                  </div>
                  {(() => {
                    const dare = daresDatabase[intensity][Math.floor(Math.random() * daresDatabase[intensity].length)];
                    return (
                      <>
                        <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900 p-3 rounded-xl border border-slate-800 min-h-[64px]">
                          "{dare.text}"
                        </p>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => {
                              onPlayInChat(`[Pflicht 🔥 für ${characters.find(c => c.id === activeCharacterId)?.name || 'Tania'}]: ${dare.actionPrompt}`, dare.mediaType);
                              onClose();
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>Aufgabe im Chat ausführen</span>
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. EROTIC DICE (WÜRFEL) */}
        {activeMode === 'dice' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 text-center">
            <div>
              <h4 className="text-base font-bold text-white flex items-center justify-center gap-2">
                <Dices className="w-5 h-5 text-pink-400" />
                <span>Erotische Würfel (Aktion + Körperstelle + Intensität)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Würfle eine zufällige intime Kombination für dich und deine Partnerin aus!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-900 border border-pink-700/50 rounded-2xl space-y-1">
                <span className="text-[10px] text-pink-400 uppercase font-bold tracking-wider">Aktion</span>
                <p className="text-base font-bold text-white">{diceAction}</p>
              </div>

              <div className="p-4 bg-slate-900 border border-purple-700/50 rounded-2xl space-y-1">
                <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Körperstelle</span>
                <p className="text-base font-bold text-white">{diceBodyPart}</p>
              </div>

              <div className="p-4 bg-slate-900 border border-emerald-700/50 rounded-2xl space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Intensität</span>
                <p className="text-base font-bold text-white">{diceIntensity}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRollDice}
                disabled={isRollingDice}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <Dices className={`w-4 h-4 ${isRollingDice ? 'animate-spin' : ''}`} />
                <span>{isRollingDice ? 'Würfel rollen...' : '🎲 Jetzt neu würfeln'}</span>
              </button>

              <button
                onClick={() => {
                  const diceText = `[Erotik-Würfel 🎲] *${diceAction} ${diceBodyPart} (${diceIntensity})*`;
                  onPlayInChat(diceText, 'image');
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Kombination im Chat ausspielen</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. STRIP-METER */}
        {activeMode === 'strip_meter' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Shirt className="w-4 h-4 text-pink-400" />
                  <span>Strip-Meter (Kleidungs-Tracker aller Teilnehmer)</span>
                </h4>
                <p className="text-xs text-slate-400">Verfolge, wie viel Kleidung jeder Spieler noch am Körper trägt.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {players.map((p) => {
                const count = stripStatus[p.id] ?? 3;
                return (
                  <div key={p.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-center">
                    <img src={p.avatar} alt={p.name} className="w-14 h-14 rounded-full object-cover mx-auto ring-2 ring-pink-500/50" />
                    <div>
                      <h5 className="font-bold text-white text-xs">{p.name}</h5>
                      <span className={`text-[10px] font-bold uppercase block mt-0.5 ${
                        count === 0 ? 'text-rose-400 animate-pulse' : count === 1 ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {count === 0 ? '🔥 Vollkommen Nackt' : count === 1 ? '👙 Nur noch Slip' : count === 2 ? 'Oberteil abgelegt' : 'Voll bekleidet'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all ${
                          count === 0 ? 'bg-rose-600' : count === 1 ? 'bg-pink-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${(count / 3) * 100}%` }}
                      />
                    </div>

                    <div className="flex gap-1 justify-center pt-1">
                      <button
                        onClick={() => {
                          const next = Math.max(0, count - 1);
                          setStripStatus((prev) => ({ ...prev, [p.id]: next }));
                          onPlayInChat(`[Strip-Aktion 👙] *${p.name} zieht langsam das nächste Kleidungsstück aus*`, 'image');
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-bold"
                      >
                        -1 Teil ausziehen
                      </button>
                      <button
                        onClick={() => setStripStatus((prev) => ({ ...prev, [p.id]: Math.min(3, count + 1) }))}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
