/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { EyeOff, Settings as SettingsIcon } from 'lucide-react';
import { 
  MemberId, 
  TabType, 
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
  SavingsContribution,
  StickyNote,
  StudyItem,
  FocusSession,
  BinConfig,
  BinScheduleItem,
  WorkoutEntry,
  QuickFamilyStatus,
  SentNudge,
  WhiteFlagOffer,
  CoupleMilestone,
  UKCarInfo,
  UKDeliveryItem,
  UKBillItem,
  UKLoyaltyCard,
  HomeItemLocation,
  SectionVisibility,
  FamilyMember
} from './types';
import { 
  INITIAL_POSTS, 
  INITIAL_EVENTS, 
  INITIAL_WORK_SHIFTS, 
  INITIAL_KINDERGARTEN_DUTY, 
  INITIAL_TASKS, 
  INITIAL_SHOPPING, 
  INITIAL_RECIPES, 
  INITIAL_MEAL_PLAN, 
  INITIAL_DOG_PROFILE, 
  INITIAL_DOG_STATUS, 
  INITIAL_CAT_PROFILE,
  INITIAL_CAT_STATUS,
  INITIAL_CHILD_PROFILE,
  INITIAL_ENTERTAINMENT,
  INITIAL_BUCKET_LIST,
  INITIAL_SAVINGS_GOALS,
  INITIAL_STICKY_NOTES,
  INITIAL_STUDY_ITEMS,
  INITIAL_FOCUS_SESSIONS,
  INITIAL_BIN_CONFIG,
  INITIAL_BIN_SCHEDULE,
  INITIAL_WORKOUTS,
  INITIAL_QUICK_STATUS,
  INITIAL_SENT_NUDGES,
  INITIAL_WHITE_FLAG_OFFERS,
  INITIAL_COUPLE_MILESTONES,
  INITIAL_UK_CAR,
  INITIAL_UK_DELIVERIES,
  INITIAL_UK_BILLS,
  INITIAL_UK_LOYALTY_CARDS,
  INITIAL_HOME_ITEMS,
  INITIAL_SECTION_VISIBILITY,
  FAMILY_MEMBERS
} from './data/initialData';

import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { QuickStatusBar } from './components/QuickStatusBar';
import { FeedSection } from './components/FeedSection';
import { CalendarSection } from './components/CalendarSection';
import { TasksSection } from './components/TasksSection';
import { ShoppingRecipesSection } from './components/ShoppingRecipesSection';
import { DogSection } from './components/DogSection';
import { ChildSection } from './components/ChildSection';
import { EntertainmentSection } from './components/EntertainmentSection';
import { FridgeNotesSection } from './components/FridgeNotesSection';
import { SavingsSection } from './components/SavingsSection';
import { EducationSection } from './components/EducationSection';
import { FitnessSection } from './components/FitnessSection';
import { LoveNudgesSection } from './components/LoveNudgesSection';
import { UKLogisticsSection } from './components/UKLogisticsSection';
import { SettingsSection } from './components/SettingsSection';
import { NotificationsModal } from './components/NotificationsModal';
import { QuickAddFAB } from './components/QuickAddFAB';

