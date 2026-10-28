import React, { useState } from 'react';
import { Character, ChatMessage } from '../types';
import { SpinTheBottleGame } from './SpinTheBottleGame';
import { 
  Send, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Flame, 
  Camera, 
  Film,
  RefreshCw,
  Play,
  Dices
} from 'lucide-react';

interface ChatTabProps {
  characters: Character[];
  activeCharacterId: string;
  setActiveCharacterId: (id: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  characters,
  activeCharacterId,
  setActiveCharacterId,
}) => {
  const activeCharacter = characters.find((c) => c.id === activeCharacterId) || characters[0];

  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [styleMode, setStyleMode] = useState<'photorealistic' | 'anime' | 'render3d'>('photorealistic');
  const [mediaTriggerType, setMediaTriggerType] = useState<'image' | 'video'>('image');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  // Initial roleplay messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'character',
      characterId: activeCharacter.id,
      text: `Hey Liebling... schön, dass du da bist. *lächelt dich verschmitzt an und streicht sich eine blonde Strähne aus der Stirn* 
Ich habe den ganzen Tag in der warmen Sonne am Strand gelegen. Die Wellen rauschen, mein knapper Bikini ist noch feucht vom Meerwasser... Lust auf eine Runde Flaschendrehen oder Wahrheit oder Pflicht mit mir?`,
      timestamp: 'Gerade eben',
      generatedMedia: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        promptUsed: `score_9, score_8_up, masterpiece, A beautiful 23yo blonde woman smiling on tropical sunny beach, golden hour, wearing tiny red micro bikini, sun kissed wet skin, water droplets, photorealistic, intricate facial features, 8k uhd, softbox rim lighting`,
        model: 'SDXL BigAsp v2 (Photorealism)',
      },
    },
  ]);

  const handleSendMessage = (customText?: string, forcedType?: 'image' | 'video') => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isGenerating) return;

    const chosenType = forcedType || mediaTriggerType;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsGenerating(true);

    // Simulate AI Roleplay & In-Chat Visual Trigger
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let replyText = '';
      let mediaData: ChatMessage['generatedMedia'] | undefined = undefined;

      // Handle Flaschendrehen, Wahrheit, Pflicht & Strip Actions
      if (lower.includes('flaschendrehen') || lower.includes('wahrheit') || lower.includes('pflicht') || lower.includes('strip') || lower.includes('würfel')) {
        if (lower.includes('wahrheit')) {
          replyText = `*errötet leicht, beißt sich auf die Unterlippe und sieht dir tief in die Augen* 
Ein intimes Geständnis also? Nun gut... wenn die Flasche es so will... *atmet tief ein und gesteht mit leiser, zitternder Stimme:* 
"Wenn ich ganz ehrlich bin... jedes Mal wenn du den Raum betrittst, kribbelt es in meinem ganzen Körper. Ich habe mir schon so oft vorgestellt, wie es wäre, wenn du mir jedes einzelne Kleidungsstück nimmst und mich ganz dir überlässt..."`;
          mediaData = {
            type: chosenType,
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
            promptUsed: `score_9, score_8_up, intimate close up, blushing cheeks, parted lips, looking directly into camera with intense desire, confession of love and lust, cinematic lighting, 8k uhd photorealism`,
            model: 'SDXL BigAsp v2 (Photorealism)',
          };
        } else if (lower.includes('strip') || lower.includes('ausziehen') || lower.includes('nackt')) {
          replyText = `*lächelt verführerisch und blickt dir fest in die Augen* 
Du wolltest es so beim Spiel! *greift mit langsamen Fingern nach den Bändern des Bikinis und löst den Knoten... der Stoff gleitet hinab und gibt die warme, gebräunte Haut frei* 
Ich habe keine Angst davor, mich vor dir nackt zu zeigen. Gefällt dir meine Belohnung für deinen Mut?`;
          mediaData = {
            type: chosenType,
            url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
            promptUsed: `score_9, score_8_up, sensual disrobing striptease, blonde woman untying string bikini, exposed shoulders and sun kissed skin, blushing, intimate room lighting, 8k uhd photorealism`,
            model: chosenType === 'video' ? 'Stable Video Diffusion (SVD-XT) 4K' : 'SDXL BigAsp v2 Photorealism',
          };
        } else if (lower.includes('würfel')) {
          replyText = `*atmet hörbar auf und beugt sich langsam zu dir vor* 
Die Würfel haben entschieden... *folgt der Kombination mit sanften, prickelnden Berührungen und haucht dir warm an die Haut* Spürst du, wie heiß mein Atem ist? Jetzt will ich sehen, wie du reagierst...`;
          mediaData = {
            type: chosenType,
            url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
            promptUsed: `score_9, score_8_up, intimate erotic game touch, sensual embrace, passionate facial expression, cinematic depth of field, 8k uhd`,
            model: 'SDXL BigAsp v2 Photorealism',
          };
        } else {
          // General Dare / Pflicht
          replyText = `*beißt sich auf die Lippe und nimmt die Pflicht ohne zu zögern an* 
Ich kneife vor keiner einzigen Pflicht beim Flaschendrehen! *führt die Anweisung langsam und genießerisch vor deinen Augen aus* 
Sieh mich an... ich erfülle jede deiner Aufgaben. Und jetzt drehe ich die Flasche für dich!`;
          mediaData = {
            type: chosenType,
            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
            promptUsed: `score_9, score_8_up, seductive pose fulfilling erotic dare, wet shimmering skin, parted lips, intense gaze at viewer, golden hour beach lighting, 8k uhd`,
            model: chosenType === 'video' ? 'Stable Video Diffusion (SVD-XT) 4K' : 'SDXL BigAsp v2 Photorealism',
          };
        }
      } else if (lower.includes('ausziehen') || lower.includes('nackt') || lower.includes('stripp')) {
        replyText = `*beißt sich sanft auf die Unterlippe und blickt dir direkt in die Augen* 
Du willst also mehr sehen? *greift mit zitternden Fingern nach den Bändern ihres Bikinis und löst den ersten Knoten... der Stoff gleitet langsam nach unten und gibt den Blick frei auf ihre gebräunte Haut* Gefällt dir, was du siehst?`;
        
        mediaData = {
          type: chosenType,
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
          promptUsed: styleMode === 'photorealistic'
            ? `score_9, score_8_up, explicit disrobing, blonde woman untying string bikini on beach, sun kissed skin, exposed shoulders and cleavage, sensual intimate expression, blushing cheeks, cinematic depth of field, 8k uhd photorealism`
            : `score_9, score_8_up, source_anime, masterpiece, blonde anime girl, untying bikini straps, sensual pose, blushing, beach background, detailed lineart, pony diffusion xl`,
          model: chosenType === 'video' ? 'SVD-XT Video Motion Pipeline' : (styleMode === 'photorealistic' ? 'SDXL BigAsp v2 Photorealism' : 'Pony Diffusion V6 (Anime)'),
        };
      } else if (lower.includes('video') || lower.includes('clip') || lower.includes('film') || chosenType === 'video') {
        replyText = `*bewegt sich lasziv vor der Kamera im warmen Meerwasser* 
Ich lasse die Kamera laufen... sieh dir an, wie meine Hüften sich im Rhythmus der Wellen bewegen. *schmiegt sich sanft an und schenkt dir ein atemberaubendes Lächeln*`;
        
        mediaData = {
          type: 'video',
          url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
          promptUsed: `(masterpiece:1.2), 4k video, 60fps, SVD motion, ${activeCharacter.name} sensual dance on beach sunset, camera panning down, wet glistening skin, fluid animation`,
          model: 'Stable Video Diffusion (SVD-XT) 4K',
        };
      } else if (lower.includes('umdrehen') || lower.includes('hinten') || lower.includes('doggy')) {
        replyText = `*dreht sich langsam auf dem weichen Sand um und stützt sich auf die Unterarme* 
*blickt über ihre Schulter verführerisch zu dir zurück, während der Rücken durchgebogen ist* Ich bin ganz dein... nimm dir, was du willst.`;
        mediaData = {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
          promptUsed: `score_9, score_8_up, on all fours, arched back, looking back over shoulder at viewer, explicit pose, intimate beach sand, wet skin sheen, hyper realistic, direct eye contact, high detail anatomy`,
          model: 'SDXL BigAsp v2 Photorealism',
        };
      } else {
        replyText = `*posiert verführerisch für dich und haucht leise* 
Sieh mich an... genau so, wie du mich magst. *ihr Atem geht schneller und ihre Haut glänzt warm in der Abendsonne*`;
        mediaData = {
          type: chosenType,
          url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
          promptUsed: `score_9, score_8_up, intimate close up portrait, beautiful woman, wet hair strands, deep sensual gaze, parted lips, warm glow, studio lighting quality`,
          model: 'Forge Checkpoint HotSwap API',
        };
      }

      const charMsg: ChatMessage = {
        id: `char-${Date.now()}`,
        sender: 'character',
        characterId: activeCharacter.id,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        generatedMedia: mediaData,
      };

      setMessages((prev) => [...prev, charMsg]);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Sidebar: Character Profile, Game Launch & Trigger Controls */}
      <div className="lg:col-span-1 space-y-4">
        
        {/* Active Character Card */}
        <div className="bg-slate-900 border border-pink-900/40 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={activeCharacter.avatar}
              alt={activeCharacter.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-500/60 shadow-md shadow-pink-600/20"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-base">{activeCharacter.name}</h3>
                <span className="text-[10px] bg-pink-950 text-pink-300 border border-pink-700/50 px-1.5 py-0.2 rounded-full font-mono">
                  {activeCharacter.age}J
                </span>
              </div>
              <p className="text-xs text-pink-300 font-medium">{activeCharacter.role}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Aussehen &amp; Körper:</span>
              <p className="text-slate-300">{activeCharacter.appearance.body}</p>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Stil &amp; Kleidung:</span>
              <p className="text-slate-300">{activeCharacter.appearance.style}</p>
            </div>
          </div>

          {/* Switch Character Dropdown */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-[11px] text-slate-400 font-medium block mb-1">
              Figur wechseln:
            </label>
            <div className="flex gap-1.5">
              {characters.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCharacterId(c.id)}
                  className={`flex-1 text-xs py-1.5 px-2 rounded-lg font-medium transition-all ${
                    activeCharacterId === c.id
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* EROTIC GAME LAUNCH CARD */}
        <div className="bg-gradient-to-r from-pink-950/90 via-purple-950/70 to-slate-900 border-2 border-pink-700/60 rounded-2xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>Erotik-Spiel im Chat</span>
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-pink-900 text-pink-200 border border-pink-700 font-bold uppercase">
              Interaktiv
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Flaschendrehen mit Dreh-Physik, intimen Wahrheiten, Pflicht-Aufgaben, Strip-Meter &amp; Erotik-Würfeln.
          </p>

          <button
            onClick={() => setIsGameModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 border border-pink-400/40"
          >
            <span>🍾 Flaschendrehen starten</span>
          </button>
        </div>

        {/* In-Chat Visual Generator Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-pink-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generierungs-Typ</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Chromebook Online</span>
          </div>

          {/* Toggle Image vs Video Output */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setMediaTriggerType('image')}
              className={`text-xs py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                mediaTriggerType === 'image'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Bilder</span>
            </button>
            <button
              onClick={() => setMediaTriggerType('video')}
              className={`text-xs py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                mediaTriggerType === 'video'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Videos (Clips)</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => setStyleMode('photorealistic')}
              className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-all ${
                styleMode === 'photorealistic'
                  ? 'bg-slate-700 text-pink-300 border border-pink-500/50'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Fotorealismus
            </button>
            <button
              onClick={() => setStyleMode('anime')}
              className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-all ${
                styleMode === 'anime'
                  ? 'bg-slate-700 text-pink-300 border border-pink-500/50'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Pony Anime XL
            </button>
          </div>
        </div>

        {/* 1-Click Trigger Action Shortcuts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
            Schnell-Aktionen im Chat:
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setIsGameModalOpen(true)}
              className="text-left text-xs p-2 rounded-lg bg-pink-950/70 hover:bg-pink-900/80 text-pink-200 border border-pink-800/50 transition-all flex items-center gap-2 font-semibold"
            >
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              <span>🍾 Flaschendrehen / Wahrheit / Pflicht</span>
            </button>
            <button
              onClick={() => handleSendMessage('*zieht ihren Bikini langsam aus und lächelt verlegen*', 'image')}
              className="text-left text-xs p-2 rounded-lg bg-slate-800/80 hover:bg-pink-950/60 hover:text-pink-300 text-slate-300 transition-all flex items-center gap-2"
            >
              <Flame className="w-3.5 h-3.5 text-pink-500" />
              <span>*Bikini ausziehen (Foto)*</span>
            </button>
            <button
              onClick={() => handleSendMessage('*tanzt langsam und lasziv am Strand im Abendlicht*', 'video')}
              className="text-left text-xs p-2 rounded-lg bg-slate-800/80 hover:bg-pink-950/60 hover:text-pink-300 text-slate-300 transition-all flex items-center gap-2"
            >
              <Film className="w-3.5 h-3.5 text-indigo-400" />
              <span>*Video-Clip generieren (4K)*</span>
            </button>
            <button
              onClick={() => handleSendMessage('*dreht sich um und geht auf alle Viere*', 'image')}
              className="text-left text-xs p-2 rounded-lg bg-slate-800/80 hover:bg-pink-950/60 hover:text-pink-300 text-slate-300 transition-all flex items-center gap-2"
            >
              <Camera className="w-3.5 h-3.5 text-rose-500" />
              <span>*Auf alle Viere gehen (Doggy)*</span>
            </button>
            <button
              onClick={() => handleSendMessage('*haucht dir leise ins Ohr und flüstert dirty talk*')}
              className="text-left text-xs p-2 rounded-lg bg-slate-800/80 hover:bg-pink-950/60 hover:text-pink-300 text-slate-300 transition-all flex items-center gap-2"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Dirty Talk &amp; Stimme anhören</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Chat Stream & Live In-Chat Generation Feed */}
      <div className="lg:col-span-3 flex flex-col h-[750px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Chat Stream Header */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-white text-sm">
              Artanis Chat: {activeCharacter.name}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">| 100% Unzensiert &amp; Direkt</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Direct Erotic Game Button */}
            <button
              onClick={() => setIsGameModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-pink-600/30 transition-all cursor-pointer border border-pink-400/40"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>🍾 Flaschendrehen spielen</span>
            </button>

            <span className="px-2 py-1 rounded bg-pink-950 text-pink-300 border border-pink-800/50 font-mono text-[11px] hidden md:inline">
              {mediaTriggerType === 'video' ? 'Video (SVD)' : 'txt2img (SDXL)'}
            </span>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/20 rounded-br-none'
                    : 'bg-slate-950/90 text-slate-200 border border-pink-950/80 rounded-bl-none shadow-md'
                }`}
              >
                {/* Format italics for actions */}
                <div className="whitespace-pre-wrap">
                  {msg.text.split(/(\*[^*]+\*)/g).map((part, index) => {
                    if (part.startsWith('*') && part.endsWith('*')) {
                      return (
                        <span key={index} className="italic text-pink-300 font-medium bg-pink-950/40 px-1 py-0.5 rounded">
                          {part}
                        </span>
                      );
                    }
                    return <span key={index}>{part}</span>;
                  })}
                </div>

                <div className="mt-2 text-[10px] text-slate-400 text-right">
                  {msg.timestamp}
                </div>
              </div>

              {/* In-Chat Auto-Generated Media Card (Image or Video) */}
              {msg.generatedMedia && (
                <div className="max-w-[85%] bg-slate-950 border border-pink-900/60 rounded-2xl overflow-hidden shadow-2xl p-3 space-y-3">
                  <div className="flex items-center justify-between text-xs text-pink-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      {msg.generatedMedia.type === 'video' ? (
                        <>
                          <Film className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Video-Clip aus Chat erzeugt ({msg.generatedMedia.model})</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5 text-pink-400" />
                          <span>Foto aus Chat erzeugt ({msg.generatedMedia.model})</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-pink-950 text-pink-200 border border-pink-800/40">
                      {msg.generatedMedia.type === 'video' ? '60 FPS 4K' : 'High-Res'}
                    </span>
                  </div>

                  {/* Media Visual Container */}
                  <div className="relative rounded-xl overflow-hidden group aspect-video bg-black flex items-center justify-center">
                    <img
                      src={msg.generatedMedia.url}
                      alt="Generiertes Medium"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    
                    {msg.generatedMedia.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg shadow-pink-600/40">
                          <Play className="w-5 h-5 ml-0.5" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {msg.generatedMedia.promptUsed}
                      </p>
                    </div>
                  </div>

                  {/* Prompt Copy & Audio Simulator */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyPrompt(msg.generatedMedia!.promptUsed, msg.id)}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-pink-300 py-1 px-2 rounded bg-slate-900 hover:bg-slate-850 transition-colors cursor-pointer"
                      >
                        {copiedPromptId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Prompt kopiert!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Prompt kopieren</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const utterance = new SpeechSynthesisUtterance(msg.text.replace(/\*[^*]+\*/g, ''));
                            utterance.lang = 'de-DE';
                            utterance.pitch = activeCharacter.id === 'tania' ? 0.85 : 1.15;
                            utterance.rate = 0.9;
                            window.speechSynthesis.speak(utterance);
                          } else {
                            alert(`Stimme von ${activeCharacter.name} abgespielt: "${msg.text.slice(0, 80)}..."`);
                          }
                        }}
                        className="flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 py-1 px-2 rounded bg-purple-950/60 border border-purple-800/40 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3 text-purple-400" />
                        <span>Dirty Talk abspielen</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      Artanis API: 200 OK
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-pink-400 bg-pink-950/40 p-3 rounded-xl border border-pink-900/40 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
              <span>{activeCharacter.name} führt die Aktion aus und generiert Medien...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Schreibe mit ${activeCharacter.name}... (oder klicke auf "Flaschendrehen")`}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={isGenerating || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Senden</span>
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Tipp: Setze Handlungen in Sternchen <code>*...*</code> oder starte das Flaschendrehen</span>
            <span>Vollständig unzensiert</span>
          </div>
        </div>

      </div>

      {/* SPIN THE BOTTLE / TRUTH OR DARE GAME MODAL */}
      <SpinTheBottleGame
        characters={characters}
        activeCharacterId={activeCharacterId}
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        onPlayInChat={(gameText, forcedType) => handleSendMessage(gameText, forcedType)}
      />

    </div>
  );
};
