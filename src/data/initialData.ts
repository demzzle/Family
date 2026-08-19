import {
  FamilyMember,
  Post,
  CalendarEvent,
  WorkShift,
  KindergartenDuty,
  TaskItem,
  ShoppingItem,
  Recipe,
  MealPlanDay,
  DogProfile,
  DogDailyStatus,
  CatProfile,
  CatDailyStatus,
  ChildProfile,
  EntertainmentItem,
  DateBucketItem,
  SavingsGoal,
  StickyNote,
  StudyItem,
  FocusSession,
  BinConfig,
  BinScheduleItem,
  WorkoutEntry,
  QuickFamilyStatus,
  ChildMedicationLog,
  LoveNudgeTemplate,
  SentNudge,
  WhiteFlagOffer,
  CoupleMilestone,
  UKCarInfo,
  UKDeliveryItem,
  UKBillItem,
  UKLoyaltyCard,
  HomeItemLocation,
  SectionVisibility
} from '../types';

export const FAMILY_MEMBERS: Record<string, FamilyMember> = {
  mama: {
    id: 'mama',
    name: 'Aleksandra',
    role: 'Mama',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    color: '#e07a5f',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    badgeText: 'text-rose-700'
  },
  tata: {
    id: 'tata',
    name: 'Kuba',
    role: 'Tata',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    color: '#3d5a80',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    badgeText: 'text-sky-700'
  },
  dziecko: {
    id: 'dziecko',
    name: 'Tymek',
    role: 'Maluch (3,5 l.)',
    avatar: 'https://images.unsplash.com/photo-1595454223600-91fbdd7726d4?w=200&auto=format&fit=crop&q=80',
    color: '#81b29a',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-700'
  },
  aria: {
    id: 'aria',
    name: 'Aria',
    role: 'Piesek (Golden)',
    avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80',
    color: '#f4a261',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    badgeText: 'text-amber-700'
  },
  kot: {
    id: 'kot',
    name: 'Luna',
    role: 'Kicia (Brytyjczyk)',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeText: 'text-purple-700'
  }
};

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'mama',
    content: 'Poranny spacer z Arią w parku przed pracą! Znalazła największy patyk w całym lesie i nie chciała go oddać 🌲🐾 Tymek zachwycony, zbieraliśmy też szyszki do przedszkola.',
    timestamp: '2026-08-19T08:30:00Z',
    formattedDate: 'Dzisiaj, 08:30',
    mediaUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likes: ['tata', 'mama'],
    mood: '🥰 Szczęśliwa',
    tag: 'Spacer z Arią',
    pinned: true,
    comments: [
      {
        id: 'c1',
        authorId: 'tata',
        text: 'Genialne zdjęcie! Wieczorny spacer biorę ja, pójdziemy nad rzekę 🐕',
        timestamp: '08:45'
      }
    ]
  },
  {
    id: 'post-2',
    authorId: 'tata',
    content: 'Tymek dzisiaj w przedszkolu zrobił pierwszy rysunek naszej całej czwórki – nawet Aria ma dorysowany ogon i obrożę! Wisi już na lodówce 🎨❤️',
    timestamp: '2026-08-18T16:45:00Z',
    formattedDate: 'Wczoraj, 16:45',
    mediaUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likes: ['mama', 'tata'],
    mood: '🎨 Dumny tata',
    tag: 'Dzieło Tymka',
    comments: [
      {
        id: 'c2',
        authorId: 'mama',
        text: 'Cudowny jest nasz mały artysta! Musimy to zachować w teczce wspomnień.',
        timestamp: '17:10'
      }
    ]
  }
];

const todayStr = new Date().toISOString().split('T')[0];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Odprowadzenie Tymka do Przedszkola',
    date: todayStr,
    startTime: '08:00',
    endTime: '08:30',
    category: 'kindergarten',
    assignedTo: ['tata'],
    location: 'Przedszkole Leśne Skrzaty',
    note: 'Zabrać worek z kapciami i bidon z wodą',
    completed: true
  },
  {
    id: 'ev-2',
    title: 'Odbiór Tymka z Przedszkola',
    date: todayStr,
    startTime: '15:45',
    endTime: '16:15',
    category: 'kindergarten',
    assignedTo: ['mama'],
    location: 'Przedszkole',
    note: 'Pani Magda prosiła o podpisanie zgody na wycieczkę',
    reminder: true
  },
  {
    id: 'ev-3',
    title: 'Długi spacer z Arią nad jeziorem',
    date: todayStr,
    startTime: '18:30',
    endTime: '19:45',
    category: 'aria',
    assignedTo: ['tata', 'mama', 'dziecko'],
    location: 'Park Miejski i Błonia',
    isEveningPlan: true
  },
  {
    id: 'ev-4',
    title: 'Wizyta kontrolna u weterynarza (Aria)',
    date: '2026-08-22',
    startTime: '11:00',
    endTime: '11:45',
    category: 'health',
    assignedTo: ['mama'],
    location: 'Klinika Weterynaryjna "Cztery Łapy"',
    note: 'Szczepienie przypominające przeciw wściekliźnie + kontrola uszu'
  },
  {
    id: 'ev-5',
    title: 'Wyciągnięcie Koszy (Black Bin / Ogólne)',
    date: '2026-08-24',
    startTime: '20:00',
    endTime: '20:15',
    category: 'bins',
    assignedTo: ['tata', 'mama'],
    location: 'Przed domem',
    reminder: true
  }
];

export const INITIAL_WORK_SHIFTS: WorkShift[] = [
  {
    id: 'ws-1',
    memberId: 'mama',
    date: todayStr,
    startTime: '09:00',
    endTime: '17:00',
    type: 'office',
    note: 'Spotkanie projektowe o 11:00'
  },
  {
    id: 'ws-2',
    memberId: 'tata',
    date: todayStr,
    startTime: '08:30',
    endTime: '16:30',
    type: 'home',
    note: 'Dyżur domowy i przygotowanie obiadu'
  }
];

