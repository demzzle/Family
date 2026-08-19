import React, { useState } from 'react';
import { 
  Dog, 
  GraduationCap, 
  Brain, 
  Trash2, 
  Check, 
  Clock, 
  Sparkles, 
  Home, 
  Briefcase,
  AlertCircle,
  Footprints,
  Heart,
  Car
} from 'lucide-react';
import { QuickFamilyStatus, MemberId, BinScheduleItem, TabType } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface QuickStatusBarProps {
  quickStatus: QuickFamilyStatus;
  activeMemberId: MemberId;
  binSchedule: BinScheduleItem[];
  onUpdateStatus: (newStatus: QuickFamilyStatus) => void;
  onNavigateTab: (tab: TabType) => void;
  onQuickWalkAction: () => void;
}

export const QuickStatusBar: React.FC<QuickStatusBarProps> = ({
  quickStatus,
  activeMemberId,
  binSchedule,
  onUpdateStatus,
  onNavigateTab,
  onQuickWalkAction
}) => {
  const [showFocusModal, setShowFocusModal] = useState(false);
  const [focusTopic, setFocusTopic] = useState('Pisanie eseju / Nauka');
  const [focusUntil, setFocusUntil] = useState('20:00');

  const nowTime = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  const activeMember = FAMILY_MEMBERS[activeMemberId] || FAMILY_MEMBERS.mama;

  // Toggle child kindergarten status
  const handleToggleKindergarten = () => {
    onUpdateStatus({
      ...quickStatus,
      childInKindergarten: {
        inKindergarten: !quickStatus.childInKindergarten.inKindergarten,
        updatedBy: activeMemberId,
        time: nowTime
      }
    });
  };

  // Toggle focus mode
  const handleToggleFocus = () => {
    if (quickStatus.focusMode.active) {
      onUpdateStatus({
        ...quickStatus,
        focusMode: { active: false }
      });
    } else {
      setShowFocusModal(true);
    }
  };

  const handleStartFocus = (e: React.FormEvent) => {
    e.preventDefault();
    const person = activeMemberId === 'tata' ? 'kuba' : 'aleksandra';
    onUpdateStatus({
      ...quickStatus,
      focusMode: {
        active: true,
        person,
        topic: focusTopic,
        until: focusUntil
      }
    });
    setShowFocusModal(false);
  };

  const nextBin = binSchedule.find((b) => b.isNext) || binSchedule[0];

  return (
    <div className="space-y-2.5 mb-5">
      {/* Active Focus Alert Banner (if someone is in deep focus mode) */}
      {quickStatus.focusMode.active && (
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white px-4 py-2.5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2 text-xs border border-purple-400/40 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="p-1 bg-white/20 rounded-lg animate-pulse">
              <Brain className="w-4 h-4 text-purple-200" />
            </span>
            <span>
              <strong>🤫 Tryb Skupienia:</strong> {quickStatus.focusMode.person === 'kuba' ? 'Kuba' : 'Aleksandra'} uczy się ({quickStatus.focusMode.topic}) do <strong>{quickStatus.focusMode.until}</strong>. Prosimy o ciszę!
            </span>
          </div>
          <button
            onClick={() => onUpdateStatus({ ...quickStatus, focusMode: { active: false } })}
            className="text-[11px] bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-xl transition-colors shrink-0 font-semibold"
          >
            Zakończ skupienie
          </button>
        </div>
      )}

      {/* Main Interactive Quick Action Bar */}
      <div className="bg-white/95 backdrop-blur-xs border border-stone-200/90 rounded-3xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-stone-800 font-['Outfit',sans-serif]">
              Centrum Dowodzenia Domem (UK)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Love Nudge Jump */}
            <button
              onClick={() => onNavigateTab('nudges')}
              className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border border-rose-200"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Zaczepki & Nastroje ({quickStatus.memberMoods?.mama?.mood || '🥰'} / {quickStatus.memberMoods?.tata?.mood || '☕'})</span>
            </button>

            {/* Next Bin Day Pill */}
            {nextBin && (
              <button
                onClick={() => onNavigateTab('uk_logistics')}
                className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 rounded-xl text-[11px] font-semibold text-stone-700 transition-colors border border-stone-200"
                title="Kliknij, aby otworzyć logistykę i harmonogram koszy"
              >
                <Trash2 className={`w-3.5 h-3.5 ${nextBin.colorCode === 'black' ? 'text-stone-900' : 'text-emerald-600'}`} />
                <span>
                  Kosz (Pon): <strong className={nextBin.colorCode === 'black' ? 'text-stone-900' : 'text-emerald-700'}>{nextBin.name.split('&')[0]}</strong>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Main Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          
          {/* 1. Quick Dog Walk Action */}
          <div
            onClick={onQuickWalkAction}
            className="p-2.5 rounded-2xl bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200/80 transition-all cursor-pointer flex items-center justify-between group active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500 text-white shadow-2xs group-hover:scale-105 transition-transform">
                <Dog className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-amber-950">Spacer z Arią</p>
                <p className="text-[11px] text-amber-800">
                  Ost: {quickStatus.lastDogWalk.time} ({FAMILY_MEMBERS[quickStatus.lastDogWalk.by]?.name || 'Tata'})
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-1 rounded-lg">
              + Idę teraz!
            </span>
          </div>

          {/* 2. Kindergarten Status */}
          <div
            onClick={handleToggleKindergarten}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group active:scale-98 ${
              quickStatus.childInKindergarten.inKindergarten
                ? 'bg-emerald-50/80 hover:bg-emerald-100/70 border-emerald-200/80'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl text-white shadow-2xs transition-transform group-hover:scale-105 ${
                quickStatus.childInKindergarten.inKindergarten ? 'bg-emerald-600' : 'bg-stone-400'
              }`}>
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-900">
                  {quickStatus.childInKindergarten.inKindergarten ? 'Tymek w Przedszkolu' : 'Tymek w Domu / Odebrany'}
                </p>
                <p className="text-[11px] text-stone-500">
                  {quickStatus.childInKindergarten.inKindergarten
                    ? `Od: ${quickStatus.childInKindergarten.time} (${FAMILY_MEMBERS[quickStatus.childInKindergarten.updatedBy]?.name})`
                    : `Odebrany o ${quickStatus.childInKindergarten.time}`}
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
              quickStatus.childInKindergarten.inKindergarten ? 'bg-emerald-200/70 text-emerald-900' : 'bg-stone-200 text-stone-700'
            }`}>
              {quickStatus.childInKindergarten.inKindergarten ? 'Odbierz' : 'W przedszkolu'}
            </span>
          </div>

          {/* 3. Deep Focus Mode */}
          <div
            onClick={handleToggleFocus}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group active:scale-98 ${
              quickStatus.focusMode.active
                ? 'bg-purple-50/90 border-purple-300'
                : 'bg-indigo-50/70 hover:bg-indigo-100/70 border-indigo-200/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-600 text-white shadow-2xs group-hover:scale-105 transition-transform">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-purple-950">Potrzebuję Skupienia</p>
                <p className="text-[11px] text-purple-800">
                  {quickStatus.focusMode.active ? `Aktywne do ${quickStatus.focusMode.until}` : 'Studia & Apprenticeship'}
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-purple-200/70 text-purple-900 font-bold px-2 py-1 rounded-lg">
              {quickStatus.focusMode.active ? 'Włączone' : 'Włącz'}
            </span>
          </div>

        </div>
      </div>

      {/* Focus Mode Setup Modal */}
      {showFocusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-purple-100 text-purple-800">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif]">
                  Włącz Tryb Skupienia (Focus)
                </h3>
              </div>
              <button onClick={() => setShowFocusModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleStartFocus} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nad czym pracujesz?</label>
                <input
                  type="text"
                  required
                  value={focusTopic}
                  onChange={(e) => setFocusTopic(e.target.value)}
                  placeholder="np. Pisanie eseju do Apprenticeship, Projekt w Go..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Do której godziny?</label>
                <input
                  type="time"
                  required
                  value={focusUntil}
                  onChange={(e) => setFocusUntil(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <p className="text-[11px] text-stone-500 bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                💡 Druga osoba zobaczy na górze aplikacji powiadomienie, że jesteś w trakcie nauki i potrzebujesz spokoju.
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowFocusModal(false)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-700 text-white rounded-xl font-bold hover:bg-purple-800 shadow-xs"
                >
                  Aktywuj tryb skupienia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
