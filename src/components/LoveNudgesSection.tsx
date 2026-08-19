import React, { useState } from 'react';
import { 
  Heart, 
  Send, 
  Smile, 
  Sparkles, 
  Flame, 
  Coffee, 
  Dog, 
  GraduationCap, 
  MessageCircle, 
  Flag, 
  Clock, 
  Calendar, 
  Check, 
  Plus, 
  Zap, 
  Gift, 
  BellRing,
  RotateCcw,
  Sparkle
} from 'lucide-react';
import { 
  MemberId, 
  NudgeCategory, 
  LoveNudgeTemplate, 
  SentNudge, 
  WhiteFlagOffer, 
  CoupleMilestone,
  QuickFamilyStatus 
} from '../types';
import { INITIAL_LOVE_NUDGE_TEMPLATES } from '../data/initialData';

interface LoveNudgesSectionProps {
  activeMemberId: MemberId;
  sentNudges: SentNudge[];
  whiteFlagOffers: WhiteFlagOffer[];
  milestones: CoupleMilestone[];
  quickStatus: QuickFamilyStatus;
  onSendNudge: (nudge: Omit<SentNudge, 'id' | 'timestamp'>) => void;
  onReactToNudge: (nudgeId: string, reaction: string) => void;
  onSendWhiteFlag: (offer: Omit<WhiteFlagOffer, 'id' | 'timestamp' | 'accepted'>) => void;
  onAcceptWhiteFlag: (offerId: string) => void;
  onUpdateMood: (member: 'mama' | 'tata', mood: string, energy: number, label: string, note?: string) => void;
}

