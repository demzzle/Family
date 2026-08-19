import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Users, 
  Trash2, 
  RefreshCw, 
  Download, 
  Upload, 
  Check, 
  Camera, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Palette, 
  HelpCircle,
  FolderSync,
  Heart,
  Truck,
  Calendar,
  CheckSquare,
  ShoppingCart,
  Baby,
  Dog,
  Cat,
  Film,
  GraduationCap,
  Activity,
  StickyNote as StickyIcon,
  PiggyBank,
  LayoutGrid
} from 'lucide-react';
import { SectionVisibility, FamilyMember, MemberId } from '../types';

interface SettingsSectionProps {
  sectionVisibility: SectionVisibility;
  onUpdateSectionVisibility: (config: SectionVisibility) => void;
  familyMembers: Record<string, FamilyMember>;
  onUpdateFamilyMember: (member: FamilyMember) => void;
  onClearSampleData: () => void;
  onRestoreSampleData: () => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => void;
}

const SECTION_DESCRIPTIONS: {
  id: keyof SectionVisibility;
  name: string;
  desc: string;
  icon: any;
  color: string;
  badge: string;
}[] = [
  {
    id: 'feed',
    name: 'Tablica Rodzinna (Feed)',
    desc: 'Oś czasu wspomnień, zdjęcia, wpisy z dnia codziennego, lajki i komentarze',
    icon: LayoutGrid,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    badge: 'Główna'
  },
  {
    id: 'nudges',
    name: 'Zaczepki & Relacja (Love Nudges)',
    desc: 'Błyskawiczne miłosne zaczepki, flirt, barometr nastroju i Biała Flaga (rozejm)',
    icon: Heart,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    badge: 'Relacja'
  },
  {
    id: 'uk_logistics',
    name: 'Logistyka UK & Dom (🇬🇧)',
    desc: 'Harmonogram koszy (Bin Day), MOT/Tax auta, paczki/kurierzy, karty lojalnościowe, wyszukiwarka przedmiotów',
    icon: Truck,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    badge: 'UK Hub'
  },
  {
    id: 'calendar',
    name: 'Kalendarz & Harmonogram',
    desc: 'Wydarzenia, grafiki pracy, dyżury odprowadzania/odbioru z przedszkola i plany na wieczór',
    icon: Calendar,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    badge: 'Czas'
  },
  {
    id: 'tasks',
    name: 'Zadania & Terminy (Tasks)',
    desc: 'Domowe obowiązki, harmonogram sprzątania, terminy i priorytety',
    icon: CheckSquare,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    badge: 'Organizacja'
  },
  {
    id: 'shopping',
    name: 'Zakupy & Przepisy & Posiłki',
    desc: 'Inteligentna lista zakupów, baza ulubionych dań i tygodniowy jadłospis',
    icon: ShoppingCart,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    badge: 'Kuchnia'
  },
  {
    id: 'child',
    name: 'Strefa Dziecka (Tymek)',
    desc: 'Aktualne rozmiary ubranek/butów, dziennik leków, niezbędnik przedszkolaka i złote myśli',
    icon: Baby,
    color: 'text-sky-600 bg-sky-50 border-sky-200',
    badge: 'Dziecko'
  },
  {
    id: 'dog',
    name: 'Kącik Psa (Aria)',
    desc: 'Status spacerów z timerem, wizyty u weterynarza, szczepienia i profilaktyka na kleszcze',
    icon: Dog,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    badge: 'Pies'
  },
  {
    id: 'cat',
    name: 'Kącik Kota (Luna)',
    desc: 'Czyszczenie kuwety, karmienie, świeża woda, szczepienia kotka i zabawa',
    icon: Cat,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    badge: 'Kot'
  },
  {
    id: 'entertainment',
    name: 'Rozrywka & Randki & Koło Fortuny',
    desc: 'Filmy i seriale do obejrzenia, lista marzeń (Bucket List) oraz generator losowy decyzji',
    icon: Film,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    badge: 'Relaks'
  },
  {
    id: 'education',
    name: 'Edukacja & Studia',
    desc: 'Degree Apprenticeship, backend, zadania na uczelnię i sesje głębokiego skupienia (Pomodoro)',
    icon: GraduationCap,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    badge: 'Rozwój'
  },
  {
    id: 'fitness',
    name: 'Treningi & Ruch',
    desc: 'Dziennik aktywności: bieganie, siłownia, pilates, joga i spacery z Arią',
    icon: Activity,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    badge: 'Zdrowie'
  },
  {
    id: 'fridge',
    name: 'Lodówka (Wirtualne Karteczki)',
    desc: 'Kolorowe notatki, ważne informacje na dany dzień, piny i przypomnienia',
    icon: StickyIcon,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    badge: 'Notatki'
  },
  {
    id: 'savings',
    name: 'Skarbonka (Cele Oszczędnościowe)',
    desc: 'Paski postępu oszczędzania na wakacje, remont i wspólne marzenia',
    icon: PiggyBank,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    badge: 'Finanse'
  },
  {
    id: 'quickStatusBar',
    name: 'Pasek Szybkich Akcji (Góra ekranu)',
    desc: 'Szybki pasek meldunku ze spaceru psa, statusu przedszkola, focus mode i powiadomień o koszach',
    icon: Sliders,
    color: 'text-stone-700 bg-stone-100 border-stone-300',
    badge: 'Pasek Górny'
  }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&auto=format&fit=crop&q=80'
];

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  sectionVisibility,
  onUpdateSectionVisibility,
  familyMembers,
  onUpdateFamilyMember,
  onClearSampleData,
  onRestoreSampleData,
  onExportData,
  onImportData
}) => {
  const [activeTab, setActiveTab] = useState<'visibility' | 'members' | 'data'>('visibility');
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarUploadRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleSection = (sectionId: keyof SectionVisibility) => {
    const updated = {
      ...sectionVisibility,
      [sectionId]: !sectionVisibility[sectionId]
    };
    onUpdateSectionVisibility(updated);
    showToast(`Zaktualizowano widoczność sekcji: ${sectionId}`);
  };

  const handleEnableAll = () => {
    const allEnabled: SectionVisibility = {
      feed: true,
      nudges: true,
      uk_logistics: true,
      calendar: true,
      tasks: true,
      shopping: true,
      child: true,
      dog: true,
      entertainment: true,
      education: true,
      fitness: true,
      fridge: true,
      savings: true,
      quickStatusBar: true
    };
    onUpdateSectionVisibility(allEnabled);
    showToast('Włączono wszystkie sekcje');
  };

  const handleEnableMinimal = () => {
    const minimal: SectionVisibility = {
      feed: true,
      nudges: true,
      uk_logistics: true,
      calendar: true,
      tasks: true,
      shopping: true,
      child: true,
      dog: true,
      entertainment: false,
      education: false,
      fitness: false,
      fridge: false,
      savings: false,
      quickStatusBar: true
    };
    onUpdateSectionVisibility(minimal);
    showToast('Włączono zestaw najważniejszych sekcji');
  };

  // Avatar file upload to base64
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingMember) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingMember({
          ...editingMember,
          avatar: reader.result
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    onUpdateFamilyMember(editingMember);
    setEditingMember(null);
    showToast(`Zapisano profil: ${editingMember.name}`);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImportData(reader.result);
        showToast('Dane zaimportowane pomyślnie!');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const activeCount = Object.values(sectionVisibility).filter(Boolean).length;
  const totalCount = Object.keys(sectionVisibility).length;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs mb-3">
            <Settings className="w-3.5 h-3.5" />
            Centrum Konfiguracji Portalu
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-['Outfit',sans-serif]">
            Ustawienia & Zarządzanie Danymi
          </h2>
          <p className="text-sm sm:text-base text-stone-300 mt-2">
            Dostosuj aplikację do swoich prawdziwych potrzeb. Włączaj i wyłączaj sekcje, edytuj profile domowników oraz zarządzaj kopiami zapasowymi.
          </p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
          <Sliders className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200/80">
        <button
          id="tab-visibility-btn"
          onClick={() => setActiveTab('visibility')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'visibility'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-600" />
          Widoczność Sekcji ({activeCount}/{totalCount})
        </button>

        <button
          id="tab-members-btn"
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'members'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4 text-amber-600" />
          Profile Rodziny (CRUD)
        </button>

        <button
          id="tab-data-btn"
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'data'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FolderSync className="w-4 h-4 text-amber-600" />
          Zarządzanie Danymi & Reset
        </button>
      </div>

      {/* TAB 1: SECTION VISIBILITY (TOGGLES) */}
      {activeTab === 'visibility' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Zarządzaj widocznymi modułami
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Wyłącz sekcje, z których aktualnie nie korzystacie, aby uprościć menu i ekran główny.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEnableAll}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  Włącz wszystkie
                </button>
                <button
                  onClick={handleEnableMinimal}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                >
                  Tylko kluczowe
                </button>
              </div>
            </div>

            {/* Grid of section toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-6">
              {SECTION_DESCRIPTIONS.map((section) => {
                const IconComponent = section.icon;
                const isVisible = sectionVisibility[section.id];

                return (
                  <div
                    key={section.id}
                    className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all ${
                      isVisible
                        ? 'bg-stone-50/70 border-stone-200 hover:border-amber-300'
                        : 'bg-stone-100/40 border-stone-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className={`p-2.5 rounded-xl border ${section.color} shrink-0 mt-0.5`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-stone-900">
                            {section.name}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                            {section.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                          {section.desc}
                        </p>
                      </div>
                    </div>

                    {/* Switch Toggle */}
                    <button
                      id={`toggle-${section.id}`}
                      onClick={() => handleToggleSection(section.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isVisible ? 'bg-emerald-500' : 'bg-stone-300'
                      }`}
                      role="switch"
                      aria-checked={isVisible}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isVisible ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FAMILY MEMBERS (CRUD) */}
      {activeTab === 'members' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-xs">
            <div className="pb-6 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                Członkowie Rodziny & Profile
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Edytuj imiona, role, zdjęcia profilowe (wgrywanie pliku z telefonu/komputera lub link URL) oraz kolory.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              {(Object.values(familyMembers) as FamilyMember[]).map((member) => (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex flex-col items-center text-center relative group hover:border-amber-300 transition-all shadow-2xs"
                >
                  <div className="relative mb-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-20 h-20 rounded-2xl object-cover ring-3 ring-amber-400/40 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div 
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: member.color }}
                    />
                  </div>

                  <h4 className="text-base font-bold text-stone-900">
                    {member.name}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    {member.role}
                  </p>

                  <span className={`mt-2 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${member.badgeBg}`}>
                    ID: {member.id}
                  </span>

                  <button
                    id={`edit-member-${member.id}-btn`}
                    onClick={() => setEditingMember(member)}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 transition-colors shadow-2xs"
                  >
                    Edytuj dane & zdjęcie
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA MANAGEMENT & ZERO RESET */}
      {activeTab === 'data' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-xs">
            <div className="pb-6 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                Czyszczenie & Kopia Zapasowa Danych
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Chcesz zacząć korzystać z aplikacji na czysto? Użyj przycisku „Zacznij od zera”, aby usunąć dane przykładowe i wprowadzić własne.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              
              {/* Card 1: Clear Sample Data (Start from Scratch) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col justify-between">
                <div>
                  <div className="inline-flex p-2.5 rounded-xl bg-rose-100 text-rose-700 mb-3">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900">
                    🧹 Zacznij od zera (Wyczyść przykłady)
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Usuwa przykładowe posty, zadania, wpisy w kalendarzu, przepisy, leki, paczki i notatki wygenerowane przez AI. Zachowuje Wasze profile i ustawienia, abyście mogli natychmiast wpisywać prawdziwe dane.
                  </p>
                </div>

                <div className="mt-5">
                  <button
                    id="clear-sample-data-btn"
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs active:scale-98"
                  >
                    Wyczyść dane przykładowe (Zacznij od zera)
                  </button>
                </div>
              </div>

              {/* Card 2: Restore Sample Data */}
              <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="inline-flex p-2.5 rounded-xl bg-stone-200 text-stone-700 mb-3">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900">
                    🔄 Przywróć dane przykładowe
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Jeśli chcesz ponownie zobaczyć demonstracyjne wpisy, zadania, harmonogram koszy i kącik psa z przykładowymi danymi, możesz je w każdej chwili załadować z powrotem.
                  </p>
                </div>

                <div className="mt-5">
                  <button
                    id="restore-sample-data-btn"
                    onClick={() => setShowRestoreConfirm(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs sm:text-sm font-semibold transition-colors active:scale-98"
                  >
                    Przywróć dane demonstracyjne
                  </button>
                </div>
              </div>

              {/* Card 3: Export Backup JSON */}
              <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="inline-flex p-2.5 rounded-xl bg-indigo-100 text-indigo-700 mb-3">
                    <Download className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900">
                    💾 Pobierz kopię zapasową (JSON)
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Eksportuj wszystkie wprowadzone informacje do bezpiecznego pliku tekstowego JSON na swój telefon lub komputer.
                  </p>
                </div>

                <div className="mt-5">
                  <button
                    id="export-json-btn"
                    onClick={onExportData}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Pobierz plik backupu (.json)
                  </button>
                </div>
              </div>

              {/* Card 4: Import Backup JSON */}
              <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="inline-flex p-2.5 rounded-xl bg-emerald-100 text-emerald-700 mb-3">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900">
                    📥 Wgraj kopię zapasową (JSON)
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Przywróć dane z wcześniej pobranego pliku JSON na innym urządzeniu (np. z telefonu partnera).
                  </p>
                </div>

                <div className="mt-5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportFileChange}
                    accept=".json,application/json"
                    className="hidden"
                  />
                  <button
                    id="import-json-btn"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Wybierz plik z dysku (.json)
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MEMBER PROFILE */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: editingMember.color }}
                >
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Edycja Profilu: {editingMember.name}
                  </h3>
                  <p className="text-xs text-stone-500">ID: {editingMember.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="text-stone-400 hover:text-stone-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Imię / Nazwa
                </label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Rola w rodzinie
                </label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Avatar section */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Zdjęcie profilowe / Awatar
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={editingMember.avatar}
                    alt={editingMember.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={avatarUploadRef}
                      onChange={handleAvatarFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarUploadRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-stone-200"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Wgraj zdjęcie z urządzenia
                    </button>
                  </div>
                </div>

                <input
                  type="url"
                  placeholder="Lub wklej link do zdjęcia (URL)..."
                  value={editingMember.avatar}
                  onChange={(e) => setEditingMember({ ...editingMember, avatar: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />

                {/* Preset Avatar Grid */}
                <div className="mt-2.5">
                  <p className="text-[11px] font-semibold text-stone-400 mb-1.5">
                    LUB WYBIERZ Z GOTOWYCH:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setEditingMember({ ...editingMember, avatar: url })}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 ${
                          editingMember.avatar === url ? 'border-amber-500 ring-2 ring-amber-200' : 'border-transparent'
                        }`}
                      >
                        <img src={url} alt="preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kolor akcentu
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editingMember.color}
                    onChange={(e) => setEditingMember({ ...editingMember, color: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-stone-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={editingMember.color}
                    onChange={(e) => setEditingMember({ ...editingMember, color: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
                >
                  Zapisz zmiany
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CLEAR DATA CONFIRMATION */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2.5 rounded-xl bg-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Wyczyścić dane przykładowe?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              Ta operacja usunie przykładowe posty, zadania, harmonogramy i wpisy wygenerowane demonstracyjnie, pozostawiając czystą aplikację gotową na Wasze prawdziwe dane. Twoje profile rodziny zostaną zachowane.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  onClearSampleData();
                  setShowClearConfirm(false);
                  showToast('Dane przykładowe wyczyszczone. Możesz zacząć od zera!');
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Tak, wyczyść i zacznij od zera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESTORE DATA CONFIRMATION */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="p-2.5 rounded-xl bg-amber-100">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Przywrócić dane demonstracyjne?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              Czy na pewno chcesz nadpisać obecne dane i załadować pełen zestaw przykładowych wpisów, zadań, przepisów i harmonogramów?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  onRestoreSampleData();
                  setShowRestoreConfirm(false);
                  showToast('Dane demonstracyjne przywrócone!');
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
              >
                Tak, załaduj przykłady
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
