import React, { useState } from 'react';
import { 
  Trash2, 
  Car, 
  Package, 
  Receipt, 
  CreditCard, 
  Search, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  ExternalLink, 
  Copy, 
  Check, 
  Truck, 
  Sparkles, 
  Home, 
  Info,
  QrCode,
  Tag
} from 'lucide-react';
import { 
  BinConfig, 
  BinScheduleItem, 
  UKCarInfo, 
  UKDeliveryItem, 
  UKBillItem, 
  UKLoyaltyCard, 
  HomeItemLocation, 
  MemberId 
} from '../types';

interface UKLogisticsSectionProps {
  binConfig: BinConfig;
  binSchedule: BinScheduleItem[];
  carInfo: UKCarInfo;
  deliveries: UKDeliveryItem[];
  bills: UKBillItem[];
  loyaltyCards: UKLoyaltyCard[];
  homeItems: HomeItemLocation[];
  activeMemberId: MemberId;
  onUpdateBinConfig: (config: BinConfig) => void;
  onUpdateCarInfo: (car: UKCarInfo) => void;
  onAddDelivery: (delivery: Omit<UKDeliveryItem, 'id'>) => void;
  onToggleDeliveryStatus: (id: string) => void;
  onDeleteDelivery: (id: string) => void;
  onAddBill: (bill: Omit<UKBillItem, 'id'>) => void;
  onDeleteBill: (id: string) => void;
  onAddHomeItem: (item: Omit<HomeItemLocation, 'id'>) => void;
  onDeleteHomeItem: (id: string) => void;
}

