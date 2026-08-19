import React, { useState } from 'react';
import { 
  Activity, 
  Dumbbell, 
  Flame, 
  Timer, 
  Plus, 
  TrendingUp, 
  Smile, 
  Heart, 
  Trash2, 
  Calendar, 
  Zap, 
  Footprints 
} from 'lucide-react';
import { WorkoutEntry, MemberId } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface FitnessSectionProps {
  workouts: WorkoutEntry[];
  activeMemberId: MemberId;
  onAddWorkout: (workout: Omit<WorkoutEntry, 'id'>) => void;
  onDeleteWorkout: (id: string) => void;
}

export const FitnessSection: React.FC<FitnessSectionProps> = ({
  workouts,
  activeMemberId,
  onAddWorkout,
  onDeleteWorkout
}) => {
  const [selectedPerson, setSelectedPerson] = useState<'aleksandra' | 'kuba'>(
    activeMemberId === 'tata' ? 'kuba' : 'aleksandra'
  );

  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<any>('pilates');
  const [duration, setDuration] = useState('45');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');
  const [details, setDetails] = useState('');
  const [mood, setMood] = useState<'swietnie' | 'dobrze' | 'zmeczenie' | 'ciezko'>('swietnie');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredWorkouts = workouts.filter((w) => w.person === selectedPerson);
  const totalMinutes = filteredWorkouts.reduce((sum, w) => sum + w.durationMinutes, 0);
  const totalCalories = filteredWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
  const totalWorkouts = filteredWorkouts.length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !duration) return;

    onAddWorkout({
      person: selectedPerson,
      date: workoutDate,
      type,
      title: title.trim(),
      durationMinutes: Number(duration),
      distanceKm: distance ? Number(distance) : undefined,
      calories: calories ? Number(calories) : undefined,
      details: details.trim(),
      mood
    });

    setTitle('');
    setDetails('');
    setDistance('');
    setCalories('');
    setShowAddModal(false);
  };

  const typeIcons: Record<string, string> = {
    pilates: '🧘‍♀️ Pilates & Stretching',
    bieganie: '🏃‍♂️ Bieganie',
    silownia: '🏋️‍♂️ Siłownia & Ciężary',
    joga: '🌿 Joga & Relaks',
    spacer_z_aria: '🐾 Długi spacer / Marszobieg z Arią',
    rower: '🚴 Rower',
    hiit: '⚡ Trening HIIT / Interwały',
    inne: '🏅 Inna aktywność'
  };

  const moodBadges = {
    swietnie: { label: '🔥 Świetna forma & energia', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    dobrze: { label: '👍 Dobry trening', bg: 'bg-sky-100 text-sky-900 border-sky-300' },
    zmeczenie: { label: '😴 Zmęczenie, ale zrobione', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
    ciezko: { label: '🥵 Było bardzo ciężko', bg: 'bg-rose-100 text-rose-900 border-rose-300' }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-sky-500/10 border border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-2xl shadow-xs">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Outfit',sans-serif]">
              Dziennik Treningowy & Ruch
            </h2>
          </div>
          <p className="text-xs text-stone-600">
            Śledzimy nasze treningi, samopoczucie, biegi, pilates, siłownię oraz długie spacery z Arią.
          </p>
        </div>

        {/* Tab Switcher: Aleksandra vs Kuba */}
        <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-2xl border border-emerald-200 shadow-2xs">
          <button
            onClick={() => setSelectedPerson('aleksandra')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedPerson === 'aleksandra'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>👩 Aleksandra</span>
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
          </button>
        </div>
      </div>

      {/* Stats Summary Widget for Selected Person */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-500 block font-medium">Treningi w tym miesiącu</span>
            <span className="text-xl font-black text-stone-900 font-['Outfit',sans-serif]">
              {totalWorkouts} sesji
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-teal-100 text-teal-800">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-500 block font-medium">Łączny czas aktywności</span>
            <span className="text-xl font-black text-stone-900 font-['Outfit',sans-serif]">
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-orange-100 text-orange-800">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-500 block font-medium">Spalone kalorie</span>
            <span className="text-xl font-black text-stone-900 font-['Outfit',sans-serif]">
              {totalCalories.toLocaleString('pl-PL')} kcal
            </span>
          </div>
        </div>
      </div>

      {/* Main Workouts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
          <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif]">
            Historia Aktywności ({selectedPerson === 'aleksandra' ? 'Aleksandra' : 'Kuba'})
          </h3>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Dodaj trening
          </button>
        </div>

        <div className="space-y-3">
          {filteredWorkouts.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-3 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60 inline-block">
                      {typeIcons[w.type] || 'Trening'}
                    </span>
                    <h4 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                      {w.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {w.date}
                    </span>
                    <button
                      onClick={() => onDeleteWorkout(w.id)}
                      className="text-stone-300 hover:text-rose-600 p-1"
                      title="Usuń wpis"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics Pill Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="bg-stone-50 border border-stone-200 px-3 py-1 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-stone-500" />
                    {w.durationMinutes} min
                  </div>

                  {w.distanceKm && (
                    <div className="bg-stone-50 border border-stone-200 px-3 py-1 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5 text-stone-500" />
                      {w.distanceKm} km
                    </div>
                  )}

                  {w.calories && (
                    <div className="bg-stone-50 border border-stone-200 px-3 py-1 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      {w.calories} kcal
                    </div>
                  )}

                  <span className={`px-2.5 py-0.5 rounded-xl text-[11px] font-semibold border ${moodBadges[w.mood]?.bg}`}>
                    {moodBadges[w.mood]?.label}
                  </span>
                </div>

                {/* Details / Exercises notes */}
                {w.details && (
                  <p className="text-xs text-stone-700 bg-stone-50/70 p-3 rounded-2xl border border-stone-100 mt-2">
                    📝 <strong>Przebieg treningu:</strong> {w.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Workout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Zapisz Nowy Trening ({selectedPerson === 'aleksandra' ? 'Aleksandra' : 'Kuba'})
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nazwa treningu / partia *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Trening nóg i pośladków, Bieg 5km..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Typ aktywności</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="pilates">🧘‍♀️ Pilates & Stretching</option>
                    <option value="bieganie">🏃‍♂️ Bieganie</option>
                    <option value="silownia">🏋️‍♂️ Siłownia</option>
                    <option value="joga">🌿 Joga</option>
                    <option value="spacer_z_aria">🐾 Marsz z Arią</option>
                    <option value="rower">🚴 Rower</option>
                    <option value="hiit">⚡ HIIT</option>
                    <option value="inne">🏅 Inne</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={workoutDate}
                    onChange={(e) => setWorkoutDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Czas (min) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dystans (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="5.2"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kalorie</label>
                  <input
                    type="number"
                    placeholder="350"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Samopoczucie</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                >
                  <option value="swietnie">🔥 Świetna forma & energia</option>
                  <option value="dobrze">👍 Dobry trening</option>
                  <option value="zmeczenie">😴 Zmęczenie, ale zrobione</option>
                  <option value="ciezko">🥵 Było ciężko</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Ćwiczenia, serie lub notatka</label>
                <textarea
                  rows={2}
                  placeholder="np. Przysiady 4x10, Martwy ciąg 3x12, wznosy hantli..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 shadow-xs"
                >
                  Zapisz aktywność
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
