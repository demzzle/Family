import React, { useState, useRef } from 'react';
import { 
  Dog, 
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
  Bone, 
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
  Upload
} from 'lucide-react';
import { DogProfile, DogDailyStatus, MemberId, DogVaccination, DogVetVisit, DogPreventionItem, FamilyMember } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface DogSectionProps {
  dogProfile: DogProfile;
  dogStatus: DogDailyStatus;
  activeMemberId: MemberId;
  onUpdateStatus: (newStatus: DogDailyStatus) => void;
  onUpdateProfile: (newProfile: DogProfile) => void;
  familyMembers?: Record<string, FamilyMember>;
}

export const DogSection: React.FC<DogSectionProps> = ({
  dogProfile,
  dogStatus,
  activeMemberId,
  onUpdateStatus,
  onUpdateProfile,
  familyMembers = FAMILY_MEMBERS
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'health' | 'prevention' | 'profile'>('daily');
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [showAddPreventionModal, setShowAddPreventionModal] = useState(false);

  // Profile Editor Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(dogProfile.name);
  const [editBreed, setEditBreed] = useState(dogProfile.breed);
  const [editBirthDate, setEditBirthDate] = useState(dogProfile.birthDate);
  const [editChip, setEditChip] = useState(dogProfile.chipNumber);
  const [editWeight, setEditWeight] = useState(dogProfile.weightKg);
  const [editSnack, setEditSnack] = useState(dogProfile.favoriteSnack);
  const [editClinic, setEditClinic] = useState(dogProfile.vetClinic);
  const [editAddress, setEditAddress] = useState(dogProfile.vetAddress);
  const [editPhone, setEditPhone] = useState(dogProfile.vetPhone);
  const [editAvatar, setEditAvatar] = useState(dogProfile.avatarUrl);
  const dogAvatarInputRef = useRef<HTMLInputElement>(null);

  // New Vaccination State
  const [vacName, setVacName] = useState('');
  const [vacDate, setVacDate] = useState(new Date().toISOString().split('T')[0]);
  const [vacNextDate, setVacNextDate] = useState('');
  const [vacClinic, setVacClinic] = useState(dogProfile.vetClinic);

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
      ...dogProfile,
      name: editName.trim() || dogProfile.name,
      breed: editBreed.trim() || dogProfile.breed,
      birthDate: editBirthDate.trim() || dogProfile.birthDate,
      chipNumber: editChip.trim() || dogProfile.chipNumber,
      weightKg: editWeight || dogProfile.weightKg,
      favoriteSnack: editSnack.trim() || dogProfile.favoriteSnack,
      vetClinic: editClinic.trim() || dogProfile.vetClinic,
      vetAddress: editAddress.trim() || dogProfile.vetAddress,
      vetPhone: editPhone.trim() || dogProfile.vetPhone,
      avatarUrl: editAvatar || dogProfile.avatarUrl
    });
    setIsEditingProfile(false);
  };

  const handleDeleteVaccine = (id: string) => {
    onUpdateProfile({
      ...dogProfile,
      vaccinations: dogProfile.vaccinations.filter((v) => v.id !== id)
    });
  };

  const handleDeleteVisit = (id: string) => {
    onUpdateProfile({
      ...dogProfile,
      vetVisits: dogProfile.vetVisits.filter((v) => v.id !== id)
    });
  };

  const handleDeletePrevention = (id: string) => {
    onUpdateProfile({
      ...dogProfile,
      prevention: (dogProfile.prevention || []).filter((p) => p.id !== id)
    });
  };

  const nowTime = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

  // Quick Walk Trigger
  const handleQuickWalk = () => {
    // Determine which walk is next
    if (!dogStatus.morningWalk.done) {
      onUpdateStatus({
        ...dogStatus,
        morningWalk: { done: true, by: activeMemberId, time: nowTime }
      });
    } else if (!dogStatus.afternoonWalk.done) {
      onUpdateStatus({
        ...dogStatus,
        afternoonWalk: { done: true, by: activeMemberId, time: nowTime }
      });
    } else {
      onUpdateStatus({
        ...dogStatus,
        eveningWalk: { done: true, by: activeMemberId, time: nowTime }
      });
    }
  };

  const handleToggleMorningWalk = () => {
    onUpdateStatus({
      ...dogStatus,
      morningWalk: {
        done: !dogStatus.morningWalk.done,
        by: !dogStatus.morningWalk.done ? activeMemberId : undefined,
        time: !dogStatus.morningWalk.done ? nowTime : undefined
      }
    });
  };

  const handleToggleAfternoonWalk = () => {
    onUpdateStatus({
      ...dogStatus,
      afternoonWalk: {
        done: !dogStatus.afternoonWalk.done,
        by: !dogStatus.afternoonWalk.done ? activeMemberId : undefined,
        time: !dogStatus.afternoonWalk.done ? nowTime : undefined
      }
    });
  };

  const handleToggleEveningWalk = () => {
    onUpdateStatus({
      ...dogStatus,
      eveningWalk: {
        done: !dogStatus.eveningWalk.done,
        by: !dogStatus.eveningWalk.done ? activeMemberId : undefined,
        time: !dogStatus.eveningWalk.done ? nowTime : undefined
      }
    });
  };

  const handleToggleMorningFood = () => {
    onUpdateStatus({
      ...dogStatus,
      morningFood: {
        done: !dogStatus.morningFood.done,
        by: !dogStatus.morningFood.done ? activeMemberId : undefined,
        time: !dogStatus.morningFood.done ? nowTime : undefined
      }
    });
  };

  const handleToggleEveningFood = () => {
    onUpdateStatus({
      ...dogStatus,
      eveningFood: {
        done: !dogStatus.eveningFood.done,
        by: !dogStatus.eveningFood.done ? activeMemberId : undefined,
        time: !dogStatus.eveningFood.done ? nowTime : undefined
      }
    });
  };

  const handleToggleWater = () => {
    onUpdateStatus({
      ...dogStatus,
      waterChanged: {
        done: !dogStatus.waterChanged.done,
        by: !dogStatus.waterChanged.done ? activeMemberId : undefined
      }
    });
  };

  const handleToggleMeds = () => {
    onUpdateStatus({
      ...dogStatus,
      medsTaken: {
        done: !dogStatus.medsTaken.done,
        by: !dogStatus.medsTaken.done ? activeMemberId : undefined
      }
    });
  };

  const handleAddVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacName.trim()) return;

    const newVac: DogVaccination = {
      id: `v-${Date.now()}`,
      name: vacName.trim(),
      date: vacDate,
      nextDueDate: vacNextDate || vacDate,
      vetClinic: vacClinic.trim(),
      status: 'valid'
    };

    onUpdateProfile({
      ...dogProfile,
      vaccinations: [newVac, ...dogProfile.vaccinations]
    });

    setVacName('');
    setShowAddVaccineModal(false);
  };

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitReason.trim()) return;

    const newVisit: DogVetVisit = {
      id: `vv-${Date.now()}`,
      date: visitDate,
      reason: visitReason.trim(),
      doctor: visitDoctor.trim() || 'Lekarz dyżurny',
      clinic: dogProfile.vetClinic,
      notes: visitNotes.trim(),
      cost: visitCost.trim() || undefined
    };

    onUpdateProfile({
      ...dogProfile,
      vetVisits: [newVisit, ...dogProfile.vetVisits]
    });

    setVisitReason('');
    setVisitDoctor('');
    setVisitNotes('');
    setVisitCost('');
    setShowAddVisitModal(false);
  };

  const handleTogglePrevention = (id: string) => {
    const updated = (dogProfile.prevention || []).map((p) =>
      p.id === id ? { ...p, done: !p.done } : p
    );
    onUpdateProfile({ ...dogProfile, prevention: updated });
  };

  const handleAddPrevention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prevTitle.trim()) return;

    const newPrev: DogPreventionItem = {
      id: `pr-${Date.now()}`,
      title: prevTitle.trim(),
      lastGivenDate: new Date().toISOString().split('T')[0],
      nextDueDate: prevNextDate || new Date().toISOString().split('T')[0],
      frequencyMonths: 1,
      done: true
    };

    onUpdateProfile({
      ...dogProfile,
      prevention: [...(dogProfile.prevention || []), newPrev]
    });

    setPrevTitle('');
    setPrevNextDate('');
    setShowAddPreventionModal(false);
  };

  // Last walk info
  const lastWalk = dogStatus.eveningWalk.done
    ? { name: 'Wieczorny', by: dogStatus.eveningWalk.by, time: dogStatus.eveningWalk.time }
    : dogStatus.afternoonWalk.done
    ? { name: 'Popołudniowy', by: dogStatus.afternoonWalk.by, time: dogStatus.afternoonWalk.time }
    : dogStatus.morningWalk.done
    ? { name: 'Poranny', by: dogStatus.morningWalk.by, time: dogStatus.morningWalk.time }
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Hero Profile Card */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-400/10 to-amber-100/50 border border-amber-200 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <img
                src={dogProfile.avatarUrl}
                alt={dogProfile.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-amber-600 text-white shadow-xs">
                <Dog className="w-4 h-4" />
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-stone-900 font-['Outfit',sans-serif]">
                  {dogProfile.name}
                </h2>
                <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-300">
                  {dogProfile.breed}
                </span>
                <span className="bg-stone-100 text-stone-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  ⚖️ {dogProfile.weightKg} kg
                </span>
              </div>

              <p className="text-xs text-stone-600">
                Urodzona: <strong>{dogProfile.birthDate}</strong> • Chip: <code className="bg-white/80 px-1.5 py-0.5 rounded border border-stone-200">{dogProfile.chipNumber}</code>
              </p>

              <p className="text-xs text-amber-900 bg-white/70 backdrop-blur-xs p-2.5 rounded-xl border border-amber-200/60 inline-block">
                🦴 <strong>Ulubione smaczki:</strong> {dogProfile.favoriteSnack}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Quick Vet Call Box */}
            <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-200/80 text-xs space-y-1.5 text-left shadow-2xs">
              <div className="flex items-center gap-1.5 text-stone-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{dogProfile.vetClinic}</span>
              </div>
              <p className="text-[11px] text-stone-500">{dogProfile.vetAddress}</p>
              <a
                href={`tel:${dogProfile.vetPhone}`}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                {dogProfile.vetPhone}
              </a>
            </div>

            <button
              onClick={() => {
                setEditName(dogProfile.name);
                setEditBreed(dogProfile.breed);
                setEditBirthDate(dogProfile.birthDate);
                setEditChip(dogProfile.chipNumber);
                setEditWeight(dogProfile.weightKg);
                setEditSnack(dogProfile.favoriteSnack);
                setEditClinic(dogProfile.vetClinic);
                setEditAddress(dogProfile.vetAddress);
                setEditPhone(dogProfile.vetPhone);
                setEditAvatar(dogProfile.avatarUrl);
                setIsEditingProfile(true);
              }}
              className="px-3.5 py-2.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              Edytuj profil
            </button>
          </div>
        </div>
      </div>

      {/* Prominent "Kto wyszedł z Arią?" Live Status Card */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">Status Ostatniego Spaceru</span>
            <p className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
              {lastWalk
                ? `Ostatnio wyszedł(a): ${FAMILY_MEMBERS[lastWalk.by || 'tata']?.name} o ${lastWalk.time} (${lastWalk.name})`
                : 'Aria jeszcze dzisiaj nie wychodziła na spacer!'}
            </p>
          </div>
        </div>

        <button
          onClick={handleQuickWalk}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Dog className="w-4 h-4" /> Idę teraz na spacer z Arią!
        </button>
      </div>

      {/* Navigation Sub Tabs */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-2 shadow-2xs flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'daily'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <Footprints className="w-3.5 h-3.5" />
          Codzienny Tracker (Spacery & Miska)
        </button>
        <button
          onClick={() => setActiveTab('prevention')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'prevention'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Profilaktyka & Kleszcze ({dogProfile.prevention?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'health'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <Syringe className="w-3.5 h-3.5" />
          Szczepienia & Weterynarz ({dogProfile.vaccinations.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'profile'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Przypomnienia
        </button>
      </div>

      {/* TAB 1: DAILY TRACKER */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          
          {/* Walks Tracking Card */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Footprints className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                  Dzisiejsze Spacery z Arią
                </h3>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                Cel: 3 spacery
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Morning Walk */}
              <div className={`p-4 rounded-2xl border transition-all ${
                dogStatus.morningWalk.done
                  ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                  : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800">🌅 Spacer Poranny</span>
                  <button onClick={handleToggleMorningWalk} className="transition-transform active:scale-90">
                    {dogStatus.morningWalk.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 hover:text-emerald-600" />
                    )}
                  </button>
                </div>
                {dogStatus.morningWalk.done ? (
                  <div className="text-xs text-emerald-900 space-y-1">
                    <p className="font-semibold">✓ Odhaczone ({dogStatus.morningWalk.time})</p>
                    <p className="text-[11px] text-emerald-800">
                      Wyszła: {FAMILY_MEMBERS[dogStatus.morningWalk.by || 'mama']?.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400">Oczekuje na spacer</p>
                )}
              </div>

              {/* Afternoon Walk */}
              <div className={`p-4 rounded-2xl border transition-all ${
                dogStatus.afternoonWalk.done
                  ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                  : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800">☀️ Spacer Popołudniowy</span>
                  <button onClick={handleToggleAfternoonWalk} className="transition-transform active:scale-90">
                    {dogStatus.afternoonWalk.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 hover:text-emerald-600" />
                    )}
                  </button>
                </div>
                {dogStatus.afternoonWalk.done ? (
                  <div className="text-xs text-emerald-900 space-y-1">
                    <p className="font-semibold">✓ Odhaczone ({dogStatus.afternoonWalk.time})</p>
                    <p className="text-[11px] text-emerald-800">
                      Wyszedł: {FAMILY_MEMBERS[dogStatus.afternoonWalk.by || 'tata']?.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400">Oczekuje na spacer</p>
                )}
              </div>

              {/* Evening Walk */}
              <div className={`p-4 rounded-2xl border transition-all ${
                dogStatus.eveningWalk.done
                  ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                  : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800">🌙 Spacer Wieczorny</span>
                  <button onClick={handleToggleEveningWalk} className="transition-transform active:scale-90">
                    {dogStatus.eveningWalk.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 hover:text-emerald-600" />
                    )}
                  </button>
                </div>
                {dogStatus.eveningWalk.done ? (
                  <div className="text-xs text-emerald-900 space-y-1">
                    <p className="font-semibold">✓ Odhaczone ({dogStatus.eveningWalk.time})</p>
                    <p className="text-[11px] text-emerald-800">
                      Wyszedł: {FAMILY_MEMBERS[dogStatus.eveningWalk.by || 'tata']?.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400">Oczekuje na spacer</p>
                )}
              </div>
            </div>
          </div>

          {/* Feedings & Water */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
              <Bone className="w-5 h-5 text-amber-600" />
              Karmienie i Pielęgnacja na Dziś
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div
                onClick={handleToggleMorningFood}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  dogStatus.morningFood.done ? 'bg-amber-50/80 border-amber-300' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">🥣 Miska Rano</span>
                  {dogStatus.morningFood.done ? <CheckCircle2 className="w-4 h-4 text-amber-600" /> : <Circle className="w-4 h-4 text-stone-300" />}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  {dogStatus.morningFood.done ? `Nakarmiła ${FAMILY_MEMBERS[dogStatus.morningFood.by || 'mama']?.name} (${dogStatus.morningFood.time})` : 'Niepodana'}
                </p>
              </div>

              <div
                onClick={handleToggleEveningFood}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  dogStatus.eveningFood.done ? 'bg-amber-50/80 border-amber-300' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">🥣 Miska Wieczór</span>
                  {dogStatus.eveningFood.done ? <CheckCircle2 className="w-4 h-4 text-amber-600" /> : <Circle className="w-4 h-4 text-stone-300" />}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  {dogStatus.eveningFood.done ? `Nakarmił ${FAMILY_MEMBERS[dogStatus.eveningFood.by || 'tata']?.name}` : 'Oczekuje'}
                </p>
              </div>

              <div
                onClick={handleToggleWater}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  dogStatus.waterChanged.done ? 'bg-sky-50/80 border-sky-300' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">💧 Świeża Woda</span>
                  {dogStatus.waterChanged.done ? <CheckCircle2 className="w-4 h-4 text-sky-600" /> : <Circle className="w-4 h-4 text-stone-300" />}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  {dogStatus.waterChanged.done ? 'Miska umyta i napełniona' : 'Do wymiany'}
                </p>
              </div>

              <div
                onClick={handleToggleMeds}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  dogStatus.medsTaken.done ? 'bg-emerald-50/80 border-emerald-300' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">💊 Witaminy & Stawy</span>
                  {dogStatus.medsTaken.done ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-stone-300" />}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  {dogStatus.medsTaken.done ? 'Podane ze smaczkiem' : 'Do podania'}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PROFILAKTYKA & KLESZCZE */}
      {activeTab === 'prevention' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                  Harmonogram Profilaktyki (Kleszcze, Odrobaczanie)
                </h3>
              </div>
              <button
                onClick={() => setShowAddPreventionModal(true)}
                className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100"
              >
                <Plus className="w-3.5 h-3.5" /> Dodaj zabieg
              </button>
            </div>

            <div className="space-y-3">
              {(dogProfile.prevention || []).map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{p.title}</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        Aktywne
                      </span>
                    </div>
                    <p className="text-stone-500">
                      Ostatnio podano: <strong>{p.lastGivenDate}</strong> • Następna dawka: <strong className="text-amber-800">{p.nextDueDate}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      onClick={() => handleTogglePrevention(p.id)}
                      className="px-3.5 py-1.5 bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-bold transition-colors shadow-2xs"
                    >
                      ✓ Oznacz podanie dawki
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Czy na pewno chcesz usunąć ten zabieg profilaktyczny?')) {
                          handleDeletePrevention(p.id);
                        }
                      }}
                      className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Usuń zabieg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VACCINES & VET */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                  Książeczka Szczepień Arii
                </h3>
              </div>
              <button
                onClick={() => setShowAddVaccineModal(true)}
                className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100"
              >
                <Plus className="w-3.5 h-3.5" /> Dodaj szczepienie
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {dogProfile.vaccinations.map((vac) => (
                <div key={vac.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{vac.name}</span>
                      <span className={`px-2 py-0.2 rounded-full font-semibold text-[10px] ${
                        vac.status === 'upcoming' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {vac.status === 'upcoming' ? 'Wymaga odnowienia wkrótce' : 'Ważne'}
                      </span>
                    </div>
                    <p className="text-stone-500 mt-0.5">
                      Podano: <strong>{vac.date}</strong> • Następny termin: <strong className="text-amber-800">{vac.nextDueDate}</strong>
                    </p>
                    <p className="text-[11px] text-stone-400">Klinika: {vac.vetClinic}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Czy na pewno chcesz usunąć to szczepienie?')) {
                        handleDeleteVaccine(vac.id);
                      }
                    }}
                    className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Usuń szczepienie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Vet Visits History */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                  Historia Wizyt u Weterynarza
                </h3>
              </div>
              <button
                onClick={() => setShowAddVisitModal(true)}
                className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100"
              >
                <Plus className="w-3.5 h-3.5" /> Dodaj wizytę
              </button>
            </div>

            <div className="space-y-3">
              {dogProfile.vetVisits.map((v) => (
                <div key={v.id} className="bg-stone-50/70 border border-stone-200 p-4 rounded-2xl space-y-1 text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                      <span className="font-bold text-stone-900 text-sm">{v.reason}</span>
                      <span className="font-semibold text-stone-500">{v.date}</span>
                    </div>
                    <p className="text-stone-600">Lekarz: {v.doctor} • {v.clinic}</p>
                    <p className="text-stone-700 bg-white p-2.5 rounded-xl border border-stone-100 mt-1">
                      📝 {v.notes}
                    </p>
                    {v.cost && <p className="text-[11px] text-stone-500 font-semibold">Koszt: {v.cost}</p>}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Czy na pewno chcesz usunąć tę wizytę u weterynarza?')) {
                        handleDeleteVisit(v.id);
                      }
                    }}
                    className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors self-end sm:self-auto"
                    title="Usuń wizytę"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: REMINDERS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
              Przypomnienia i Notatki o Arii
            </h3>
          </div>

          <div className="space-y-2">
            {dogProfile.reminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                  rem.done ? 'bg-stone-50 border-stone-200 opacity-60 text-stone-400' : 'bg-amber-50/50 border-amber-200 text-stone-900'
                }`}
              >
                <span className="font-medium">{rem.text}</span>
                <span className="font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                  📅 {rem.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Prevention Modal */}
      {showAddPreventionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Dodaj Zabieg Profilaktyczny
              </h3>
              <button onClick={() => setShowAddPreventionModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddPrevention} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nazwa preparatu / zabiegu *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Tabletka NexGard Spectra, Krople Foresto..."
                  value={prevTitle}
                  onChange={(e) => setPrevTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Termin kolejnej dawki</label>
                <input
                  type="date"
                  required
                  value={prevNextDate}
                  onChange={(e) => setPrevNextDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddPreventionModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-xs"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vaccine Modal */}
      {showAddVaccineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Nowe Szczepienie Arii
              </h3>
              <button onClick={() => setShowAddVaccineModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddVaccine} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nazwa szczepienia *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Wścieklizna Rabisin, Nobivac..."
                  value={vacName}
                  onChange={(e) => setVacName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Data podania</label>
                  <input
                    type="date"
                    value={vacDate}
                    onChange={(e) => setVacDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Następna dawka</label>
                  <input
                    type="date"
                    value={vacNextDate}
                    onChange={(e) => setVacNextDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddVaccineModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-xs"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Dodaj Wpis z Wizyty u Weterynarza
              </h3>
              <button onClick={() => setShowAddVisitModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleAddVisit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Powód wizyty *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Kontrola uszu, badanie krwi..."
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Koszt</label>
                  <input
                    type="text"
                    placeholder="np. 150 zł"
                    value={visitCost}
                    onChange={(e) => setVisitCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Zalecenia i notatki</label>
                <textarea
                  rows={2}
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddVisitModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-xs"
                >
                  Zapisz wizytę
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL DOG PROFILE EDITOR MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Dog className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-stone-900 font-['Outfit',sans-serif]">
                  Edytuj profil psa (Arii)
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-stone-400 hover:text-stone-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4 text-xs">
              <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <img
                  src={editAvatar}
                  alt={editName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 space-y-1.5">
                  <span className="font-semibold text-stone-700 block">Zdjęcie psa</span>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={dogAvatarInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => dogAvatarInputRef.current?.click()}
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
                    Imię psa *
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
                    Rasa
                  </label>
                  <input
                    type="text"
                    value={editBreed}
                    onChange={(e) => setEditBreed(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Data urodzenia
                  </label>
                  <input
                    type="text"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Waga (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editWeight}
                    onChange={(e) => setEditWeight(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Numer CHIP
                  </label>
                  <input
                    type="text"
                    value={editChip}
                    onChange={(e) => setEditChip(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Ulubione smaczki / jedzenie
                </label>
                <input
                  type="text"
                  value={editSnack}
                  onChange={(e) => setEditSnack(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-stone-100">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Klinika weterynaryjna
                  </label>
                  <input
                    type="text"
                    value={editClinic}
                    onChange={(e) => setEditClinic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Adres kliniki
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Telefon do weterynarza
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                  />
                </div>
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
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
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