export const INITIAL_KINDERGARTEN_DUTY: KindergartenDuty = {
  date: todayStr,
  dropOffBy: 'tata',
  dropOffTime: '08:00',
  pickUpBy: 'mama',
  pickUpTime: '15:45',
  specialNotes: 'Dziś dzień zabawek – Tymek zabrał małe autko drewniane. Pamiętać o odbiorze kurtki przeciwdeszczowej.'
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Wstawić i powiesić pranie ubranek Tymka',
    category: 'cleaning',
    assignedTo: 'mama',
    dueDate: todayStr,
    dueTime: '18:00',
    priority: 'medium',
    completed: true
  },
  {
    id: 't-2',
    title: 'Odkurzyć parter i posłanie Arii',
    category: 'cleaning',
    assignedTo: 'tata',
    dueDate: todayStr,
    dueTime: '19:00',
    priority: 'high',
    completed: false,
    recurrence: 'weekly'
  },
  {
    id: 't-3',
    title: 'Wystawić kosze na podjazd przed 21:00 (Black Bin)',
    category: 'bins',
    assignedTo: 'tata',
    dueDate: todayStr,
    dueTime: '20:30',
    priority: 'high',
    completed: false,
    recurrence: 'weekly',
    reminderSet: true
  },
  {
    id: 't-4',
    title: 'Kupić zapas karmy dla Arii (Brit Care Salmon 12kg)',
    category: 'pet',
    assignedTo: 'mama',
    dueDate: '2026-08-21',
    priority: 'medium',
    completed: false
  },
  {
    id: 't-5',
    title: 'Opłacić czesne za przedszkole i rytmikę',
    category: 'bills',
    assignedTo: 'tata',
    dueDate: '2026-08-25',
    priority: 'high',
    completed: false
  }
];

export const INITIAL_SHOPPING: ShoppingItem[] = [
  { id: 's-1', name: 'Banany bio do placuszków', category: 'Warzywa i Owoce', amount: '1 kiść', checked: false, addedBy: 'mama' },
  { id: 's-2', name: 'Mleko owsiane Barista', category: 'Nabiał', amount: '2 kartony', checked: true, addedBy: 'tata' },
  { id: 's-3', name: 'Smaczki do treningu z jeleniem dla Arii', category: 'Dla Arii', amount: '2 opakowania', checked: false, addedBy: 'mama' },
  { id: 's-4', name: 'Mokre chusteczki bezzapachowe (Tymek)', category: 'Dla Dziecka', amount: 'Zapas 4-pack', checked: false, addedBy: 'mama' },
  { id: 's-5', name: 'Tabletki do zmywarki Fairy Platinum', category: 'Chemia i Dom', amount: '1 duże opakowanie', checked: false, addedBy: 'tata' }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'r-1',
    title: 'Szybki Łosoś Pieczony z Batatami i Szparagami',
    description: 'Pyszny, zdrowy obiad na 1 blachę dla całej rodziny. Tymek uwielbia pieczone bataty pokrojone w słupki!',
    prepTime: '25 min',
    rating: 5,
    tags: ['Szybki obiad', 'Rybka', 'Ulubione Tymka', 'Zdrowe'],
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
    ingredients: [
      'Filet z łososia 500g',
      '2 duże bataty',
      'Pęczek zielonych szparagów',
      'Oliwa z oliwek z pierwszego tłoczenia',
      'Sok z 1/2 cytryny i świeży koperek',
      'Sól morska i słodka papryka'
    ],
    steps: [
      'Rozgrzej piekarnik do 200°C z termoobiegiem.',
      'Bataty obierz i pokrój w słupki frytkowe, wymieszaj z oliwą i papryką, wyłóż na blachę na 15 min.',
      'Dodaj na blachę doprawionego łososia oraz szparagi skropione oliwą.',
      'Piecz całość jeszcze 12 minut do zarumienienia łososia.'
    ],
    lovedBy: ['mama', 'tata', 'dziecko'],
    difficulty: 'Łatwe'
  },
  {
    id: 'r-2',
    title: 'Puszyste Placuszki Bananowe z Borówkami',
    description: 'Naleśniczki bez cukru – naturalnie słodzone dojrzałym bananem. Idealne na leniwe sobotnie śniadanie.',
    prepTime: '15 min',
    rating: 5,
    tags: ['Śniadanie', 'Dla Dziecka', 'Wege', 'Bez cukru'],
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80',
    ingredients: [
      '2 dojrzałe banany',
      '2 jajka',
      '1 szklanka mąki orkiszowej lub owsianej',
      '1/2 szklanki mleka owsianego',
      'Świeże borówki i syrop klonowy'
    ],
    steps: [
      'Banany rozgnieć widelcem na gładką papkę.',
      'Dodaj jajka, mleko i mąkę, wymieszaj trzepaczką na gęste ciasto.',
      'Smaż małe placuszki na suchej patelni teflonowej lub odrobinie oleju kokosowego.',
      'Podawaj posypane świeżymi borówkami.'
    ],
    lovedBy: ['dziecko', 'mama', 'tata'],
    difficulty: 'Łatwe'
  }
];

export const INITIAL_MEAL_PLAN: MealPlanDay[] = [
  { dayName: 'Poniedziałek', date: '2026-08-17', dishName: 'Penne z sosem pomidorowym, bazylią i mozzarellą', cook: 'mama' },
  { dayName: 'Wtorek', date: '2026-08-18', dishName: 'Pieczony łosoś z batatami i szparagami', recipeId: 'r-1', cook: 'tata' },
  { dayName: 'Środa (Dziś)', date: todayStr, dishName: 'Curry warzywne z ciecierzycą i ryżem jaśminowym', cook: 'mama' },
  { dayName: 'Czwartek', date: '2026-08-20', dishName: 'Kotlety z indyka z purée ziemniaczanym i mizerią', cook: 'tata' },
  { dayName: 'Piątek', date: '2026-08-21', dishName: 'Domowa pizza na cienkim cieście (Tymek sam układa dodatki!)', cook: 'tata' },
  { dayName: 'Sobota', date: '2026-08-22', dishName: 'Grill w ogrodzie / pieczone warzywa & szaszłyki', cook: 'mama' },
  { dayName: 'Niedziela', date: '2026-08-23', dishName: 'Rosół z kaczki i kurczaka z domowym makaronem', cook: 'mama' }
];

