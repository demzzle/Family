import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquareHeart, 
  Calendar, 
  CheckSquare, 
  ShoppingCart, 
  Dog, 
  Quote, 
  X
} from 'lucide-react';
import { TabType } from '../types';

interface QuickAddFABProps {
  onSelectAction: (action: 'post' | 'calendar' | 'task' | 'shopping' | 'walk' | 'quote') => void;
  onNavigateTab: (tab: TabType) => void;
}

export const QuickAddFAB: React.FC<QuickAddFABProps> = ({
  onSelectAction,
  onNavigateTab
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      id: 'post',
      label: 'Nowy wpis na tablicę',
      icon: <MessageSquareHeart className="w-4 h-4" />,
      color: 'bg-rose-500 hover:bg-rose-600',
      tab: 'feed' as TabType
    },
    {
      id: 'task',
      label: 'Nowe zadanie domowe',
      icon: <CheckSquare className="w-4 h-4" />,
      color: 'bg-amber-600 hover:bg-amber-700',
      tab: 'tasks' as TabType
    },
    {
      id: 'calendar',
      label: 'Wydarzenie w kalendarzu',
      icon: <Calendar className="w-4 h-4" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      tab: 'calendar' as TabType
    },
    {
      id: 'shopping',
      label: 'Produkt na zakupy',
      icon: <ShoppingCart className="w-4 h-4" />,
      color: 'bg-teal-600 hover:bg-teal-700',
      tab: 'shopping' as TabType
    },
    {
      id: 'walk',
      label: 'Spacer z Arią',
      icon: <Dog className="w-4 h-4" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      tab: 'dog' as TabType
    },
    {
      id: 'quote',
      label: 'Powiedzonko Tymka',
      icon: <Quote className="w-4 h-4" />,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      tab: 'child' as TabType
    }
  ];

  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 z-40">
      
      {/* Expanded Action Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-2xs -z-10 animate-in fade-in duration-100"
            onClick={() => setIsOpen(false)}
          />
          <div className="flex flex-col items-end gap-2 mb-3 animate-in slide-in-from-bottom-5 fade-in duration-150">
            {actions.map((act) => (
              <button
                key={act.id}
                onClick={() => {
                  onNavigateTab(act.tab);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white text-stone-800 shadow-lg border border-stone-200 hover:bg-stone-50 transition-all text-xs font-semibold group active:scale-95"
              >
                <span>{act.label}</span>
                <span className={`p-2 rounded-xl text-white ${act.color} shadow-xs`}>
                  {act.icon}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Main Floating Button */}
      <button
        id="quick-add-fab-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-13 h-13 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90 ${
          isOpen
            ? 'bg-stone-900 rotate-45'
            : 'bg-gradient-to-tr from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 ring-4 ring-amber-200/60'
        }`}
        title="Szybkie dodawanie"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

    </div>
  );
};