export default function App() {
  // Navigation & Active Profile
  const [activeTab, setActiveTab] = useLocalStorage<TabType>('family_portal_tab', 'feed');
  const [activeMemberId, setActiveMemberId] = useLocalStorage<MemberId>('family_portal_active_member', 'mama');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Settings & Customization
  const [sectionVisibility, setSectionVisibility] = useLocalStorage<SectionVisibility>('family_portal_sections', INITIAL_SECTION_VISIBILITY);
  const [familyMembers, setFamilyMembers] = useLocalStorage<Record<string, FamilyMember>>('family_portal_members', FAMILY_MEMBERS);

  // Persistent Family Data
  const [posts, setPosts] = useLocalStorage<Post[]>('family_portal_posts', INITIAL_POSTS);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('family_portal_events', INITIAL_EVENTS);
  const [workShifts, setWorkShifts] = useLocalStorage<WorkShift[]>('family_portal_shifts', INITIAL_WORK_SHIFTS);
  const [kindergartenDuty, setKindergartenDuty] = useLocalStorage<KindergartenDuty>('family_portal_kg_duty', INITIAL_KINDERGARTEN_DUTY);
  const [tasks, setTasks] = useLocalStorage<TaskItem[]>('family_portal_tasks', INITIAL_TASKS);
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingItem[]>('family_portal_shopping', INITIAL_SHOPPING);
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('family_portal_recipes', INITIAL_RECIPES);
  const [mealPlan, setMealPlan] = useLocalStorage<MealPlanDay[]>('family_portal_meals', INITIAL_MEAL_PLAN);
  const [dogProfile, setDogProfile] = useLocalStorage<DogProfile>('family_portal_dog', INITIAL_DOG_PROFILE);
  const [dogStatus, setDogStatus] = useLocalStorage<DogDailyStatus>('family_portal_dog_status', INITIAL_DOG_STATUS);
  const [childProfile, setChildProfile] = useLocalStorage<ChildProfile>('family_portal_child', INITIAL_CHILD_PROFILE);

  // Extended Persistent Data
  const [entertainment, setEntertainment] = useLocalStorage<EntertainmentItem[]>('family_portal_entertainment', INITIAL_ENTERTAINMENT);
  const [bucketList, setBucketList] = useLocalStorage<DateBucketItem[]>('family_portal_bucket', INITIAL_BUCKET_LIST);
  const [savingsGoals, setSavingsGoals] = useLocalStorage<SavingsGoal[]>('family_portal_savings', INITIAL_SAVINGS_GOALS);
  const [stickyNotes, setStickyNotes] = useLocalStorage<StickyNote[]>('family_portal_fridge', INITIAL_STICKY_NOTES);
  const [studyItems, setStudyItems] = useLocalStorage<StudyItem[]>('family_portal_study', INITIAL_STUDY_ITEMS);
  const [focusSessions, setFocusSessions] = useLocalStorage<FocusSession[]>('family_portal_focus', INITIAL_FOCUS_SESSIONS);
  const [binConfig, setBinConfig] = useLocalStorage<BinConfig>('family_portal_bin_config', INITIAL_BIN_CONFIG);
  const [binSchedule, setBinSchedule] = useLocalStorage<BinScheduleItem[]>('family_portal_bin_schedule', INITIAL_BIN_SCHEDULE);
  const [workouts, setWorkouts] = useLocalStorage<WorkoutEntry[]>('family_portal_workouts', INITIAL_WORKOUTS);
  const [quickStatus, setQuickStatus] = useLocalStorage<QuickFamilyStatus>('family_portal_quick_status', INITIAL_QUICK_STATUS);

  // Relationship & Love Nudges
  const [sentNudges, setSentNudges] = useLocalStorage<SentNudge[]>('family_portal_nudges', INITIAL_SENT_NUDGES);
  const [whiteFlagOffers, setWhiteFlagOffers] = useLocalStorage<WhiteFlagOffer[]>('family_portal_white_flags', INITIAL_WHITE_FLAG_OFFERS);
  const [coupleMilestones, setCoupleMilestones] = useLocalStorage<CoupleMilestone[]>('family_portal_milestones', INITIAL_COUPLE_MILESTONES);

  // UK Logistics & Home Items
  const [ukCar, setUkCar] = useLocalStorage<UKCarInfo>('family_portal_uk_car', INITIAL_UK_CAR);
  const [ukDeliveries, setUkDeliveries] = useLocalStorage<UKDeliveryItem[]>('family_portal_uk_deliveries', INITIAL_UK_DELIVERIES);
  const [ukBills, setUkBills] = useLocalStorage<UKBillItem[]>('family_portal_uk_bills', INITIAL_UK_BILLS);
  const [ukLoyaltyCards, setUkLoyaltyCards] = useLocalStorage<UKLoyaltyCard[]>('family_portal_loyalty', INITIAL_UK_LOYALTY_CARDS);
  const [homeItems, setHomeItems] = useLocalStorage<HomeItemLocation[]>('family_portal_home_items', INITIAL_HOME_ITEMS);

  // Clear demo data (Start Clean / Fresh)
  const handleClearAllSampleData = () => {
    setPosts([]);
    setEvents([]);
    setTasks([]);
    setShoppingList([]);
    setRecipes([]);
    setEntertainment([]);
    setBucketList([]);
    setSavingsGoals([]);
    setStickyNotes([]);
    setStudyItems([]);
    setFocusSessions([]);
    setWorkouts([]);
    setSentNudges([]);
    setWhiteFlagOffers([]);
    setUkDeliveries([]);
    setUkBills([]);
    setHomeItems([]);
  };

  // Reset to Factory Defaults
  const handleResetData = () => {
    setSectionVisibility(INITIAL_SECTION_VISIBILITY);
    setFamilyMembers(FAMILY_MEMBERS);
    setPosts(INITIAL_POSTS);
    setEvents(INITIAL_EVENTS);
    setWorkShifts(INITIAL_WORK_SHIFTS);
    setKindergartenDuty(INITIAL_KINDERGARTEN_DUTY);
    setTasks(INITIAL_TASKS);
    setShoppingList(INITIAL_SHOPPING);
    setRecipes(INITIAL_RECIPES);
    setMealPlan(INITIAL_MEAL_PLAN);
    setDogProfile(INITIAL_DOG_PROFILE);
    setDogStatus(INITIAL_DOG_STATUS);
    setChildProfile(INITIAL_CHILD_PROFILE);
    setEntertainment(INITIAL_ENTERTAINMENT);
    setBucketList(INITIAL_BUCKET_LIST);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setStickyNotes(INITIAL_STICKY_NOTES);
    setStudyItems(INITIAL_STUDY_ITEMS);
    setFocusSessions(INITIAL_FOCUS_SESSIONS);
    setBinConfig(INITIAL_BIN_CONFIG);
    setBinSchedule(INITIAL_BIN_SCHEDULE);
    setWorkouts(INITIAL_WORKOUTS);
    setQuickStatus(INITIAL_QUICK_STATUS);
    setSentNudges(INITIAL_SENT_NUDGES);
    setWhiteFlagOffers(INITIAL_WHITE_FLAG_OFFERS);
    setCoupleMilestones(INITIAL_COUPLE_MILESTONES);
    setUkCar(INITIAL_UK_CAR);
    setUkDeliveries(INITIAL_UK_DELIVERIES);
    setUkBills(INITIAL_UK_BILLS);
    setUkLoyaltyCards(INITIAL_UK_LOYALTY_CARDS);
    setHomeItems(INITIAL_HOME_ITEMS);
  };

  // Export JSON backup
  const handleExportData = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      sectionVisibility,
      familyMembers,
      posts,
      events,
      workShifts,
      kindergartenDuty,
      tasks,
      shoppingList,
      recipes,
      mealPlan,
      dogProfile,
      dogStatus,
      childProfile,
      entertainment,
      bucketList,
      savingsGoals,
      stickyNotes,
      studyItems,
      focusSessions,
      binConfig,
      binSchedule,
      workouts,
      quickStatus,
      sentNudges,
      whiteFlagOffers,
      coupleMilestones,
      ukCar,
      ukDeliveries,
      ukBills,
      ukLoyaltyCards,
      homeItems
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rodzina-portal-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.sectionVisibility) setSectionVisibility(data.sectionVisibility);
      if (data.familyMembers) setFamilyMembers(data.familyMembers);
      if (data.posts) setPosts(data.posts);
      if (data.events) setEvents(data.events);
      if (data.workShifts) setWorkShifts(data.workShifts);
      if (data.kindergartenDuty) setKindergartenDuty(data.kindergartenDuty);
      if (data.tasks) setTasks(data.tasks);
      if (data.shoppingList) setShoppingList(data.shoppingList);
      if (data.recipes) setRecipes(data.recipes);
      if (data.mealPlan) setMealPlan(data.mealPlan);
      if (data.dogProfile) setDogProfile(data.dogProfile);
      if (data.dogStatus) setDogStatus(data.dogStatus);
      if (data.childProfile) setChildProfile(data.childProfile);
      if (data.entertainment) setEntertainment(data.entertainment);
      if (data.bucketList) setBucketList(data.bucketList);
      if (data.savingsGoals) setSavingsGoals(data.savingsGoals);
      if (data.stickyNotes) setStickyNotes(data.stickyNotes);
      if (data.studyItems) setStudyItems(data.studyItems);
      if (data.focusSessions) setFocusSessions(data.focusSessions);
      if (data.binConfig) setBinConfig(data.binConfig);
      if (data.binSchedule) setBinSchedule(data.binSchedule);
      if (data.workouts) setWorkouts(data.workouts);
      if (data.quickStatus) setQuickStatus(data.quickStatus);
      if (data.sentNudges) setSentNudges(data.sentNudges);
      if (data.whiteFlagOffers) setWhiteFlagOffers(data.whiteFlagOffers);
      if (data.coupleMilestones) setCoupleMilestones(data.coupleMilestones);
      if (data.ukCar) setUkCar(data.ukCar);
      if (data.ukDeliveries) setUkDeliveries(data.ukDeliveries);
      if (data.ukBills) setUkBills(data.ukBills);
      if (data.ukLoyaltyCards) setUkLoyaltyCards(data.ukLoyaltyCards);
      if (data.homeItems) setHomeItems(data.homeItems);
      alert('Pomyślnie zaimportowano wszystkie dane z pliku kopii zapasowej!');
    } catch (err) {
      alert('Błąd podczas odczytu pliku JSON. Upewnij się, że plik jest poprawny.');
    }
  };

  const handleUpdateFamilyMember = (member: FamilyMember) => {
    setFamilyMembers({
      ...familyMembers,
      [member.id]: member
    });
  };

  // Quick Dog Walk Action from top bar
  const handleQuickWalkAction = () => {
    const now = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    setQuickStatus({
      ...quickStatus,
      lastDogWalk: {
        time: now,
        by: activeMemberId
      }
    });

    if (!dogStatus.morningWalk.done) {
      setDogStatus({
        ...dogStatus,
        morningWalk: { done: true, time: now, by: activeMemberId }
      });
    } else if (!dogStatus.afternoonWalk.done) {
      setDogStatus({
        ...dogStatus,
        afternoonWalk: { done: true, time: now, by: activeMemberId }
      });
    } else {
      setDogStatus({
        ...dogStatus,
        eveningWalk: { done: true, time: now, by: activeMemberId }
      });
    }
  };

  // POSTS HANDLERS
  const handleAddPost = (newPost: Omit<Post, 'id' | 'timestamp' | 'formattedDate' | 'likes' | 'comments'>) => {
    const post: Post = {
      ...newPost,
      id: `p-${Date.now()}`,
      timestamp: new Date().toISOString(),
      formattedDate: 'Dzisiaj, ' + new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      likes: [],
      comments: []
    };
    setPosts([post, ...posts]);
  };

  const handleEditPost = (postId: string, updated: Partial<Post>) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, ...updated } : p)));
  };

  const handleToggleLike = (postId: string, memberId: MemberId) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const hasLiked = p.likes.includes(memberId);
          return {
            ...p,
            likes: hasLiked ? p.likes.filter((id) => id !== memberId) : [...p.likes, memberId]
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string, authorId: MemberId) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            authorId,
            text,
            timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
          };
          return {
            ...p,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      })
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handleTogglePin = (postId: string) => {
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, pinned: !p.pinned } : p))
    );
  };

  // CALENDAR HANDLERS
  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: `ev-${Date.now()}`
    };
    setEvents([...events, event]);
  };

  const handleToggleEventComplete = (eventId: string) => {
    setEvents(
      events.map((ev) =>
        ev.id === eventId ? { ...ev, completed: !ev.completed } : ev
      )
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((ev) => ev.id !== eventId));
  };

  // TASKS HANDLERS
  const handleAddTask = (newTask: Omit<TaskItem, 'id' | 'completed'>) => {
    const task: TaskItem = {
      ...newTask,
      id: `t-${Date.now()}`,
      completed: false
    };
    setTasks([task, ...tasks]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
            completedBy: nextCompleted ? activeMemberId : undefined
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  // SHOPPING & RECIPES HANDLERS
  const handleAddShoppingItem = (item: Omit<ShoppingItem, 'id' | 'checked'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: `shop-${Date.now()}`,
      checked: false
    };
    setShoppingList([...shoppingList, newItem]);
  };

  const handleToggleShoppingItem = (itemId: string) => {
    setShoppingList(
      shoppingList.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i))
    );
  };

  const handleDeleteShoppingItem = (itemId: string) => {
    setShoppingList(shoppingList.filter((i) => i.id !== itemId));
  };

  const handleClearCheckedShopping = () => {
    setShoppingList(shoppingList.filter((i) => !i.checked));
  };

  const handleAddRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: `rec-${Date.now()}`
    };
    setRecipes([...recipes, newRecipe]);
  };

  const handleAddIngredientsToShopping = (ingredients: string[], recipeTitle?: string) => {
    const newItems: ShoppingItem[] = ingredients.map((name, idx) => ({
      id: `shop-${Date.now()}-${idx}`,
      name,
      category: 'Przekąski i Inne',
      amount: recipeTitle ? `Przepis: ${recipeTitle}` : '1 szt.',
      addedBy: activeMemberId,
      checked: false
    }));
    setShoppingList([...shoppingList, ...newItems]);
  };

  // ENTERTAINMENT & BUCKET LIST HANDLERS
  const handleAddEntertainment = (item: Omit<EntertainmentItem, 'id'>) => {
    const newItem: EntertainmentItem = {
      ...item,
      id: `ent-${Date.now()}`
    };
    setEntertainment([newItem, ...entertainment]);
  };

  const handleUpdateEntertainment = (id: string, updated: Partial<EntertainmentItem>) => {
    setEntertainment(
      entertainment.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleDeleteEntertainment = (id: string) => {
    setEntertainment(entertainment.filter((i) => i.id !== id));
  };

  const handleAddBucketItem = (item: Omit<DateBucketItem, 'id' | 'done'>) => {
    const newItem: DateBucketItem = {
      ...item,
      id: `bkt-${Date.now()}`,
      done: false
    };
    setBucketList([newItem, ...bucketList]);
  };

  const handleToggleBucketItem = (id: string) => {
    setBucketList(
      bucketList.map((item) =>
        item.id === id
          ? {
              ...item,
              done: !item.done,
              doneDate: !item.done ? new Date().toLocaleDateString('pl-PL') : undefined
            }
          : item
      )
    );
  };

  const handleDeleteBucketItem = (id: string) => {
    setBucketList(bucketList.filter((i) => i.id !== id));
  };

  // FRIDGE NOTES HANDLERS
  const handleAddStickyNote = (note: Omit<StickyNote, 'id' | 'date'>) => {
    const newNote: StickyNote = {
      ...note,
      id: `note-${Date.now()}`,
      date: new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
    };
    setStickyNotes([newNote, ...stickyNotes]);
  };

  const handleTogglePinNote = (noteId: string) => {
    setStickyNotes(
      stickyNotes.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleDeleteStickyNote = (noteId: string) => {
    setStickyNotes(stickyNotes.filter((n) => n.id !== noteId));
  };

  // SAVINGS HANDLERS
  const handleAddSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'contributions'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      contributions: []
    };
    setSavingsGoals([...savingsGoals, newGoal]);
  };

  const handleAddContribution = (goalId: string, amount: number, contributorId: MemberId, note?: string) => {
    setSavingsGoals(
      savingsGoals.map((g) => {
        if (g.id === goalId) {
          const newContrib: SavingsContribution = {
            id: `c-${Date.now()}`,
            amount,
            memberId: contributorId,
            date: new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }),
            note
          };
          return {
            ...g,
            currentAmount: g.currentAmount + amount,
            contributions: [newContrib, ...g.contributions]
          };
        }
        return g;
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setSavingsGoals(savingsGoals.filter((g) => g.id !== goalId));
  };

  // EDUCATION & STUDY HANDLERS
  const handleAddStudyItem = (item: Omit<StudyItem, 'id'>) => {
    const newItem: StudyItem = {
      ...item,
      id: `study-${Date.now()}`
    };
    setStudyItems([...studyItems, newItem]);
  };

  const handleUpdateStudyItem = (id: string, updated: Partial<StudyItem>) => {
    setStudyItems(
      studyItems.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleDeleteStudyItem = (id: string) => {
    setStudyItems(studyItems.filter((item) => item.id !== id));
  };

  const handleAddFocusSession = (session: Omit<FocusSession, 'id'>) => {
    const newSession: FocusSession = {
      ...session,
      id: `focus-${Date.now()}`
    };
    setFocusSessions([newSession, ...focusSessions]);
  };

  const handleToggleFocusActive = (active: boolean, memberName?: string, taskName?: string) => {
    const personKey: 'aleksandra' | 'kuba' = memberName === 'aleksandra' || activeMemberId === 'mama' ? 'aleksandra' : 'kuba';
    setQuickStatus({
      ...quickStatus,
      focusMode: {
        active,
        person: personKey,
        topic: taskName || 'Nauka / Studia',
        until: active ? '2h' : undefined
      }
    });
  };

  // FITNESS HANDLERS
  const handleAddWorkout = (workout: Omit<WorkoutEntry, 'id'>) => {
    const newWorkout: WorkoutEntry = {
      ...workout,
      id: `wo-${Date.now()}`
    };
    setWorkouts([newWorkout, ...workouts]);
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(workouts.filter((w) => w.id !== workoutId));
  };

  // LOVE NUDGES & RELATIONSHIP HANDLERS
  const handleSendNudge = (nudge: Omit<SentNudge, 'id' | 'timestamp' | 'resolved'>) => {
    const newNudge: SentNudge = {
      ...nudge,
      id: `ndg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      resolved: false
    };
    setSentNudges([newNudge, ...sentNudges]);
  };

  const handleReactToNudge = (nudgeId: string, emoji: string, comment?: string) => {
    setSentNudges(
      sentNudges.map((n) =>
        n.id === nudgeId
          ? {
              ...n,
              responseEmoji: emoji,
              responseComment: comment,
              resolved: true
            }
          : n
      )
    );
  };

  const handleSendWhiteFlag = (offer: Omit<WhiteFlagOffer, 'id' | 'timestamp' | 'accepted'>) => {
    const newOffer: WhiteFlagOffer = {
      ...offer,
      id: `wf-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      accepted: false
    };
    setWhiteFlagOffers([newOffer, ...whiteFlagOffers]);
  };

  const handleAcceptWhiteFlag = (offerId: string) => {
    setWhiteFlagOffers(
      whiteFlagOffers.map((w) =>
        w.id === offerId ? { ...w, accepted: true } : w
      )
    );
  };

  const handleUpdateMood = (memberId: 'mama' | 'tata', mood: string, energy: number, label: string, note?: string) => {
    const prevMoods = quickStatus.memberMoods || {
      mama: { mood: '🥰', energy: 85, label: 'Dobry humor i energia', updatedTime: '10:00' },
      tata: { mood: '☕', energy: 75, label: 'Zajęty pracą / Apprenticeship', updatedTime: '09:30' }
    };
    setQuickStatus({
      ...quickStatus,
      memberMoods: {
        ...prevMoods,
        [memberId]: { 
          mood, 
          energy, 
          label, 
          note,
          updatedTime: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) 
        }
      }
    });
  };

  // UK LOGISTICS HANDLERS
  const handleUpdateBinConfig = (config: BinConfig) => {
    setBinConfig(config);
  };

  const handleUpdateCarInfo = (car: UKCarInfo) => {
    setUkCar(car);
  };

  const handleAddDelivery = (delivery: Omit<UKDeliveryItem, 'id'>) => {
    const newDelivery: UKDeliveryItem = {
      ...delivery,
      id: `del-${Date.now()}`
    };
    setUkDeliveries([newDelivery, ...ukDeliveries]);
  };

  const handleToggleDeliveryStatus = (deliveryId: string) => {
    setUkDeliveries(
      ukDeliveries.map((d) => {
        if (d.id === deliveryId) {
          const nextStatus = d.status === 'delivered' ? 'in_transit' : 'delivered';
          return {
            ...d,
            status: nextStatus,
            deliveredAt: nextStatus === 'delivered' ? new Date().toLocaleDateString('pl-PL') : undefined
          };
        }
        return d;
      })
    );
  };

  const handleDeleteDelivery = (deliveryId: string) => {
    setUkDeliveries(ukDeliveries.filter((d) => d.id !== deliveryId));
  };

  const handleAddBill = (bill: Omit<UKBillItem, 'id'>) => {
    const newBill: UKBillItem = {
      ...bill,
      id: `bill-${Date.now()}`
    };
    setUkBills([...ukBills, newBill]);
  };

  const handleDeleteBill = (billId: string) => {
    setUkBills(ukBills.filter((b) => b.id !== billId));
  };

  const handleAddHomeItem = (item: Omit<HomeItemLocation, 'id'>) => {
    const newItem: HomeItemLocation = {
      ...item,
      id: `hi-${Date.now()}`
    };
    setHomeItems([newItem, ...homeItems]);
  };

  const handleDeleteHomeItem = (itemId: string) => {
    setHomeItems(homeItems.filter((i) => i.id !== itemId));
  };

  // Notifications calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter((ev) => ev.date === todayStr);
  const pendingTodayTasks = tasks.filter((t) => !t.completed && t.dueDate === todayStr);
  const unpackedChildCount = childProfile.packingList.filter((i) => !i.checked).length;
  const pendingWalks = [dogStatus.morningWalk.done, dogStatus.afternoonWalk.done, dogStatus.eveningWalk.done].filter((d) => !d).length;
  const activeWhiteFlags = whiteFlagOffers.filter((w) => !w.accepted).length;
  const unreadNudges = sentNudges.filter((n) => !n.resolved && n.to === activeMemberId).length;
  const pendingParcels = ukDeliveries.filter((d) => d.status === 'in_transit').length;
  
  const notificationCount = pendingTodayTasks.length + (unpackedChildCount > 0 ? 1 : 0) + (pendingWalks > 0 ? 1 : 0) + activeWhiteFlags + unreadNudges;

  const badges = {
    tasks: tasks.filter((t) => !t.completed).length,
    shopping: shoppingList.filter((i) => !i.checked).length,
    dog: pendingWalks,
    entertainment: entertainment.filter((e) => e.status === 'watchlist').length,
    fridge: stickyNotes.length,
    education: studyItems.filter((s) => s.status === 'in_progress').length,
    nudges: unreadNudges + activeWhiteFlags > 0 ? unreadNudges + activeWhiteFlags : undefined,
    uk_logistics: pendingParcels > 0 ? pendingParcels : undefined
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col selection:bg-amber-200">
      
      {/* Top Header with Profile Switcher & Settings */}
      <Header
        activeMemberId={activeMemberId}
        onSelectMember={setActiveMemberId}
        notificationCount={notificationCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onResetData={handleResetData}
        familyMembers={familyMembers}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Navigation (Desktop & Mobile) */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badges={badges}
        sectionVisibility={sectionVisibility}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7">
        
        {/* Top Interactive Quick Status Bar */}
        {sectionVisibility.quickStatusBar !== false && (
          <QuickStatusBar
            quickStatus={quickStatus}
            activeMemberId={activeMemberId}
            binSchedule={binSchedule}
            onUpdateStatus={setQuickStatus}
            onNavigateTab={setActiveTab}
            onQuickWalkAction={handleQuickWalkAction}
          />
        )}

        {/* Informative placeholder if user opens a tab that was toggled off in settings */}
        {activeTab !== 'settings' && activeTab in sectionVisibility && !sectionVisibility[activeTab as keyof SectionVisibility] && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-stone-200 text-center shadow-xs max-w-md mx-auto my-12">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <EyeOff className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Ta sekcja jest ukryta w ustawieniach</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-5">
              Możesz w każdej chwili włączyć tę sekcję ponownie w panelu Ustawień.
            </p>
            <button
              onClick={() => setActiveTab('settings')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs"
            >
              <SettingsIcon className="w-4 h-4" />
              Otwórz Ustawienia
            </button>
          </div>
        )}

        {activeTab === 'feed' && sectionVisibility.feed && (
          <FeedSection
            posts={posts}
            activeMemberId={activeMemberId}
            onAddPost={handleAddPost}
            onEditPost={(post) => handleEditPost(post.id, post)}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onDeletePost={handleDeletePost}
            onTogglePin={handleTogglePin}
            familyMembers={familyMembers}
          />
        )}

        {activeTab === 'nudges' && sectionVisibility.nudges && (
          <LoveNudgesSection
            activeMemberId={activeMemberId}
            sentNudges={sentNudges}
            whiteFlagOffers={whiteFlagOffers}
            milestones={coupleMilestones}
            quickStatus={quickStatus}
            onSendNudge={handleSendNudge}
            onReactToNudge={handleReactToNudge}
            onSendWhiteFlag={handleSendWhiteFlag}
            onAcceptWhiteFlag={handleAcceptWhiteFlag}
            onUpdateMood={handleUpdateMood}
          />
        )}

        {activeTab === 'uk_logistics' && sectionVisibility.uk_logistics && (
          <UKLogisticsSection
            activeMemberId={activeMemberId}
            binConfig={binConfig}
            binSchedule={binSchedule}
            carInfo={ukCar}
            deliveries={ukDeliveries}
            bills={ukBills}
            loyaltyCards={ukLoyaltyCards}
            homeItems={homeItems}
            onUpdateBinConfig={handleUpdateBinConfig}
            onUpdateCarInfo={handleUpdateCarInfo}
            onAddDelivery={handleAddDelivery}
            onToggleDeliveryStatus={handleToggleDeliveryStatus}
            onDeleteDelivery={handleDeleteDelivery}
            onAddBill={handleAddBill}
            onDeleteBill={handleDeleteBill}
            onAddHomeItem={handleAddHomeItem}
            onDeleteHomeItem={handleDeleteHomeItem}
          />
        )}

        {activeTab === 'calendar' && sectionVisibility.calendar && (
          <CalendarSection
            events={events}
            workShifts={workShifts}
            kindergartenDuty={kindergartenDuty}
            activeMemberId={activeMemberId}
            onAddEvent={handleAddEvent}
            onToggleEventComplete={handleToggleEventComplete}
            onDeleteEvent={handleDeleteEvent}
            onUpdateKindergartenDuty={setKindergartenDuty}
            onUpdateWorkShift={(shift) => {
              setWorkShifts(workShifts.map((s) => (s.id === shift.id ? shift : s)));
            }}
          />
        )}

        {activeTab === 'tasks' && sectionVisibility.tasks && (
          <TasksSection
            tasks={tasks}
            activeMemberId={activeMemberId}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'shopping' && sectionVisibility.shopping && (
          <ShoppingRecipesSection
            shoppingList={shoppingList}
            recipes={recipes}
            mealPlan={mealPlan}
            activeMemberId={activeMemberId}
            onAddShoppingItem={handleAddShoppingItem}
            onToggleShoppingItem={handleToggleShoppingItem}
            onDeleteShoppingItem={handleDeleteShoppingItem}
            onClearCheckedShopping={handleClearCheckedShopping}
            onAddRecipe={handleAddRecipe}
            onAddIngredientsToShopping={handleAddIngredientsToShopping}
            onUpdateMealPlan={setMealPlan}
          />
        )}

        {activeTab === 'dog' && sectionVisibility.dog && (
          <DogSection
            dogProfile={dogProfile}
            dogStatus={dogStatus}
            activeMemberId={activeMemberId}
            onUpdateStatus={setDogStatus}
            onUpdateProfile={setDogProfile}
            familyMembers={familyMembers}
          />
        )}

        {activeTab === 'child' && sectionVisibility.child && (
          <ChildSection
            childProfile={childProfile}
            activeMemberId={activeMemberId}
            onUpdateProfile={setChildProfile}
            familyMembers={familyMembers}
          />
        )}

        {activeTab === 'entertainment' && sectionVisibility.entertainment && (
          <EntertainmentSection
            entertainment={entertainment}
            bucketList={bucketList}
            recipes={recipes}
            activeMemberId={activeMemberId}
            onAddEntertainment={handleAddEntertainment}
            onUpdateEntertainment={handleUpdateEntertainment}
            onDeleteEntertainment={handleDeleteEntertainment}
            onAddBucketItem={handleAddBucketItem}
            onToggleBucketItem={handleToggleBucketItem}
            onDeleteBucketItem={handleDeleteBucketItem}
          />
        )}

        {activeTab === 'fridge' && sectionVisibility.fridge && (
          <FridgeNotesSection
            notes={stickyNotes}
            activeMemberId={activeMemberId}
            onAddNote={handleAddStickyNote}
            onTogglePin={handleTogglePinNote}
            onDeleteNote={handleDeleteStickyNote}
          />
        )}

        {activeTab === 'savings' && sectionVisibility.savings && (
          <SavingsSection
            goals={savingsGoals}
            activeMemberId={activeMemberId}
            onAddGoal={handleAddSavingsGoal}
            onAddContribution={handleAddContribution}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'education' && sectionVisibility.education && (
          <EducationSection
            studyItems={studyItems}
            focusSessions={focusSessions}
            activeMemberId={activeMemberId}
            onAddStudyItem={handleAddStudyItem}
            onUpdateStudyItem={handleUpdateStudyItem}
            onDeleteStudyItem={handleDeleteStudyItem}
            onAddFocusSession={handleAddFocusSession}
            onToggleFocusActive={handleToggleFocusActive}
          />
        )}

        {activeTab === 'fitness' && sectionVisibility.fitness && (
          <FitnessSection
            workouts={workouts}
            activeMemberId={activeMemberId}
            onAddWorkout={handleAddWorkout}
            onDeleteWorkout={handleDeleteWorkout}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsSection
            sectionVisibility={sectionVisibility}
            onUpdateSectionVisibility={setSectionVisibility}
            familyMembers={familyMembers}
            onUpdateFamilyMember={handleUpdateFamilyMember}
            onClearSampleData={handleClearAllSampleData}
            onRestoreSampleData={handleResetData}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Floating Action Button for Instant Add */}
      <QuickAddFAB
        onSelectAction={(action) => {
          if (action === 'post') setActiveTab('feed');
          if (action === 'calendar') setActiveTab('calendar');
          if (action === 'task') setActiveTab('tasks');
          if (action === 'shopping') setActiveTab('shopping');
          if (action === 'walk') setActiveTab('dog');
          if (action === 'quote') setActiveTab('child');
        }}
        onNavigateTab={setActiveTab}
      />

      {/* Notifications and Reminders Center Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        todayEvents={todayEvents}
        todayTasks={tasks.filter((t) => t.dueDate === todayStr)}
        kindergartenDuty={kindergartenDuty}
        dogProfile={dogProfile}
        childProfile={childProfile}
        onNavigateTab={setActiveTab}
      />

    </div>
  );
}