export const INITIAL_DOG_PROFILE: DogProfile = {
  name: 'Aria',
  breed: 'Golden Retriever',
  birthDate: '2023-04-12',
  weightKg: 28.4,
  chipNumber: '616093900123456',
  vetClinic: 'Przychodnia Weterynaryjna "Cztery Łapy"',
  vetPhone: '+48 501 234 567',
  vetAddress: 'ul. Parkowa 14, Warszawa',
  insuranceNumber: 'PET-PL-2024-88492',
  favoriteSnack: 'Suszone paski z jelenia, marchewka w kawałkach i masło orzechowe w konga',
  avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
  vaccinations: [
    { id: 'v-1', name: 'Wścieklizna (Rabisin)', date: '2025-08-25', nextDueDate: '2026-08-25', vetClinic: 'Cztery Łapy', status: 'upcoming' },
    { id: 'v-2', name: 'Wieloważna (Nobivac DHPPi)', date: '2025-05-10', nextDueDate: '2027-05-10', vetClinic: 'Cztery Łapy', status: 'valid' }
  ],
  vetVisits: [
    {
      id: 'vv-1',
      date: '2026-05-10',
      reason: 'Szczepienie przeciw kaszlowi kenelowemu + obcięcie pazurów',
      clinic: 'Cztery Łapy',
      doctor: 'Lek. wet. Piotr Nowak',
      notes: 'Piesek zniósł zabieg wzorowo, nagrodzona smaczkiem.',
      cost: '110 zł'
    }
  ],
  prevention: [
    { id: 'pr-1', title: 'Tabletka NexGard Spectra (Kleszcze, pchły, nicienie)', lastGivenDate: '2026-08-01', nextDueDate: '2026-09-01', frequencyMonths: 1, done: true },
    { id: 'pr-2', title: 'Odrobaczanie profilaktyczne (Dehinel Plus)', lastGivenDate: '2026-05-15', nextDueDate: '2026-08-25', frequencyMonths: 3, done: false }
  ],
  reminders: [
    { id: 'dr-1', text: 'Tabletka przeciw kleszczom (NexGard Spectra)', date: '2026-09-01', done: false },
    { id: 'dr-2', text: 'Wizyta kontrolna i szczepienie wścieklizny', date: '2026-08-22', done: false },
    { id: 'dr-3', text: 'Czesanie podszerstka (sezonowe)', date: '2026-08-20', done: false }
  ]
};

export const INITIAL_DOG_STATUS: DogDailyStatus = {
  date: todayStr,
  morningWalk: { done: true, by: 'mama', time: '07:30', notes: 'Park i aportowanie piłki' },
  afternoonWalk: { done: true, by: 'tata', time: '13:15', notes: 'Szybki obchód wokół osiedla' },
  eveningWalk: { done: false },
  morningFood: { done: true, by: 'mama', time: '08:00' },
  eveningFood: { done: false },
  waterChanged: { done: true, by: 'tata' },
  medsTaken: { done: true, by: 'mama' }
};

export const INITIAL_CAT_PROFILE: CatProfile = {
  name: 'Luna',
  breed: 'Brytyjski krótkowłosy (British Shorthair)',
  birthDate: '2024-03-10',
  weightKg: 4.2,
  chipNumber: '985141002348912',
  vetClinic: 'Przychodnia Weterynaryjna "Cztery Łapy"',
  vetPhone: '+48 501 234 567',
  vetAddress: 'ul. Parkowa 14, Warszawa',
  insuranceNumber: 'PET-CAT-2024-9182',
  favoriteSnack: 'Kremiki Miamor z łososiem, suszone kawałki kaczki i trawa dla kotów',
  favoriteToy: 'Wędka z piórkami z dzwoneczkiem, laser i kartonowe pudełko po paczce',
  litterType: 'Żwirek bentonitowy drobny bezzapachowy (wymiana filtra węglowego co 2 mies.)',
  indoorOutdoor: 'indoor',
  avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
  vaccinations: [
    { id: 'vc-1', name: 'Zasadnicza RCP (Koci katar + panleukopenia - Purevax)', date: '2025-09-12', nextDueDate: '2026-09-12', vetClinic: 'Cztery Łapy', status: 'valid' },
    { id: 'vc-2', name: 'Wścieklizna (Rabisin)', date: '2025-09-12', nextDueDate: '2026-09-12', vetClinic: 'Cztery Łapy', status: 'valid' }
  ],
  vetVisits: [
    {
      id: 'vvc-1',
      date: '2026-04-15',
      reason: 'Kontrola okresowa, obcięcie pazurków i przegląd uszu',
      clinic: 'Cztery Łapy',
      doctor: 'Lek. wet. Anna Kowalska',
      notes: 'Waga w normie (4.2kg), ząbki idealnie czyste bez kamienia.',
      cost: '90 zł'
    }
  ],
  prevention: [
    { id: 'prc-1', title: 'Krople na kark Stronghold / Broadline (Pchły, kleszcze, świerzb)', lastGivenDate: '2026-08-05', nextDueDate: '2026-09-05', frequencyMonths: 1, done: true },
    { id: 'prc-2', title: 'Pasta odkłaczająca (GimCat Malt-Soft Extra)', lastGivenDate: '2026-08-18', nextDueDate: '2026-08-25', frequencyMonths: 1, done: true }
  ],
  reminders: [
    { id: 'rc-1', text: 'Krople na kark przeciw pasożytom (05.09)', date: '2026-09-05', done: false },
    { id: 'rc-2', text: 'Wymiana wkładu w filtrze fontanny z wodą', date: '2026-08-28', done: false },
    { id: 'rc-3', text: 'Czesanie furminatorem i obcięcie pazurków', date: '2026-08-23', done: false }
  ]
};

export const INITIAL_CAT_STATUS: CatDailyStatus = {
  date: todayStr,
  morningFood: { done: true, by: 'mama', time: '07:15', notes: 'Mokra karma z łososiem Animonda Carny' },
  eveningFood: { done: false },
  waterChanged: { done: true, by: 'tata' },
  litterBoxCleaned: { done: true, by: 'mama', time: '08:10', notes: 'Sprzątnięta i dosypany świeży żwirek' },
  brushed: { done: false },
  played: { done: true, by: 'tata', time: '14:30', notes: 'Zabawa wędką z piórkami z Tymkiem' },
  medsTaken: { done: true, by: 'mama' }
};

