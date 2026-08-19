import React, { useState, useRef } from 'react';
import { 
  Cat, 
  Heart, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Syringe, 
  Activity, 
  Fish, 
  Footprints, 
  MapPin, 
  Bell, 
  FileText, 
  Check,
  Shield,
  Bug,
  Pill,
  Trash2,
  Edit3,
  Upload,
  AlertTriangle,
  Feather,
  Home
} from 'lucide-react';
import { CatProfile, CatDailyStatus, MemberId, CatVaccination, CatVetVisit, CatPreventionItem, FamilyMember } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface CatSectionProps {
  catProfile: CatProfile;
  catStatus: CatDailyStatus;
  activeMemberId: MemberId;
  onUpdateStatus: (newStatus: CatDailyStatus) => void;
  onUpdateProfile: (newProfile: CatProfile) => void;
  familyMembers?: Record<string, FamilyMember>;
}

export const CatSection: React.FC<CatSectionProps> = ({
  catProfile,
  catStatus,
  activeMemberId,
  onUpdateStatus,
  onUpdateProfile,
  familyMembers = FAMILY_MEMBERS
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'health' | 'prevention' | 'guide'>('daily');
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [showAddPreventionModal, setShowAddPreventionModal] = useState(false);

  // Profile Editor Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(catProfile.name);
  const [editBreed, setEditBreed] = useState(catProfile.breed);
  const [editBirthDate, setEditBirthDate] = useState(catProfile.birthDate);
  const [editChip, setEditChip] = useState(catProfile.chipNumber);
  const [editWeight, setEditWeight] = useState(catProfile.weightKg);
  const [editSnack, setEditSnack] = useState(catProfile.favoriteSnack);
  const [editToy, setEditToy] = useState(catProfile.favoriteToy);
  const [editLitter, setEditLitter] = useState(catProfile.litterType);
  const [editIndoorOutdoor, setEditIndoorOutdoor] = useState<'indoor' | 'outdoor' | 'both'>(catProfile.indoorOutdoor || 'indoor');
  const [editClinic, setEditClinic] = useState(catProfile.vetClinic);
  const [editAddress, setEditAddress] = useState(catProfile.vetAddress);
  const [editPhone, setEditPhone] = useState(catProfile.vetPhone);
  const [editInsurance, setEditInsurance] = useState(catProfile.insuranceNumber);
  const [editAvatar, setEditAvatar] = useState(catProfile.avatarUrl);
  const catAvatarInputRef = useRef<HTMLInputElement>(null);

  // New Vaccination State
  const [vacName, setVacName] = useState('');
  const [vacDate, setVacDate] = useState(new Date().toISOString().split('T')[0]);
  const [vacNextDate, setVacNextDate] = useState('');
  const [vacClinic, setVacClinic] = useState(catProfile.vetClinic);

  // New Vet Visit State
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitReason, setVisitReason] = useState('');
  const [visitDoctor, setVisitDoctor] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [visitCost, setVisitCost] = useState('');

  // New Prevention State
  const [prevTitle, setPrevTitle] = useState('');
  const [prevNextDate, setPrevNextDate] = useState('');

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...catProfile,
      name: editName.trim() || 'Kot',
      breed: editBreed.trim() || 'Europejski',
      birthDate: editBirthDate,
      weightKg: Number(editWeight) || catProfile.weightKg,
      chipNumber: editChip.trim(),
      favoriteSnack: editSnack.trim(),
      favoriteToy: editToy.trim(),
      litterType: editLitter.trim(),
      indoorOutdoor: editIndoorOutdoor,
      vetClinic: editClinic.trim(),
      vetAddress: editAddress.trim(),
      vetPhone: editPhone.trim(),
      insuranceNumber: editInsurance.trim(),
      avatarUrl: editAvatar.trim() || catProfile.avatarUrl
    });
    setIsEditingProfile(false);
  };

  // Helper for Age Calculation
  const getAge = (birthDateString: string) => {
    try {
      const birth = new Date(birthDateString);
      const now = new Date();
      const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
      if (diffMonths < 12) {
        return `${diffMonths} mies.`;
      }
      const years = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;
      return remainingMonths > 0 ? `${years} l. ${remainingMonths} m.` : `${years} lata`;
    } catch {
      return '2 lata';
    }
  };

  const handleToggleDailyItem = (
    key: keyof Pick<CatDailyStatus, 'waterChanged' | 'brushed' | 'medsTaken'>
  ) => {
    const isCurrentlyDone = catStatus[key].done;
    onUpdateStatus({
      ...catStatus,
      [key]: {
        done: !isCurrentlyDone,
        by: !isCurrentlyDone ? activeMemberId : undefined
      }
    });
  };

  const handleToggleCareAction = (
    action: 'morningFood' | 'eveningFood' | 'litterBoxCleaned' | 'played'
  ) => {
    const current = catStatus[action];
    const isDone = current.done;
    const nowTime = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    onUpdateStatus({
      ...catStatus,
      [action]: {
        ...current,
        done: !isDone,
        by: !isDone ? activeMemberId : undefined,
        time: !isDone ? nowTime : undefined
      }
    });
  };

  const handleAddVaccination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacName || !vacDate || !vacNextDate) return;

    const newVac: CatVaccination = {
      id: `vc-${Date.now()}`,
      name: vacName,
      date: vacDate,
      nextDueDate: vacNextDate,
      vetClinic: vacClinic,
      status: 'valid'
    };

    onUpdateProfile({
      ...catProfile,
      vaccinations: [newVac, ...catProfile.vaccinations]
    });

    setVacName('');
    setShowAddVaccineModal(false);
  };

  const handleDeleteVaccine = (vacId: string) => {
    onUpdateProfile({
      ...catProfile,
      vaccinations: catProfile.vaccinations.filter((v) => v.id !== vacId)
    });
  };

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitReason) return;

    const newVisit: CatVetVisit = {
      id: `vvc-${Date.now()}`,
      date: visitDate,
      reason: visitReason,
      clinic: catProfile.vetClinic,
      doctor: visitDoctor || 'Lek. weterynarii',
      notes: visitNotes,
      cost: visitCost || undefined
    };

    onUpdateProfile({
      ...catProfile,
      vetVisits: [newVisit, ...catProfile.vetVisits]
    });

    setVisitReason('');
    setVisitNotes('');
    setVisitDoctor('');
    setVisitCost('');
    setShowAddVisitModal(false);
  };

  const handleDeleteVisit = (visitId: string) => {
    onUpdateProfile({
      ...catProfile,
      vetVisits: catProfile.vetVisits.filter((v) => v.id !== visitId)
    });
  };

  const handleAddPrevention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prevTitle || !prevNextDate) return;

    const newPrev: CatPreventionItem = {
      id: `prc-${Date.now()}`,
      title: prevTitle,
      lastGivenDate: new Date().toISOString().split('T')[0],
      nextDueDate: prevNextDate,
      frequencyMonths: 1,
      done: true
    };

    onUpdateProfile({
      ...catProfile,
      prevention: [newPrev, ...catProfile.prevention]
    });

    setPrevTitle('');
    setShowAddPreventionModal(false);
  };

  const handleDeletePrevention = (prevId: string) => {
    onUpdateProfile({
      ...catProfile,
      prevention: catProfile.prevention.filter((p) => p.id !== prevId)
    });
  };

  const handleToggleReminder = (remId: string) => {
    onUpdateProfile({
      ...catProfile,
      reminders: catProfile.reminders.map((r) =>
        r.id === remId ? { ...r, done: !r.done } : r
      )
    });
  };

  const dailyTasksCount = 7;
  const completedDailyCount = [
    catStatus.morningFood.done,
    catStatus.eveningFood.done,
    catStatus.waterChanged.done,
    catStatus.litterBoxCleaned.done,
    catStatus.brushed.done,
    catStatus.played.done,
    catStatus.medsTaken.done
  ].filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-12 animate-in fade-in duration-200">
      
      {/* 1. Header Pet Card */}
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50/40 to-fuchsia-50 border border-purple-200/80 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          
          {/* Avatar with Cute Collar Tag */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-white shadow-md border border-purple-200">
              <img 
                src={catProfile.avatarUrl} 
                alt={catProfile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-2xl shadow-md flex items-center justify-center">
              <Cat className="w-5 h-5" />
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-['Outfit',sans-serif]">
                {catProfile.name}
              </h1>
              <span className="px-3 py-1 bg-purple-100/90 text-purple-800 border border-purple-200 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                {catProfile.breed}
              </span>
              <span className="px-2.5 py-0.5 bg-stone-100 text-stone-600 text-xs font-medium rounded-full border border-stone-200 flex items-center gap-1">
                <Home className="w-3 h-3 text-stone-500" />
                {catProfile.indoorOutdoor === 'indoor' ? 'Kot niewychodzący' : catProfile.indoorOutdoor === 'outdoor' ? 'Kot wychodzący' : 'Kot domowo-ogrodowy'}
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-2.5 border border-purple-100/80 shadow-2xs text-center md:text-left">
                <span className="text-[11px] text-stone-500 block font-medium">Wiek</span>
                <span className="text-sm font-bold text-stone-900">{getAge(catProfile.birthDate)}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-2.5 border border-purple-100/80 shadow-2xs text-center md:text-left">
                <span className="text-[11px] text-stone-500 block font-medium">Waga</span>
                <span className="text-sm font-bold text-purple-900">{catProfile.weightKg} kg</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-2.5 border border-purple-100/80 shadow-2xs text-center md:text-left">
                <span className="text-[11px] text-stone-500 block font-medium">Numer CHIP</span>
                <span className="text-xs font-mono font-bold text-stone-800 truncate block" title={catProfile.chipNumber}>
                  {catProfile.chipNumber}
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-2.5 border border-purple-100/80 shadow-2xs text-center md:text-left">
                <span className="text-[11px] text-stone-500 block font-medium">Opieka dzisiaj</span>
                <span className="text-sm font-bold text-emerald-700">{completedDailyCount}/{dailyTasksCount} zaliczone</span>
              </div>
            </div>

            {/* Vet Quick Contact Pill */}
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="font-semibold text-stone-800">{catProfile.vetClinic}</span>
                <span className="text-stone-400">|</span>
                <a href={`tel:${catProfile.vetPhone}`} className="text-purple-700 font-semibold hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {catProfile.vetPhone}
                </a>
              </div>

              <button
                onClick={() => {
                  setEditName(catProfile.name);
                  setEditBreed(catProfile.breed);
                  setEditBirthDate(catProfile.birthDate);
                  setEditChip(catProfile.chipNumber);
                  setEditWeight(catProfile.weightKg);
                  setEditSnack(catProfile.favoriteSnack);
                  setEditToy(catProfile.favoriteToy);
                  setEditLitter(catProfile.litterType);
                  setEditIndoorOutdoor(catProfile.indoorOutdoor || 'indoor');
                  setEditClinic(catProfile.vetClinic);
                  setEditAddress(catProfile.vetAddress);
                  setEditPhone(catProfile.vetPhone);
                  setEditInsurance(catProfile.insuranceNumber);
                  setEditAvatar(catProfile.avatarUrl);
                  setIsEditingProfile(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edytuj profil kotka
              </button>
            </div>
          </div>
        </div>

        {/* Ambient watermark icon */}
        <Cat className="absolute -right-8 -bottom-8 w-44 h-44 text-purple-400/10 pointer-events-none" />
      </div>

      {/* 2. Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('daily')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'daily'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Codzienna Opieka
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
            {completedDailyCount}/{dailyTasksCount}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('health')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'health'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <Syringe className="w-4 h-4" />
          Książeczka Zdrowia
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-700">
            {catProfile.vaccinations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('prevention')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'prevention'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Profilaktyka & Pasożyty
        </button>

        <button
          onClick={() => setActiveSubTab('guide')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'guide'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Kocie Zasady & Bezpieczeństwo
        </button>
      </div>

      {/* 3. Sub-Tab 1: Daily Care Routine */}
      {activeSubTab === 'daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Litter Box Card */}
            <div className={`p-5 rounded-3xl border transition-all duration-200 ${
              catStatus.litterBoxCleaned.done 
                ? 'bg-purple-50/70 border-purple-200 shadow-xs' 
                : 'bg-white border-stone-200/90 shadow-2xs hover:border-purple-300'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    catStatus.litterBoxCleaned.done ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                  }`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Czyszczenie kuwety</h3>
                    <p className="text-xs text-stone-500">Żwirek i filtr węglowy</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleCareAction('litterBoxCleaned')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    catStatus.litterBoxCleaned.done ? 'text-purple-600' : 'text-stone-300 hover:text-stone-400'
                  }`}
                >
                  {catStatus.litterBoxCleaned.done ? <CheckCircle2 className="w-6 h-6 fill-purple-600 text-white" /> : <Circle className="w-6 h-6" />}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {catStatus.litterBoxCleaned.done ? (
                  <div className="text-purple-900 font-medium">
                    <span>Sprzątnięta o {catStatus.litterBoxCleaned.time || '08:00'}</span>
                    <span className="text-stone-500 block text-[11px]">
                      przez: {familyMembers[catStatus.litterBoxCleaned.by || 'mama']?.name || 'Rodzina'}
                    </span>
                  </div>
                ) : (
                  <span className="text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-lg">Wymaga sprzątnięcia</span>
                )}
                <button
                  onClick={() => handleToggleCareAction('litterBoxCleaned')}
                  className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs transition-colors"
                >
                  {catStatus.litterBoxCleaned.done ? 'Odznacz' : 'Oznacz jako czysta'}
                </button>
              </div>
            </div>

            {/* Morning Food */}
            <div className={`p-5 rounded-3xl border transition-all duration-200 ${
              catStatus.morningFood.done 
                ? 'bg-amber-50/60 border-amber-200 shadow-xs' 
                : 'bg-white border-stone-200/90 shadow-2xs hover:border-amber-300'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    catStatus.morningFood.done ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <Fish className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Karmienie poranne</h3>
                    <p className="text-xs text-stone-500">Mokra karma / saszetka</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleCareAction('morningFood')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    catStatus.morningFood.done ? 'text-amber-600' : 'text-stone-300 hover:text-stone-400'
                  }`}
                >
                  {catStatus.morningFood.done ? <CheckCircle2 className="w-6 h-6 fill-amber-500 text-white" /> : <Circle className="w-6 h-6" />}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {catStatus.morningFood.done ? (
                  <div className="text-amber-950 font-medium">
                    <span>Nakarmił(a) o {catStatus.morningFood.time || '07:30'}</span>
                    <span className="text-stone-500 block text-[11px]">
                      {familyMembers[catStatus.morningFood.by || 'mama']?.name || 'Rodzina'}
                    </span>
                  </div>
                ) : (
                  <span className="text-stone-500">Czeka na poranną miskę</span>
                )}
                <button
                  onClick={() => handleToggleCareAction('morningFood')}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors"
                >
                  {catStatus.morningFood.done ? 'Cofnij' : 'Nakarmiłem(am)'}
                </button>
              </div>
            </div>

            {/* Evening Food */}
            <div className={`p-5 rounded-3xl border transition-all duration-200 ${
              catStatus.eveningFood.done 
                ? 'bg-amber-50/60 border-amber-200 shadow-xs' 
                : 'bg-white border-stone-200/90 shadow-2xs hover:border-amber-300'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    catStatus.eveningFood.done ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <Fish className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Karmienie wieczorne</h3>
                    <p className="text-xs text-stone-500">Chrupki / mokra porcja</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleCareAction('eveningFood')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    catStatus.eveningFood.done ? 'text-amber-600' : 'text-stone-300 hover:text-stone-400'
                  }`}
                >
                  {catStatus.eveningFood.done ? <CheckCircle2 className="w-6 h-6 fill-amber-500 text-white" /> : <Circle className="w-6 h-6" />}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {catStatus.eveningFood.done ? (
                  <div className="text-amber-950 font-medium">
                    <span>Nakarmił(a) o {catStatus.eveningFood.time || '19:00'}</span>
                    <span className="text-stone-500 block text-[11px]">
                      {familyMembers[catStatus.eveningFood.by || 'tata']?.name || 'Rodzina'}
                    </span>
                  </div>
                ) : (
                  <span className="text-stone-500">Czeka na wieczorną miskę</span>
                )}
                <button
                  onClick={() => handleToggleCareAction('eveningFood')}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors"
                >
                  {catStatus.eveningFood.done ? 'Cofnij' : 'Nakarmiłem(am)'}
                </button>
              </div>
            </div>

            {/* Fresh Water / Fountain */}
            <div className={`p-5 rounded-3xl border transition-all duration-200 ${
              catStatus.waterChanged.done 
                ? 'bg-sky-50/70 border-sky-200 shadow-xs' 
                : 'bg-white border-stone-200/90 shadow-2xs hover:border-sky-300'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    catStatus.waterChanged.done ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-700'
                  }`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Świeża woda / Fontanna</h3>
                    <p className="text-xs text-stone-500">Płukanie i dolewka wody</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleDailyItem('waterChanged')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    catStatus.waterChanged.done ? 'text-sky-600' : 'text-stone-300 hover:text-stone-400'
                  }`}
                >
                  {catStatus.waterChanged.done ? <CheckCircle2 className="w-6 h-6 fill-sky-600 text-white" /> : <Circle className="w-6 h-6" />}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {catStatus.waterChanged.done ? (
                  <span className="text-sky-900 font-medium">Woda zmieniona dzisiaj</span>
                ) : (
                  <span className="text-stone-500">Wymień wodę na świeżą</span>
                )}
                <button
                  onClick={() => handleToggleDailyItem('waterChanged')}
                  className="px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs transition-colors"
                >
                  {catStatus.waterChanged.done ? 'Cofnij' : 'Zmieniłem(am)'}
                </button>
              </div>
            </div>

            {/* Playtime / Active stimulation */}
            <div className={`p-5 rounded-3xl border transition-all duration-200 ${
              catStatus.played.done 
                ? 'bg-rose-50/70 border-rose-200 shadow-xs' 
                : 'bg-white border-stone-200/90 shadow-2xs hover:border-rose-300'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    catStatus.played.done ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
                    <Feather className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Zabawa & Aktywność</h3>
                    <p className="text-xs text-stone-500">Wędka z piórkami / laser</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleCareAction('played')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    catStatus.played.done ? 'text-rose-600' : 'text-stone-300 hover:text-stone-400'
                  }`}
                >
                  {catStatus.played.done ? <CheckCircle2 className="w-6 h-6 fill-rose-500 text-white" /> : <Circle className="w-6 h-6" />}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {catStatus.played.done ? (
                  <span className="text-rose-900 font-medium">Kot wybiegany i zadowolony</span>
                ) : (
                  <span className="text-stone-500">Min. 15 min zabawy</span>
                )}
                <button
                  onClick={() => handleToggleCareAction('played')}
                  className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs transition-colors"
                >
                  {catStatus.played.done ? 'Cofnij' : 'Pobawiono'}
                </button>
              </div>
            </div>

            {/* Brushing Fur */}
            <div className={`p-5 rounded-3xl border transition-all duration-200 ${
              catStatus.brushed.done 
                ? 'bg-emerald-50/70 border-emerald-200 shadow-xs' 
                : 'bg-white border-stone-200/90 shadow-2xs hover:border-emerald-300'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    catStatus.brushed.done ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Czesanie futerka</h3>
                    <p className="text-xs text-stone-500">Redukcja kłaczków & masaż</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleDailyItem('brushed')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    catStatus.brushed.done ? 'text-emerald-600' : 'text-stone-300 hover:text-stone-400'
                  }`}
                >
                  {catStatus.brushed.done ? <CheckCircle2 className="w-6 h-6 fill-emerald-600 text-white" /> : <Circle className="w-6 h-6" />}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {catStatus.brushed.done ? (
                  <span className="text-emerald-900 font-medium">Wyczesana dzisiaj</span>
                ) : (
                  <span className="text-stone-500">Czesanie furminatorem</span>
                )}
                <button
                  onClick={() => handleToggleDailyItem('brushed')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs transition-colors"
                >
                  {catStatus.brushed.done ? 'Cofnij' : 'Wyczesano'}
                </button>
              </div>
            </div>

          </div>

          {/* Quick Reminders List */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3 font-['Outfit',sans-serif]">
              <Bell className="w-4 h-4 text-purple-600" />
              Przypomnienia dla opiekunów {catProfile.name}
            </h3>
            <div className="space-y-2">
              {catProfile.reminders.map((rem) => (
                <div 
                  key={rem.id} 
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${
                    rem.done ? 'bg-stone-50 border-stone-200 text-stone-400' : 'bg-purple-50/50 border-purple-100 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleReminder(rem.id)}
                      className="cursor-pointer"
                    >
                      {rem.done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-purple-400 hover:text-purple-600" />
                      )}
                    </button>
                    <span className={`text-xs font-medium ${rem.done ? 'line-through' : ''}`}>
                      {rem.text}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                    {rem.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Sub-Tab 2: Health & Vaccinations */}
      {activeSubTab === 'health' && (
        <div className="space-y-6">
          
          {/* Vaccinations Block */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-purple-600" />
                  Książeczka Szczepień Kota
                </h3>
                <p className="text-xs text-stone-500">Zasadnicze Purevax (Koci katar, panleukopenia), Wścieklizna, FeLV</p>
              </div>

              <button
                onClick={() => setShowAddVaccineModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Dodaj wpis szczepienia
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {catProfile.vaccinations.map((vac) => (
                <div key={vac.id} className="p-4 rounded-2xl border border-purple-100 bg-purple-50/40 relative group hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{vac.name}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{vac.vetClinic}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteVaccine(vac.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Usuń wpis"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 pt-2 border-t border-purple-100/80 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Podano: <strong>{vac.date}</strong></span>
                    <span className="px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800 text-[11px]">
                      Kolejne: {vac.nextDueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vet Visits History */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-500" />
                  Historia Wizyt u Weterynarza
                </h3>
                <p className="text-xs text-stone-500">Przeglądy okresowe, obcinanie pazurków, badania krwi i zalecenia</p>
              </div>

              <button
                onClick={() => setShowAddVisitModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Zarejestruj wizytę
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {catProfile.vetVisits.map((visit) => (
                <div key={visit.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-colors relative group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                          {visit.date}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm">{visit.reason}</h4>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        {visit.clinic} &bull; {visit.doctor}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {visit.cost && (
                        <span className="text-xs font-bold text-stone-900 bg-amber-100 px-2.5 py-1 rounded-xl">
                          {visit.cost}
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteVisit(visit.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Usuń wpis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {visit.notes && (
                    <p className="mt-2.5 pt-2 border-t border-stone-200/60 text-xs text-stone-600 leading-relaxed">
                      📝 {visit.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 5. Sub-Tab 3: Prevention & Parasites */}
      {activeSubTab === 'prevention' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                  <Bug className="w-5 h-5 text-indigo-600" />
                  Ochrona Przed Pasożytami & Odkłaczanie
                </h3>
                <p className="text-xs text-stone-500">Krople spot-on na kark (pchły, kleszcze, świerzb) oraz pasta odkłaczająca</p>
              </div>

              <button
                onClick={() => setShowAddPreventionModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Dodaj zabieg profilaktyczny
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {catProfile.prevention.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 relative group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <Pill className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{item.title}</h4>
                    </div>
                    <button
                      onClick={() => handleDeletePrevention(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-indigo-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Ostatnio: <strong>{item.lastGivenDate}</strong></span>
                    <span className="px-2.5 py-1 rounded-xl font-bold bg-purple-600 text-white text-[11px]">
                      Kolejne: {item.nextDueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Sub-Tab 4: Cat Guide & Safety Rules */}
      {activeSubTab === 'guide' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Toxic vs Safe Plants */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2 font-['Outfit',sans-serif]">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Śmiertelnie niebezpieczne rośliny dla kotów
              </h3>
              <ul className="text-xs text-rose-900 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">🚫 Lilie (wszystkie odmiany)</span> – pyłek i woda z wazonu powodują ostrą niewydolność nerek!
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">🚫 Monstera & Skrzydłokwiat</span> – szczawiany wapnia podrażniają pyszczek i przełyk.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">🚫 Gwiazda Betlejemska & Bluszcz</span> – toksyczne soki.
                </li>
              </ul>
              <div className="pt-2 border-t border-rose-200/60 text-xs text-emerald-800 font-medium">
                ✅ Bezpieczne: Zielistka, Pieniążek (Pilea), Palma chamedora, Trawa dla kota, Kocimiętka.
              </div>
            </div>

            {/* Favorite Habits & Notes */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-3xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2 font-['Outfit',sans-serif]">
                <Heart className="w-4 h-4 text-purple-600" />
                Ulubione rzeczy & zwyczaje {catProfile.name}
              </h3>
              <div className="space-y-2.5 text-xs text-purple-950">
                <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
                  <span className="text-stone-500 font-medium block">Ulubione przysmaki:</span>
                  <p className="font-semibold text-stone-800 mt-0.5">{catProfile.favoriteSnack}</p>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
                  <span className="text-stone-500 font-medium block">Ulubiona zabawka:</span>
                  <p className="font-semibold text-stone-800 mt-0.5">{catProfile.favoriteToy}</p>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100">
                  <span className="text-stone-500 font-medium block">Typ żwirku w kuwecie:</span>
                  <p className="font-semibold text-stone-800 mt-0.5">{catProfile.litterType}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                <Cat className="w-5 h-5 text-purple-600" />
                Edycja Profilu Kotka
              </h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-stone-400 hover:text-stone-700 text-lg cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              
              {/* Photo Upload / URL */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Zdjęcie profilowe kotka</label>
                <div className="flex items-center gap-4">
                  <img src={editAvatar} alt="Podgląd" className="w-16 h-16 rounded-2xl object-cover border ring-2 ring-purple-200" />
                  <div className="space-y-1.5 flex-1">
                    <input 
                      type="file" 
                      ref={catAvatarInputRef} 
                      onChange={handleAvatarUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => catAvatarInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold border border-purple-200 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Wybierz zdjęcie z telefonu / komputera
                    </button>
                    <input
                      type="text"
                      placeholder="Lub wklej link URL do zdjęcia"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Imię kotka *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Rasa</label>
                  <input
                    type="text"
                    value={editBreed}
                    onChange={(e) => setEditBreed(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Data urodzenia</label>
                  <input
                    type="date"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Waga (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editWeight}
                    onChange={(e) => setEditWeight(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tryb życia</label>
                  <select
                    value={editIndoorOutdoor}
                    onChange={(e) => setEditIndoorOutdoor(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  >
                    <option value="indoor">Tylko w domu (niewychodzący)</option>
                    <option value="outdoor">Wychodzący</option>
                    <option value="both">Dom z ogrodem / woliera</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Numer CHIP</label>
                  <input
                    type="text"
                    value={editChip}
                    onChange={(e) => setEditChip(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Numer polisy ubezpieczeniowej</label>
                  <input
                    type="text"
                    value={editInsurance}
                    onChange={(e) => setEditInsurance(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Przychodnia weterynaryjna</label>
                  <input
                    type="text"
                    value={editClinic}
                    onChange={(e) => setEditClinic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Telefon do weterynarza</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Ulubione przysmaki</label>
                <input
                  type="text"
                  value={editSnack}
                  onChange={(e) => setEditSnack(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Ulubiona zabawka</label>
                <input
                  type="text"
                  value={editToy}
                  onChange={(e) => setEditToy(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Żwirek / kuweta</label>
                <input
                  type="text"
                  value={editLitter}
                  onChange={(e) => setEditLitter(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 font-semibold text-stone-700"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Zapisz zmiany
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Add Vaccine Modal */}
      {showAddVaccineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">Dodaj Szczepienie Kota</h3>
              <button onClick={() => setShowAddVaccineModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>
            <form onSubmit={handleAddVaccination} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nazwa szczepionki *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Purevax RCP (Koci katar / panleukopenia)"
                  value={vacName}
                  onChange={(e) => setVacName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Data szczepienia *</label>
                  <input
                    type="date"
                    required
                    value={vacDate}
                    onChange={(e) => setVacDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Termin kolejnego *</label>
                  <input
                    type="date"
                    required
                    value={vacNextDate}
                    onChange={(e) => setVacNextDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Lecznica / Weterynarz</label>
                <input
                  type="text"
                  value={vacClinic}
                  onChange={(e) => setVacClinic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVaccineModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vet Visit Modal */}
      {showAddVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">Zarejestruj Wizytę Weterynaryjną</h3>
              <button onClick={() => setShowAddVisitModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>
            <form onSubmit={handleAddVisit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Data wizyty *</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Koszt</label>
                  <input
                    type="text"
                    placeholder="np. 90 zł lub £40"
                    value={visitCost}
                    onChange={(e) => setVisitCost(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Powód wizyty *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Kontrola ząbków, obcięcie pazurków, szczepienie"
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Lekarz weterynarii</label>
                <input
                  type="text"
                  placeholder="np. Lek. wet. Anna Kowalska"
                  value={visitDoctor}
                  onChange={(e) => setVisitDoctor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Zalecenia i notatki</label>
                <textarea
                  rows={3}
                  placeholder="Zalecenia, przepisane leki, waga, uwagi..."
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVisitModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold"
                >
                  Zapisz wizytę
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Prevention Modal */}
      {showAddPreventionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">Dodaj Zabieg Profilaktyczny</h3>
              <button onClick={() => setShowAddPreventionModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>
            <form onSubmit={handleAddPrevention} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Preparat / Zabieg *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Krople na kark Stronghold (pchły/kleszcze), Pasta odkłaczająca"
                  value={prevTitle}
                  onChange={(e) => setPrevTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Data kolejnego podania *</label>
                <input
                  type="date"
                  required
                  value={prevNextDate}
                  onChange={(e) => setPrevNextDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPreventionModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
