import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Plus, 
  Bell, 
  CheckCircle2, 
  Circle, 
  MapPin, 
  Users, 
  Sun, 
  Moon, 
  ArrowRightLeft, 
  Sparkles, 
  CalendarDays, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { CalendarEvent, WorkShift, KindergartenDuty, MemberId, EventCategory } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface CalendarSectionProps {
  events: CalendarEvent[];
  workShifts: WorkShift[];
  kindergartenDuty: KindergartenDuty;
  activeMemberId: MemberId;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onToggleEventComplete: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateKindergartenDuty: (duty: KindergartenDuty) => void;
  onUpdateWorkShift: (shift: WorkShift) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  events,
  workShifts,
  kindergartenDuty,
  activeMemberId,
  onAddEvent,
  onToggleEventComplete,
  onDeleteEvent,
  onUpdateKindergartenDuty,
  onUpdateWorkShift
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'today' | 'shifts' | 'all'>('today');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEventStartTime, setNewEventStartTime] = useState('18:00');
  const [newEventEndTime, setNewEventEndTime] = useState('19:00');
  const [newEventCategory, setNewEventCategory] = useState<EventCategory>('family');
  const [newEventAssigned, setNewEventAssigned] = useState<MemberId[]>([activeMemberId]);
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventNote, setNewEventNote] = useState('');
  const [newEventIsEvening, setNewEventIsEvening] = useState(false);
  const [newEventReminder, setNewEventReminder] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];

  // Today's events sorted by start time
  const todayEvents = events
    .filter((ev) => ev.date === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const eveningPlans = todayEvents.filter((ev) => ev.isEveningPlan || parseInt(ev.startTime.split(':')[0]) >= 17);
  const daytimeEvents = todayEvents.filter((ev) => !eveningPlans.includes(ev));

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    onAddEvent({
      title: newEventTitle.trim(),
      date: newEventDate,
      startTime: newEventStartTime,
      endTime: newEventEndTime,
      category: newEventCategory,
      assignedTo: newEventAssigned.length > 0 ? newEventAssigned : ['mama'],
      location: newEventLocation.trim() || undefined,
      note: newEventNote.trim() || undefined,
      isEveningPlan: newEventIsEvening,
      reminder: newEventReminder,
      completed: false
    });

    setNewEventTitle('');
    setNewEventLocation('');
    setNewEventNote('');
    setShowAddModal(false);
  };

  const toggleAssignee = (id: MemberId) => {
    if (newEventAssigned.includes(id)) {
      if (newEventAssigned.length > 1) {
        setNewEventAssigned(newEventAssigned.filter((m) => m !== id));
      }
    } else {
      setNewEventAssigned([...newEventAssigned, id]);
    }
  };

  // Quick swap kindergarten drop off / pick up
  const handleSwapDropOff = () => {
    const nextDrop = kindergartenDuty.dropOffBy === 'mama' ? 'tata' : 'mama';
    onUpdateKindergartenDuty({
      ...kindergartenDuty,
      dropOffBy: nextDrop
    });
  };

  const handleSwapPickUp = () => {
    const nextPick = kindergartenDuty.pickUpBy === 'mama' ? 'tata' : 'mama';
    onUpdateKindergartenDuty({
      ...kindergartenDuty,
      pickUpBy: nextPick
    });
  };

  const getCategoryBadge = (category: EventCategory) => {
    switch (category) {
      case 'kindergarten':
        return { label: 'Przedszkole', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'work':
        return { label: 'Praca', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'family':
        return { label: 'Rodzina', bg: 'bg-amber-100 text-amber-900 border-amber-200' };
      case 'aria':
        return { label: 'Aria', bg: 'bg-orange-100 text-orange-900 border-orange-200' };
      case 'health':
        return { label: 'Zdrowie', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return { label: 'Dom', bg: 'bg-stone-100 text-stone-700 border-stone-200' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Top Banner: Navigation between Today, Shifts & Full Schedule */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-stone-900 font-['Outfit',sans-serif]">
                Kalendarz i Organizacja Dnia
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Grafiki pracy rodziców, dyżury przedszkolne Tymka i plany wieczorne.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Dodaj wydarzenie
            </button>
          </div>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-stone-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('today')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'today'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Plan na Dziś & Wieczór ({todayEvents.length})
          </button>
          <button
            onClick={() => setActiveSubTab('shifts')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'shifts'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Grafiki Pracy & Przedszkole
          </button>
          <button
            onClick={() => setActiveSubTab('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'all'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            Wszystkie Nadchodzące ({events.length})
          </button>
        </div>
      </div>

      {/* QUICK HIGHLIGHT CARDS: Kindergarten Duties & Shifts Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Kindergarten Card */}
        <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/60 border border-emerald-200/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Przedszkole – Dzisiejszy Dyżur</h3>
                <p className="text-[11px] text-emerald-800">Grupa "Wiewiórki" (Leśne Skrzaty)</p>
              </div>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-300">
              Dziś
            </span>
          </div>

          <div className="space-y-2.5 bg-white/80 rounded-2xl p-3.5 border border-emerald-100">
            {/* Drop off */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-stone-600">Odprowadza:</span>
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <img
                    src={FAMILY_MEMBERS[kindergartenDuty.dropOffBy]?.avatar}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {FAMILY_MEMBERS[kindergartenDuty.dropOffBy]?.name || kindergartenDuty.dropOffBy}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {kindergartenDuty.dropOffTime}
                </span>
                <button
                  onClick={handleSwapDropOff}
                  title="Zmień osobę odprowadzającą"
                  className="p-1 rounded-lg text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pick up */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-stone-600">Odbiera:</span>
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <img
                    src={FAMILY_MEMBERS[kindergartenDuty.pickUpBy]?.avatar}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {FAMILY_MEMBERS[kindergartenDuty.pickUpBy]?.name || kindergartenDuty.pickUpBy}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                  {kindergartenDuty.pickUpTime}
                </span>
                <button
                  onClick={handleSwapPickUp}
                  title="Zmień osobę odbierającą"
                  className="p-1 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {kindergartenDuty.specialNotes && (
            <p className="text-[11px] text-emerald-900/90 mt-2 bg-emerald-100/50 px-3 py-1 rounded-xl">
              💡 {kindergartenDuty.specialNotes}
            </p>
          )}
        </div>

        {/* Work Shifts Card */}
        <div className="bg-gradient-to-br from-sky-50/90 to-blue-50/60 border border-sky-200/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Grafiki Pracy – Dzisiaj</h3>
                <p className="text-[11px] text-sky-800">Godziny i lokalizacja rodziców</p>
              </div>
            </div>
            <span className="text-xs bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full font-semibold border border-sky-300">
              Praca
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Aleksandra */}
            <div className="bg-white/80 rounded-2xl p-3 border border-sky-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={FAMILY_MEMBERS.mama.avatar}
                  alt=""
                  className="w-7 h-7 rounded-xl object-cover ring-1 ring-rose-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="font-bold text-stone-900 block">Aleksandra (Mama)</span>
                  <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    🏢 Biuro Centrum
                  </span>
                </div>
              </div>
              <span className="font-semibold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg">
                09:00 – 17:00
              </span>
            </div>

            {/* Kuba */}
            <div className="bg-white/80 rounded-2xl p-3 border border-sky-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={FAMILY_MEMBERS.tata.avatar}
                  alt=""
                  className="w-7 h-7 rounded-xl object-cover ring-1 ring-sky-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="font-bold text-stone-900 block">Kuba (Tata)</span>
                  <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                    🏠 Home Office
                  </span>
                </div>
              </div>
              <span className="font-semibold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg">
                08:30 – 16:30
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* VIEW: TODAY'S TIMELINE & EVENING PLANS */}
      {activeSubTab === 'today' && (
        <div className="space-y-6">
          
          {/* Day Schedule */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                  Oś Czasu na Dziś
                </h3>
              </div>
              <span className="text-xs font-semibold text-stone-500">
                {todayEvents.length} zaplanowane punkty
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {todayEvents.map((ev) => {
                const badge = getCategoryBadge(ev.category);
                return (
                  <div
                    key={ev.id}
                    className={`py-3.5 flex items-start justify-between gap-3 group transition-colors rounded-xl px-2 ${
                      ev.completed ? 'opacity-60 bg-stone-50/50' : 'hover:bg-amber-50/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleEventComplete(ev.id)}
                        className="mt-0.5 text-stone-400 hover:text-amber-600 transition-colors"
                      >
                        {ev.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-300" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-bold ${ev.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                            {ev.title}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          {ev.isEveningPlan && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                              <Moon className="w-2.5 h-2.5" /> Wieczór
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-500 flex-wrap">
                          <span className="flex items-center gap-1 font-semibold text-stone-700">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            {ev.startTime} – {ev.endTime}
                          </span>
                          {ev.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-stone-400" />
                              {ev.location}
                            </span>
                          )}
                          {ev.reminder && (
                            <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 text-[10px]">
                              <Bell className="w-3 h-3" /> Przypomnienie aktywne
                            </span>
                          )}
                        </div>

                        {ev.note && (
                          <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-xl border border-stone-100 inline-block">
                            📝 {ev.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Assigned Avatars & Delete */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-1.5">
                        {ev.assignedTo.map((mId) => {
                          const m = FAMILY_MEMBERS[mId];
                          if (!m) return null;
                          return (
                            <img
                              key={m.id}
                              src={m.avatar}
                              alt={m.name}
                              title={m.name}
                              className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                              referrerPolicy="no-referrer"
                            />
                          );
                        })}
                      </div>

                      <button
                        onClick={() => onDeleteEvent(ev.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-all text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evening Plans Card */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-rose-50 rounded-3xl border border-indigo-200/80 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-5 h-5 text-indigo-700" />
              <h3 className="text-base font-bold text-indigo-950 font-['Outfit',sans-serif]">
                Plany na Dziś Wieczór
              </h3>
            </div>

            <div className="space-y-3">
              {eveningPlans.length === 0 ? (
                <p className="text-xs text-stone-500 italic">Brak wpisanych planów na wieczór. Czas na relaks!</p>
              ) : (
                eveningPlans.map((ev) => (
                  <div key={ev.id} className="bg-white/90 border border-indigo-100 rounded-2xl p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-stone-900">{ev.title}</p>
                      <p className="text-xs text-indigo-900 flex items-center gap-2 mt-0.5">
                        <span>⏰ {ev.startTime} – {ev.endTime}</span>
                        {ev.location && <span>📍 {ev.location}</span>}
                      </p>
                      {ev.note && <p className="text-xs text-stone-600 mt-1">✨ {ev.note}</p>}
                    </div>
                    <div className="flex items-center -space-x-2">
                      {ev.assignedTo.map((mId) => {
                        const m = FAMILY_MEMBERS[mId];
                        return m ? (
                          <img
                            key={m.id}
                            src={m.avatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                            referrerPolicy="no-referrer"
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* VIEW: WORK SHIFTS & KINDERGARTEN SCHEDULE */}
      {activeSubTab === 'shifts' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
              Harmonogram Pracy i Dyżury w tym Tygodniu
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Zestawienie godzin pracy rodziców i koordynacji odbioru dziecka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mama Schedule */}
            <div className="border border-rose-200 bg-rose-50/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={FAMILY_MEMBERS.mama.avatar}
                  alt=""
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-rose-300"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Aleksandra (Mama)</h4>
                  <p className="text-xs text-stone-500">Domyślne godziny: 08:30 – 16:30 / 09:00 – 17:00</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-white p-2.5 rounded-xl border border-rose-100">
                  <span className="font-semibold text-stone-800">Środa (Dziś):</span>
                  <span className="text-rose-800 font-bold">09:00 – 17:00 (Biuro)</span>
                </div>
                <div className="flex justify-between bg-white p-2.5 rounded-xl border border-rose-100">
                  <span className="font-semibold text-stone-800">Czwartek:</span>
                  <span className="text-emerald-700 font-bold">08:30 – 16:30 (Home Office)</span>
                </div>
                <div className="flex justify-between bg-white p-2.5 rounded-xl border border-rose-100">
                  <span className="font-semibold text-stone-800">Piątek:</span>
                  <span className="text-emerald-700 font-bold">08:00 – 16:00 (Home Office)</span>
                </div>
              </div>
            </div>

            {/* Tata Schedule */}
            <div className="border border-sky-200 bg-sky-50/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={FAMILY_MEMBERS.tata.avatar}
                  alt=""
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-sky-300"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Kuba (Tata)</h4>
                  <p className="text-xs text-stone-500">Domyślne godziny: 08:30 – 16:30</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-white p-2.5 rounded-xl border border-sky-100">
                  <span className="font-semibold text-stone-800">Środa (Dziś):</span>
                  <span className="text-emerald-700 font-bold">08:30 – 16:30 (Home Office)</span>
                </div>
                <div className="flex justify-between bg-white p-2.5 rounded-xl border border-sky-100">
                  <span className="font-semibold text-stone-800">Czwartek:</span>
                  <span className="text-sky-800 font-bold">09:00 – 17:00 (Biuro)</span>
                </div>
                <div className="flex justify-between bg-white p-2.5 rounded-xl border border-sky-100">
                  <span className="font-semibold text-stone-800">Piątek:</span>
                  <span className="text-emerald-700 font-bold">08:30 – 16:30 (Home Office)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ALL UPCOMING EVENTS */}
      {activeSubTab === 'all' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
              Wszystkie Nadchodzące Wydarzenia
            </h3>
            <span className="text-xs text-stone-500">{events.length} pozycji</span>
          </div>

          <div className="divide-y divide-stone-100">
            {events.map((ev) => {
              const badge = getCategoryBadge(ev.category);
              return (
                <div key={ev.id} className="py-3.5 flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleEventComplete(ev.id)}
                      className="mt-0.5 text-stone-400 hover:text-amber-600 transition-colors"
                    >
                      {ev.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold ${ev.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                          {ev.title}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          📅 {ev.date}
                        </span>
                        <span>⏰ {ev.startTime} – {ev.endTime}</span>
                        {ev.location && <span>📍 {ev.location}</span>}
                      </div>
                      {ev.note && <p className="text-xs text-stone-600 mt-1">📝 {ev.note}</p>}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteEvent(ev.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-all text-xs"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900 font-['Outfit',sans-serif]">
                Dodaj Nowe Wydarzenie do Kalendarza
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tytuł wydarzenia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Wizyta kontrolna u stomatologa, Urodziny Tymka..."
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Od godziny</label>
                  <input
                    type="time"
                    value={newEventStartTime}
                    onChange={(e) => setNewEventStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Do godziny</label>
                  <input
                    type="time"
                    value={newEventEndTime}
                    onChange={(e) => setNewEventEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Kategoria</label>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value as EventCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  <option value="family">Rodzina & Wspólne</option>
                  <option value="kindergarten">Przedszkole / Dziecko</option>
                  <option value="work">Praca rodziców</option>
                  <option value="aria">Pies Aria</option>
                  <option value="health">Zdrowie / Lekarz</option>
                  <option value="home">Dom i sprawy bieżące</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Kogo dotyczy?</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(FAMILY_MEMBERS).map((m) => {
                    const isSelected = newEventAssigned.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleAssignee(m.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-amber-100 border-amber-400 text-amber-900 ring-1 ring-amber-300'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <img src={m.avatar} alt="" className="w-5 h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Lokalizacja (opcjonalnie)</label>
                <input
                  type="text"
                  placeholder="np. Przychodnia Medyczna, Park Miejski..."
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Notatki / Szczegóły</label>
                <textarea
                  placeholder="Wskazówki, co zabrać..."
                  value={newEventNote}
                  onChange={(e) => setNewEventNote(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEventIsEvening}
                    onChange={(e) => setNewEventIsEvening(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-400"
                  />
                  Zaznacz jako plan na wieczór
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEventReminder}
                    onChange={(e) => setNewEventReminder(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-400"
                  />
                  Włącz przypomnienie
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Zapisz wydarzenie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
