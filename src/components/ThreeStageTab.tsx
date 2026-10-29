import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Character } from '../types';
import { 
  Eye, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  Camera, 
  Sun, 
  Maximize2,
  Flame,
  Layers,
  Play
} from 'lucide-react';

interface ThreeStageTabProps {
  characters: Character[];
  activeCharacterId: string;
}

export const ThreeStageTab: React.FC<ThreeStageTabProps> = ({
  characters,
  activeCharacterId,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedCharId, setSelectedCharId] = useState<string>(activeCharacterId);
  const [cameraView, setCameraView] = useState<'studio' | 'closeup' | 'pov_doggy' | 'orbit'>('studio');
  const [lightingPreset, setLightingPreset] = useState<'neon_pink' | 'golden_sunset' | 'cyber_dark'>('neon_pink');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioTrack, setAudioTrack] = useState<'tania_whisper' | 'beach_waves' | 'heartbeat'>('tania_whisper');

  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera & WebGL Renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.04);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Lighting Rig (Warm Key, Cool Rim, Soft Fill)
    const ambientLight = new THREE.AmbientLight(0x221326, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf43f5e, 2.8);
    keyLight.position.set(2.5, 4.0, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xa855f7, 3.5, 10);
    rimLight.position.set(-3.0, 2.5, -2.0);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 1.5, 8);
    fillLight.position.set(0, -0.5, 2.5);
    scene.add(fillLight);

    // 3. Composite 3D Stage & Character Mannequin Assembly (THREE.Group)
    const characterGroup = new THREE.Group();

    // Floor Pedestal with contact shadow
    const floorGeo = new THREE.CylinderGeometry(2.4, 2.5, 0.15, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.25,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.075;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid accent ring
    const ringGeo = new THREE.RingGeometry(2.2, 2.38, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    // Mannequin Torso & Silhouette (Procedural PBR materials)
    const skinMat = new THREE.MeshStandardMaterial({
      color: selectedChar.id === 'lila' ? 0xe0a97c : 0xf2c4a2,
      roughness: 0.35,
      metalness: 0.08,
    });

    const lingerieMat = new THREE.MeshStandardMaterial({
      color: selectedChar.id === 'lila' ? 0xe11d48 : 0x0f172a,
      roughness: 0.4,
      metalness: 0.5,
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.2,
      metalness: 0.9,
    });

    // Torso (Upper & Lower)
    const chestGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.45, 24);
    const chest = new THREE.Mesh(chestGeo, skinMat);
    chest.position.y = 1.55;
    chest.castShadow = true;
    characterGroup.add(chest);

    // Bikini/Dress Top
    const topGeo = new THREE.CylinderGeometry(0.25, 0.23, 0.22, 24);
    const top = new THREE.Mesh(topGeo, lingerieMat);
    top.position.y = 1.56;
    characterGroup.add(top);

    // Waist / Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.26, 0.4, 24);
    const pelvis = new THREE.Mesh(pelvisGeo, skinMat);
    pelvis.position.y = 1.2;
    pelvis.castShadow = true;
    characterGroup.add(pelvis);

    // Slip / Bikini bottom
    const bottomGeo = new THREE.CylinderGeometry(0.19, 0.27, 0.2, 24);
    const bottom = new THREE.Mesh(bottomGeo, lingerieMat);
    bottom.position.y = 1.15;
    characterGroup.add(bottom);

    // Neck & Head
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.18, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 1.85;
    characterGroup.add(neck);

    const headGeo = new THREE.SphereGeometry(0.16, 24, 24);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 2.05;
    head.castShadow = true;
    characterGroup.add(head);

    // Hair Group
    const hairGeo = new THREE.SphereGeometry(0.19, 20, 20);
    const hairMat = new THREE.MeshStandardMaterial({
      color: selectedChar.id === 'lila' ? 0xfef08a : 0x1c1917,
      roughness: 0.5,
      metalness: 0.1,
    });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 2.08, -0.04);
    characterGroup.add(hair);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.055, 1.05, 16);
    const leftLeg = new THREE.Mesh(legGeo, skinMat);
    leftLeg.position.set(-0.12, 0.52, 0);
    leftLeg.castShadow = true;
    characterGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, skinMat);
    rightLeg.position.set(0.12, 0.52, 0);
    rightLeg.castShadow = true;
    characterGroup.add(rightLeg);

    // Gold Chain Accent
    const chainGeo = new THREE.TorusGeometry(0.2, 0.012, 12, 32);
    const chain = new THREE.Mesh(chainGeo, goldAccentMat);
    chain.rotation.x = Math.PI / 2;
    chain.position.y = 1.05;
    characterGroup.add(chain);

    scene.add(characterGroup);

    // 4. Smooth Rotation & Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle breathing & gentle turntable spin
      characterGroup.rotation.y = elapsedTime * 0.25;
      chest.scale.set(1 + Math.sin(elapsedTime * 2) * 0.02, 1, 1 + Math.sin(elapsedTime * 2) * 0.02);

      // Camera view positioning
      if (cameraView === 'closeup') {
        camera.position.lerp(new THREE.Vector3(0, 1.95, 1.2), 0.05);
        camera.lookAt(0, 1.9, 0);
      } else if (cameraView === 'pov_doggy') {
        camera.position.lerp(new THREE.Vector3(0, 0.9, 2.2), 0.05);
        camera.lookAt(0, 1.2, 0);
      } else {
        camera.position.lerp(new THREE.Vector3(0, 1.6, 4.0), 0.05);
        camera.lookAt(0, 1.3, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 5. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      floorGeo.dispose();
      floorMat.dispose();
      chestGeo.dispose();
      skinMat.dispose();
      lingerieMat.dispose();
      goldAccentMat.dispose();
      renderer.dispose();
    };
  }, [selectedCharId, cameraView, lightingPreset]);

  // Audio Playback Handler
  const toggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = selectedChar.id === 'tania'
          ? 'Ich sehe, wie du mich ansiehst... Komm näher zu mir auf die 3D-Bühne.'
          : 'Mmmh... die Meeresbrise ist so warm... dreh mich noch weiter für dich um...';
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'de-DE';
        utterance.pitch = selectedChar.id === 'tania' ? 0.8 : 1.2;
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 3D Stage Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 text-xs font-semibold mb-1 border border-pink-800/40">
            <Flame className="w-3.5 h-3.5 text-pink-400" />
            <span>Three.js 3D-Bühne &amp; Raumklang</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            3D-Studio: Posen, Beleuchtung &amp; Erotisches Audio
          </h2>
          <p className="text-xs text-slate-400">
            Betrachte die Charaktere frei in 3D aus allen Blickwinkeln (Nahaufnahme, Doggy-POV, Studio) mit dynamischem Audio.
          </p>
        </div>

        {/* Character & Sound Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg ${
              isPlayingAudio 
                ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? 'Audio stoppen' : '🔊 Stimme & Raumklang abspielen'}</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport & Control Dock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main 3D Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[520px] flex items-center justify-center">
          <div ref={mountRef} className="w-full h-[520px]" />

          {/* Floating Camera Angle Selector (Direct Viewport Dock) */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-xl">
            <span className="text-[10px] text-slate-400 font-semibold px-2 uppercase">Kamera:</span>
            <button
              onClick={() => setCameraView('studio')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'studio' ? 'bg-pink-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setCameraView('closeup')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'closeup' ? 'bg-pink-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Nahaufnahme
            </button>
            <button
              onClick={() => setCameraView('pov_doggy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraView === 'pov_doggy' ? 'bg-pink-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Doggy-POV
            </button>
          </div>
        </div>

        {/* Right: Stage Lighting & Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">
              Charakter &amp; Aussehen auf der Bühne
            </h3>

            {/* Character Selector */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Figur auf Bühne rufen:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {characters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCharId(c.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                      selectedCharId === c.id
                        ? 'bg-pink-600 text-white border-pink-400 shadow-md font-bold'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Lighting Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs text-slate-300 font-semibold block">Licht-Stimmung:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'neon_pink', label: 'Neon Pink' },
                  { id: 'golden_sunset', label: 'Sunset Gold' },
                  { id: 'cyber_dark', label: 'Dark Club' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLightingPreset(item.id as typeof lightingPreset)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                      lightingPreset === item.id
                        ? 'bg-pink-600 text-white border-pink-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Voice Lines Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs text-slate-300 font-semibold block">Audio-Spur:</label>
              <select
                value={audioTrack}
                onChange={(e) => setAudioTrack(e.target.value as typeof audioTrack)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="tania_whisper">Tania: Sinnliches Flüstern (Deutsch)</option>
                <option value="beach_waves">Lila: Strand-Atmosphäre &amp; Keuchen</option>
                <option value="heartbeat">Erregter Herzschlag &amp; Atem</option>
              </select>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
