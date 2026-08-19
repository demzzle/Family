import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Dog, 
  GraduationCap, 
  ShoppingBag, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { CalendarEvent, TaskItem, DogProfile, ChildProfile, KindergartenDuty, TabType } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayEvents: CalendarEvent[];
  todayTasks: TaskItem[];
  kindergartenDuty: KindergartenDuty;
  dogProfile: DogProfile;
  childProfile: ChildProfile;
  onNavigateTab: (tab: TabType) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  todayEvents,
  todayTasks,
  kindergartenDuty,
  dogProfile,
  childProfile,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  const pendingTasks = todayTasks.filter((t) => !t.completed);
  const unpackedChildItems = childProfile.packingList.filter((i) => !i.checked);
  const upcomingDogVaccines = dogProfile.vaccinations.filter((v) => v.status === 'upcoming');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-['Outfit',sans-serif]">
                Centrum Przypomnień
              </h3>
              <p className="text-xs text-stone-500">Ważne sprawy i terminy na dziś dla rodziny</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
          >
            ✕
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          
          {/* Kindergarten reminder */}
          <div
            onClick={() => {
              onNavigateTab('calendar');
              onClose();
            }}
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 cursor-pointer hover:bg-emerald-100/70 transition-colors flex items-start justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-emerald-700 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-950 block">Odbiór Tymka z Przedszkola o {kindergartenDuty.pickUpTime}</span>
                <p className="text-emerald-800 mt-0.5">
                  Dyżur pełni dzisiaj: <strong>{kindergartenDuty.pickUpBy.toUpperCase()}</strong>
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0" />
          </div>

          {/* Pending tasks on today */}
          {pendingTasks.length > 0 && (
            <div
              onClick={() => {
                onNavigateTab('tasks');
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100/70 transition-colors flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-700 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-950 block">
                    {pendingTasks.length} zadania do zrobienia na dzisiaj
                  </span>
                  <p className="text-amber-800 mt-0.5">
                    m.in. {pendingTasks[0].title}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-700 shrink-0" />
            </div>
          )}

          {/* Dog Vaccinations upcoming */}
          {upcomingDogVaccines.length > 0 && (
            <div
              onClick={() => {
                onNavigateTab('dog');
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 cursor-pointer hover:bg-orange-100/70 transition-colors flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <Dog className="w-4 h-4 text-orange-700 mt-0.5" />
                <div>
                  <span className="font-bold text-orange-950 block">
                    Szczepienie Arii: {upcomingDogVaccines[0].name}
                  </span>
                  <p className="text-orange-800 mt-0.5">
                    Termin przypada wkrótce ({upcomingDogVaccines[0].nextDueDate})
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-orange-700 shrink-0" />
            </div>
          )}

          {/* Unpacked Child Items */}
          {unpackedChildItems.length > 0 && (
            <div
              onClick={() => {
                onNavigateTab('child');
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 cursor-pointer hover:bg-teal-100/70 transition-colors flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <ShoppingBag className="w-4 h-4 text-teal-700 mt-0.5" />
                <div>
                  <span className="font-bold text-teal-950 block">
                    {unpackedChildItems.length} rzeczy do spakowania dla Tymka
                  </span>
                  <p className="text-teal-800 mt-0.5">
                    Sprawdź checklistę plecaka do przedszkola
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-700 shrink-0" />
            </div>
          )}

        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-900 text-white rounded-2xl text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Zamknij powiadomienia
          </button>
        </div>

      </div>
    </div>
  );
};