export const INITIAL_CHILD_PROFILE: ChildProfile = {
  name: 'Tymek',
  birthDate: '2023-02-14',
  currentHeightCm: 104,
  currentWeightKg: 16.2,
  clothesSize: '104 / 110 (3-4 lata)',
  shoeSize: '26 (dł. wkładki 16.5 cm)',
  hatSize: '50-52 cm',
  kindergartenName: 'Przedszkole Niepubliczne "Leśne Skrzaty"',
  groupName: 'Grupa "Wiewiórki"',
  teacherName: 'Pani Kasia & Pani Magda',
  allergies: ['Brak alergii pokarmowych (delikatna skóra atopowa przy proszkach zapachowych)'],
  favoriteMeals: ['Placuszki bananowe', 'Zupa pomidorowa z lanymi kluskami', 'Penne z łososiem', 'Arbuz i borówki'],
  favoriteToys: ['Drewniane tory kolejowe Brio', 'Klocki Lego Duplo', 'Pluszowy piesek "Mini-Aria"', 'Hulajnoga trójkołowa'],
  avatarUrl: 'https://images.unsplash.com/photo-1595454223600-91fbdd7726d4?w=800&auto=format&fit=crop&q=80',
  packingList: [
    { id: 'pk-1', item: 'Bidon z wodą (umyty i napełniony)', checked: true, category: 'codziennie' },
    { id: 'pk-2', item: 'Kapcie na rzepy do sali', checked: true, category: 'codziennie' },
    { id: 'pk-3', item: 'Komplet ubrań na zmianę (koszulka, spodenki, majteczki, skarpetki)', checked: true, category: 'zapas' },
    { id: 'pk-4', item: 'Kurtka przeciwdeszczowa i kalosze w szatni', checked: true, category: 'specjalne' },
    { id: 'pk-5', item: 'Ulubiona przytulanka na leżakowanie', checked: false, category: 'codziennie' },
    { id: 'pk-6', item: 'Kupić nowe kalosze rozmiar 27 na deszczowe dni', checked: false, category: 'do_dokupienia' }
  ],
  medicationLogs: [
    {
      id: 'med-1',
      date: '2026-08-16',
      time: '19:30',
      medName: 'Syrop Lipomal (lipowy)',
      dose: '5 ml',
      administeredBy: 'mama',
      reason: 'Lekki katar wieczorny i chrypka po basenie',
      temperature: '36.8°C'
    },
    {
      id: 'med-2',
      date: '2026-08-16',
      time: '08:00',
      medName: 'Witamina D3 w kroplach (Devikap)',
      dose: '2 krople (1000 IU)',
      administeredBy: 'tata',
      reason: 'Codzienna suplementacja odporności'
    }
  ],
  schedule: [
    { id: 'sch-1', day: 'Wtorek', title: 'Zajęcia Rytmiczno-Muzyczne', time: '10:00 - 10:45', location: 'Sala gimnastyczna', notes: 'Wygodne spodenki' },
    { id: 'sch-2', day: 'Środa', title: 'Warsztaty Małego Odkrywcy / Plastyka', time: '11:00 - 11:45', location: 'Przedszkole', notes: 'Fartuszek malarski w szafce' },
    { id: 'sch-3', day: 'Czwartek', title: 'Język Angielski przez zabawę', time: '09:30 - 10:00', location: 'Grupa Wiewiórki', notes: 'Piosenki o zwierzątkach' },
    { id: 'sch-4', day: 'Piątek', title: 'Dzień zabawek & Gimnastyka korekcyjna', time: '10:30 - 11:15', location: 'Przedszkole', notes: 'Można przynieść 1 małą zabawkę z domu' }
  ],
  milestones: [
    {
      id: 'm-1',
      date: '2026-08-15',
      title: 'Pierwsza samodzielna jazda na rowerku biegowym bez asekuracji',
      quoteOrStory: 'Tymek powiedział: "Mamo patrz, lecę jak samolot, Aria mnie nie dogoni!"',
      age: '3 lata i 6 miesięcy'
    },
    {
      id: 'm-2',
      date: '2026-07-28',
      title: 'Genialna logika o chmurach',
      quoteOrStory: '"Tato, deszcz pada, bo chmurki biorą prysznic, żeby być czyste na jutro!"',
      age: '3 lata i 5 miesięcy'
    }
  ]
};

// 1. Entertainment & Movies
export const INITIAL_ENTERTAINMENT: EntertainmentItem[] = [
  {
    id: 'ent-1',
    title: 'W głowie się nie mieści 2 (Inside Out 2)',
    type: 'movie',
    status: 'watched',
    rating: 5,
    platform: 'Disney+',
    notes: 'Tymek oglądał jak zaczarowany, a my popłakaliśmy się ze śmiechu i wzruszenia.',
    addedBy: 'mama',
    genre: 'Animacja / Familijny'
  },
  {
    id: 'ent-2',
    title: 'The Bear (Sezon 3)',
    type: 'series',
    status: 'watching',
    rating: 5,
    platform: 'Disney+',
    notes: 'Oglądamy wieczorami we dwoje po uśpieniu Tymka! Świetny klimat.',
    addedBy: 'tata',
    genre: 'Dramat / Kulinarny'
  },
  {
    id: 'ent-3',
    title: 'Diuna: Część Druga',
    type: 'movie',
    status: 'watchlist',
    platform: 'HBO Max',
    notes: 'Zrobić popcorn i obejrzeć na rzutniku w sobotni wieczór!',
    addedBy: 'tata',
    genre: 'Sci-Fi / Przygodowy'
  },
  {
    id: 'ent-4',
    title: 'Planeta Ziemia III',
    type: 'documentary',
    status: 'watchlist',
    platform: 'BBC iPlayer / Netflix',
    notes: 'Odcinek o oceanach idealny do obejrzenia z Tymkiem w niedzielę.',
    addedBy: 'mama',
    genre: 'Przyrodniczy'
  }
];

export const INITIAL_BUCKET_LIST: DateBucketItem[] = [
  {
    id: 'b-1',
    title: 'Randka z kolacją włoską tylko we dwoje (Osteria)',
    description: 'Dziadkowie zostają z Tymkiem i Arią na 4 godziny – my idziemy na świeżą pastę i tiramisu!',
    category: 'romantic',
    done: false,
    suggestedBy: 'mama',
    locationOrBudget: 'Osteria del Sole, ~250 zł'
  },
  {
    id: 'b-2',
    title: 'Wyprawa na kajaki z Tymkiem i piknik z Arią nad rzeką',
    description: 'Wynajęcie stabilnego kajaku 3-osobowego i kamizelki ratunkowej dla Tymka i Arii.',
    category: 'outdoor',
    done: true,
    doneDate: '2026-07-20',
    suggestedBy: 'tata',
    locationOrBudget: 'Dolina rzeki Świder'
  },
  {
    id: 'b-3',
    title: 'Weekend w domku w lesie z balią termalną pod gwiazdami',
    description: 'Spokojny wyjazd rodzinny w góry na 3 dni jesienią.',
    category: 'travel',
    done: false,
    suggestedBy: 'tata',
    locationOrBudget: 'Bieszczady lub Beskidy'
  }
];

