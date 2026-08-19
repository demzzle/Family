import React from 'react';
import { Heart, Bell, UserCheck, Settings, Calendar } from 'lucide-react';
import { FamilyMember, MemberId } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface HeaderProps {
  activeMemberId: MemberId;
  onSelectMember: (id: MemberId) => void;
  notificationCount: number;
  onOpenNotifications: () => void;
  onResetData: () => void;
  familyMembers?: Record<string, FamilyMember>;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMemberId,
  onSelectMember,
  notificationCount,
  onOpenNotifications,
  onResetData,
  familyMembers = FAMILY_MEMBERS,
  onOpenSettings
}) => {
  const [showMemberMenu, setShowMemberMenu] = React.useState(false);
  const activeMember = familyMembers[activeMemberId] || familyMembers.mama || FAMILY_MEMBERS.mama;

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = today.toLocaleDateString('pl-PL', options);

  return (
    <header className="sticky top-0 z-30 bg-[#fcfaf8]/95 backdrop-blur-md border-b border-stone-200/70 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-400 to-amber-600 text-white shadow-sm shadow-amber-500/20">
              <Heart className="w-5 h-5 fill-white/30 text-white" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white border-2 border-white">
                4
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 font-['Outfit',sans-serif]">
                  Portal Rodzinny
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100/80 text-amber-800 border border-amber-200/60">
                  Nasz Dom
                </span>
              </div>
              <p className="text-xs text-stone-500 capitalize flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-600 inline" />
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Right Side: Active User Switcher & Notifications & Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notification Bell */}
            <button
              id="notifications-bell-btn"
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-colors border border-transparent hover:border-stone-200 active:scale-95"
              title="Powiadomienia i przypomnienia"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Quick Settings Icon Button */}
            {onOpenSettings && (
              <button
                id="header-settings-btn"
                onClick={onOpenSettings}
                className="p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-colors border border-transparent hover:border-stone-200 active:scale-95"
                title="Ustawienia i personalizacja"
              >
                <Settings className="w-5 h-5 text-stone-600 hover:text-amber-600" />
              </button>
            )}

            {/* Profile Switcher dropdown */}
            <div className="relative">
              <button
                id="member-switcher-btn"
                onClick={() => setShowMemberMenu(!showMemberMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-amber-300 transition-all active:scale-98"
              >
                <div className="relative">
                  <img
                    src={activeMember.avatar}
                    alt={activeMember.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-2 ring-amber-400/40"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                </div>
                <div className="text-left hidden xs:block sm:block">
                  <p className="text-xs font-semibold text-stone-800 leading-tight">
                    {activeMember.name}
                  </p>
                  <p className="text-[10px] text-stone-500 leading-none">
                    {activeMember.role}
                  </p>
                </div>
                <span className="text-[10px] text-stone-400 ml-0.5">▼</span>
              </button>

              {/* Profile Picker Dropdown */}
              {showMemberMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowMemberMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-stone-200 shadow-xl p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-stone-100 mb-1">
                      <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        Przełącz aktywnego użytkownika
                      </p>
                      <p className="text-xs text-stone-600">
                        Jako kto dodajesz wpisy i oznaczasz zadania?
                      </p>
                    </div>

                    <div className="space-y-1">
                      {Object.values(familyMembers).map((member) => (
                        <button
                          key={member.id}
                          onClick={() => {
                            onSelectMember(member.id);
                            setShowMemberMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                            activeMemberId === member.id
                              ? 'bg-amber-50 border border-amber-200 text-stone-900 font-medium'
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-stone-900 truncate">
                              {member.name}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              {member.role}
                            </p>
                          </div>
                          {activeMemberId === member.id && (
                            <UserCheck className="w-4 h-4 text-amber-600" />
                          )}
                        </button>
                      ))}
                    </div>

                    {onOpenSettings && (
                      <div className="mt-2 pt-2 border-t border-stone-100">
                        <button
                          onClick={() => {
                            setShowMemberMenu(false);
                            onOpenSettings();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors font-medium"
                        >
                          <Settings className="w-3.5 h-3.5 text-stone-500" />
                          Ustawienia i edycja domowników
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

