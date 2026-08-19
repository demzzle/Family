import React from 'react';
import { 
  MessageSquareHeart, 
  CalendarDays, 
  CheckSquare, 
  ShoppingCart, 
  Dog, 
  Cat,
  Baby,
  Film,
  Sparkles,
  PiggyBank,
  GraduationCap,
  Activity,
  Heart,
  Home,
  Settings
} from 'lucide-react';
import { TabType, SectionVisibility } from '../types';

interface NavbarBadges {
  tasks?: number;
  shopping?: number;
  dog?: number;
  cat?: number;
  entertainment?: number;
  fridge?: number;
  education?: number;
  nudges?: number;
  uk_logistics?: number;
}

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  badges?: NavbarBadges;
  sectionVisibility?: SectionVisibility;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  badges = {} as NavbarBadges,
  sectionVisibility
}) => {
  const allTabs: { id: TabType; label: string; shortLabel: string; icon: React.ReactNode; badge?: number; color: string; isAlwaysVisible?: boolean }[] = [
    {
      id: 'feed',
      label: 'Tablica Rodzinna',
      shortLabel: 'Tablica',
      icon: <MessageSquareHeart className="w-5 h-5" />,
      color: 'amber'
    },
    {
      id: 'nudges',
      label: 'Zaczepki & Relacja',
      shortLabel: 'Zaczepki 💕',
      icon: <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />,
      badge: badges.nudges,
      color: 'rose'
    },
    {
      id: 'uk_logistics',
      label: 'Logistyka UK & Kosze',
      shortLabel: 'Dom UK 🇬🇧',
      icon: <Home className="w-5 h-5" />,
      badge: badges.uk_logistics,
      color: 'sky'
    },
    {
      id: 'calendar',
      label: 'Kalendarz & Dzień',
      shortLabel: 'Kalendarz',
      icon: <CalendarDays className="w-5 h-5" />,
      color: 'sky'
    },
    {
      id: 'tasks',
      label: 'Zadania & Terminy',
      shortLabel: 'Zadania',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: badges.tasks,
      color: 'emerald'
    },
    {
      id: 'shopping',
      label: 'Zakupy & Posiłki',
      shortLabel: 'Kuchnia',
      icon: <ShoppingCart className="w-5 h-5" />,
      badge: badges.shopping,
      color: 'teal'
    },
    {
      id: 'child',
      label: 'Strefa Dziecka',
      shortLabel: 'Tymek',
      icon: <Baby className="w-5 h-5" />,
      color: 'emerald'
    },
    {
      id: 'dog',
      label: 'Kącik Arii',
      shortLabel: 'Aria',
      icon: <Dog className="w-5 h-5" />,
      badge: badges.dog,
      color: 'orange'
    },
    {
      id: 'cat',
      label: 'Kącik Kota',
      shortLabel: 'Kotek 🐱',
      icon: <Cat className="w-5 h-5" />,
      badge: badges.cat,
      color: 'purple'
    },
    {
      id: 'entertainment',
      label: 'Rozrywka & Randki',
      shortLabel: 'Rozrywka',
      icon: <Film className="w-5 h-5" />,
      badge: badges.entertainment,
      color: 'rose'
    },
    {
      id: 'education',
      label: 'Edukacja & Studia',
      shortLabel: 'Nauka',
      icon: <GraduationCap className="w-5 h-5" />,
      badge: badges.education,
      color: 'indigo'
    },
    {
      id: 'fitness',
      label: 'Treningi & Ruch',
      shortLabel: 'Trening',
      icon: <Activity className="w-5 h-5" />,
      color: 'teal'
    },
    {
      id: 'fridge',
      label: 'Lodówka (Notatki)',
      shortLabel: 'Lodówka',
      icon: <Sparkles className="w-5 h-5" />,
      badge: badges.fridge,
      color: 'amber'
    },
    {
      id: 'savings',
      label: 'Skarbonka',
      shortLabel: 'Skarbonka',
      icon: <PiggyBank className="w-5 h-5" />,
      color: 'emerald'
    },
    {
      id: 'settings',
      label: 'Ustawienia',
      shortLabel: 'Ustawienia',
      icon: <Settings className="w-5 h-5" />,
      color: 'stone',
      isAlwaysVisible: true
    }
  ];

  // Filter tabs based on sectionVisibility
  const tabs = allTabs.filter((tab) => {
    if (tab.isAlwaysVisible) return true;
    if (!sectionVisibility) return true;
    const key = tab.id as keyof SectionVisibility;
    return sectionVisibility[key] !== false;
  });

  return (
    <>
      {/* Desktop & Tablet Top Navigation Bar */}
      <nav className="hidden md:block bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 lg:space-x-2 py-2 overflow-x-auto no-scrollbar scroll-smooth">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`desktop-tab-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-100/90 text-amber-950 shadow-2xs font-bold ring-1 ring-amber-300/60'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                  }`}
                >
                  <span className={`${isActive ? 'text-amber-800' : 'text-stone-400 group-hover:text-stone-600'}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-amber-700 text-white'
                          : 'bg-stone-200 text-stone-700 group-hover:bg-stone-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Fixed Navigation Bar (Scrollable horizontally with prominent icons) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg px-2 py-1.5">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-1 py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl transition-all relative shrink-0 ${
                  isActive
                    ? 'text-amber-800 font-bold bg-amber-50'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <div className="relative">
                  <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-amber-700' : ''}`}>
                    {tab.icon}
                  </span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                  {tab.shortLabel}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