// 2. Savings & Goals
export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'sg-1',
    title: 'Wakacje w Słonecznej Hiszpanii (Alicante)',
    targetAmount: 12000,
    currentAmount: 8400,
    currency: 'zł',
    category: 'wakacje',
    deadline: '2027-06-01',
    icon: '🌴',
    contributions: [
      { id: 'c-1', memberId: 'mama', amount: 1500, date: '2026-08-01', note: 'Z premii lipcowej' },
      { id: 'c-2', memberId: 'tata', amount: 1500, date: '2026-08-01', note: 'Wpłata comiesięczna' },
      { id: 'c-3', memberId: 'mama', amount: 1000, date: '2026-07-01' }
    ]
  },
  {
    id: 'sg-2',
    title: 'Nowy rowerek i fotelik rowerowy dla Tymka',
    targetAmount: 1600,
    currentAmount: 1250,
    currency: 'zł',
    category: 'dziecko',
    deadline: '2026-09-15',
    icon: '🚲',
    contributions: [
      { id: 'c-4', memberId: 'tata', amount: 650, date: '2026-08-10', note: 'Sprzedaż starego wózka na Vinted' },
      { id: 'c-5', memberId: 'mama', amount: 600, date: '2026-07-15' }
    ]
  },
  {
    id: 'sg-3',
    title: 'Poduszka Bezpieczeństwa (Emergency Fund)',
    targetAmount: 25000,
    currentAmount: 19500,
    currency: 'zł',
    category: 'fundusz_awaryjny',
    icon: '🛡️',
    contributions: [
      { id: 'c-6', memberId: 'tata', amount: 1000, date: '2026-08-01' }
    ]
  }
];

// 3. Virtual Fridge Sticky Notes
export const INITIAL_STICKY_NOTES: StickyNote[] = [
  {
    id: 'sn-1',
    content: '🔑 Kod do furtki kurierskiej: 4821# (zostawiać paczki pod zadaszeniem tarasu)',
    authorId: 'tata',
    date: todayStr,
    color: 'yellow',
    pinned: true,
    tag: 'Ważne dla domu'
  },
  {
    id: 'sn-2',
    content: '❤️ Kocham Was najmocniej! Dobrego dnia w pracy i przedszkolu. Wieczorem robię naleśniki z musem jabłkowym!',
    authorId: 'mama',
    date: todayStr,
    color: 'pink',
    pinned: true,
    tag: 'Miły liścik'
  },
  {
    id: 'sn-3',
    content: '🚗 Auto zatankowane do pełna i umyte. Fotelik Tymka sprawdzony.',
    authorId: 'tata',
    date: '2026-08-18',
    color: 'blue',
    pinned: false,
    tag: 'Auto'
  },
  {
    id: 'sn-4',
    content: '🌿 Podlać monstery i storczyki na piętrze w czwartek wieczorem!',
    authorId: 'mama',
    date: '2026-08-17',
    color: 'green',
    pinned: false,
    tag: 'Roślinki'
  }
];

// 4. Study & Apprenticeship
export const INITIAL_STUDY_ITEMS: StudyItem[] = [
  {
    id: 'si-1',
    person: 'aleksandra',
    title: 'Portfolio Projektowe: Moduł Zarządzania & Analizy Danych',
    courseOrModule: 'Digital Business Apprenticeship (Level 6)',
    type: 'portfolio',
    deadline: '2026-09-12',
    status: 'in_progress',
    notes: 'Opisać studium przypadku wdrożenia procesu CRM oraz metryki KPI.',
    links: [
      { label: 'Portal Uczelniany / OneFile', url: 'https://onefile.co.uk' },
      { label: 'Wytyczne do modułu (PDF)', url: '#' }
    ]
  },
  {
    id: 'si-2',
    person: 'aleksandra',
    title: 'Esej Refleksyjny: Leadership & Stakeholder Management',
    courseOrModule: 'Apprenticeship Leadership Module',
    type: 'essay',
    deadline: '2026-08-30',
    status: 'in_progress',
    notes: '2500 słów. Gotowe 1400 słów. Dokończyć sekcję o komunikacji kryzysowej.'
  },
  {
    id: 'si-3',
    person: 'kuba',
    title: 'Projekt Końcowy: Architektura Systemów Rozproszonych',
    courseOrModule: 'Informatyka Stosowana (Studia Magisterskie)',
    type: 'project',
    deadline: '2026-09-20',
    status: 'in_progress',
    notes: 'Implementacja backendu w Go i kolejkowania RabbitMQ.',
    links: [
      { label: 'Moodle Uczelni', url: '#' },
      { label: 'Repozytorium GitHub projektu', url: '#' }
    ]
  },
  {
    id: 'si-4',
    person: 'kuba',
    title: 'Egzamin: Bezpieczeństwo Sieci i Kryptografia',
    courseOrModule: 'Bezpieczeństwo IT',
    type: 'exam',
    deadline: '2026-09-05',
    status: 'not_started',
    notes: 'Przerobić zestawy zadań z poprzednich 3 lat i protokoły TLS 1.3.'
  }
];

export const INITIAL_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'fs-1',
    person: 'aleksandra',
    title: 'Pisanie Eseju do Apprenticeship (2500 słów)',
    startTime: '18:00',
    endTime: '20:00',
    date: todayStr,
    active: false,
    note: 'Kuba bawi się z Tymkiem i wyprowadza Arię 🤫'
  }
];

// 5. UK Bin Day Tracker Configuration
export const INITIAL_BIN_CONFIG: BinConfig = {
  regularDayOfWeek: 1, // Poniedziałek
  currentCycle: 'weekA',
  weekABins: ['Black Bin (Odpady zmieszane / General Waste)', 'Food Waste Caddy (Zielony koszyk na bio)'],
  weekBBins: ['Green Bin (Recykling: plastik, papier, puszki)', 'Blue Bin (Szkło)', 'Brown Bin (Odpady ogrodowe)'],
  reminderTime: 'Niedziela 20:00'
};

