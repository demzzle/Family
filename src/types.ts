export type MemberId = 'mama' | 'tata' | 'dziecko' | 'aria' | 'kot';

export interface FamilyMember {
  id: MemberId;
  name: string;
  role: string;
  avatar: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface PostComment {
  id: string;
  authorId: MemberId;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: MemberId;
  content: string;
  timestamp: string;
  formattedDate: string;
  mediaUrl?: string;
  mediaType?: 'image';
  likes: MemberId[];
  comments: PostComment[];
  mood?: string;
  tag?: string;
  pinned?: boolean;
}

export type EventCategory = 'work' | 'kindergarten' | 'aria' | 'cat' | 'family' | 'health' | 'home' | 'study' | 'bins';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: EventCategory;
  assignedTo: MemberId[];
  location?: string;
  note?: string;
  isEveningPlan?: boolean;
  reminder?: boolean;
  completed?: boolean;
}

export interface WorkShift {
  id: string;
  memberId: 'mama' | 'tata';
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  type: 'office' | 'home' | 'off';
  note?: string;
}

export interface KindergartenDuty {
  date: string; // YYYY-MM-DD
  dropOffBy: 'mama' | 'tata' | 'razem';
  dropOffTime: string;
  pickUpBy: 'mama' | 'tata' | 'dziadkowie';
  pickUpTime: string;
  specialNotes?: string;
}

export type TaskCategory = 'cleaning' | 'deadlines' | 'home' | 'kids' | 'pet' | 'bills' | 'bins';

export interface TaskItem {
  id: string;
  title: string;
  category: TaskCategory;
  assignedTo: MemberId;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  reminderSet?: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'Warzywa i Owoce' | 'Nabiał' | 'Pieczywo' | 'Dla Arii' | 'Dla Kota' | 'Dla Dziecka' | 'Chemia i Dom' | 'Przekąski i Inne';
  amount: string;
  checked: boolean;
  addedBy: MemberId;
  notes?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  rating: number; // 1 to 5
  tags: string[];
  ingredients: string[];
  steps: string[];
  imageUrl: string;
  lovedBy: MemberId[];
  difficulty: 'Łatwe' | 'Średnie' | 'Wykwintne';
}

export interface MealPlanDay {
  dayName: string;
  date: string;
  dishName: string;
  recipeId?: string;
  cook: MemberId;
  sideDish?: string;
}

export interface DogVaccination {
  id: string;
  name: string;
  date: string;
  nextDueDate: string;
  vetClinic: string;
  status: 'valid' | 'upcoming' | 'overdue';
}

export interface DogVetVisit {
  id: string;
  date: string;
  reason: string;
  clinic: string;
  doctor: string;
  notes: string;
  cost?: string;
}

export interface DogPreventionItem {
  id: string;
  title: string; // np. Tabletka Nexgard (kleszcze/pchły), Odrobaczanie
  lastGivenDate: string;
  nextDueDate: string;
  frequencyMonths: number;
  done: boolean;
}

export interface DogDailyStatus {
  date: string;
  morningWalk: { done: boolean; by?: MemberId; time?: string; notes?: string };
  afternoonWalk: { done: boolean; by?: MemberId; time?: string; notes?: string };
  eveningWalk: { done: boolean; by?: MemberId; time?: string; notes?: string };
  morningFood: { done: boolean; by?: MemberId; time?: string };
  eveningFood: { done: boolean; by?: MemberId; time?: string };
  waterChanged: { done: boolean; by?: MemberId };
  medsTaken: { done: boolean; by?: MemberId };
}

export interface DogProfile {
  name: string;
  breed: string;
  birthDate: string;
  weightKg: number;
  chipNumber: string;
  vetClinic: string;
  vetPhone: string;
  vetAddress: string;
  insuranceNumber: string;
  favoriteSnack: string;
  avatarUrl: string;
  vaccinations: DogVaccination[];
  vetVisits: DogVetVisit[];
  prevention: DogPreventionItem[];
  reminders: { id: string; text: string; date: string; done: boolean }[];
}

export interface CatVaccination {
  id: string;
  name: string;
  date: string;
  nextDueDate: string;
  vetClinic: string;
  status: 'valid' | 'upcoming' | 'overdue';
}

export interface CatVetVisit {
  id: string;
  date: string;
  reason: string;
  clinic: string;
  doctor: string;
  notes: string;
  cost?: string;
}

export interface CatPreventionItem {
  id: string;
  title: string; // np. Krople na kark Stronghold/Broadline (pchły, kleszcze, świerzb), Pasta odkłaczająca
  lastGivenDate: string;
  nextDueDate: string;
  frequencyMonths: number;
  done: boolean;
}

