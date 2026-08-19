import React, { useState } from 'react';
import { 
  Pin, 
  Plus, 
  Trash2, 
  Sparkles, 
  Heart, 
  Tag, 
  AlertCircle, 
  Check, 
  Layers
} from 'lucide-react';
import { StickyNote, StickyNoteColor, MemberId } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface FridgeNotesSectionProps {
  notes: StickyNote[];
  activeMemberId: MemberId;
  onAddNote: (note: Omit<StickyNote, 'id'>) => void;
  onTogglePin: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const FridgeNotesSection: React.FC<FridgeNotesSectionProps> = ({
  notes,
  activeMemberId,
  onAddNote,
  onTogglePin,
  onDeleteNote
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [content, setContent] = useState('');
  const [color, setColor] = useState<StickyNoteColor>('yellow');
  const [tag, setTag] = useState('Ważne na dziś');
  const [isUrgent, setIsUrgent] = useState(false);

  const colorStyles: Record<StickyNoteColor, { bg: string; border: string; tape: string; text: string }> = {
    yellow: { bg: 'bg-[#fef9c3]', border: 'border-yellow-300', tape: 'bg-yellow-400/40', text: 'text-yellow-950' },
    pink: { bg: 'bg-[#fce7f3]', border: 'border-pink-300', tape: 'bg-pink-400/40', text: 'text-pink-950' },
    blue: { bg: 'bg-[#e0f2fe]', border: 'border-sky-300', tape: 'bg-sky-400/40', text: 'text-sky-950' },
    green: { bg: 'bg-[#dcfce7]', border: 'border-emerald-300', tape: 'bg-emerald-400/40', text: 'text-emerald-950' },
    orange: { bg: 'bg-[#ffedd5]', border: 'border-orange-300', tape: 'bg-orange-400/40', text: 'text-orange-950' },
    purple: { bg: 'bg-[#f3e8ff]', border: 'border-purple-300', tape: 'bg-purple-400/40', text: 'text-purple-950' }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddNote({
      content: content.trim(),
      authorId: activeMemberId,
      date: new Date().toISOString().split('T')[0],
      color,
      pinned: true,
      tag: tag.trim() || undefined,
      isUrgent
    });

    setContent('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-400/10 to-yellow-500/10 border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
            <span className="text-2xl">🧊</span>
            Wirtualna Lodówka – Notatki & Liściki
          </h2>
          <p className="text-xs text-stone-600">
            Przyklejane karteczki dla rodziny, kody do bramy, ważne przypomnienia na dziś i miłe słówka.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Przyklej nową karteczkę
        </button>
      </div>

      {/* Fridge Surface Board */}
      <div className="bg-stone-200/60 border-2 border-stone-300/80 rounded-3xl p-6 sm:p-8 min-h-[400px] shadow-inner relative overflow-hidden">
        {/* Subtle Magnetic Grid Pattern */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => {
            const st = colorStyles[note.color] || colorStyles.yellow;
            return (
              <div
                key={note.id}
                className={`${st.bg} ${st.border} border rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all relative group transform hover:-translate-y-0.5`}
              >
                {/* Washi Tape / Magnet on top */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  <div className={`h-4 w-12 ${st.tape} rounded-xs shadow-2xs backdrop-blur-2xs transform -rotate-1`} />
                </div>

                {/* Top Action Bar */}
                <div className="flex items-center justify-between mb-3 pt-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-white/70 px-2 py-0.5 rounded-md text-stone-700">
                    {note.tag || 'Notatka'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(note.id)}
                      className={`p-1 rounded-lg transition-colors ${note.pinned ? 'text-amber-800' : 'text-stone-400'}`}
                      title="Pinezka"
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-amber-700' : ''}`} />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 rounded-lg text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Odklej"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Note Body */}
                <p className={`text-sm font-medium leading-relaxed ${st.text} whitespace-pre-wrap`}>
                  {note.content}
                </p>

                {/* Footer / Author */}
                <div className="mt-4 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] text-stone-500">
                  <span>📅 {note.date}</span>
                  <span className="font-semibold">
                    ~ {FAMILY_MEMBERS[note.authorId]?.name || 'Rodzina'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Sticky Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Przyklej Karteczkę na Lodówkę
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Treść notatki *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="np. Kod do furtki kurierskiej, miły liścik, przypomnienie..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kolor karteczki</label>
                <div className="flex gap-2">
                  {(['yellow', 'pink', 'blue', 'green', 'orange', 'purple'] as StickyNoteColor[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${colorStyles[c].bg} ${
                        color === c ? 'scale-110 border-stone-900 shadow-xs' : 'border-stone-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Etykieta / Kategoria</label>
                <input
                  type="text"
                  placeholder="np. Ważne dla domu, Miły liścik, Auto, Opiekunka..."
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
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
                  className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-xs"
                >
                  Przyklej
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