export const INITIAL_BIN_SCHEDULE: BinScheduleItem[] = [
  {
    id: 'bin-1',
    name: 'Black Bin (General Waste) & Food Caddy',
    colorCode: 'black',
    description: 'Odpady zmieszane, niepodlegające recyklingowi oraz resztki jedzenia.',
    collectionDayOfWeek: 1,
    nextCollectionDate: '2026-08-24', // Najbliższy poniedziałek
    isNext: true
  },
  {
    id: 'bin-2',
    name: 'Green & Blue Bin (Recykling & Szkło)',
    colorCode: 'green',
    description: 'Papier, tektura, butelki plastikowe, puszki aluminiowe oraz szkło.',
    collectionDayOfWeek: 1,
    nextCollectionDate: '2026-08-31', // Kolejny poniedziałek
    isNext: false
  }
];

// 6. Fitness & Workouts
export const INITIAL_WORKOUTS: WorkoutEntry[] = [
  {
    id: 'w-1',
    person: 'aleksandra',
    date: todayStr,
    type: 'pilates',
    title: 'Poranny Pilates & Stretching z gumami oporowymi',
    durationMinutes: 35,
    details: 'Wzmocnienie mięśni głębokich core, pośladków i rozciąganie kręgosłupa.',
    calories: 190,
    mood: 'swietnie'
  },
  {
    id: 'w-2',
    person: 'aleksandra',
    date: '2026-08-17',
    type: 'spacer_z_aria',
    title: 'Szybki marszobieg z Arią po lesie',
    durationMinutes: 50,
    distanceKm: 4.8,
    details: 'Aria w szelkach canicrossowych, świetne tempo!',
    calories: 280,
    mood: 'dobrze'
  },
  {
    id: 'w-3',
    person: 'kuba',
    date: todayStr,
    type: 'silownia',
    title: 'Trening Siłowy: Góra Ciała (Push / Klatka & Barki)',
    durationMinutes: 55,
    details: 'Wyciskanie sztangi leżąc 4x8 (85kg), żołnierskie 3x10 (50kg), pompki na poręczach 3x12.',
    calories: 420,
    mood: 'swietnie'
  },
  {
    id: 'w-4',
    person: 'kuba',
    date: '2026-08-16',
    type: 'bieganie',
    title: 'Bieg regeneracyjny w strefie tętna Z2',
    durationMinutes: 45,
    distanceKm: 7.2,
    details: 'Średnie tempo 5:35 min/km, równe tętno 142 bpm.',
    calories: 510,
    mood: 'dobrze'
  }
];

// 7. Quick Family Status Dashboard
export const INITIAL_QUICK_FAMILY_STATUS: QuickFamilyStatus = {
  lastDogWalk: { time: '13:15', by: 'tata', notes: 'Spokojny spacer 25 min' },
  childInKindergarten: { inKindergarten: true, updatedBy: 'tata', time: '08:00' },
  focusMode: { active: false },
  homeStatus: { aleksandraHome: false, kubaHome: true },
  memberMoods: {
    mama: { mood: '🥰', energy: 85, label: 'Świetny humor & motywacja', updatedTime: '10:30', note: 'Esej do przodu i pyszna kawa!' },
    tata: { mood: '☕', energy: 75, label: 'W trybie skupienia (Work)', updatedTime: '11:15', note: 'Dużo kodu dzisiaj' }
  }
};

export const INITIAL_QUICK_STATUS = INITIAL_QUICK_FAMILY_STATUS;

// 8. Love Nudge Templates
export const INITIAL_LOVE_NUDGE_TEMPLATES: LoveNudgeTemplate[] = [
  // Flirt & Zabawa 😈
  { id: 'n-flirt-1', category: 'flirt', text: 'Szykuj się na wieczór w sypialni...', emoji: '🛏️' },
  { id: 'n-flirt-2', category: 'flirt', text: 'Lody / coś słodkiego tylko we dwoje?', emoji: '🍦' },
  { id: 'n-flirt-3', category: 'flirt', text: 'Wymknijmy się na chwilę...', emoji: '🔞' },
  { id: 'n-flirt-4', category: 'flirt', text: 'Wieczór z lampką wina po uśpieniu Tymka?', emoji: '🍷' },
  { id: 'n-flirt-5', category: 'flirt', text: 'Należy mi się dziś masaż pleców!', emoji: '💆‍♀️' },
  { id: 'n-flirt-6', category: 'flirt', text: 'Szybki flirt w kuchni? 🤫', emoji: '💋' },

  // Słodkie 🥰
  { id: 'n-sweet-1', category: 'sweet', text: 'Wysyłam milion buziaków!', emoji: '💋' },
  { id: 'n-sweet-2', category: 'sweet', text: 'Tęsknię za Tobą... Przytul mocno!', emoji: '🫂' },
  { id: 'n-sweet-3', category: 'sweet', text: 'Pamiętaj, że bardzo Cię kocham!', emoji: '❤️' },
  { id: 'n-sweet-4', category: 'sweet', text: 'Daj mi trochę uwagi...', emoji: '🥺' },
  { id: 'n-sweet-5', category: 'sweet', text: 'Właśnie pomyślałam/em o Tobie i się uśmiecham!', emoji: '🥰' },

  // Dom & Jedzenie ☕
  { id: 'n-food-1', category: 'home_food', text: 'Zrobisz mi pyszną kawkę / herbatkę?', emoji: '☕' },
  { id: 'n-food-2', category: 'home_food', text: 'Przyniesiesz mi szklankę zimnej wody?', emoji: '🥤' },
  { id: 'n-food-3', category: 'home_food', text: 'Zamawiamy dziś coś pysznego na obiad?', emoji: '🍕' },
  { id: 'n-food-4', category: 'home_food', text: 'Masz ochotę na małe co nieco / słodkie?', emoji: '🍪' },

  // Pies Aria & Dziecko 🐕
  { id: 'n-pet-1', category: 'pet_child', text: 'Twoja kolej na spacer z Arią!', emoji: '🐕' },
  { id: 'n-pet-2', category: 'pet_child', text: 'Aria prosi o smaczka i drapanie za uszkiem!', emoji: '🦴' },
  { id: 'n-pet-3', category: 'pet_child', text: 'Przejmiesz na chwilę Tymka?', emoji: '👶' },
  { id: 'n-pet-4', category: 'pet_child', text: 'Rzeczy i bidon do przedszkola spakowane?', emoji: '🎒' },

  // Nauka & Trening 🧠
  { id: 'n-study-1', category: 'study_fitness', text: 'Pamiętaj o dzisiejszym eseju / nauce!', emoji: '🧠' },
  { id: 'n-study-2', category: 'study_fitness', text: 'Robisz sobie małą przerwę na rozciąganie?', emoji: '⏱️' },
  { id: 'n-study-3', category: 'study_fitness', text: 'Idziemy dziś razem na trening / spacer?', emoji: '💪' },
  { id: 'n-study-4', category: 'study_fitness', text: 'Nawodnij się! Wypij szklankę wody 💧', emoji: '💧' },

  // Zaczepne 😜
  { id: 'n-play-1', category: 'playful', text: 'Skończ już ten telefon i spójrz na mnie 😜', emoji: '📱' },
  { id: 'n-play-2', category: 'playful', text: 'Kto dzisiaj wynosi kosz na podjazd? 🧹', emoji: '🗑️' },
  { id: 'n-play-3', category: 'playful', text: 'Rezerwuję najlepsze miejsce na kanapie!', emoji: '🛋️' },
  { id: 'n-play-4', category: 'playful', text: 'Ty dziś wybierasz film na wieczór! 🎬', emoji: '🍿' }
];