export interface CatDailyStatus {
  date: string;
  morningFood: { done: boolean; by?: MemberId; time?: string; notes?: string };
  eveningFood: { done: boolean; by?: MemberId; time?: string; notes?: string };
  waterChanged: { done: boolean; by?: MemberId };
  litterBoxCleaned: { done: boolean; by?: MemberId; time?: string; notes?: string };
  brushed: { done: boolean; by?: MemberId };
  played: { done: boolean; by?: MemberId; time?: string; notes?: string };
  medsTaken: { done: boolean; by?: MemberId };
}

export interface CatProfile {
  name: string;
  breed: string;
  birthDate: string;
  weightKg: number;
  chipNumber: string;
  vetClinic: string;
  vetPhone: string;
  vetAddress: string;
  insuranceNumber: string;
  favoriteSnack: string;
  favoriteToy: string;
  litterType: string;
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  avatarUrl: string;
  vaccinations: CatVaccination[];
  vetVisits: CatVetVisit[];
  prevention: CatPreventionItem[];
  reminders: { id: string; text: string; date: string; done: boolean }[];
}

export interface ChildPackingItem {
  id: string;
  item: string;
  checked: boolean;
  category: 'codziennie' | 'zapas' | 'specjalne' | 'do_dokupienia';
}

export interface ChildActivity {
  id: string;
  day: string;
  title: string;
  time: string;
  location: string;
  notes?: string;
}

export interface ChildMilestone {
  id: string;
  date: string;
  title: string;
  quoteOrStory: string;
  age: string;
}

export interface ChildMedicationLog {
  id: string;
  date: string;
  time: string;
  medName: string;
  dose: string;
  administeredBy: MemberId;
  reason: string;
  temperature?: string;
}

export interface ChildProfile {
  name: string;
  birthDate: string;
  currentHeightCm: number;
  currentWeightKg: number;
  clothesSize: string;
  shoeSize: string;
  hatSize: string;
  kindergartenName: string;
  groupName: string;
  teacherName: string;
  allergies: string[];
  favoriteMeals: string[];
  favoriteToys: string[];
  avatarUrl: string;
  packingList: ChildPackingItem[];
  schedule: ChildActivity[];
  milestones: ChildMilestone[];
  medicationLogs: ChildMedicationLog[];
}

// 1. Entertainment & Movies
export interface EntertainmentItem {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'documentary';
  status: 'watchlist' | 'watching' | 'watched';
  rating?: number; // 1-5
  platform?: string; // Netflix, Disney+, HBO Max, Apple TV+, Prime
  notes?: string;
  addedBy: MemberId;
  genre?: string;
  posterUrl?: string;
}

export interface DateBucketItem {
  id: string;
  title: string;
  description: string;
  category: 'romantic' | 'family' | 'outdoor' | 'travel' | 'home';
  done: boolean;
  doneDate?: string;
  suggestedBy: MemberId;
  locationOrBudget?: string;
}

// 2. Savings & Goals
export interface SavingsContribution {
  id: string;
  memberId: MemberId;
  amount: number;
  date: string;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: 'zł' | '£' | '€';
  category: 'wakacje' | 'dom' | 'dziecko' | 'pies' | 'fundusz_awaryjny' | 'inne';
  deadline?: string;
  icon: string;
  contributions: SavingsContribution[];
}

// 3. Virtual Fridge Sticky Notes
export type StickyNoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple';

export interface StickyNote {
  id: string;
  content: string;
  authorId: MemberId;
  date: string;
  color: StickyNoteColor;
  pinned: boolean;
  isUrgent?: boolean;
  tag?: string;
}

// 4. Education & Apprenticeship
export interface StudyItem {
  id: string;
  person: 'aleksandra' | 'kuba';
  title: string;
  courseOrModule: string;
  type: 'essay' | 'project' | 'exam' | 'assignment' | 'portfolio' | 'coursework';
  deadline: string; // YYYY-MM-DD
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  grade?: string;
  notes?: string;
  links?: { label: string; url: string }[];
}

export interface FocusSession {
  id: string;
  person: 'aleksandra' | 'kuba';
  title: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  date: string;
  active: boolean;
  note?: string;
}

// 5. UK Bin Day Tracker
export interface BinScheduleItem {
  id: string;
  name: string; // np. Black Bin (General Waste), Green Bin (Recycling), Blue/Brown Bin (Garden/Food)
  colorCode: 'black' | 'green' | 'blue' | 'brown';
  description: string;
  collectionDayOfWeek: number; // 1 = Monday
  nextCollectionDate: string; // YYYY-MM-DD
  isNext: boolean;
}

export interface BinConfig {
  regularDayOfWeek: number; // 1 = Monday
  currentCycle: 'weekA' | 'weekB';
  weekABins: string[]; // ['Black Bin (General Waste)', 'Food Caddy']
  weekBBins: string[]; // ['Green/Blue Bin (Recycling)', 'Garden Waste']
  reminderTime: string; // '20:00 Sunday'
}

