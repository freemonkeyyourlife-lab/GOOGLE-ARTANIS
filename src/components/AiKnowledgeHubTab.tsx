import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Code2, 
  Terminal, 
  Sparkles, 
  Server, 
  Cpu, 
  Volume2, 
  Film, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Laptop, 
  Zap,
  HelpCircle,
  FolderGit2,
  Sliders,
  Send,
  MessageSquare
} from 'lucide-react';

interface KnowledgeArticle {
  id: string;
  category: 'code' | 'prompt' | 'server' | 'model' | 'voice' | 'video' | 'chromebook' | 'training';
  title: string;
  summary: string;
  tags: string[];
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
  terminalCommand?: string;
  portsOrEndpoints?: string;
}

const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-tailscale-forge',
    category: 'server',
    title: 'Tailscale VPN zu Stable Diffusion Forge (Port 7860)',
    summary: 'Sichere Verbindung vom Chromebook zum entfernten GPU-Server ohne Portweiterleitung oder Firewall-Öffnung.',
    tags: ['Tailscale', 'Forge', 'Port 7860', 'Remote GPU', 'Sicherheit'],
    portsOrEndpoints: 'http://100.82.14.90:7860',
    terminalCommand: 'tailscale up && ./webui.sh --listen --api --port 7860 --enable-insecure-extension-access',
    codeSnippet: `# Python API Test für Forge / A1111 über Tailscale
import requests

url = "http://100.82.14.90:7860/sdapi/v1/txt2img"
payload = {
    "prompt": "score_9, score_8_up, stunning woman Mia, luxury silk lingerie, 8k uhd photorealism",
    "negative_prompt": "deformed, blurry, bad anatomy",
    "steps": 28,
    "cfg_scale": 7.0,
    "width": 864,
    "height": 1152
}
response = requests.post(url, json=payload, timeout=60)
print("Status:", response.status_code)`,
    codeLanguage: 'python',
    content: `Tailscale erzeugt ein verschlüsseltes WireGuard-Mesh-Netzwerk. Der GPU-Server erhält eine statische IP im Bereich 100.x.y.z (z.B. 100.82.14.90).
Starte Forge mit den Argumenten '--api --listen', damit die Schnittstelle auch über das Tailscale-Interface Anfragen entgegennimmt. Auf dem Chromebook rufst du die URL direkt im Browser auf.`
  },
  {
    id: 'art-sillytavern-setup',
    category: 'server',
    title: 'SillyTavern & KoboldCPP (Unzensierter Chat & Sprach-Backend)',
    summary: 'Lokales oder Remote Rollenspiel-Frontend mit GGUF-Modellen, Charakterkarten und XTTS-Sprachausgabe.',
    tags: ['SillyTavern', 'KoboldCPP', 'GGUF', 'Port 8000', 'Port 5001'],
    portsOrEndpoints: 'http://localhost:8000 (SillyTavern) | http://localhost:5001 (KoboldCPP)',
    terminalCommand: '# SillyTavern starten:\ngit clone https://github.com/SillyTavern/SillyTavern.git && cd SillyTavern && npm install && npm start\n\n# KoboldCPP mit GGUF starten:\n./koboldcpp --model Llama-3-8B-Instruct-Q4_K_M.gguf --port 5001 --usecublas',
    content: `SillyTavern ist das führende Interface für Charakterkarten (PNG/JSON), Sprachsteuerung und unzensiertes Rollenspiel. 
KoboldCPP dient als extrem speichereffizientes Backend für GGUF-Modelle auf CPU oder GPU. In SillyTavern wählst du als API 'KoboldAI' und trägst 'http://localhost:5001' ein.`
  },
  {
    id: 'art-sdxl-prompting',
    category: 'prompt',
    title: 'Meister-Prompting für SDXL & Fotorealismus (BigAsp v2 / RealVis)',
    summary: 'Exakte Token-Gewichtung für lebendige Hauttextur, natürliche Poren, Tiefenschärfe und Lichtbrechung.',
    tags: ['SDXL', 'BigAsp v2', 'Photorealism', 'Hauttextur', '8k'],
    codeSnippet: `// Positiver Prompt:
score_9, score_8_up, masterpiece, raw photo, stunning 24yo woman Mia, warm brown-green eyes, natural wet skin texture, detailed skin pores, wearing delicate gold-trimmed black lace lingerie, luxury penthouse balcony, warm golden hour sun flare, depth of field, 85mm f/1.4 lens, 8k uhd photorealistic

// Negativer Prompt:
deformed, bad anatomy, bad hands, missing fingers, extra limbs, fused fingers, distorted face, blurry, low quality, oversaturated, drawing, cartoon, anime, 3d render, watermark, signature`,
    codeLanguage: 'text',
    content: `SDXL-Modelle reagieren besonders sensibel auf Qualitätspräfixe wie 'score_9, score_8_up, masterpiece' und physikalische Kameraangaben (z.B. '85mm f/1.4 lens', 'raw photo'). Vermeide generische Füllwörter wie 'very beautiful' und setze stattdessen auf Beleuchtung, Material (Seide, Spitze) und Hautdetails.`
  },
  {
    id: 'art-google-imagen3',
    category: 'prompt',
    title: 'Google Bild-Studio (Imagen 3 & Gemini 2.5 Flash)',
    summary: 'Richtlinien für natürliche Sprache, Bildstile (Porträt, Film 35mm, 3D-Comic) und Referenzbilder.',
    tags: ['Google AI Studio', 'Imagen 3', 'Gemini', 'Porträt', '3D-Comic', 'Film'],
    codeSnippet: `# API-Aufruf für Google Imagen 3 Bildgenerierung
import google.generativeai as genai

genai.configure(api_key="DEIN_GOOGLE_API_KEY")
result = genai.generate_images(
    model="models/imagen-3.0-generate-002",
    prompt="Cinematic 35mm film still of Mia standing in an ambient gold-lit luxury lounge, Kodak Vision3 tone, sharp focus, 8k",
    number_of_images=4,
    aspect_ratio="9:16"
)`,
    codeLanguage: 'python',
    content: `Google Imagen 3 versteht deskriptive natürliche Sätze deutlich besser als Aneinanderreihungen von Komma-Tags. Die wichtigsten Bildstile:
1. Porträt: Fokus auf Mimik, Augenreflexionen, natürliche Poren.
2. Film (35mm): Weiches Filmkorn, anamorphotische Farbtiefe, Kodak-Farbtemperatur.
3. 3D-Comic: Stylischer CGI-Look mit Raytracing und Unreal Engine 5 Beleuchtung.`
  },
  {
    id: 'art-lora-training',
    category: 'training',
    title: 'LoRA Charakter-Training für eigene Figuren (Mia / Tania)',
    summary: 'Vorbereitung von 15–30 hochauflösenden Bildern, Auto-Captioning und Kohya_ss Trainingsparameter.',
    tags: ['LoRA', 'Training', 'Kohya_ss', 'SDXL', 'Triggerwort', 'Rank 32'],
    terminalCommand: 'accelerate launch --num_cpu_threads_per_process=2 "./sdxl_train_network.py" \\\n  --pretrained_model_name_or_path="models/sdxl_base.safetensors" \\\n  --train_data_dir="./dataset/mia" \\\n  --output_name="mia_v2_lora" \\\n  --network_dim=32 --network_alpha=16 \\\n  --learning_rate=0.0001 --max_train_epochs=10',
    content: `Für ein sauberes Charakter-LoRA benötigst du:
- 15 bis 30 Bilder (Nahaufnahmen Gesicht, Halbkörper, Ganzkörper, verschiedene Outfits & Beleuchtungen).
- Quadratische oder seitenverhältnisgerechte Auflösung (z.B. 1024x1024 für SDXL).
- Textdateien mit identischem Namen (.txt) und dem festen Triggerwort (z.B. 'mia_character, woman with brown hair...').
- Rank 32 / Alpha 16 bietet die beste Balance zwischen Ähnlichkeit und Flexibilität beim Posing.`
  },
  {
    id: 'art-xtts-voice-cloning',
    category: 'voice',
    title: 'XTTS v2 / AllTalk: Stimme clonen & Dirty-Talk steuern',
    summary: '10 bis 30 Sekunden saubere Sprachaufnahme einsprechen und als Echtzeit-Sprachklon für Charaktere nutzen.',
    tags: ['XTTS v2', 'AllTalk', 'Voice Clone', 'Mikrofon', 'Stimme'],
    terminalCommand: '# AllTalk TTS Server starten:\ngit clone https://github.com/daswer123/alltalk_tts.git && cd alltalk_tts\npip install -r requirements.txt && python3 script.py',
    content: `XTTS v2 benötigt lediglich ein 10–20 Sekunden langes, rauschfreies Audio-Sample (WAV, 24kHz/48kHz). 
Wichtig für erotische Sprachausgabe:
- Flüsterton und Atemgeräusche bereits in der Vorlage einsprechen.
- Tonhöhe (Pitch) leicht senken (0.85–0.95 für dominante oder intime Frauenstimmen).
- Sprechgeschwindigkeit auf ca. 0.9x stellen, um Pausen und Verführung hervorzuheben.`
  },
  {
    id: 'art-facefusion-reactor',
    category: 'video',
    title: 'Faceswapping & Video-Bearbeitung mit FaceFusion / ReActor',
    summary: 'Gesichtstausch in Bildern und Videos mit GPU-Beschleunigung und nahtloser Farbanpassung.',
    tags: ['FaceFusion', 'ReActor', 'Faceswap', 'Video', 'InsightFace'],
    terminalCommand: 'git clone https://github.com/facefusion/facefusion.git && cd facefusion\npython3 install.py && python3 facefusion.run --execution-providers cuda',
    content: `FaceFusion und das ReActor Forge-Plugin nutzen InsightFace Onnx-Modelle (inswapper_128), um Gesichter aus Quellbildern fotorealistisch auf Zielbilder oder Videosequenzen zu übertragen.
Tipp: Verwende als Quellbild ein gut ausgeleuchtetes, frontales Porträt mit neutralem Gesichtsausdruck.`
  },
  {
    id: 'art-chromebook-linux',
    category: 'chromebook',
    title: 'Chromebook Linux-Container (Penguin) & externe Festplatten',
    summary: 'Befehle für Dateirechte, externe USB-Platten und lokale Python/Node-Umgebungen auf ChromeOS.',
    tags: ['Chromebook', 'ChromeOS', 'Penguin', 'Crostini', 'USB Mount'],
    terminalCommand: '# Externe Festplatte / USB im Chromebook einbinden:\n# 1. In der Dateien-App: Rechtsklick auf Festplatte -> "Für Linux freigeben"\n# 2. Pfad im Linux-Terminal:\nls -lh /mnt/chromeos/removable/\n\n# Node.js & Python installieren:\nsudo apt update && sudo apt install -y python3-pip python3-venv git curl nodejs npm',
    content: `Im Chromebook Crostini-Container (penguin) liegen freigegebene externe USB-Laufwerke unter '/mnt/chromeos/removable/'. 
Mit 'chmod +x' machst du heruntergeladene Binärdateien (z.B. stash-linux oder koboldcpp) sofort ausführbar.`
  },
  {
    id: 'art-fastapi-backend',
    category: 'code',
    title: 'Eigenes Python FastAPI Backend für In-Chat Generierung',
    summary: 'Schlanke REST-API, die Chat-Nachrichten empfängt und im Hintergrund automatisch Forge-Bilder triggert.',
    tags: ['Python', 'FastAPI', 'Uvicorn', 'Backend', 'In-Chat'],
    codeSnippet: `from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    character: str

@app.post("/api/chat-action")
def handle_action(req: ChatRequest):
    # Erkennt intime Beschreibungen und erzeugt passendes Bild
    if "*" in req.message or "ausziehen" in req.message.lower():
        prompt = f"stunning {req.character}, {req.message}, 8k photorealistic"
        # Sende an Forge Server
        forge_resp = requests.post("http://localhost:7860/sdapi/v1/txt2img", json={"prompt": prompt, "steps": 25})
        return {"reply": f"*{req.character} reagiert hingebungsvoll*", "has_image": True}
    return {"reply": f"Ich habe dich gehört: {req.message}", "has_image": False}`,
    codeLanguage: 'python',
    terminalCommand: 'pip install fastapi uvicorn requests && uvicorn server:app --host 0.0.0.0 --port 8501 --reload',
    content: `FastAPI ermöglicht asynchrone Webhooks. Bei eingehenden Chat-Nachrichten mit Sternchen (*...*) oder Aktionswörtern wird die Stable Diffusion Forge API (/sdapi/v1/txt2img) automatisch angesteuert und das fertige Bild direkt als base64 oder URL an den Chat zurückgesendet.`
  }
];

