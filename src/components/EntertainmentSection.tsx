import React, { useState } from 'react';
import { 
  Film, 
  Tv, 
  Sparkles, 
  Dices, 
  Heart, 
  Plus, 
  Star, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  MapPin, 
  Play, 
  Shuffle, 
  Compass, 
  Award,
  Layers
} from 'lucide-react';
import { EntertainmentItem, DateBucketItem, Recipe, MemberId } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface EntertainmentSectionProps {
  entertainment: EntertainmentItem[];
  bucketList: DateBucketItem[];
  recipes: Recipe[];
  activeMemberId: MemberId;
  onAddEntertainment: (item: Omit<EntertainmentItem, 'id'>) => void;
  onUpdateEntertainment: (item: EntertainmentItem) => void;
  onDeleteEntertainment: (id: string) => void;
  onAddBucketItem: (item: Omit<DateBucketItem, 'id'>) => void;
  onToggleBucketItem: (id: string) => void;
  onDeleteBucketItem: (id: string) => void;
}

export const EntertainmentSection: React.FC<EntertainmentSectionProps> = ({
  entertainment,
  bucketList,
  recipes,
  activeMemberId,
  onAddEntertainment,
  onUpdateEntertainment,
  onDeleteEntertainment,
  onAddBucketItem,
  onToggleBucketItem,
  onDeleteBucketItem
}) => {
  const [mainTab, setMainTab] = useState<'movies' | 'wheel' | 'bucket'>('movies');
  const [movieFilter, setMovieFilter] = useState<'watchlist' | 'watching' | 'watched'>('watchlist');

  // New Movie / Series Modal
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [movieTitle, setMovieTitle] = useState('');
  const [movieType, setMovieType] = useState<'movie' | 'series' | 'documentary'>('movie');
  const [moviePlatform, setMoviePlatform] = useState('Netflix');
  const [movieGenre, setMovieGenre] = useState('');
  const [movieNotes, setMovieNotes] = useState('');
  const [movieStatus, setMovieStatus] = useState<'watchlist' | 'watching' | 'watched'>('watchlist');
  const [movieRating, setMovieRating] = useState<number>(5);

  // New Bucket List Item Modal
  const [showAddBucketModal, setShowAddBucketModal] = useState(false);
  const [bucketTitle, setBucketTitle] = useState('');
  const [bucketDesc, setBucketDesc] = useState('');
  const [bucketCategory, setBucketCategory] = useState<'romantic' | 'family' | 'outdoor' | 'travel' | 'home'>('romantic');
  const [bucketLocation, setBucketLocation] = useState('');

  // Wheel of Fortune / Decision Spinner State
  const [wheelMode, setWheelMode] = useState<'movies' | 'dinner' | 'date'>('movies');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [selectedSubtext, setSelectedSubtext] = useState<string | null>(null);

  const handleSpinDecision = () => {
    setIsSpinning(true);
    setSelectedResult(null);

    let candidates: { title: string; sub?: string }[] = [];

    if (wheelMode === 'movies') {
      const list = entertainment.filter((e) => e.status === 'watchlist');
      if (list.length > 0) {
        candidates = list.map((m) => ({ title: m.title, sub: `${m.platform || 'Streaming'} • ${m.type === 'movie' ? 'Film' : 'Serial'}` }));
      } else {
        candidates = [
          { title: 'Interstellar', sub: 'Klasyk sci-fi' },
          { title: 'Grand Budapest Hotel', sub: 'Klimatyczna komedia Wesa Andersona' },
          { title: 'Ratatuj', sub: 'Dla całej rodziny' }
        ];
      }
    } else if (wheelMode === 'dinner') {
      if (recipes.length > 0) {
        candidates = recipes.map((r) => ({ title: r.title, sub: `Czas: ${r.prepTime} • ${r.difficulty}` }));
      } else {
        candidates = [
          { title: 'Domowa Pizza z pieczarkami i mozzarellą', sub: 'Tymek układa składniki' },
          { title: 'Pieczony Łosoś z batatami i cytryną', sub: 'Szybkie i zdrowe' },
          { title: 'Penne z sosem pomidorowo-bazyliowym', sub: 'Klasyk w 15 minut' }
        ];
      }
    } else {
      const list = bucketList.filter((b) => !b.done);
      if (list.length > 0) {
        candidates = list.map((b) => ({ title: b.title, sub: b.locationOrBudget || b.description }));
      } else {
        candidates = [
          { title: 'Wieczorny spacer po starym mieście i lody rzemieślnicze', sub: 'Krótka randka' },
          { title: 'Piknik na trawie z koszem owoców i kocykiem', sub: 'Z Tymkiem i Arią' },
          { title: 'Kino samochodowe pod gwiazdami', sub: 'Zabieramy popcorn' }
        ];
      }
    }

    // Animation simulation
    setTimeout(() => {
      const winner = candidates[Math.floor(Math.random() * candidates.length)];
      setSelectedResult(winner.title);
      setSelectedSubtext(winner.sub || null);
      setIsSpinning(false);
    }, 1200);
  };

  const handleAddMovieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    onAddEntertainment({
      title: movieTitle.trim(),
      type: movieType,
      platform: moviePlatform,
      genre: movieGenre.trim() || undefined,
      notes: movieNotes.trim() || undefined,
      status: movieStatus,
      rating: movieStatus === 'watched' ? movieRating : undefined,
      addedBy: activeMemberId
    });

    setMovieTitle('');
    setMovieNotes('');
    setShowAddMovieModal(false);
  };

  const handleAddBucketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bucketTitle.trim()) return;

    onAddBucketItem({
      title: bucketTitle.trim(),
      description: bucketDesc.trim(),
      category: bucketCategory,
      locationOrBudget: bucketLocation.trim() || undefined,
      done: false,
      suggestedBy: activeMemberId
    });

    setBucketTitle('');
    setBucketDesc('');
    setBucketLocation('');
    setShowAddBucketModal(false);
  };

  const filteredEntertainment = entertainment.filter((e) => e.status === movieFilter);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Top Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-purple-500/10 border border-stone-200/80 p-5 rounded-3xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
            <Film className="w-5 h-5 text-rose-600" />
            Rozrywka, Randki & Generator Decyzji
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Nasze filmy na wieczór, koło fortuny gdy nie wiemy co wybrać oraz lista wspólnych marzeń!
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 bg-white/80 p-1.5 rounded-2xl border border-stone-200 shadow-2xs">
          <button
            onClick={() => setMainTab('movies')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mainTab === 'movies' ? 'bg-rose-600 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            Kino Domowe ({entertainment.length})
          </button>
          <button
            onClick={() => setMainTab('wheel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mainTab === 'wheel' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            Koło Fortuny 🎲
          </button>
          <button
            onClick={() => setMainTab('bucket')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mainTab === 'bucket' ? 'bg-purple-600 text-white shadow-2xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Randki & Marzenia ({bucketList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: KINO DOMOWE / FILMY & SERIALE */}
      {mainTab === 'movies' && (
        <div className="space-y-5">
          {/* Filter Bar & Add Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMovieFilter('watchlist')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  movieFilter === 'watchlist' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                🍿 Do obejrzenia ({entertainment.filter((e) => e.status === 'watchlist').length})
              </button>
              <button
                onClick={() => setMovieFilter('watching')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  movieFilter === 'watching' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                🎬 Aktualnie oglądamy ({entertainment.filter((e) => e.status === 'watching').length})
              </button>
              <button
                onClick={() => setMovieFilter('watched')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  movieFilter === 'watched' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                ⭐ Obejrzane z oceną ({entertainment.filter((e) => e.status === 'watched').length})
              </button>
            </div>

            <button
              onClick={() => setShowAddMovieModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Dodaj film / serial
            </button>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntertainment.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200/90 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-rose-300 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                        {item.type === 'movie' ? 'Film' : item.type === 'series' ? 'Serial' : 'Dokument'}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif]">
                        {item.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onDeleteEntertainment(item.id)}
                      className="text-stone-300 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Usuń"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    {item.platform && (
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-semibold">
                        📺 {item.platform}
                      </span>
                    )}
                    {item.genre && (
                      <span className="bg-stone-50 text-stone-500 px-2 py-0.5 rounded-md">
                        {item.genre}
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {/* Status Switcher & Star Rating */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  {item.status === 'watched' ? (
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= (item.rating || 5) ? 'fill-amber-400 text-amber-500' : 'text-stone-200'}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {item.status === 'watchlist' && (
                        <button
                          onClick={() => onUpdateEntertainment({ ...item, status: 'watching' })}
                          className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold hover:bg-amber-100"
                        >
                          ▶ Zacznij oglądać
                        </button>
                      )}
                      {item.status === 'watching' && (
                        <button
                          onClick={() => onUpdateEntertainment({ ...item, status: 'watched', rating: 5 })}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-semibold hover:bg-emerald-100"
                        >
                          ✓ Oznacz jako obejrzane
                        </button>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] text-stone-400">
                    dodał(a): {FAMILY_MEMBERS[item.addedBy]?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: KOŁO FORTUNY / GENERATOR DECYZJI */}
      {mainTab === 'wheel' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs text-center space-y-6">
          <div className="space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-800 mb-1">
              <Dices className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-['Outfit',sans-serif]">
              Generator Decyzji & Koło Fortuny
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Nie możecie się zdecydować, co obejrzeć, co zjeść na obiad lub co robić w weekend? Pozwólcie losowi wybrać za Was!
            </p>
          </div>

          {/* Decision Modes */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => { setWheelMode('movies'); setSelectedResult(null); }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                wheelMode === 'movies' ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80'
              }`}
            >
              🎬 Film na wieczór
            </button>
            <button
              onClick={() => { setWheelMode('dinner'); setSelectedResult(null); }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                wheelMode === 'dinner' ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80'
              }`}
            >
              🍲 Co na obiad / kolację?
            </button>
            <button
              onClick={() => { setWheelMode('date'); setSelectedResult(null); }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                wheelMode === 'date' ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80'
              }`}
            >
              ❤️ Randka / Aktywność
            </button>
          </div>

          {/* Interactive Wheel Canvas / Presentation */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/15 to-orange-500/5 border border-amber-200/80 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            {isSpinning ? (
              <div className="space-y-3 animate-pulse">
                <Shuffle className="w-12 h-12 text-amber-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-amber-900">Losowanie w toku... 🎲</p>
              </div>
            ) : selectedResult ? (
              <div className="space-y-2 animate-in zoom-in-95 duration-200">
                <span className="text-2xl">🎉</span>
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Dzisiejszy wybór losu:</p>
                <h4 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Outfit',sans-serif]">
                  {selectedResult}
                </h4>
                {selectedSubtext && (
                  <p className="text-xs text-stone-600 bg-white/90 px-3 py-1 rounded-xl inline-block border border-amber-200/60">
                    {selectedSubtext}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-stone-500">
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-medium">Kliknij przycisk poniżej, aby wylosować opcję!</p>
              </div>
            )}
          </div>

          {/* Spin Button */}
          <button
            disabled={isSpinning}
            onClick={handleSpinDecision}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isSpinning ? 'Losowanie...' : '🎲 Zakręć kołem i zdecyduj!'}
          </button>
        </div>
      )}

      {/* TAB 3: LISTA MARZEŃ I RANDEK (BUCKET LIST) */}
      {mainTab === 'bucket' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif]">
                Rodzinna Lista Marzeń & Randek (Bucket List)
              </h3>
              <p className="text-xs text-stone-500">
                Zrealizowano: {bucketList.filter((b) => b.done).length} z {bucketList.length} wspólnych planów
              </p>
            </div>

            <button
              onClick={() => setShowAddBucketModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Dodaj pomysł
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bucketList.map((item) => (
              <div
                key={item.id}
                className={`rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-3 ${
                  item.done
                    ? 'bg-stone-50 border-stone-200 opacity-70'
                    : 'bg-white border-purple-200/80 shadow-xs hover:border-purple-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onToggleBucketItem(item.id)}
                      className="flex items-start gap-2.5 text-left flex-1"
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-5 h-5 text-purple-600 fill-purple-100 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300 hover:text-purple-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className={`text-sm font-bold font-['Outfit',sans-serif] ${item.done ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => onDeleteBucketItem(item.id)}
                      className="text-stone-300 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.locationOrBudget && (
                    <div className="flex items-center gap-1 text-[11px] text-purple-800 bg-purple-50 p-2 rounded-xl border border-purple-100">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.locationOrBudget}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>
                    Kategoria: <strong>{item.category === 'romantic' ? '❤️ Randka we dwoje' : item.category === 'outdoor' ? '🌲 Na świeżym powietrzu' : '✈️ Podróż'}</strong>
                  </span>
                  <span>Zaproponował(a): {FAMILY_MEMBERS[item.suggestedBy]?.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Dodaj Film lub Serial
              </h3>
              <button onClick={() => setShowAddMovieModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddMovieSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tytuł *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Diuna 2, The Bear..."
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Typ</label>
                  <select
                    value={movieType}
                    onChange={(e) => setMovieType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="movie">Film</option>
                    <option value="series">Serial</option>
                    <option value="documentary">Dokument</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Platforma</label>
                  <select
                    value={moviePlatform}
                    onChange={(e) => setMoviePlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="Netflix">Netflix</option>
                    <option value="Disney+">Disney+</option>
                    <option value="HBO Max">HBO Max</option>
                    <option value="Apple TV+">Apple TV+</option>
                    <option value="Prime Video">Prime Video</option>
                    <option value="Kino">W kinie</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Status</label>
                  <select
                    value={movieStatus}
                    onChange={(e) => setMovieStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="watchlist">Do obejrzenia</option>
                    <option value="watching">Aktualnie oglądamy</option>
                    <option value="watched">Obejrzane</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Gatunek</label>
                  <input
                    type="text"
                    placeholder="np. Komedia, Sci-Fi..."
                    value={movieGenre}
                    onChange={(e) => setMovieGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notatka / Dlaczego chcemy obejrzeć?</label>
                <textarea
                  rows={2}
                  placeholder="np. Polecane przez znajomych, super soundtrack..."
                  value={movieNotes}
                  onChange={(e) => setMovieNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddMovieModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-xs"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bucket Item Modal */}
      {showAddBucketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Dodaj Pomysł na Randkę lub Marzenie
              </h3>
              <button onClick={() => setShowAddBucketModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddBucketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nazwa pomysłu *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Kolacja przy świecach na tarasie, Wyjazd do zoo z Tymkiem..."
                  value={bucketTitle}
                  onChange={(e) => setBucketTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kategoria</label>
                <select
                  value={bucketCategory}
                  onChange={(e) => setBucketCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                >
                  <option value="romantic">❤️ Randka we dwoje</option>
                  <option value="family">👨‍👩‍👦 Rodzinna wyprawa</option>
                  <option value="outdoor">🌲 Na świeżym powietrzu / Sport</option>
                  <option value="travel">✈️ Podróże i wyjazdy</option>
                  <option value="home">🏡 Domowe zacisze</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Lokalizacja / Szacowany budżet</label>
                <input
                  type="text"
                  placeholder="np. Włoska knajpka w centrum, ~150 zł"
                  value={bucketLocation}
                  onChange={(e) => setBucketLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Opis / Szczegóły</label>
                <textarea
                  rows={2}
                  placeholder="Co trzeba przygotować, kto opiekuje się Arią..."
                  value={bucketDesc}
                  onChange={(e) => setBucketDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddBucketModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-xs"
                >
                  Dodaj do Bucket List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