// 6. Fitness & Workout Log
export interface WorkoutEntry {
  id: string;
  person: 'aleksandra' | 'kuba';
  date: string; // YYYY-MM-DD
  type: 'bieganie' | 'silownia' | 'pilates' | 'joga' | 'spacer_z_aria' | 'hiit' | 'rower' | 'inne';
  title: string;
  durationMinutes: number;
  details: string; // np. "4x10 przysiady, 3x12 martwy ciąg" lub "Tempo 5:40 min/km"
  distanceKm?: number;
  calories?: number;
  mood: 'swietnie' | 'dobrze' | 'zmeczenie' | 'ciezko';
}

// 7. Quick Status State for Header Dashboard
export interface QuickFamilyStatus {
  lastDogWalk: { time: string; by: MemberId; notes?: string };
  childInKindergarten: { inKindergarten: boolean; updatedBy: MemberId; time: string };
  focusMode: { active: boolean; person?: 'aleksandra' | 'kuba'; topic?: string; until?: string };
  homeStatus: { aleksandraHome: boolean; kubaHome: boolean };
  memberMoods: Record<'mama' | 'tata', { mood: string; energy: number; label: string; updatedTime: string; note?: string }>;
}

// 8. Love Nudges & Relationship System
export type NudgeCategory = 'flirt' | 'sweet' | 'home_food' | 'pet_child' | 'study_fitness' | 'playful';

export interface LoveNudgeTemplate {
  id: string;
  category: NudgeCategory;
  text: string;
  emoji: string;
  soundType?: 'chime' | 'kiss' | 'bell' | 'pop';
}

export interface SentNudge {
  id: string;
  from: MemberId;
  to: MemberId;
  category: NudgeCategory;
  text: string;
  emoji: string;
  timestamp: string; // ISO or formatted
  reaction?: string;
  resolved?: boolean;
}

export interface WhiteFlagOffer {
  id: string;
  from: MemberId;
  to: MemberId;
  message: string;
  peaceOffer: string; // np. "Robię herbatkę z miodem i przytulam", "Zamawiam ulubioną pizzę"
  timestamp: string;
  accepted: boolean;
}

export interface CoupleMilestone {
  id: string;
  title: string;
  date: string;
  daysRemaining: number;
  type: 'anniversary' | 'birthday' | 'trip';
  icon: string;
}

// 9. UK Logistics & Home Hub
export interface UKCarInfo {
  regNumber: string;
  makeModel: string;
  motDueDate: string;
  roadTaxDueDate: string;
  insuranceDueDate: string;
  insuranceProvider: string;
  breakdownCover: string;
  mileage: string;
  notes?: string;
}

export interface UKDeliveryItem {
  id: string;
  courier: 'Amazon' | 'Royal Mail' | 'Evri' | 'DPD' | 'DHL' | 'Inne';
  trackingNumber?: string;
  description: string;
  recipient: MemberId;
  status: 'in_transit' | 'delivered' | 'delayed';
  expectedDate: string;
  safePlaceNote: string;
}

export interface UKBillItem {
  id: string;
  title: string;
  provider: string;
  amount: string;
  category: 'tax_free_childcare' | 'council_tax' | 'energy' | 'water' | 'broadband' | 'tv_licence' | 'insurance' | 'inne';
  nextDueDate: string;
  frequency: 'co 3 miesiące (Tax-Free)' | 'miesięcznie' | 'rocznie';
  autoPay: boolean;
  notes?: string;
}

export interface UKLoyaltyCard {
  id: string;
  name: string;
  cardNumber: string;
  category: string;
  color: string;
  barcodeType: 'qr' | 'code128' | 'ean13';
}

export interface HomeItemLocation {
  id: string;
  name: string;
  room: string;
  spot: string;
  category: 'Dokumenty UK' | 'Zdrowie i Apteczka' | 'Elektronika' | 'Narzędzia' | 'Ubranka Tymka' | 'Dla Arii' | 'Dla Kota' | 'Pamiątki i Inne';
  tags: string[];
}

export interface SectionVisibility {
  feed: boolean;
  nudges: boolean;
  uk_logistics: boolean;
  calendar: boolean;
  tasks: boolean;
  shopping: boolean;
  child: boolean;
  dog: boolean;
  cat: boolean;
  entertainment: boolean;
  education: boolean;
  fitness: boolean;
  fridge: boolean;
  savings: boolean;
  quickStatusBar: boolean;
}

export type TabType = 
  | 'feed' 
  | 'nudges'
  | 'uk_logistics'
  | 'calendar' 
  | 'tasks' 
  | 'shopping' 
  | 'child' 
  | 'dog' 
  | 'cat'
  | 'entertainment' 
  | 'education' 
  | 'fitness' 
  | 'fridge' 
  | 'savings'
  | 'settings';
