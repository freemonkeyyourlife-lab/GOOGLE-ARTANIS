import React, { useState } from 'react';
import { 
  Wrench, 
  ExternalLink, 
  Download, 
  Terminal, 
  Copy, 
  Check, 
  CheckCircle2, 
  Layers, 
  Server, 
  Zap, 
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

export const SetupHubTab: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedBatch, setCopiedBatch] = useState(false);

  const dockerComposeYaml = `version: '3.8'

services:
  # 1. Stash: Medien-Galerie & Organizer für Festplatten & Zips
  stash:
    image: stashapp/stash:latest
    container_name: stash
    restart: unless-stopped
    ports:
      - "9999:9999"
    environment:
      - STASH_STASH=/data/
      - STASH_GENERATED=/generated/
      - STASH_METADATA=/metadata/
      - STASH_CACHE=/cache/
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - ./stash/config:/root/.stash
      - ./stash/generated:/generated
      - ./stash/metadata:/metadata
      - ./stash/cache:/cache
      # HIER deinen lokalen Foto- / Video-Ordner einhängen:
      - /media/photos:/data:ro

  # 2. SillyTavern: Chat-Frontend & Rollenspiele
  sillytavern:
    image: ghcr.io/sillytavern/sillytavern:latest
    container_name: sillytavern
    restart: unless-stopped
    ports:
      - "8000:8000"
    volumes:
      - ./sillytavern/config:/home/node/app/config
      - ./sillytavern/data:/home/node/app/data

  # 3. Text-KI Backend: Ollama (Unzensierte LLMs)
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ./ollama_models:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
`;

  const handleCopyDocker = () => {
    navigator.clipboard.writeText(dockerComposeYaml);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Code & Grafische Oberflächen</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Dein 1-Klick Setup für die private Plattform
            </h2>
            <p className="text-xs text-slate-400">
              Keine Programmierkenntnisse nötig – alle Tools haben fertige Installationsprogramme und Web-Oberflächen
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Schritt:</span>
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                  activeStep === step
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Setup Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step Navigation Menu */}
        <div className="space-y-3">
          
          <button
            onClick={() => setActiveStep(1)}
            className={`w-full p-4 rounded-2xl border text-left transition-all ${
              activeStep === 1
                ? 'bg-slate-900 border-pink-500 ring-1 ring-pink-500/40 shadow-lg'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Schritt 1</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-pink-950 text-pink-300 font-medium">Medien</span>
            </div>
            <h3 className="font-bold text-white text-sm">Stash (Festplatten & Netflix-Galerie)</h3>
            <p className="text-xs text-slate-400 mt-1">Automatische Festplatten-Durchsuchung und Tagging</p>
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`w-full p-4 rounded-2xl border text-left transition-all ${
              activeStep === 2
                ? 'bg-slate-900 border-pink-500 ring-1 ring-pink-500/40 shadow-lg'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Schritt 2</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-medium">Bilder-KI</span>
            </div>
            <h3 className="font-bold text-white text-sm">Stable Diffusion Forge (1-Klick Installer)</h3>
            <p className="text-xs text-slate-400 mt-1">Bilder & Pornos per Mausklick generieren</p>
          </button>

          <button
            onClick={() => setActiveStep(3)}
            className={`w-full p-4 rounded-2xl border text-left transition-all ${
              activeStep === 3
                ? 'bg-slate-900 border-pink-500 ring-1 ring-pink-500/40 shadow-lg'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Schritt 3</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-medium">Rollenspiel</span>
            </div>
            <h3 className="font-bold text-white text-sm">SillyTavern & Backups</h3>
            <p className="text-xs text-slate-400 mt-1">Chat-Frontend für Lila, Tania und unzensierte Storys</p>
          </button>

          <button
            onClick={() => setActiveStep(4)}
            className={`w-full p-4 rounded-2xl border text-left transition-all ${
              activeStep === 4
                ? 'bg-slate-900 border-pink-500 ring-1 ring-pink-500/40 shadow-lg'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Schritt 4</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-medium">Server / Cloud</span>
            </div>
            <h3 className="font-bold text-white text-sm">Docker & Cloud-Server (RunPod / Vast.ai)</h3>
            <p className="text-xs text-slate-400 mt-1">Flexibler Umzug auf externe GPU-Server</p>
          </button>

        </div>

        {/* Detailed Step Instructions View */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          {/* STEP 1: STASH */}
          {activeStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Stash: Deine private lokale Medien-Galerie</h3>
                  <p className="text-xs text-slate-400">Durchsucht automatisch deine Festplatten nach Fotos, Videos und Zips</p>
                </div>
                <a
                  href="https://github.com/stashapp/stash/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md shadow-pink-600/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Stash Download</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-pink-950 text-pink-300 border border-pink-800 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Download der Datei</h4>
                    <p className="text-slate-400">
                      Gehe auf die <a href="https://github.com/stashapp/stash/releases" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline">Stash GitHub Releases</a> und lade die <code>stash-win.exe</code> herunter.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-pink-950 text-pink-300 border border-pink-800 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Ordner erstellen & Starten</h4>
                    <p className="text-slate-400">
                      Erstelle auf deinem Laufwerk einen Ordner <code>C:\Stash</code> und lege die Datei hinein. Benenne sie einfach in <code>stash.exe</code> um und mache einen <strong>Doppelklick</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-pink-950 text-pink-300 border border-pink-800 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Im Browser öffnen & Festplatte auswählen</h4>
                    <p className="text-slate-400">
                      Öffne deinen Browser auf <code>http://localhost:9999</code>. Wähle im Einrichtungsassistenten einfach deine Foto-Ordner oder externe Festplatte aus. Stash erstellt automatisch Vorschaubilder, erkennt Gesichter und taggt alles für dich!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-pink-950/40 border border-pink-800/40 p-4 rounded-xl flex items-center justify-between text-xs text-pink-200">
                <span>Dokumentation: Ausführliche Anleitung auf StashDocs</span>
                <a
                  href="https://docs.stashapp.cc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-pink-400 hover:underline flex items-center gap-1"
                >
                  <span>Docs ansehen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* STEP 2: FORGE */}
          {activeStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Stable Diffusion WebUI Forge</h3>
                  <p className="text-xs text-slate-400">Das modernste, schnellste Interface für Bilder & Pornos (One-Click Installer)</p>
                </div>
                <a
                  href="https://github.com/lllyasviel/stable-diffusion-webui-forge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md shadow-pink-600/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Forge GitHub</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-pink-950 text-pink-300 border border-pink-800 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white">One-Click Paket herunterladen</h4>
                    <p className="text-slate-400">
                      Forge bietet ein fertiges 7z-Paket mit allen Abhängigkeiten (Python, Torch, Git). Lade es einfach von der <a href="https://github.com/lllyasviel/stable-diffusion-webui-forge" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline">Forge GitHub Seite</a> herunter und entpacke es.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-pink-950 text-pink-300 border border-pink-800 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Empfohlene NSFW-Modelle von Civitai herunterladen</h4>
                    <p className="text-slate-400">
                      Lade die Checkpoint-Dateien (z. B. <strong>BigAsp v2</strong> für Realismus oder <strong>Pony Diffusion V6</strong> für Anime) mit 1 Klick von <a href="https://civitai.com" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline">Civitai.com</a> herunter und lege sie in den Ordner <code>webui/models/Stable-diffusion</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-pink-950 text-pink-300 border border-pink-800 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Starten mit <code>run.bat</code></h4>
                    <p className="text-slate-400">
                      Doppelklick auf <code>run.bat</code>. Es öffnet sich automatisch dein Browser unter <code>http://localhost:7860</code>. Du musst nichts programmieren – tippe einfach deinen Prompt ein oder nutze unsere Prompt-Matrix!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Civitai Model-Hub für unzensierte Checkpoints:</span>
                <a
                  href="https://civitai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Civitai öffnen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* STEP 3: SILLYTAVERN */}
          {activeStep === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">SillyTavern: Chat, Storys & Charakter-Backups</h3>
                  <p className="text-xs text-slate-400">Das weltweit führende Frontend für unzensierte Rollenspiele</p>
                </div>
                <a
                  href="https://github.com/SillyTavern/SillyTavern"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md shadow-pink-600/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>SillyTavern GitHub</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-pink-950 text-pink-300 border border-pink-800 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Node.js herunterladen</h4>
                    <p className="text-slate-400">
                      Falls noch nicht auf deinem PC: Installiere die offizielle LTS Version von <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline">nodejs.org</a> (einfach immer auf &quot;Next&quot; klicken).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-pink-950 text-pink-300 border border-pink-800 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white">SillyTavern ZIP entpacken & Starten</h4>
                    <p className="text-slate-400">
                      Lade die ZIP von GitHub herunter, entpacke sie und mache einen Doppelklick auf <code>start.bat</code>. Es installiert sich alles von selbst und öffnet sich im Browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-pink-950 text-pink-300 border border-pink-800 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Charaktere per Drag & Drop reinziehen</h4>
                    <p className="text-slate-400">
                      Deine alten Backups (wie Lila) oder neu erstellte Karten ziehst du einfach per Maus in das Browserfenster. Sie sind sofort verfügbar!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DOCKER & CLOUD */}
          {activeStep === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Docker & Cloud-Server (RunPod / Vast.ai)</h3>
                  <p className="text-xs text-slate-400">Möchtest du flexibel umziehen? Nutze dieses Docker Compose File</p>
                </div>
                <button
                  onClick={handleCopyDocker}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md shadow-pink-600/30 transition-all cursor-pointer"
                >
                  {copiedDocker ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDocker ? 'Kopiert!' : 'Docker Compose kopieren'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Mit dieser Datei kannst du deine gesamte Plattform mit einem einzigen Befehl (<code>docker compose up -d</code>) auf jedem Linux-Server oder gemieteten Cloud-GPU (z. B. RunPod oder Vast.ai) starten:
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 max-h-72 overflow-y-auto scrollbar-thin">
                <pre>{dockerComposeYaml}</pre>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-pink-400 font-bold block mb-1">RunPod</span>
                  <p className="text-slate-400 text-[11px]">Günstige Nvidia GPUs stundenweise mieten ohne Bindung.</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-purple-400 font-bold block mb-1">Tailscale</span>
                  <p className="text-slate-400 text-[11px]">Sicherer VPN-Tunnel zu deinem Heimserver von unterwegs.</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
