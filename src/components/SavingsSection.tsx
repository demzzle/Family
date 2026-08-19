import React, { useState } from 'react';
import { 
  PiggyBank, 
  Plus, 
  TrendingUp, 
  Target, 
  Calendar, 
  Sparkles, 
  Coins, 
  Trash2, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import { SavingsGoal, SavingsContribution, MemberId } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface SavingsSectionProps {
  goals: SavingsGoal[];
  activeMemberId: MemberId;
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'contributions'>) => void;
  onAddContribution: (goalId: string, contribution: Omit<SavingsContribution, 'id'>) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const SavingsSection: React.FC<SavingsSectionProps> = ({
  goals,
  activeMemberId,
  onAddGoal,
  onAddContribution,
  onDeleteGoal
}) => {
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // New Goal Form State
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [currency, setCurrency] = useState<'zł' | '£' | '€'>('zł');
  const [category, setCategory] = useState<any>('wakacje');
  const [icon, setIcon] = useState('🌴');
  const [deadline, setDeadline] = useState('');

  // Contribution Form State
  const [contribAmount, setContribAmount] = useState('');
  const [contribNote, setContribNote] = useState('');

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalPercentage = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount) return;

    onAddGoal({
      title: title.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(initialAmount) || 0,
      currency,
      category,
      icon: icon || '🎯',
      deadline: deadline || undefined
    });

    setTitle('');
    setTargetAmount('');
    setInitialAmount('');
    setShowAddGoalModal(false);
  };

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !contribAmount) return;

    onAddContribution(selectedGoalId, {
      memberId: activeMemberId,
      amount: Number(contribAmount),
      date: new Date().toISOString().split('T')[0],
      note: contribNote.trim() || undefined
    });

    setContribAmount('');
    setContribNote('');
    setShowContributeModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-teal-400/10 to-emerald-100/50 border border-emerald-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-2xl shadow-xs">
              <PiggyBank className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Outfit',sans-serif]">
              Skarbonka & Wspólne Cele
            </h2>
          </div>
          <p className="text-xs text-stone-600 max-w-lg">
            Odkładamy na marzenia, wakacje, wyposażenie dla Tymka i poduszkę finansową dla naszego spokoju.
          </p>
        </div>

        {/* Global Summary Box */}
        <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-emerald-200 text-center sm:text-right shadow-2xs w-full sm:w-auto">
          <span className="text-xs text-stone-500 block">Łącznie zaoszczędzono</span>
          <span className="text-2xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            {totalSaved.toLocaleString('pl-PL')} zł
          </span>
          <div className="flex items-center justify-center sm:justify-end gap-1.5 text-xs text-emerald-800 font-bold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{totalPercentage}% wszystkich celów</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
          Aktywne Skarbonki ({goals.length})
        </h3>
        <button
          onClick={() => setShowAddGoalModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Nowy cel oszczędnościowy
        </button>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 bg-stone-50 rounded-2xl border border-stone-200/60 shadow-2xs">
                      {goal.icon}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                        {goal.title}
                      </h4>
                      {goal.deadline && (
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" /> Cel do: {goal.deadline}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-stone-300 hover:text-rose-600 p-1"
                    title="Usuń skarbonkę"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar & Amounts */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900 text-sm">
                      {goal.currentAmount.toLocaleString('pl-PL')} {goal.currency}
                    </span>
                    <span className="text-stone-500 font-medium">
                      z {goal.targetAmount.toLocaleString('pl-PL')} {goal.currency} ({pct}%)
                    </span>
                  </div>

                  {/* Gradient Progress bar */}
                  <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 100
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>
                      {pct >= 100 ? '🎉 Cel osiągnięty!' : `Brakuje: ${remaining.toLocaleString('pl-PL')} ${goal.currency}`}
                    </span>
                    <span>Wpłat: {goal.contributions.length}</span>
                  </div>
                </div>

                {/* Recent Contributions Preview */}
                {goal.contributions.length > 0 && (
                  <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-100 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Ostatnia wpłata:</span>
                    <p className="text-stone-700 font-medium">
                      +{goal.contributions[0].amount} {goal.currency} od {FAMILY_MEMBERS[goal.contributions[0].memberId]?.name}
                      {goal.contributions[0].note && <span className="text-stone-500 italic"> ({goal.contributions[0].note})</span>}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button: Add Funds */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-end">
                <button
                  onClick={() => {
                    setSelectedGoalId(goal.id);
                    setShowContributeModal(true);
                  }}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Dorzuć do skarbonki
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Nowy Cel Oszczędnościowy
              </h3>
              <button onClick={() => setShowAddGoalModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nazwa celu *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Wakacje w Grecji, Nowy aparat fotograficzny..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kwota docelowa *</label>
                  <input
                    type="number"
                    required
                    placeholder="np. 5000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kwota startowa</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Waluta</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="zł">zł (PLN)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="€">€ (EUR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Ikona / Emotka</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="🌴, 🚲, 🏡..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Planowana data realizacji</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 shadow-xs"
                >
                  Stwórz skarbonkę
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Wpłata do Skarbonki
              </h3>
              <button onClick={() => setShowContributeModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleContributeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kwota wpłaty *</label>
                <input
                  type="number"
                  required
                  placeholder="np. 200"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notatka (opcjonalnie)</label>
                <input
                  type="text"
                  placeholder="np. Z premii, sprzedaż z Vinted..."
                  value={contribNote}
                  onChange={(e) => setContribNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowContributeModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 shadow-xs"
                >
                  Zatwierdź wpłatę
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