export const LoveNudgesSection: React.FC<LoveNudgesSectionProps> = ({
  activeMemberId,
  sentNudges,
  whiteFlagOffers,
  milestones,
  quickStatus,
  onSendNudge,
  onReactToNudge,
  onSendWhiteFlag,
  onAcceptWhiteFlag,
  onUpdateMood
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NudgeCategory | 'all'>('all');
  const [customText, setCustomText] = useState('');
  const [customEmoji, setCustomEmoji] = useState('❤️');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showWhiteFlagModal, setShowWhiteFlagModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // White flag form state
  const [wfMessage, setWfMessage] = useState('Przepraszam za wcześniejsze spięcie! Bardzo Cię kocham.');
  const [wfPeaceOffer, setWfPeaceOffer] = useState('Robię Twoją ulubioną herbatkę z cytryną i miodem + wieczorny masaż 💆‍♀️☕');

  // Mood form state
  const currentMemberKey = activeMemberId === 'tata' ? 'tata' : 'mama';
  const currentMoodData = quickStatus.memberMoods?.[currentMemberKey] || {
    mood: '🥰',
    energy: 85,
    label: 'Dobry nastrój',
    updatedTime: 'Teraz',
    note: ''
  };

  const [editMoodEmoji, setEditMoodEmoji] = useState(currentMoodData.mood);
  const [editEnergy, setEditEnergy] = useState(currentMoodData.energy);
  const [editMoodLabel, setEditMoodLabel] = useState(currentMoodData.label);
  const [editMoodNote, setEditMoodNote] = useState(currentMoodData.note || '');

  // Calculate days together (e.g. from 2019-02-14)
  const relationshipStart = new Date('2019-02-14');
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - relationshipStart.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const remainingDaysAfterYears = diffDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;

  const targetPartner: MemberId = activeMemberId === 'mama' ? 'tata' : 'mama';
  const targetPartnerName = activeMemberId === 'mama' ? 'Kuba (Tata)' : 'Aleksandra (Mama)';

  const categoryConfigs: Record<NudgeCategory, { label: string; icon: any; color: string; bg: string; border: string }> = {
    flirt: {
      label: 'Flirt & Zabawa 😈',
      icon: Flame,
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200'
    },
    sweet: {
      label: 'Słodkie & Uczucia 🥰',
      icon: Heart,
      color: 'text-pink-700',
      bg: 'bg-pink-50',
      border: 'border-pink-200'
    },
    home_food: {
      label: 'Dom & Jedzenie ☕',
      icon: Coffee,
      color: 'text-amber-800',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    pet_child: {
      label: 'Pies & Dziecko 🐕',
      icon: Dog,
      color: 'text-emerald-800',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    study_fitness: {
      label: 'Nauka & Trening 🧠',
      icon: GraduationCap,
      color: 'text-indigo-800',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200'
    },
    playful: {
      label: 'Zaczepne & Luz 😜',
      icon: Smile,
      color: 'text-violet-800',
      bg: 'bg-violet-50',
      border: 'border-violet-200'
    }
  };

  const handleSendNudgeClick = (text: string, emoji: string, category: NudgeCategory) => {
    onSendNudge({
      from: activeMemberId,
      to: targetPartner,
      category,
      text,
      emoji
    });

    setToastMessage(`Wysłano zaczepkę do ${targetPartnerName}: "${emoji} ${text}"`);
    setTimeout(() => setToastMessage(null), 4000);

    // Try browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Zaczepka od: ${activeMemberId === 'mama' ? 'Oli' : 'Kuby'}`, {
          body: `${emoji} ${text}`,
          icon: '/favicon.ico'
        });
      } catch (e) {
        // Safe ignore
      }
    }
  };

  const handleWhiteFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfMessage.trim()) return;

    onSendWhiteFlag({
      from: activeMemberId,
      to: targetPartner,
      message: wfMessage.trim(),
      peaceOffer: wfPeaceOffer.trim()
    });

    setShowWhiteFlagModal(false);
    setToastMessage(`🏳️ Wysłano Białą Flagę do ${targetPartnerName}!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMood(currentMemberKey, editMoodEmoji, editEnergy, editMoodLabel, editMoodNote);
    setShowMoodModal(false);
    setToastMessage('Zaktualizowano Twój nastrój i poziom energii!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? INITIAL_LOVE_NUDGE_TEMPLATES 
    : INITIAL_LOVE_NUDGE_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-24 md:pb-14">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-stone-900/95 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Hero & Relationship Counter Card */}
      <div className="bg-gradient-to-br from-rose-500/15 via-pink-500/10 to-amber-500/15 border border-rose-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-rose-600 text-white rounded-2xl shadow-xs">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">
                Zaczepki & Kącik Związku
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              Prywatna przestrzeń dla Ciebie i partnera: szybkie miłosne zaczepki, flirt, prośby o kawkę, łagodzenie spięć Białą Flagą oraz licznik wspólnych dni.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowMoodModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-stone-200 text-stone-800 text-xs font-bold shadow-2xs hover:bg-stone-50 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Mój Nastrój: {currentMoodData.mood} ({currentMoodData.energy}%)
            </button>

            <button
              onClick={() => setShowWhiteFlagModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border-2 border-stone-800 hover:bg-stone-900 hover:text-white text-stone-900 text-xs font-black shadow-xs transition-all active:scale-95"
            >
              <Flag className="w-3.5 h-3.5 text-rose-500" />
              Biała Flaga 🏳️
            </button>
          </div>
        </div>

        {/* Relationship Counter & Mood Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Days Together Counter */}
          <div className="bg-white/95 rounded-2xl p-4 border border-rose-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">
                Jesteśmy Razem
              </span>
              <span className="text-xl font-black text-stone-900 font-['Outfit',sans-serif]">
                {diffDays} dni ({years} lat {months} mies.)
              </span>
              <span className="text-[10px] text-stone-500 block">Od 14 lutego 2019 r.</span>
            </div>
          </div>

          {/* Mama Mood Card */}
          <div className="bg-white/95 rounded-2xl p-4 border border-rose-200/80 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{quickStatus.memberMoods?.mama?.mood || '🥰'}</span>
              <div>
                <span className="text-[11px] font-bold text-rose-800 block">Ola (Mama)</span>
                <span className="text-xs font-semibold text-stone-800 line-clamp-1">
                  {quickStatus.memberMoods?.mama?.label || 'Super nastrój'}
                </span>
                <span className="text-[10px] text-stone-500">Energia: {quickStatus.memberMoods?.mama?.energy || 85}%</span>
              </div>
            </div>
            {activeMemberId === 'mama' && (
              <button 
                onClick={() => setShowMoodModal(true)} 
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Zmień
              </button>
            )}
          </div>

          {/* Tata Mood Card */}
          <div className="bg-white/95 rounded-2xl p-4 border border-sky-200/80 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{quickStatus.memberMoods?.tata?.mood || '☕'}</span>
              <div>
                <span className="text-[11px] font-bold text-sky-800 block">Kuba (Tata)</span>
                <span className="text-xs font-semibold text-stone-800 line-clamp-1">
                  {quickStatus.memberMoods?.tata?.label || 'W trybie pracy'}
                </span>
                <span className="text-[10px] text-stone-500">Energia: {quickStatus.memberMoods?.tata?.energy || 75}%</span>
              </div>
            </div>
            {activeMemberId === 'tata' && (
              <button 
                onClick={() => setShowMoodModal(true)} 
                className="text-[11px] font-bold text-sky-700 hover:underline"
              >
                Zmień
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active White Flag Alerts Banner (if any) */}
      {whiteFlagOffers.length > 0 && (
        <div className="space-y-3">
          {whiteFlagOffers.map((wf) => (
            <div 
              key={wf.id}
              className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-amber-400 text-amber-950 rounded-2xl text-xl shrink-0">
                  🏳️
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
                      Biała Flaga od {wf.from === 'mama' ? 'Oli' : 'Kuby'}
                    </span>
                    <span className="text-xs text-stone-500">{wf.timestamp}</span>
                  </div>
                  <p className="text-sm font-bold text-stone-900">
                    "{wf.message}"
                  </p>
                  <p className="text-xs text-stone-700">
                    🎁 <strong>Oferta rozejmu:</strong> {wf.peaceOffer}
                  </p>
                </div>
              </div>

              {!wf.accepted && wf.to === activeMemberId ? (
                <button
                  onClick={() => onAcceptWhiteFlag(wf.id)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Check className="w-4 h-4" /> Akceptuję rozejm & Przytulam ❤️
                </button>
              ) : wf.accepted ? (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1 shrink-0">
                  <Check className="w-3.5 h-3.5" /> Rozejm zaakceptowany!
                </span>
              ) : (
                <span className="text-xs font-semibold text-stone-500 italic shrink-0">
                  Oczekiwanie na odpowiedź partnera...
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Grid: Send Nudges vs History & Anniversaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Column: Interactive Nudge Buttons */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Header & Category Filters */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  Wyślij Zaczepkę do {targetPartnerName}
                </h3>
                <p className="text-xs text-stone-500">
                  Kliknij w kafelek, aby natychmiast wysłać powiadomienie do partnera.
                </p>
              </div>

              <button
                onClick={() => setShowCustomModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Własna zaczepka
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Wszystkie ({INITIAL_LOVE_NUDGE_TEMPLATES.length})
              </button>

              {(Object.keys(categoryConfigs) as NudgeCategory[]).map((cat) => {
                const conf = categoryConfigs[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nudge Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredTemplates.map((item) => {
              const conf = categoryConfigs[item.category];
              return (
                <button
                  key={item.id}
                  onClick={() => handleSendNudgeClick(item.text, item.emoji, item.category)}
                  className={`group relative text-left p-4 rounded-2xl border ${conf.border} ${conf.bg} hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all flex items-start gap-3.5`}
                >
                  <span className="text-2xl sm:text-3xl shrink-0 group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </span>

                  <div className="space-y-1 flex-1">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${conf.color} block`}>
                      {conf.label}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                      {item.text}
                    </p>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1.5 rounded-xl shadow-xs border border-stone-200 shrink-0">
                    <Send className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sent Nudges Feed & Anniversaries */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Anniversaries & Birthdays */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-600" />
              Nadchodzące Rocznice & Ważne Daty
            </h3>

            <div className="space-y-2.5">
              {milestones.map((m) => (
                <div 
                  key={m.id}
                  className="bg-stone-50/80 p-3 rounded-2xl border border-stone-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{m.title}</h4>
                      <span className="text-[11px] text-stone-500">{m.date}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200/60">
                    za {m.daysRemaining} dni
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* History of Sent Nudges */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                <BellRing className="w-4 h-4 text-rose-600" />
                Ostatnie Zaczepki
              </h3>
              <span className="text-[11px] font-semibold text-stone-400">
                {sentNudges.length} wpisów
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {sentNudges.map((nudge) => {
                const isFromMe = nudge.from === activeMemberId;
                return (
                  <div
                    key={nudge.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                      isFromMe 
                        ? 'bg-rose-50/50 border-rose-200/80 ml-2' 
                        : 'bg-stone-50 border-stone-200 mr-2'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{nudge.emoji}</span>
                        <span className="font-bold text-stone-900">
                          {isFromMe ? 'Ty' : nudge.from === 'mama' ? 'Ola' : 'Kuba'} ➔ {isFromMe ? (nudge.to === 'mama' ? 'Ola' : 'Kuba') : 'Ciebie'}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400">{nudge.timestamp}</span>
                    </div>

                    <p className="text-xs text-stone-800 font-medium pl-6">
                      "{nudge.text}"
                    </p>

                    {/* Reaction Bar */}
                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 pl-6">
                      {nudge.reaction ? (
                        <span className="text-[11px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                          {nudge.reaction}
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {['❤️', '🔥', '🥰', '☕', '👍', '😜'].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => onReactToNudge(nudge.id, emoji)}
                              className="text-xs hover:scale-125 transition-transform p-0.5"
                              title={`Zareaguj ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Custom Nudge */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Napisz Własną Zaczepkę</h3>
              <button onClick={() => setShowCustomModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Wybierz ikonkę / emoji</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['❤️', '💋', '😈', '🍦', '☕', '💆‍♀️', '🍷', '🍕', '🐕', '🧠', '😜', '🫂'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setCustomEmoji(em)}
                      className={`text-xl p-2 rounded-xl border transition-all ${
                        customEmoji === em ? 'bg-rose-100 border-rose-400 scale-110' : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Treść wiadomości</label>
                <input
                  type="text"
                  placeholder="np. Kto dzisiaj robi kolację przy świecach?..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  disabled={!customText.trim()}
                  onClick={() => {
                    handleSendNudgeClick(customText.trim(), customEmoji, 'playful');
                    setShowCustomModal(false);
                    setCustomText('');
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs disabled:opacity-50"
                >
                  Wyślij zaczepkę 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: White Flag */}
      {showWhiteFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏳️</span>
                <h3 className="text-base font-bold text-stone-900">Biała Flaga (Rozejm & Przytulenie)</h3>
              </div>
              <button onClick={() => setShowWhiteFlagModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <p className="text-xs text-stone-600">
              Coś poszło nie tak? Czasem drobne zmęczenie bierze górę. Wyślij partnerowi Białą Flagę ze słodką propozycją rozejmu!
            </p>

            <form onSubmit={handleWhiteFlagSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Wiadomość z przeprosinami / miłością</label>
                <textarea
                  rows={2}
                  required
                  value={wfMessage}
                  onChange={(e) => setWfMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">🎁 Oferta rozejmu (na osłodę)</label>
                <input
                  type="text"
                  required
                  value={wfPeaceOffer}
                  onChange={(e) => setWfPeaceOffer(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                  placeholder="np. Robię pyszną herbatkę / Zamawiam pizzę / 15 minut masażu"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-stone-500 font-semibold">Gotowe propozycje:</span>
                {[
                  'Robię kawkę ze spienionym mlekiem ☕',
                  'Kupuję Twoje ulubione lody 🍦',
                  '20 minut relaksującego masażu pleców 💆‍♀️',
                  'Przejmuję dzisiaj cały wieczorny spacer z Arią 🐕'
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setWfPeaceOffer(sug)}
                    className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-1 rounded-lg hover:bg-amber-100"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowWhiteFlagModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-black text-white font-bold rounded-xl shadow-xs"
                >
                  Wyślij Białą Flagę 🏳️❤️
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Mood Tracker */}
      {showMoodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Zaktualizuj Swój Nastrój ({currentMemberKey === 'mama' ? 'Aleksandra' : 'Kuba'})
              </h3>
              <button onClick={() => setShowMoodModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSaveMood} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Jak się dzisiaj czujesz?</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { emoji: '🥰', label: 'Zakochana / Szczęśliwa' },
                    { emoji: '⚡', label: 'Pełna energii & zmotywowana' },
                    { emoji: '☕', label: 'W trybie skupienia' },
                    { emoji: '😴', label: 'Zmęczona / Potrzebuję snu' },
                    { emoji: '🤯', label: 'Dużo na głowie / Stres' },
                    { emoji: '🤒', label: 'Słabsze samopoczucie' },
                    { emoji: '🧘‍♀️', label: 'Spokój & chillout' },
                    { emoji: '🤗', label: 'Wesoła & wdzięczna' }
                  ].map((m) => (
                    <button
                      key={m.emoji}
                      type="button"
                      onClick={() => {
                        setEditMoodEmoji(m.emoji);
                        setEditMoodLabel(m.label);
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition-all ${
                        editMoodEmoji === m.emoji 
                          ? 'bg-rose-100 border-rose-400 ring-2 ring-rose-300' 
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-2xl block">{m.emoji}</span>
                      <span className="text-[10px] text-stone-600 block mt-1 line-clamp-1">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-stone-700">Poziom energii ({editEnergy}%)</label>
                  <span className="font-bold text-rose-600">{editEnergy >= 75 ? '🔥 Wysoki' : editEnergy >= 45 ? '⚡ Umiarkowany' : '🪫 Niski'}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={editEnergy}
                  onChange={(e) => setEditEnergy(Number(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Krótka notatka (opcjonalnie)</label>
                <input
                  type="text"
                  placeholder="np. Dziś praca zdalna, po południu siłownia!"
                  value={editMoodNote}
                  onChange={(e) => setEditMoodNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowMoodModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Zapisz nastrój ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
