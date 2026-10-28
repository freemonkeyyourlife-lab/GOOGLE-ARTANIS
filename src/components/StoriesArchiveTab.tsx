import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  Sparkles, 
  Film, 
  Heart, 
  Lock, 
  MessageSquare, 
  Calendar, 
  Flame,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export const StoriesArchiveTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [activeStoryModal, setActiveStoryModal] = useState<any | null>(null);

  const categories = ['Alle', 'Solo Tania', 'Solo Artanis', 'Paar-Erlebnisse', 'Interaktive Storys', 'Sitzungen'];

  const stories = [
    {
      id: 'story-1',
      title: 'Tania: Die abendliche Sprechstunde',
      category: 'Sitzungen',
      creator: 'Tania',
      duration: 'Interaktive Session',
      cover: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/dd71409ec_generated_image.png',
      tag: '18+ Unzensiert',
      description: 'Private therapeutische Führung im Penthouse. Tania übernimmt die Kontrolle, gibt klare Anweisungen und fordert dich heraus.',
      content: `Das Penthouse liegt im Halbdunkel, die Lichter der Großstadt spiegeln sich in den riesigen Glasfronten. 
Tania sitzt in einem tiefen Samtsessel, die Beine übereinandergeschlagen. Ein maßgeschneidertes, dunkles Seiden-Negligé schmiegt sich an ihre Kurven.

„Tritt vor...“, sagt sie leise, während ihre smaragdgrünen Augen deinen Blick festhalten. 
„Du wolltest diese Sitzung. Du hast darum gebeten, dass ich deine Gedanken ordne. Dann zieh deine Zweifel aus – und setz dich vor mich auf den Boden.“

Sie beugt sich leicht nach vorne, und der Duft von schwerem Jasmin und warmer Haut erfüllt den Raum...`,
    },
    {
      id: 'story-2',
      title: 'Lila: Strand-Session in der goldenen Stunde',
      category: 'Solo Tania',
      creator: 'Lila',
      duration: '4K Foto & Video Session',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      tag: 'Bikini & Meer',
      description: 'Tropische Wellen, sonnengebräunte Haut und ein Micro-Bikini, der kaum etwas verhüllt.',
      content: `Der Sand ist noch warm von der Nachmittagssonne. Lila steht im seichten Wasser, die Wellen umspülen ihre Knöchel. 
Das winzige rote Triangel-Oberteil ihres Bikinis spannt sich über ihrer sonnengebräunten Brust, Wassertropfen perlen auf ihrem Bauch.

„Kommst du ins Wasser?“, ruft sie mit einem unverschämten Lächeln. 
„Oder willst du lieber zusehen, wie ich mir die Träger aufk風ote...?“ 

Sie greift mit beiden Händen nach den Bändern im Nacken...`,
    },
    {
      id: 'story-3',
      title: 'Artanis × Tania: Freitagnacht zu zweit',
      category: 'Paar-Erlebnisse',
      creator: 'Artanis & Tania',
      duration: 'Duo Storytelling',
      cover: 'https://media.base44.com/images/public/6aaaf0f2a95eaf5ac21b377f/9795fbefc_generated_image.png',
      tag: 'Paar VIP',
      description: 'Ein intimer Blick hinter die Kulissen ihres gemeinsamen Lebens. Zwischen Leidenschaft, Dominanz und purer Hingabe.',
      content: `Artanis justiert die Kamera auf dem Stativ, während Tania auf dem breiten Kingsize-Bett sitzt und sich langsam durch das dunkle Seidenhaar streicht.

„Die Beleuchtung ist perfekt“, murmelt Artanis mit tiefer Stimme. Er tritt ans Bett und reicht Tania ein Glas Rotwein. 
Ihre Finger berühren sich, und für einen Moment bleibt die Luft im Raum stehen.

„Wir haben unserem Gast versprochen, dass wir heute keine Geheimnisse haben...“, haucht Tania mit einem vielsagenden Blick zur Linse...`,
    },
  ];

  const filteredStories = stories.filter(
    (s) => selectedCategory === 'Alle' || s.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 text-xs font-semibold mb-1 border border-pink-800/40">
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span>Artanis × Tania Geschichten &amp; Szenen</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Storys &amp; Interaktive Sessions
          </h2>
          <p className="text-xs text-slate-400">
            Exklusive Geschichten, interaktive Erlebnisse und Sprechstunden von Artanis, Tania &amp; Lila
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Stories & Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            onClick={() => setActiveStoryModal(story)}
            className="group bg-slate-900 border border-slate-800 hover:border-pink-500/50 rounded-2xl overflow-hidden shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-black overflow-hidden">
              <img
                src={story.cover}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-pink-300 border border-pink-500/40">
                {story.tag}
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                <Film className="w-3 h-3 text-pink-400" />
                <span>{story.duration}</span>
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider block mb-1">
                  {story.creator}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                  {story.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {story.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-pink-400 font-semibold group-hover:underline">
                  Session öffnen &amp; lesen →
                </span>
                <span className="text-[10px] text-slate-500">Unzensiert</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Story Reader Modal */}
      {activeStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-pink-900/60 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto scrollbar-thin p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">
                  {activeStoryModal.creator} • {activeStoryModal.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {activeStoryModal.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveStoryModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden aspect-video bg-black max-h-64">
              <img
                src={activeStoryModal.cover}
                alt={activeStoryModal.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
              {activeStoryModal.content}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Möchtest du diese Szene im Chat fortführen?
              </span>
              <button
                onClick={() => {
                  alert(`Szene "${activeStoryModal.title}" wurde in das Chat Modul geladen!`);
                  setActiveStoryModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-lg shadow-pink-600/30"
              >
                Im Chat weiterspielen →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