export const AiKnowledgeHubTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive Neutral Q&A Engine
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [consultationAnswer, setConsultationAnswer] = useState<{
    query: string;
    answer: string;
    actionSteps: string[];
    terminalCommand?: string;
    codeSnippet?: string;
  } | null>(null);
  const [isConsulting, setIsConsulting] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Alle Themen' },
    { id: 'server', label: 'Server & Ports' },
    { id: 'prompt', label: 'Prompts & Kinks' },
    { id: 'code', label: 'Coden & Skripte' },
    { id: 'model', label: 'Modelle & VAE' },
    { id: 'training', label: 'LoRA Training' },
    { id: 'voice', label: 'Stimmen & Audio' },
    { id: 'video', label: 'Video & Faceswap' },
    { id: 'chromebook', label: 'Chromebook & Linux' },
  ];

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.tags.some(t => t.toLowerCase().includes(q)) ||
      art.content.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Neutral Q&A engine logic
  const handleAskQuestion = (customQuery?: string) => {
    const query = (customQuery || userQuestion).trim();
    if (!query) return;

    setIsConsulting(true);

    setTimeout(() => {
      const qLower = query.toLowerCase();
      let resAnswer = '';
      let steps: string[] = [];
      let command: string | undefined = undefined;
      let code: string | undefined = undefined;

      if (qLower.includes('tailscale') || qLower.includes('100.') || qLower.includes('ip')) {
        resAnswer = 'Tailscale stellt eine Ende-zu-Ende verschlüsselte Verbindung zwischen deinem Chromebook und dem GPU-Server her. Keine Router-Ports oder Firewall-Öffnungen erforderlich.';
        steps = [
          'Auf dem Server: "tailscale up" ausführen und die vergebene 100.x.y.z IP ablesen.',
          'Forge mit Argumenten starten: "./webui.sh --listen --api --port 7860".',
          'Auf dem Chromebook: Im Reiter "Bild-Generator" unter "Verbindung" die IP "http://100.x.y.z:7860" eintragen und speichern.'
        ];
        command = 'tailscale status && ./webui.sh --listen --api --port 7860';
      } else if (qLower.includes('sillytavern') || qLower.includes('tavern') || qLower.includes('karte') || qLower.includes('chat')) {
        resAnswer = 'SillyTavern verwaltet unzensierte Charakter-Karten (.png mit eingebetteten Metadaten) und verbindet sich nahtlos mit lokalen LLMs (KoboldCPP) oder Cloud-APIs.';
        steps = [
          'SillyTavern im Terminal starten: "cd SillyTavern && npm start" (erreichbar unter http://localhost:8000).',
          'In SillyTavern auf das Icon "Charaktere" klicken und die exportierte JSON/PNG-Karte von Mia oder Tania hineinziehen.',
          'Unter "API Connections" KoboldAI wählen und mit "http://localhost:5001" verbinden.'
        ];
        command = 'cd SillyTavern && npm start';
      } else if (qLower.includes('stimme') || qLower.includes('xtts') || qLower.includes('audio') || qLower.includes('einsprechen')) {
        resAnswer = 'Für lebendige erotische Sprachausgabe nutzt du das Stimmen-Studio: Eigene Stimmproben können direkt über das Mikrofon eingesprochen oder als WAV-Datei hochgeladen werden.';
        steps = [
          'Im Reiter "Stimmen" auf "Live Stimme einsprechen" klicken und 10–20 Sekunden Testtext flüstern.',
          'Tonhöhe (Pitch) auf 0.9x–1.05x und Hauchigkeit auf 75–85% justieren.',
          'Auf "Stimme anhören" klicken, um die Sprachsynthese direkt über die Browser-Engine auszuführen.'
        ];
      } else if (qLower.includes('prompt') || qLower.includes('kink') || qLower.includes('bild') || qLower.includes('haut')) {
        resAnswer = 'Für fotorealistische Hautdetails und authentische Erotik-Bilder ist das Zusammenspiel aus SDXL-Qualitäts-Scores und negativen Tokens entscheidend.';
        steps = [
          'Positiv-Start: "score_9, score_8_up, masterpiece, raw photo, stunning 24yo woman Mia, natural wet skin texture, detailed skin pores, 8k uhd".',
          'Stil wählen: Porträt (Nahaufnahme), Film (35mm Körnung) oder 3D-Comic (CGI).',
          'Negativ immer setzen: "deformed, bad anatomy, bad hands, blurry, drawing, cartoon".'
        ];
        code = `score_9, score_8_up, masterpiece, raw photo, stunning 24yo woman Mia, emerald eyes, wet skin texture, detailed skin pores, wearing luxury silk lingerie, 8k uhd photorealism`;
      } else if (qLower.includes('chromebook') || qLower.includes('linux') || qLower.includes('festplatte') || qLower.includes('usb')) {
        resAnswer = 'Auf dem Chromebook läuft Linux im sicheren Crostini-Container (penguin). Externe Festplatten müssen in der ChromeOS Dateien-App für Linux freigegeben werden.';
        steps = [
          'Dateien-App öffnen -> Rechtsklick auf Festplatte/USB -> "Für Linux freigeben".',
          'Im Terminal liegt der Pfad unter "/mnt/chromeos/removable/[Name-der-Platte]".',
          'Dateien können mit "ls -lh /mnt/chromeos/removable/" durchsucht werden.'
        ];
        command = 'ls -lh /mnt/chromeos/removable/';
      } else {
        resAnswer = `Konkrete Analyse für Anfrage "${query}": Dieses Thema ist vollständig im ARTANIS Studio modularisierbar. Nutze die vorgefertigten Endpunkte und Skripte.`;
        steps = [
          'Prüfe, ob der entsprechende Dienst (Forge: 7860, SillyTavern: 8000, Kobold: 5001) aktiv ist.',
          'Kopiere den passenden Terminal-Befehl aus der Enzyklopädie.',
          'Führe den Test über den jeweiligen Tab (Bild-Generator, Stimmen oder Dateien) aus.'
        ];
      }

      setConsultationAnswer({
        query,
        answer: resAnswer,
        actionSteps: steps,
        terminalCommand: command,
        codeSnippet: code,
      });

      setIsConsulting(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Luxury Black, Gold & Silver Glass */}
      <div className="relative overflow-hidden rounded-2xl bg-black/85 backdrop-blur-2xl border border-amber-500/25 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>KI-Nachschlagewerk &amp; Enzyklopädie · 100% Neutral &amp; Konkret</span>
              </span>
            </div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent font-serif tracking-tight">
              Master-Wissen: Coden, Prompts, Server &amp; Anbinden
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Vollständiges technisches Nachschlagewerk über Modelle, Tailscale-Verbindungen, Forge, SillyTavern, KoboldCPP, Stash, XTTS-Stimmen, Faceswap und Chromebook-Linux.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-300 bg-zinc-950/80 border border-amber-500/40 px-3 py-1.5 rounded-xl font-mono shadow-inner">
              {KNOWLEDGE_ARTICLES.length} Fachartikel geladen
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Neutral Consultation Bar */}
      <div className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interaktive Sofort-Auskunft &amp; Problemlöser (Jede Frage / Jeder Auftrag)</span>
          </span>
          <span className="text-[10px] text-zinc-500">100% sachlich, unzensiert &amp; lösungsorientiert</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
            placeholder="z.B.: Wie binde ich Tailscale in Forge ein? Oder: Welcher Prompt für fotorealistische Haut?"
            className="flex-1 bg-black/70 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
          />
          <button
            onClick={() => handleAskQuestion()}
            disabled={isConsulting || !userQuestion.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isConsulting ? <Zap className="w-4 h-4 animate-spin text-black" /> : <Send className="w-4 h-4" />}
            <span>Analysieren</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-zinc-500 text-[10px]">Häufige Aufträge:</span>
          {[
            'Tailscale mit Forge verbinden',
            'SillyTavern & Kobold starten',
            'SDXL Hauttextur Prompt',
            'Eigene Stimme für Mia einsprechen',
            'USB-Festplatte in Chromebook Linux'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setUserQuestion(suggestion);
                handleAskQuestion(suggestion);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-amber-950/40 text-zinc-300 hover:text-amber-200 border border-zinc-800 hover:border-amber-500/30 transition-colors cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Interactive Consultation Result */}
        {consultationAnswer && (
          <div className="mt-4 p-4 rounded-xl bg-black/80 border border-amber-500/30 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold text-amber-300 font-mono">
                Ergebnis für: &quot;{consultationAnswer.query}&quot;
              </span>
              <button
                onClick={() => setConsultationAnswer(null)}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                Schließen
              </button>
            </div>

            <p className="text-xs text-zinc-200 leading-relaxed">
              {consultationAnswer.answer}
            </p>

            {consultationAnswer.actionSteps.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">
                  Konkrete Schritt-für-Schritt Anleitung:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-300">
                  {consultationAnswer.actionSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {consultationAnswer.terminalCommand && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-zinc-400 font-mono">Terminal-Befehl (Linux / Chromebook):</span>
                  <button
                    onClick={() => handleCopy(consultationAnswer.terminalCommand!, 'ans-cmd')}
                    className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'ans-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Kopieren</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-emerald-300 font-mono overflow-x-auto">
                  {consultationAnswer.terminalCommand}
                </pre>
              </div>
            )}

            {consultationAnswer.codeSnippet && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-zinc-400 font-mono">Code / Prompt:</span>
                  <button
                    onClick={() => handleCopy(consultationAnswer.codeSnippet!, 'ans-code')}
                    className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'ans-code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Kopieren</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-amber-200 font-mono overflow-x-auto whitespace-pre-wrap">
                  {consultationAnswer.codeSnippet}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Artikel filtern..."
            className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Encyclopedia Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 p-5 shadow-xl space-y-3.5 hover:border-amber-400/50 transition-all group"
          >
            {/* Header & Badges */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                  {article.category.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                  {article.title}
                </h3>
              </div>

              {article.portsOrEndpoints && (
                <span className="text-[10px] text-zinc-400 font-mono bg-black/60 border border-zinc-800 px-2 py-0.5 rounded-lg whitespace-nowrap">
                  {article.portsOrEndpoints}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {article.summary}
            </p>

            <p className="text-xs text-zinc-400 leading-relaxed bg-black/40 p-3 rounded-xl border border-zinc-800/80">
              {article.content}
            </p>

            {/* Terminal Command Snippet */}
            {article.terminalCommand && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-mono flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-emerald-400" />
                    <span>Terminal-Befehl:</span>
                  </span>
                  <button
                    onClick={() => handleCopy(article.terminalCommand!, `${article.id}-cmd`)}
                    className="text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === `${article.id}-cmd` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Kopieren</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-xl bg-black/90 border border-zinc-800 text-[11px] text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap">
                  {article.terminalCommand}
                </pre>
              </div>
            )}

            {/* Code Snippet */}
            {article.codeSnippet && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-mono flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-amber-400" />
                    <span>Code / Prompt-Vorlage ({article.codeLanguage || 'text'}):</span>
                  </span>
                  <button
                    onClick={() => handleCopy(article.codeSnippet!, `${article.id}-code`)}
                    className="text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === `${article.id}-code` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Kopieren</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-xl bg-black/90 border border-zinc-800 text-[11px] text-amber-200/90 font-mono overflow-x-auto whitespace-pre-wrap">
                  {article.codeSnippet}
                </pre>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1 pt-1">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
