import React, { useState, useRef } from 'react';
import { 
  Baby, 
  Ruler, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Quote, 
  Heart, 
  BookOpen, 
  Backpack, 
  Calendar, 
  Smile, 
  Edit3, 
  Check, 
  Clock,
  Pill,
  Activity,
  ShoppingBag,
  ShieldAlert,
  Upload,
  Camera
} from 'lucide-react';
import { ChildProfile, ChildPackingItem, ChildMilestone, ChildMedicationLog, MemberId, FamilyMember } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface ChildSectionProps {
  childProfile: ChildProfile;
  activeMemberId: MemberId;
  onUpdateProfile: (newProfile: ChildProfile) => void;
  familyMembers?: Record<string, FamilyMember>;
}

export const ChildSection: React.FC<ChildSectionProps> = ({
  childProfile,
  activeMemberId,
  onUpdateProfile,
  familyMembers = FAMILY_MEMBERS
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'meds' | 'kindergarten' | 'quotes'>('overview');
  
  // Full Profile Editor Modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(childProfile.name);
  const [editBirthDate, setEditBirthDate] = useState(childProfile.birthDate);
  const [editKindergarten, setEditKindergarten] = useState(childProfile.kindergartenName);
  const [editGroup, setEditGroup] = useState(childProfile.groupName);
  const [editTeacher, setEditTeacher] = useState(childProfile.teacherName);
  const [editAvatar, setEditAvatar] = useState(childProfile.avatarUrl);
  const childAvatarInputRef = useRef<HTMLInputElement>(null);

  // Quick Size Editor Modal
  const [isEditingSizes, setIsEditingSizes] = useState(false);
  const [editClothes, setEditClothes] = useState(childProfile.clothesSize);
  const [editShoe, setEditShoe] = useState(childProfile.shoeSize);
  const [editHeight, setEditHeight] = useState(childProfile.currentHeightCm);
  const [editWeight, setEditWeight] = useState(childProfile.currentWeightKg);

  // New Medication Modal
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('5 ml');
  const [medTime, setMedTime] = useState(new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }));
  const [medNotes, setMedNotes] = useState('');

  // New Quote / Milestone Modal
  const [showAddQuoteModal, setShowAddQuoteModal] = useState(false);
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteStory, setQuoteStory] = useState('');
  const [quoteAge, setQuoteAge] = useState('3,5 roku');

  // New Packing Item
  const [newPackItem, setNewPackItem] = useState('');
  const [packCategory, setPackCategory] = useState<'codziennie' | 'zapas' | 'dokupic'>('codziennie');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveFullProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...childProfile,
      name: editName.trim() || childProfile.name,
      birthDate: editBirthDate.trim() || childProfile.birthDate,
      kindergartenName: editKindergarten.trim() || childProfile.kindergartenName,
      groupName: editGroup.trim() || childProfile.groupName,
      teacherName: editTeacher.trim() || childProfile.teacherName,
      avatarUrl: editAvatar || childProfile.avatarUrl
    });
    setIsEditingProfile(false);
  };

  const handleSaveSizes = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...childProfile,
      clothesSize: editClothes,
      shoeSize: editShoe,
      currentHeightCm: editHeight,
      currentWeightKg: editWeight
    });
    setIsEditingSizes(false);
  };

  const handleDeleteMedication = (id: string) => {
    onUpdateProfile({
      ...childProfile,
      medicationLogs: (childProfile.medicationLogs || []).filter((l) => l.id !== id)
    });
  };

  const handleDeleteMilestone = (id: string) => {
    onUpdateProfile({
      ...childProfile,
      milestones: childProfile.milestones.filter((m) => m.id !== id)
    });
  };

  const handleTogglePackItem = (id: string) => {
    const updated = childProfile.packingList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    onUpdateProfile({ ...childProfile, packingList: updated });
  };

  const handleAddPackItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackItem.trim()) return;

    const newItem: ChildPackingItem = {
      id: `pk-${Date.now()}`,
      item: newPackItem.trim(),
      checked: false,
      category: packCategory
    };

    onUpdateProfile({
      ...childProfile,
      packingList: [...childProfile.packingList, newItem]
    });
    setNewPackItem('');
  };

  const handleDeletePackItem = (id: string) => {
    onUpdateProfile({
      ...childProfile,
      packingList: childProfile.packingList.filter((i) => i.id !== id)
    });
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const newLog: ChildMedicationLog = {
      id: `med-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: medTime,
      medName: medName.trim(),
      dose: medDose.trim(),
      administeredBy: activeMemberId,
      reason: medNotes.trim() || 'Profilaktyka / doraźnie',
      temperature: undefined
    };

    onUpdateProfile({
      ...childProfile,
      medicationLogs: [newLog, ...(childProfile.medicationLogs || [])]
    });

    setMedName('');
    setMedNotes('');
    setShowAddMedModal(false);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteStory.trim()) return;

    const newMilestone: ChildMilestone = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: quoteTitle.trim() || 'Śmieszne powiedzonko',
      quoteOrStory: quoteStory.trim(),
      age: quoteAge.trim()
    };

    onUpdateProfile({
      ...childProfile,
      milestones: [newMilestone, ...childProfile.milestones]
    });

    setQuoteTitle('');
    setQuoteStory('');
    setShowAddQuoteModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Hero Child Card */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-teal-400/10 to-emerald-100/50 border border-emerald-200 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <img
                src={childProfile.avatarUrl}
                alt={childProfile.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                <Baby className="w-4 h-4" />
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-stone-900 font-['Outfit',sans-serif]">
                  {childProfile.name}
                </h2>
                <span className="bg-emerald-100 text-emerald-900 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Przedszkolak
                </span>
              </div>

              <p className="text-xs text-stone-600">
                Urodziny: <strong>{childProfile.birthDate}</strong> • Grupa: <strong>{childProfile.groupName}</strong> ({childProfile.kindergartenName})
              </p>

              {/* Quick Sizes Pill Row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="bg-white/80 border border-emerald-200 text-stone-800 text-xs px-2.5 py-1 rounded-xl font-bold">
                  👕 Ubrania: {childProfile.clothesSize}
                </span>
                <span className="bg-white/80 border border-emerald-200 text-stone-800 text-xs px-2.5 py-1 rounded-xl font-bold">
                  👟 Buty: {childProfile.shoeSize}
                </span>
                <span className="bg-white/80 border border-emerald-200 text-stone-800 text-xs px-2.5 py-1 rounded-xl font-bold">
                  📏 Wzrost: {childProfile.currentHeightCm} cm
                </span>
                <button
                  onClick={() => setIsEditingSizes(true)}
                  className="text-[11px] text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-2.5 py-1 rounded-xl font-semibold transition-colors"
                >
                  ✏️ Edytuj wymiary
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditName(childProfile.name);
              setEditBirthDate(childProfile.birthDate);
              setEditKindergarten(childProfile.kindergartenName);
              setEditGroup(childProfile.groupName);
              setEditTeacher(childProfile.teacherName);
              setEditAvatar(childProfile.avatarUrl);
              setIsEditingProfile(true);
            }}
            className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
            Edytuj dane i zdjęcie
          </button>
        </div>
      </div>

      {/* Navigation Sub Tabs */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-2 shadow-2xs flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <Baby className="w-3.5 h-3.5" />
          Niezbędnik & Wymiary
        </button>
        <button
          onClick={() => setActiveTab('meds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'meds'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          Dzienniczek Zdrowia i Leków ({childProfile.medicationLogs?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('kindergarten')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'kindergarten'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <Backpack className="w-3.5 h-3.5" />
          Wyprawka do Przedszkola ({childProfile.packingList.length})
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'quotes'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          Powiedzonka & Kamienie Milowe ({childProfile.milestones.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SIZES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                <Ruler className="w-4 h-4 text-emerald-600" />
                Aktualne Rozmiary Tymka
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                  <span className="text-stone-500">Ubrania (Góra / Dół):</span>
                  <span className="font-bold text-stone-900">{childProfile.clothesSize}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                  <span className="text-stone-500">Rozmiar buta (Kapcie / Kalosze):</span>
                  <span className="font-bold text-stone-900">{childProfile.shoeSize}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                  <span className="text-stone-500">Wzrost:</span>
                  <span className="font-bold text-stone-900">{childProfile.currentHeightCm} cm</span>
                </div>
                <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                  <span className="text-stone-500">Waga:</span>
                  <span className="font-bold text-stone-900">{childProfile.currentWeightKg} kg</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Informacje o Przedszkolu
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-stone-50 rounded-xl">
                  <span className="text-stone-500 block">Przedszkole i grupa:</span>
                  <span className="font-bold text-stone-900">{childProfile.kindergartenName} – {childProfile.groupName}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl">
                  <span className="text-stone-500 block">Wychowawczyni / Kontakt:</span>
                  <span className="font-bold text-stone-900">{childProfile.teacherName}</span>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-emerald-800 font-semibold block">Godziny: 07:30 – 16:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DZIENNICZEK ZDROWIA I LEKÓW */}
      {activeTab === 'meds' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                Dzienniczek Podawania Leków i Witamin
              </h3>
              <p className="text-xs text-stone-500">
                Sprawdzaj, czy i o której Tymek dostał syrop, witaminę D3 czy probiotyk, aby nie zdublować dawki.
              </p>
            </div>

            <button
              onClick={() => setShowAddMedModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Zapisz podanie leku
            </button>
          </div>

          <div className="space-y-3">
            {(childProfile.medicationLogs || []).map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{log.medName}</span>
                    <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md text-[11px]">
                      Dawka: {log.dose}
                    </span>
                  </div>
                  {log.reason && (
                    <p className="text-stone-600 bg-stone-50 p-1.5 rounded-lg border border-stone-100 text-[11px]">
                      📝 {log.reason}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-stone-800 block">
                      🕒 {log.time} ({log.date})
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Podał(a): <strong>{familyMembers[log.administeredBy]?.name || 'Rodzic'}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Czy na pewno chcesz usunąć ten wpis o leku?')) {
                        handleDeleteMedication(log.id);
                      }
                    }}
                    className="text-stone-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Usuń wpis o leku"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WYPRAWKA DO PRZEDSZKOLA */}
      {activeTab === 'kindergarten' && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
              <Backpack className="w-5 h-5 text-emerald-600" />
              Niezbędnik & Wyprawka Przedszkolaka
            </h3>

            {/* Quick Add Form */}
            <form onSubmit={handleAddPackItem} className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="np. Dodatkowa para skarpetek, kalosze..."
                value={newPackItem}
                onChange={(e) => setNewPackItem(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200"
              />
              <select
                value={packCategory}
                onChange={(e) => setPackCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-stone-200 font-semibold"
              >
                <option value="codziennie">🎒 Codziennie</option>
                <option value="zapas">🗄️ Zapas w szafce</option>
                <option value="dokupic">🛒 Do dokupienia</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 shrink-0"
              >
                Dodaj
              </button>
            </form>

            {/* List */}
            <div className="divide-y divide-stone-100">
              {childProfile.packingList.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => handleTogglePackItem(item.id)}
                    className="flex items-center gap-2.5 text-left flex-1"
                  >
                    {item.checked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-300 hover:text-emerald-600 shrink-0" />
                    )}
                    <span className={item.checked ? 'line-through text-stone-400' : 'font-medium text-stone-900'}>
                      {item.item}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-semibold">
                      {item.category === 'codziennie' ? 'Codziennie' : item.category === 'zapas' ? 'Zapas' : 'Do kupienia'}
                    </span>
                    <button
                      onClick={() => handleDeletePackItem(item.id)}
                      className="text-stone-300 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUOTES & MILESTONES */}
      {activeTab === 'quotes' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                <Quote className="w-4 h-4 text-emerald-600" />
                Złote Myśli & Kamienie Milowe Tymka
              </h3>
              <p className="text-xs text-stone-500">
                Prywatna kronika najśmieszniejszych wypowiedzi i wspomnień.
              </p>
            </div>

            <button
              onClick={() => setShowAddQuoteModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Zapisz powiedzonko
            </button>
          </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {childProfile.milestones.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-3xl border border-emerald-200/80 p-5 shadow-xs space-y-2 flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          {m.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-stone-400">Wiek: {m.age}</span>
                          <button
                            onClick={() => {
                              if (window.confirm('Czy na pewno chcesz usunąć tę złotą myśl?')) {
                                handleDeleteMilestone(m.id);
                              }
                            }}
                            className="text-stone-300 hover:text-rose-600 p-1 transition-colors"
                            title="Usuń powiedzonko"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-stone-800 italic bg-stone-50 p-3 rounded-2xl border border-stone-100 leading-relaxed">
                        "{m.quoteOrStory}"
                      </p>
                    </div>
                    <div className="text-[11px] text-stone-400 text-right pt-2 border-t border-stone-100">
                      📅 {m.date}
                    </div>
                  </div>
                ))}
              </div>
        </div>
      )}

      {/* Size Editor Modal */}
      {isEditingSizes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Aktualizuj Wymiary Tymka
              </h3>
              <button onClick={() => setIsEditingSizes(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSaveSizes} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Rozmiar ubranek</label>
                <input
                  type="text"
                  value={editClothes}
                  onChange={(e) => setEditClothes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Rozmiar buta</label>
                <input
                  type="text"
                  value={editShoe}
                  onChange={(e) => setEditShoe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Wzrost (cm)</label>
                  <input
                    type="number"
                    value={editHeight}
                    onChange={(e) => setEditHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Waga (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editWeight}
                    onChange={(e) => setEditWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditingSizes(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 shadow-xs"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Medication Log Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Zapisz Podanie Leku
              </h3>
              <button onClick={() => setShowAddMedModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddMedication} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nazwa leku / suplementu *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Syrop Lipomal, Paracetamol, Witamina D3..."
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dawka (np. 5 ml, 1 kropla)</label>
                  <input
                    type="text"
                    required
                    value={medDose}
                    onChange={(e) => setMedDose(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Godzina podania</label>
                  <input
                    type="time"
                    required
                    value={medTime}
                    onChange={(e) => setMedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dodatkowa notatka (np. po jedzeniu, stan gorączki)</label>
                <input
                  type="text"
                  placeholder="np. Temperatura 37.8°C, ładnie wypił..."
                  value={medNotes}
                  onChange={(e) => setMedNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 shadow-xs"
                >
                  Zapisz w dzienniczku
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Quote Modal */}
      {showAddQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Zapisz Złotą Myśl Tymka
              </h3>
              <button onClick={() => setShowAddQuoteModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tytuł / Okazja</label>
                <input
                  type="text"
                  placeholder="np. O chmurach na niebie, Spacer z Arią..."
                  value={quoteTitle}
                  onChange={(e) => setQuoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Co powiedział Tymek? *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Cytat..."
                  value={quoteStory}
                  onChange={(e) => setQuoteStory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Wiek Tymka</label>
                <input
                  type="text"
                  value={quoteAge}
                  onChange={(e) => setQuoteAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddQuoteModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 shadow-xs"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL PROFILE EDITOR MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-stone-900 font-['Outfit',sans-serif]">
                  Edytuj profil dziecka
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-stone-400 hover:text-stone-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFullProfile} className="space-y-4 mt-4 text-xs">
              <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <img
                  src={editAvatar}
                  alt={editName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 space-y-1.5">
                  <span className="font-semibold text-stone-700 block">Zdjęcie profilowe dziecka</span>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={childAvatarInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => childAvatarInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-xl font-semibold flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Wgraj z pliku
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Lub wklej link do zdjęcia (URL)
                </label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Imię dziecka *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Data urodzin
                  </label>
                  <input
                    type="text"
                    placeholder="np. 14 maja 2021"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nazwa przedszkola / żłobka
                  </label>
                  <input
                    type="text"
                    value={editKindergarten}
                    onChange={(e) => setEditKindergarten(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Grupa przedszkolna
                  </label>
                  <input
                    type="text"
                    value={editGroup}
                    onChange={(e) => setEditGroup(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Wychowawca / Kontakt
                </label>
                <input
                  type="text"
                  placeholder="np. Pani Kasia (tel. ...)"
                  value={editTeacher}
                  onChange={(e) => setEditTeacher(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs"
                >
                  Zapisz profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