export const INITIAL_SENT_NUDGES: SentNudge[] = [
  {
    id: 'sn-1',
    from: 'mama',
    to: 'tata',
    category: 'flirt',
    text: 'Wieczór z lampką wina po uśpieniu Tymka?',
    emoji: '🍷',
    timestamp: 'Dzisiaj, 10:45',
    reaction: '🔥 Zgoda!'
  },
  {
    id: 'sn-2',
    from: 'tata',
    to: 'mama',
    category: 'home_food',
    text: 'Zrobisz mi pyszną kawkę?',
    emoji: '☕',
    timestamp: 'Dzisiaj, 09:15',
    reaction: '❤️ Już niosę'
  },
  {
    id: 'sn-3',
    from: 'mama',
    to: 'tata',
    category: 'sweet',
    text: 'Pamiętaj, że bardzo Cię kocham!',
    emoji: '❤️',
    timestamp: 'Wczoraj, 14:20',
    reaction: '🥰'
  }
];

export const INITIAL_WHITE_FLAG_OFFERS: WhiteFlagOffer[] = [
  {
    id: 'wf-1',
    from: 'tata',
    to: 'mama',
    message: 'Przepraszam za małe marudzenie rano! Kocham Cię najmocniej.',
    peaceOffer: 'Robię Twoją ulubioną kawę ze spienionym mlekiem i wieczorny masaż stóp ☕💆‍♀️',
    timestamp: 'Wczoraj 18:30',
    accepted: true
  }
];

export const INITIAL_COUPLE_MILESTONES: CoupleMilestone[] = [
  {
    id: 'cm-1',
    title: 'Rocznica Ślubu / Bycia Razem',
    date: '2026-09-18',
    daysRemaining: 30,
    type: 'anniversary',
    icon: '💍'
  },
  {
    id: 'cm-2',
    title: 'Urodziny Oli (Mamy)',
    date: '2026-10-05',
    daysRemaining: 47,
    type: 'birthday',
    icon: '🎂'
  },
  {
    id: 'cm-3',
    title: 'Urodziny Kuby (Taty)',
    date: '2026-11-12',
    daysRemaining: 85,
    type: 'birthday',
    icon: '🎁'
  },
  {
    id: 'cm-4',
    title: '4. Urodziny Tymka 🎈',
    date: '2027-03-14',
    daysRemaining: 207,
    type: 'birthday',
    icon: '🧸'
  }
];

// 9. UK Logistics & Home Data
export const INITIAL_UK_CAR: UKCarInfo = {
  regNumber: 'GK21 XYZ',
  makeModel: 'Nissan Qashqai 1.3 DIG-T (Szary Metalik)',
  motDueDate: '2027-03-20',
  roadTaxDueDate: '2027-04-01',
  insuranceDueDate: '2026-10-15',
  insuranceProvider: 'Admiral Multi-Car (Polisa #ADM-99482)',
  breakdownCover: 'AA Roadside Assistance & Home Start',
  mileage: '28,450 miles',
  notes: 'Opony całoroczne Michelin CrossClimate2, fotelik Cybex wpięty na Isofix z tyłu po prawej.'
};

export const INITIAL_UK_DELIVERIES: UKDeliveryItem[] = [
  {
    id: 'del-1',
    courier: 'Amazon',
    trackingNumber: 'AMZ-UK-8841920',
    description: 'Klocki sensoryczne dla Tymka & Filtry do dzbanka Brita',
    recipient: 'mama',
    status: 'in_transit',
    expectedDate: todayStr,
    safePlaceNote: 'Zostawić w skrzyni ogrodowej na tarasie za domem (Safe Place: Garden Box)'
  },
  {
    id: 'del-2',
    courier: 'Royal Mail',
    trackingNumber: 'RM48-992104GB',
    description: 'Nowe podręczniki do modułu Apprenticeship (Level 6)',
    recipient: 'mama',
    status: 'in_transit',
    expectedDate: '2026-08-21',
    safePlaceNote: 'Wrzut do skrzynki na listy lub u sąsiada pod nr 12'
  },
  {
    id: 'del-3',
    courier: 'Evri',
    description: 'Karma i gryzaki dla Arii (Zooplus UK)',
    recipient: 'tata',
    status: 'delivered',
    expectedDate: '2026-08-18',
    safePlaceNote: 'Pod zadaszeniem ganku'
  }
];