export const UKLogisticsSection: React.FC<UKLogisticsSectionProps> = ({
  binConfig,
  binSchedule,
  carInfo,
  deliveries,
  bills,
  loyaltyCards,
  homeItems,
  activeMemberId,
  onUpdateBinConfig,
  onUpdateCarInfo,
  onAddDelivery,
  onToggleDeliveryStatus,
  onDeleteDelivery,
  onAddBill,
  onDeleteBill,
  onAddHomeItem,
  onDeleteHomeItem
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bins' | 'car' | 'deliveries' | 'bills' | 'cards' | 'finder'>('bins');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  // Modals state
  const [showAddDeliveryModal, setShowAddDeliveryModal] = useState(false);
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [showAddHomeItemModal, setShowAddHomeItemModal] = useState(false);

  // Form states
  const [delCourier, setDelCourier] = useState<'Amazon' | 'Royal Mail' | 'Evri' | 'DPD' | 'DHL' | 'Inne'>('Amazon');
  const [delDesc, setDelDesc] = useState('');
  const [delTracking, setDelTracking] = useState('');
  const [delRecipient, setDelRecipient] = useState<MemberId>('mama');
  const [delDate, setDelDate] = useState(new Date().toISOString().split('T')[0]);
  const [delSafePlace, setDelSafePlace] = useState('Garden Box na tarasie');

  const [billTitle, setBillTitle] = useState('');
  const [billProvider, setBillProvider] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billCategory, setBillCategory] = useState<any>('council_tax');
  const [billDueDate, setBillDueDate] = useState('');
  const [billFreq, setBillFreq] = useState<any>('miesięcznie');
  const [billAutoPay, setBillAutoPay] = useState(true);
  const [billNotes, setBillNotes] = useState('');

  const [itemName, setItemName] = useState('');
  const [itemRoom, setItemRoom] = useState('Sypialnia');
  const [itemSpot, setItemSpot] = useState('');
  const [itemCategory, setItemCategory] = useState<any>('Dokumenty UK');
  const [itemTags, setItemTags] = useState('');

  const handleCopyCardNumber = (id: string, num: string) => {
    navigator.clipboard.writeText(num.replace(/\s+/g, ''));
    setCopiedCardId(id);
    setTimeout(() => setCopiedCardId(null), 2500);
  };

  // Deliveries submit
  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delDesc.trim()) return;

    onAddDelivery({
      courier: delCourier,
      description: delDesc.trim(),
      trackingNumber: delTracking.trim() || undefined,
      recipient: delRecipient,
      status: 'in_transit',
      expectedDate: delDate,
      safePlaceNote: delSafePlace.trim()
    });

    setDelDesc('');
    setDelTracking('');
    setShowAddDeliveryModal(false);
  };

  // Bills submit
  const handleBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billTitle.trim() || !billAmount.trim()) return;

    onAddBill({
      title: billTitle.trim(),
      provider: billProvider.trim() || billTitle.trim(),
      amount: billAmount.trim(),
      category: billCategory,
      nextDueDate: billDueDate || new Date().toISOString().split('T')[0],
      frequency: billFreq,
      autoPay: billAutoPay,
      notes: billNotes.trim() || undefined
    });

    setBillTitle('');
    setBillProvider('');
    setBillAmount('');
    setShowAddBillModal(false);
  };

  // Home item submit
  const handleHomeItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !itemSpot.trim()) return;

    onAddHomeItem({
      name: itemName.trim(),
      room: itemRoom,
      spot: itemSpot.trim(),
      category: itemCategory,
      tags: itemTags.split(',').map((t) => t.trim()).filter(Boolean)
    });

    setItemName('');
    setItemSpot('');
    setItemTags('');
    setShowAddHomeItemModal(false);
  };

  // Calculate MOT & Tax days remaining
  const calculateDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const motDays = calculateDaysRemaining(carInfo.motDueDate);
  const taxDays = calculateDaysRemaining(carInfo.roadTaxDueDate);
  const insuranceDays = calculateDaysRemaining(carInfo.insuranceDueDate);

  // Filtered home items
  const filteredHomeItems = homeItems.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.spot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-24 md:pb-14">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-600/15 via-indigo-600/10 to-amber-500/10 border border-sky-200/80 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-sky-700 text-white rounded-2xl shadow-xs">
                <Home className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">
                Logistyka Domowa UK & Centrum Spraw
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Harmonogram wywozu koszy (Bin Tracker), karta samochodu (MOT, Tax), tracking paczek (Safe Place), Tax-Free Childcare i wyszukiwarka domowych rzeczy ("Gdzie to jest?").
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/95 px-4 py-2 rounded-2xl border border-sky-200 shadow-2xs text-xs font-bold text-sky-900 flex items-center gap-2">
              <span className="text-base">🇬🇧</span> Dom w Wielkiej Brytanii
            </div>
          </div>
        </div>

        {/* Sub-Tabs Nav */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none">
          {[
            { id: 'bins', label: '🗑️ Wywóz Koszy (Bins)', count: binSchedule.length },
            { id: 'car', label: '🚗 Karta Auta (MOT/Tax)', badge: `${motDays}d do MOT` },
            { id: 'deliveries', label: '📦 Paczki & Kurierzy', count: deliveries.filter((d) => d.status === 'in_transit').length },
            { id: 'bills', label: '📑 Rachunki & UK Gov', count: bills.length },
            { id: 'cards', label: '💳 Karty Lojalnościowe', count: loyaltyCards.length },
            { id: 'finder', label: '🔍 Gdzie to jest?', count: homeItems.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                activeSubTab === tab.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white/90 text-stone-700 hover:bg-white border border-stone-200/80 shadow-2xs'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  activeSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  activeSubTab === tab.id ? 'bg-emerald-400 text-stone-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 1. BIN DAY TRACKER SUB-SECTION */}
      {activeSubTab === 'bins' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Next Collection Spotlight */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-400/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3.5 bg-emerald-600 text-white rounded-2xl text-2xl shadow-xs">
                  🗑️
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                    Najbliższy Wywóz (Poniedziałek)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit',sans-serif]">
                    {binConfig.currentCycle === 'weekA' ? 'Czarny Kosz (Black Bin) + Food Waste' : 'Zielony / Niebieski (Recycling) + Garden Waste'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Wystawić kosze na podjazd przed domem w niedzielę wieczorem do godz. 20:00.
                  </p>
                </div>
              </div>

              {/* Cycle Switcher */}
              <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 self-start sm:self-auto">
                <button
                  onClick={() => onUpdateBinConfig({ ...binConfig, currentCycle: 'weekA' })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    binConfig.currentCycle === 'weekA'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Tydzień A (Black Bin)
                </button>
                <button
                  onClick={() => onUpdateBinConfig({ ...binConfig, currentCycle: 'weekB' })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    binConfig.currentCycle === 'weekB'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Tydzień B (Recycling)
                </button>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-950 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Przypomnienie ustawione: Niedziela 20:00
              </span>
              <span className="text-emerald-700 font-bold">Wywóz co 2 tygodnie naprzemiennie</span>
            </div>
          </div>

          {/* Bins Category Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Black Bin */}
            <div className="bg-white p-5 rounded-3xl border border-stone-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-white bg-stone-900 px-3 py-1 rounded-xl">
                  Black Bin
                </span>
                <span className="text-2xl">⬛</span>
              </div>
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Odpady Zmieszane (General Waste)
              </h3>
              <p className="text-xs text-stone-600">
                Wszystko, co nie nadaje się do recyklingu: pieluszki Tymka, folie zabrudzone jedzeniem, worki odkurzacza, zużyte gąbki.
              </p>
            </div>

            {/* Green / Blue Bin */}
            <div className="bg-white p-5 rounded-3xl border border-emerald-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl">
                  Green / Blue Bin
                </span>
                <span className="text-2xl">♻️</span>
              </div>
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Suchy Recykling (Dry Mixed)
              </h3>
              <p className="text-xs text-stone-600">
                Puste kartony (po paczkach Amazon), czyste butelki plastikowe, puszki aluminiowe, słoiki szklane, gazety i papier.
              </p>
            </div>

            {/* Food Caddy & Garden */}
            <div className="bg-white p-5 rounded-3xl border border-amber-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl">
                  Food Caddy & Garden
                </span>
                <span className="text-2xl">🍏</span>
              </div>
              <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Bio & Resztki Jedzenia
              </h3>
              <p className="text-xs text-stone-600">
                Obierki warzyw, fusy z kawy, skorupki jajek, resztki posiłków, skoszona trawa i liście z ogródka.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* 2. CAR HUB SUB-SECTION */}
      {activeSubTab === 'car' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Vehicle Spotlight Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-4">
                {/* UK Registration Plate Badge */}
                <div className="flex items-stretch border-2 border-stone-900 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-blue-700 text-white px-2 py-1 flex flex-col items-center justify-center font-bold text-[10px]">
                    <span>🇬🇧</span>
                    <span>UK</span>
                  </div>
                  <div className="bg-amber-300 text-stone-950 px-4 py-1 flex items-center font-black tracking-widest text-lg font-mono">
                    {carInfo.regNumber}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-['Outfit',sans-serif]">
                    {carInfo.makeModel}
                  </h3>
                  <span className="text-xs text-stone-500">Przebieg: {carInfo.mileage}</span>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Auto Sprawne & Ubezpieczone
              </span>
            </div>

            {/* Crucial Due Dates Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* MOT Status */}
              <div className={`p-4 rounded-2xl border ${
                motDays > 60 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50 border-amber-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-600">Przegląd MOT (UK)</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-1">
                  <span className="text-xl font-black text-stone-900 font-['Outfit',sans-serif]">
                    {carInfo.motDueDate}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 block mt-0.5">
                    Ważny jeszcze przez {motDays} dni
                  </span>
                </div>
              </div>

              {/* Road Tax Status */}
              <div className={`p-4 rounded-2xl border ${
                taxDays > 60 ? 'bg-sky-50/60 border-sky-200' : 'bg-amber-50 border-amber-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-600">Podatek Drogowy (Road Tax)</span>
                  <Receipt className="w-4 h-4 text-sky-600" />
                </div>
                <div className="mt-1">
                  <span className="text-xl font-black text-stone-900 font-['Outfit',sans-serif]">
                    {carInfo.roadTaxDueDate}
                  </span>
                  <span className="text-xs font-bold text-sky-800 block mt-0.5">
                    Opłacony (za {taxDays} dni)
                  </span>
                </div>
              </div>

              {/* Insurance */}
              <div className={`p-4 rounded-2xl border ${
                insuranceDays > 30 ? 'bg-purple-50/60 border-purple-200' : 'bg-rose-50 border-rose-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-600">Ubezpieczenie (Insurance)</span>
                  <CreditCard className="w-4 h-4 text-purple-600" />
                </div>
                <div className="mt-1">
                  <span className="text-xl font-black text-stone-900 font-['Outfit',sans-serif]">
                    {carInfo.insuranceDueDate}
                  </span>
                  <span className="text-xs font-bold text-purple-800 block mt-0.5">
                    {insuranceDays} dni do odnowienia
                  </span>
                </div>
              </div>

            </div>

            {/* Policy & Breakdown Cover Info */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 font-semibold block">Ubezpieczyciel:</span>
                  <strong className="text-stone-900">{carInfo.insuranceProvider}</strong>
                </div>
                <div>
                  <span className="text-stone-500 font-semibold block">Pomoc drogowa (Breakdown Cover):</span>
                  <strong className="text-stone-900">{carInfo.breakdownCover}</strong>
                </div>
              </div>
              {carInfo.notes && (
                <p className="text-stone-600 pt-2 border-t border-stone-200">
                  ℹ️ <strong>Notatka:</strong> {carInfo.notes}
                </p>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 3. DELIVERIES SUB-SECTION */}
      {activeSubTab === 'deliveries' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif]">
                Oczekujące Paczki & Kurierzy UK
              </h3>
              <p className="text-xs text-stone-500">
                Śledzenie zamówień oraz instrukcje Safe Place dla kurierów.
              </p>
            </div>

            <button
              onClick={() => setShowAddDeliveryModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Dodaj paczkę
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deliveries.map((del) => {
              const isDelivered = del.status === 'delivered';
              return (
                <div
                  key={del.id}
                  className={`bg-white rounded-3xl p-5 border transition-all space-y-3.5 ${
                    isDelivered ? 'border-stone-200 opacity-75' : 'border-sky-300 shadow-xs ring-1 ring-sky-200/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2.5 bg-stone-100 text-stone-800 rounded-xl font-bold text-xs">
                        🚚 {del.courier}
                      </span>
                      <div>
                        <span className="text-[11px] font-bold text-stone-500 block">
                          Dla: {del.recipient === 'mama' ? 'Aleksandra' : 'Kuba'}
                        </span>
                        <span className="text-xs font-semibold text-stone-800 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" /> {del.expectedDate}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteDelivery(del.id)}
                      className="text-stone-300 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-stone-900">
                    {del.description}
                  </p>

                  {del.trackingNumber && (
                    <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 p-2 rounded-xl border border-stone-200">
                      <Tag className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-mono">{del.trackingNumber}</span>
                    </div>
                  )}

                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>Safe Place:</strong> {del.safePlaceNote}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      isDelivered ? 'bg-emerald-100 text-emerald-900' : 'bg-sky-100 text-sky-900'
                    }`}>
                      {isDelivered ? '✅ Dostarczona' : '⏳ W drodze do domu'}
                    </span>

                    <button
                      onClick={() => onToggleDeliveryStatus(del.id)}
                      className="text-xs font-bold text-sky-700 hover:underline"
                    >
                      {isDelivered ? 'Oznacz jako w drodze' : 'Oznacz jako odebraną'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 4. BILLS & UK GOV SUB-SECTION */}
      {activeSubTab === 'bills' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Tax-Free Childcare Special Alert Banner */}
          <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-400 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xl shrink-0">
                🇬🇧
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  Tax-Free Childcare (GOV.UK)
                </span>
                <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                  Potwierdzenie danych co 3 miesiące (Reconfirmation)
                </h3>
                <p className="text-xs text-stone-600">
                  Rząd dopłaca 20% do czesnego przedszkola (do £2,000 rocznie na dziecko). Następna rekonfirmacja: <strong>14 września 2026 r.</strong>
                </p>
              </div>
            </div>

            <a
              href="https://www.gov.uk/sign-in-childcare-account"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
            >
              Gov.uk Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif]">
              Stałe Opłaty i Rachunki Domowe UK
            </h3>

            <button
              onClick={() => setShowAddBillModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Dodaj rachunek
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3 hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 block uppercase">
                        {bill.provider}
                      </span>
                      <h4 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                        {bill.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onDeleteBill(bill.id)}
                      className="text-stone-300 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-black text-stone-900 font-['Outfit',sans-serif]">
                      {bill.amount}
                    </span>
                    <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-xl font-semibold">
                      {bill.frequency}
                    </span>
                  </div>

                  {bill.notes && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      ℹ️ {bill.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                  <span className="text-stone-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Płatność: <strong>{bill.nextDueDate}</strong>
                  </span>
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    {bill.autoPay ? '✓ Direct Debit' : '⚠️ Manualnie'}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 5. LOYALTY CARDS SUB-SECTION */}
      {activeSubTab === 'cards' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <h3 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif]">
              Wspólne Karty Lojalnościowe UK (Skaner przy kasie)
            </h3>
            <p className="text-xs text-stone-500">
              Kliknij "Kopiuj numer", aby wkleić kod w kasie samoobsługowej lub zeskanuj wygenerowany kod z ekranu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loyaltyCards.map((card) => (
              <div
                key={card.id}
                className={`bg-gradient-to-br ${card.color} text-white rounded-3xl p-6 shadow-md space-y-5 relative overflow-hidden flex flex-col justify-between`}
              >
                <div className="space-y-1 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                      {card.category}
                    </span>
                    <CreditCard className="w-5 h-5 text-white/80" />
                  </div>
                  <h4 className="text-lg font-bold pt-1">{card.name}</h4>
                </div>

                {/* Simulated Barcode / QR Box */}
                <div className="bg-white text-stone-900 p-4 rounded-2xl space-y-2 shadow-inner text-center relative z-10">
                  <div className="flex items-center justify-center py-2">
                    <div className="h-10 w-full flex items-center justify-center gap-1 opacity-90">
                      {[12, 24, 8, 16, 32, 10, 28, 14, 20, 8, 30, 18, 12, 24, 16, 28, 10, 22].map((h, i) => (
                        <div key={i} className="bg-black w-1 rounded-xs" style={{ height: `${h}px` }} />
                      ))}
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest block text-stone-900">
                    {card.cardNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between relative z-10 pt-1">
                  <span className="text-[11px] text-white/70">Wspólna karta</span>
                  <button
                    onClick={() => handleCopyCardNumber(card.id, card.cardNumber)}
                    className="flex items-center gap-1 text-xs font-bold bg-white text-stone-900 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-all shadow-xs"
                  >
                    {copiedCardId === card.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Skopiowano!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Kopiuj numer
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 6. WHERE IS IT? (HOME FINDER) SUB-SECTION */}
      {activeSubTab === 'finder' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Search & Actions Bar */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
                  <Search className="w-5 h-5 text-sky-600" />
                  "Gdzie to jest?" — Wyszukiwarka Rzeczy w Domu
                </h3>
                <p className="text-xs text-stone-500">
                  Znajdź paszporty, leki, zapasowe klucze, ubranka Tymka czy wkrętarkę w ułamku sekundy.
                </p>
              </div>

              <button
                onClick={() => setShowAddHomeItemModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Dodaj lokalizację rzeczy
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Szukaj: np. paszporty, inhalator, kombinezon, klucze, wkrętarka..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:border-sky-500 focus:outline-hidden"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              {['all', 'Dokumenty UK', 'Zdrowie i Apteczka', 'Elektronika', 'Narzędzia', 'Ubranka Tymka', 'Dla Arii', 'Pamiątki i Inne'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 ${
                    selectedCategoryFilter === cat
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat === 'all' ? 'Wszystkie pokoje' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredHomeItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs hover:border-sky-300 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200/60 inline-block">
                        {item.category}
                      </span>
                      <h4 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                        {item.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => onDeleteHomeItem(item.id)}
                      className="text-stone-300 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-stone-50/80 p-3 rounded-2xl border border-stone-100 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-stone-900 font-bold">
                      <Home className="w-3.5 h-3.5 text-sky-600" />
                      Pokój: {item.room}
                    </div>
                    <p className="text-stone-700 font-medium pl-5">
                      📍 <strong>Dokładne miejsce:</strong> {item.spot}
                    </p>
                  </div>

                  {item.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Modal: Add Delivery */}
      {showAddDeliveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Dodaj Oczekiwaną Paczkę</h3>
              <button onClick={() => setShowAddDeliveryModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleDeliverySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kurier</label>
                <select
                  value={delCourier}
                  onChange={(e) => setDelCourier(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                >
                  <option value="Amazon">Amazon Prime</option>
                  <option value="Royal Mail">Royal Mail</option>
                  <option value="Evri">Evri</option>
                  <option value="DPD">DPD UK</option>
                  <option value="DHL">DHL Express</option>
                  <option value="Inne">Inny kurier</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Co jest w paczce? *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Klocki dla Tymka, karma dla Arii..."
                  value={delDesc}
                  onChange={(e) => setDelDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dla kogo?</label>
                  <select
                    value={delRecipient}
                    onChange={(e) => setDelRecipient(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="mama">Aleksandra (Mama)</option>
                    <option value="tata">Kuba (Tata)</option>
                    <option value="dziecko">Tymek</option>
                    <option value="aria">Aria</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Data doręczenia</label>
                  <input
                    type="date"
                    value={delDate}
                    onChange={(e) => setDelDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Numer przesyłki (opcjonalnie)</label>
                <input
                  type="text"
                  placeholder="np. AMZ-UK-99482..."
                  value={delTracking}
                  onChange={(e) => setDelTracking(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Safe Place (Gdzie zostawić?)</label>
                <input
                  type="text"
                  value={delSafePlace}
                  onChange={(e) => setDelSafePlace(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddDeliveryModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-black text-white font-bold rounded-xl shadow-xs"
                >
                  Zapisz paczkę
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Bill */}
      {showAddBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Dodaj Nową Stałą Opłatę UK</h3>
              <button onClick={() => setShowAddBillModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleBillSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tytuł opłaty *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Council Tax, Virgin Media, Octopus Energy..."
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kwota (£) *</label>
                  <input
                    type="text"
                    required
                    placeholder="np. £184.00"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Częstotliwość</label>
                  <select
                    value={billFreq}
                    onChange={(e) => setBillFreq(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="miesięcznie">Miesięcznie</option>
                    <option value="co 3 miesiące (Tax-Free)">Co 3 miesiące</option>
                    <option value="rocznie">Rocznie</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Data najbliższej płatności</label>
                <input
                  type="date"
                  value={billDueDate}
                  onChange={(e) => setBillDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autopay-check"
                  checked={billAutoPay}
                  onChange={(e) => setBillAutoPay(e.target.checked)}
                  className="rounded-sm accent-stone-900"
                />
                <label htmlFor="autopay-check" className="font-semibold text-stone-800">
                  Płatność automatyczna (Direct Debit / Stojące zlecenie)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddBillModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-black text-white font-bold rounded-xl shadow-xs"
                >
                  Zapisz opłatę
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Home Item */}
      {showAddHomeItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Dodaj Rzecz do Wyszukiwarki</h3>
              <button onClick={() => setShowAddHomeItemModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleHomeItemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nazwa rzeczy / dokumentu *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Zapasowe klucze do auta, Inhalator Tymka..."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Pokój / Pomieszczenie</label>
                  <select
                    value={itemRoom}
                    onChange={(e) => setItemRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="Sypialnia na piętrze">Sypialnia</option>
                    <option value="Kuchnia">Kuchnia</option>
                    <option value="Salon">Salon</option>
                    <option value="Wiatrołap / Przedpokój">Przedpokój</option>
                    <option value="Pokój Tymka">Pokój Tymka</option>
                    <option value="Łazienka">Łazienka</option>
                    <option value="Garaż / Schowek">Garaż / Schowek</option>
                    <option value="Garderoba / Strych">Garderoba / Strych</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kategoria</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="Dokumenty UK">Dokumenty UK</option>
                    <option value="Zdrowie i Apteczka">Zdrowie i Apteczka</option>
                    <option value="Elektronika">Elektronika</option>
                    <option value="Narzędzia">Narzędzia</option>
                    <option value="Ubranka Tymka">Ubranka Tymka</option>
                    <option value="Dla Arii">Dla Arii</option>
                    <option value="Pamiątki i Inne">Pamiątki i Inne</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Gdzie dokładnie leży? *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="np. Środkowa szuflada komody, czarne pudełko po prawej stronie..."
                  value={itemSpot}
                  onChange={(e) => setItemSpot(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tagi do szybkiego szukania (po przecinku)</label>
                <input
                  type="text"
                  placeholder="np. klucze, auto, zapas, pilot"
                  value={itemTags}
                  onChange={(e) => setItemTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddHomeItemModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-black text-white font-bold rounded-xl shadow-xs"
                >
                  Zapisz lokalizację 📍
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
