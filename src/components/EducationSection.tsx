import React, { useState } from 'react';
import { 
  GraduationCap, 
  Brain, 
  Clock, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  AlertCircle, 
  Trash2, 
  BookOpen, 
  FileText, 
  Layers, 
  Sparkles,
  Link2
} from 'lucide-react';
import { StudyItem, FocusSession, MemberId } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface EducationSectionProps {
  studyItems: StudyItem[];
  focusSessions: FocusSession[];
  activeMemberId: MemberId;
  onAddStudyItem: (item: Omit<StudyItem, 'id'>) => void;
  onUpdateStudyItem: (item: StudyItem) => void;
  onDeleteStudyItem: (id: string) => void;
  onAddFocusSession: (session: Omit<FocusSession, 'id'>) => void;
  onToggleFocusActive: (sessionId: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  studyItems,
  focusSessions,
  activeMemberId,
  onAddStudyItem,
  onUpdateStudyItem,
  onDeleteStudyItem,
  onAddFocusSession,
  onToggleFocusActive
}) => {
  const [selectedPerson, setSelectedPerson] = useState<'aleksandra' | 'kuba'>(
    activeMemberId === 'tata' ? 'kuba' : 'aleksandra'
  );

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddFocusModal, setShowAddFocusModal] = useState(false);

  // New Study Item State
  const [title, setTitle] = useState('');
  const [courseOrModule, setCourseOrModule] = useState('');
  const [type, setType] = useState<any>('essay');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // New Focus Session State
  const [focusTitle, setFocusTitle] = useState('');
  const [focusStart, setFocusStart] = useState('18:00');
  const [focusEnd, setFocusEnd] = useState('20:00');
  const [focusDate, setFocusDate] = useState(new Date().toISOString().split('T')[0]);
  const [focusNote, setFocusNote] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to calculate days remaining
  const getDaysRemaining = (deadlineStr: string) => {
    const diff = new Date(deadlineStr).getTime() - new Date(todayStr).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    const links = linkTitle.trim() && linkUrl.trim() ? [{ label: linkTitle.trim(), url: linkUrl.trim() }] : undefined;

    onAddStudyItem({
      person: selectedPerson,
      title: title.trim(),
      courseOrModule: courseOrModule.trim() || 'Moduł ogólny',
      type,
      deadline,
      status: 'in_progress',
      notes: notes.trim() || undefined,
      links
    });

    setTitle('');
    setCourseOrModule('');
    setNotes('');
    setLinkTitle('');
    setLinkUrl('');
    setShowAddItemModal(false);
  };

  const handleAddFocusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!focusTitle.trim()) return;

    onAddFocusSession({
      person: selectedPerson,
      title: focusTitle.trim(),
      date: focusDate,
      startTime: focusStart,
      endTime: focusEnd,
      active: false,
      note: focusNote.trim() || undefined
    });

    setFocusTitle('');
    setFocusNote('');
    setShowAddFocusModal(false);
  };

  const filteredItems = studyItems.filter((i) => i.person === selectedPerson);
  const filteredFocus = focusSessions.filter((f) => f.person === selectedPerson);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-blue-500/10 border border-indigo-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="p-2 bg-indigo-600 text-white rounded-2xl shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Outfit',sans-serif]">
              Edukacja & Rozwój
            </h2>
          </div>
          <p className="text-xs text-stone-600">
            Śledzenie esejów, projektów i egzaminów (Mój Apprenticeship & Studia Kuby), terminy oddania i tryb skupienia.
          </p>
        </div>

        {/* Tab Switcher: Aleksandra vs Kuba */}
        <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-2xl border border-indigo-200 shadow-2xs">
          <button
            onClick={() => setSelectedPerson('aleksandra')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedPerson === 'aleksandra'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>👩 Aleksandra</span>
            <span className="text-[10px] opacity-80">(Apprenticeship)</span>
          </button>
          <button
            onClick={() => setSelectedPerson('kuba')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedPerson === 'kuba'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>👨 Kuba</span>
            <span className="text-[10px] opacity-80">(Studia Magisterskie)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Projects & Deadlines + Focus Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Projects, Essays, Exams */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif]">
                {selectedPerson === 'aleksandra' ? 'Eseje, Portfolio i Zadania (Aleksandra)' : 'Projekty, Egzaminy i Laboratoria (Kuba)'}
              </h3>
              <p className="text-[11px] text-stone-500">
                Aktywne pozycje: {filteredItems.filter((i) => i.status !== 'graded').length}
              </p>
            </div>

            <button
              onClick={() => setShowAddItemModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Dodaj zadanie / esej
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const daysLeft = getDaysRemaining(item.deadline);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-3 hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-200">
                          {item.type === 'essay' ? '📝 Esej' : item.type === 'project' ? '💻 Projekt' : item.type === 'portfolio' ? '📁 Portfolio' : '🎓 Egzamin'}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          {item.courseOrModule}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                        {item.title}
                      </h4>
                    </div>

                    {/* Deadline Countdown Pill */}
                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1 ${
                        daysLeft < 0
                          ? 'bg-stone-100 text-stone-600'
                          : daysLeft <= 3
                          ? 'bg-rose-100 text-rose-900 border border-rose-300 animate-pulse'
                          : daysLeft <= 7
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {daysLeft < 0 ? 'Minął termin' : daysLeft === 0 ? 'Dziś deadline!' : `Zostało: ${daysLeft} dni`}
                      </span>
                      <p className="text-[10px] text-stone-400 mt-0.5">Termin: {item.deadline}</p>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                      {item.notes}
                    </p>
                  )}

                  {/* Links & Status Bar */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Quick Portal Links */}
                    <div className="flex flex-wrap items-center gap-2">
                      {item.links?.map((lnk, idx) => (
                        <a
                          key={idx}
                          href={lnk.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200/60 font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" /> {lnk.label}
                        </a>
                      ))}
                    </div>

                    {/* Status Toggle buttons */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStudyItem({ ...item, status: e.target.value as any })}
                        className="text-xs px-2.5 py-1 rounded-xl border border-stone-200 font-semibold bg-stone-50 text-stone-800"
                      >
                        <option value="not_started">⚪ Do zrobienia</option>
                        <option value="in_progress">🟡 W trakcie pisania</option>
                        <option value="submitted">🔵 Złożone / Oddane</option>
                        <option value="graded">🟢 Zaliczone</option>
                      </select>

                      <button
                        onClick={() => onDeleteStudyItem(item.id)}
                        className="text-stone-300 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Focus Sessions & Quick Study Links */}
        <div className="space-y-5">
          
          {/* Focus Session Box */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif]">
                  Planowane Godziny Skupienia
                </h3>
              </div>
              <button
                onClick={() => setShowAddFocusModal(true)}
                className="text-xs text-purple-700 font-bold hover:underline"
              >
                + Zaplanuj
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Ustal godziny pisania/nauki, aby druga osoba mogła zająć się domem, Tymkiem i Arią w tym czasie.
            </p>

            <div className="space-y-2.5">
              {filteredFocus.map((f) => (
                <div
                  key={f.id}
                  className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-950 text-sm">{f.title}</span>
                    <span className="bg-white text-purple-900 px-2 py-0.5 rounded-md font-bold text-[11px] border border-purple-200">
                      {f.startTime} – {f.endTime}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px]">📅 {f.date}</p>
                  {f.note && (
                    <p className="text-purple-800 italic bg-white/70 p-1.5 rounded-lg border border-purple-100 text-[11px]">
                      {f.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Academic Portals */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-indigo-600" />
              Szybkie Portale Uczelniane
            </h3>

            <div className="space-y-2">
              <a
                href="https://onefile.co.uk"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-indigo-50 border border-stone-200 transition-colors font-semibold text-stone-800"
              >
                <span>📘 OneFile (Apprenticeship Portal)</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-indigo-50 border border-stone-200 transition-colors font-semibold text-stone-800"
              >
                <span>💻 Moodle / Canvas Uczelni</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-indigo-50 border border-stone-200 transition-colors font-semibold text-stone-800"
              >
                <span>🐙 Repozytorium GitHub Projektów</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Add Study Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Dodaj Nowe Zadanie / Esej ({selectedPerson === 'aleksandra' ? 'Aleksandra' : 'Kuba'})
              </h3>
              <button onClick={() => setShowAddItemModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddItemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tytuł zadania / eseju *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Esej: Zarządzanie Zmianą w IT..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Moduł / Przedmiot</label>
                  <input
                    type="text"
                    placeholder="np. Leadership, Architektura..."
                    value={courseOrModule}
                    onChange={(e) => setCourseOrModule(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Typ</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="essay">Esej</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="project">Projekt</option>
                    <option value="exam">Egzamin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Termin oddania (Deadline) *</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Wytyczne / Notatka</label>
                <textarea
                  rows={2}
                  placeholder="Liczba słów, wymagania, kluczowe punkty..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xs"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Focus Session Modal */}
      {showAddFocusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Zaplanuj Godziny Skupienia
              </h3>
              <button onClick={() => setShowAddFocusModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddFocusSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Co będziesz robić? *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Pisanie rozdziału 2 do eseju..."
                  value={focusTitle}
                  onChange={(e) => setFocusTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={focusDate}
                    onChange={(e) => setFocusDate(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Od</label>
                  <input
                    type="time"
                    value={focusStart}
                    onChange={(e) => setFocusStart(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Do</label>
                  <input
                    type="time"
                    value={focusEnd}
                    onChange={(e) => setFocusEnd(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notatka dla partnera</label>
                <input
                  type="text"
                  placeholder="np. Prośba o przejęcie kąpieli Tymka i spaceru z Arią"
                  value={focusNote}
                  onChange={(e) => setFocusNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddFocusModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-xs"
                >
                  Zaplanuj sesję
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