export const INITIAL_UK_BILLS: UKBillItem[] = [
  {
    id: 'ub-1',
    title: 'Tax-Free Childcare (Gov.uk Reconfirmation)',
    provider: 'Childcare Service GOV.UK',
    amount: 'Oszczędność do £500 / kwartał',
    category: 'tax_free_childcare',
    nextDueDate: '2026-09-14',
    frequency: 'co 3 miesiące (Tax-Free)',
    autoPay: false,
    notes: 'Wymaga zalogowania do konta Government Gateway i potwierdzenia dochodów!'
  },
  {
    id: 'ub-2',
    title: 'Council Tax (Band D)',
    provider: 'Local Borough Council',
    amount: '£184.00',
    category: 'council_tax',
    nextDueDate: '2026-09-01',
    frequency: 'miesięcznie',
    autoPay: true,
    notes: 'Direct Debit pobierany 1-go każdego miesiąca'
  },
  {
    id: 'ub-3',
    title: 'Energy & Gas (Dual Fuel)',
    provider: 'Octopus Energy (Tracker)',
    amount: '~£135.00',
    category: 'energy',
    nextDueDate: '2026-08-28',
    frequency: 'miesięcznie',
    autoPay: true
  },
  {
    id: 'ub-4',
    title: 'Water & Waste',
    provider: 'Thames Water',
    amount: '£38.50',
    category: 'water',
    nextDueDate: '2026-09-05',
    frequency: 'miesięcznie',
    autoPay: true
  },
  {
    id: 'ub-5',
    title: 'Fibre Broadband 500Mbps',
    provider: 'Virgin Media',
    amount: '£32.00',
    category: 'broadband',
    nextDueDate: '2026-08-25',
    frequency: 'miesięcznie',
    autoPay: true
  }
];

export const INITIAL_UK_LOYALTY_CARDS: UKLoyaltyCard[] = [
  {
    id: 'lc-1',
    name: 'Tesco Clubcard',
    cardNumber: '634004 8920 1148',
    category: 'Supermarket',
    color: 'from-blue-600 to-blue-800',
    barcodeType: 'qr'
  },
  {
    id: 'lc-2',
    name: 'Nectar (Sainsbury\'s / Argos)',
    cardNumber: '982630 0048 5912',
    category: 'Supermarket',
    color: 'from-purple-700 to-indigo-800',
    barcodeType: 'qr'
  },
  {
    id: 'lc-3',
    name: 'Boots Advantage Card',
    cardNumber: '708000 4819 2031',
    category: 'Apteka / Kosmetyki',
    color: 'from-sky-700 to-blue-900',
    barcodeType: 'code128'
  },
  {
    id: 'lc-4',
    name: 'Costa Coffee Club',
    cardNumber: 'COST-8849-2103',
    category: 'Kawiarnia',
    color: 'from-rose-800 to-red-950',
    barcodeType: 'qr'
  },
  {
    id: 'lc-5',
    name: 'M&S Sparks',
    cardNumber: '600782 1948 2011',
    category: 'Sklep & Piekarnia',
    color: 'from-emerald-800 to-stone-900',
    barcodeType: 'code128'
  }
];

export const INITIAL_HOME_ITEMS: HomeItemLocation[] = [
  {
    id: 'hi-1',
    name: 'Paszporty polskie i brytyjskie, Akty urodzenia',
    room: 'Sypialnia na piętrze',
    spot: 'Górna szuflada w komodzie dębowej, czarna teczka ognioodporna zamykana na zamek',
    category: 'Dokumenty UK',
    tags: ['Paszport', 'Dowód', 'Akt urodzenia', 'PESEL', 'Home Office']
  },
  {
    id: 'hi-2',
    name: 'Książeczka zdrowia i paszport Arii (Pet Passport & Vets)',
    room: 'Przedpokój / Wiatrołap',
    spot: 'Szafka na buty, wiszący organizer boczny w niebieskiej teczce',
    category: 'Dla Arii',
    tags: ['Aria', 'Weterynarz', 'Szczepienia', 'Cztery Łapy', 'Czip']
  },
  {
    id: 'hi-3',
    name: 'Domowa Apteczka & Inhalator Tymka (Nurofen, Paracetamol, Sól fizjologiczna)',
    room: 'Kuchnia',
    spot: 'Górna szafka nad ekspresem do kawy (wysoko, niedostępne dla dziecka)',
    category: 'Zdrowie i Apteczka',
    tags: ['Leki', 'Gorączka', 'Inhalator', 'Termometr', 'Plastry']
  },
  {
    id: 'hi-4',
    name: 'Zapasowe klucze do domu, kłódki do szopy i auta',
    room: 'Wiatrołap',
    spot: 'Skrzyneczka ścienna na klucze za drzwiami wejściowymi',
    category: 'Narzędzia',
    tags: ['Klucze', 'Szopa', 'Auto', 'Furtka']
  },
  {
    id: 'hi-5',
    name: 'Wkrętarka akumulatorowa, zestaw bitów i metrówka',
    room: 'Garaż / Schowek pod schodami',
    spot: 'Plastikowa zielona skrzynka narzędziowa Bosch na drugiej półce regału',
    category: 'Narzędzia',
    tags: ['Wkrętarka', 'Narzędzia', 'Śrubokręt', 'Baterie']
  },
  {
    id: 'hi-6',
    name: 'Zimowe kombinezony, buty śniegowe i czapki Tymka (rozmiar 98/104)',
    room: 'Garderoba / Strych',
    spot: 'Pudło próżniowe IKEA opisane "Tymek Zima 3-4 lata"',
    category: 'Ubranka Tymka',
    tags: ['Kombinezon', 'Zima', 'Czapki', 'Rękawiczki']
  },
  {
    id: 'hi-7',
    name: 'Zapasowe ładowarki USB-C, kable HDMI i baterie AA/AAA',
    room: 'Salon',
    spot: 'Szafka RTV pod telewizorem, środkowa szuflada w drewnianym pudełku',
    category: 'Elektronika',
    tags: ['Kable', 'Ładowarki', 'Baterie', 'Pilot']
  }
];

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  feed: true,
  nudges: true,
  uk_logistics: true,
  calendar: true,
  tasks: true,
  shopping: true,
  child: true,
  dog: true,
  cat: true,
  entertainment: true,
  education: true,
  fitness: true,
  fridge: true,
  savings: true,
  quickStatusBar: true
};


export const INITIAL_SECTION_VISIBILITY: SectionVisibility = {
  feed: true,
  nudges: true,
  uk_logistics: true,
  calendar: true,
  tasks: true,
  shopping: true,
  child: true,
  dog: true,
  cat: true,
  entertainment: true,
  education: true,
  fitness: true,
  fridge: true,
  savings: true,
  quickStatusBar: true
};

