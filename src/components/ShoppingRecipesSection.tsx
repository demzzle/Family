import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Utensils, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Star, 
  Clock, 
  Heart, 
  Sparkles, 
  ChefHat, 
  ShoppingBag, 
  Check, 
  ArrowRight, 
  ListPlus, 
  Eye, 
  Calendar, 
  Tag
} from 'lucide-react';
import { ShoppingItem, Recipe, MealPlanDay, MemberId } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface ShoppingRecipesSectionProps {
  shoppingList: ShoppingItem[];
  recipes: Recipe[];
  mealPlan: MealPlanDay[];
  activeMemberId: MemberId;
  onAddShoppingItem: (item: Omit<ShoppingItem, 'id'>) => void;
  onToggleShoppingItem: (id: string) => void;
  onDeleteShoppingItem: (id: string) => void;
  onClearCheckedShopping: () => void;
  onAddRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  onAddIngredientsToShopping: (ingredients: string[], recipeTitle: string) => void;
  onUpdateMealPlan: (plan: MealPlanDay[]) => void;
}

export const ShoppingRecipesSection: React.FC<ShoppingRecipesSectionProps> = ({
  shoppingList,
  recipes,
  mealPlan,
  activeMemberId,
  onAddShoppingItem,
  onToggleShoppingItem,
  onDeleteShoppingItem,
  onClearCheckedShopping,
  onAddRecipe,
  onAddIngredientsToShopping,
  onUpdateMealPlan
}) => {
  const [activeTab, setActiveTab] = useState<'shopping' | 'recipes' | 'plan'>('shopping');
  
  // Shopping State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ShoppingItem['category']>('Warzywa i Owoce');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [shopMode, setShopMode] = useState(false); // Mode optimized for grocery store
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Recipe Modal State
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [ingredientsCopiedToast, setIngredientsCopiedToast] = useState(false);

  // New Recipe Form State
  const [newRecTitle, setNewRecTitle] = useState('');
  const [newRecDesc, setNewRecDesc] = useState('');
  const [newRecTime, setNewRecTime] = useState('25 min');
  const [newRecRating, setNewRecRating] = useState(5);
  const [newRecTags, setNewRecTags] = useState('Szybki obiad, Dla dzieci');
  const [newRecIngredients, setNewRecIngredients] = useState('');
  const [newRecSteps, setNewRecSteps] = useState('');
  const [newRecImage, setNewRecImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddShoppingItem({
      name: newItemName.trim(),
      category: newItemCategory,
      amount: newItemAmount.trim() || '1 szt.',
      checked: false,
      addedBy: activeMemberId
    });

    setNewItemName('');
    setNewItemAmount('');
  };

  const handleCreateRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecTitle.trim()) return;

    const ingList = newRecIngredients
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const stepList = newRecSteps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const tagList = newRecTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onAddRecipe({
      title: newRecTitle.trim(),
      description: newRecDesc.trim(),
      prepTime: newRecTime.trim(),
      rating: newRecRating,
      tags: tagList,
      ingredients: ingList.length > 0 ? ingList : ['Składniki do uzupełnienia'],
      steps: stepList.length > 0 ? stepList : ['Przygotować składniki i podawać na ciepło.'],
      imageUrl: newRecImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      lovedBy: [activeMemberId],
      difficulty: 'Łatwe'
    });

    setNewRecTitle('');
    setNewRecDesc('');
    setNewRecIngredients('');
    setNewRecSteps('');
    setShowAddRecipeModal(false);
  };

  const handleTransferIngredients = (recipe: Recipe) => {
    onAddIngredientsToShopping(recipe.ingredients, recipe.title);
    setIngredientsCopiedToast(true);
    setTimeout(() => setIngredientsCopiedToast(false), 3000);
  };

  // Group shopping list by category
  const categories = [
    'Warzywa i Owoce',
    'Nabiał',
    'Pieczywo',
    'Dla Arii',
    'Dla Dziecka',
    'Chemia i Dom',
    'Przekąski i Inne'
  ] as const;

  const uncheckedItems = shoppingList.filter((i) => !i.checked);
  const checkedItems = shoppingList.filter((i) => i.checked);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Top Banner & Sub Tabs */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-stone-900 font-['Outfit',sans-serif]">
                Zakupy i Rodzinna Kuchnia
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Wspólna lista zakupów na żywo, sprawdzone rodzinne przepisy i plan obiadów.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'shopping' && (
              <button
                onClick={() => setShopMode(!shopMode)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                  shopMode
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {shopMode ? '✓ Tryb w sklepie włączony' : 'Tryb w sklepie'}
              </button>
            )}

            {activeTab === 'recipes' && (
              <button
                onClick={() => setShowAddRecipeModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Dodaj przepis
              </button>
            )}
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-stone-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('shopping')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'shopping'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Lista Zakupów ({uncheckedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'recipes'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            Książka Przepisów ({recipes.length})
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'plan'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Plan Obiadów na Tydzień
          </button>
        </div>
      </div>

      {/* TAB 1: SHOPPING LIST */}
      {activeTab === 'shopping' && (
        <div className="space-y-6">
          
          {/* Add Item Bar */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-5 shadow-xs">
            <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                required
                placeholder="Co kupić? (np. Masło, Banany, Karma dla psa)..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
              <input
                type="text"
                placeholder="Ilość (np. 2 szt., 500g)"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                className="w-full sm:w-36 px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as ShoppingItem['category'])}
                className="px-3 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Dodaj
              </button>
            </form>
          </div>

          {/* Category Filter Pills & Clear Action */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                  filterCategory === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Wszystkie ({shoppingList.length})
              </button>
              {categories.map((cat) => {
                const count = shoppingList.filter((i) => i.category === cat && !i.checked).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                      filterCategory === cat
                        ? 'bg-amber-700 text-white'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {cat} {count > 0 ? `(${count})` : ''}
                  </button>
                );
              })}
            </div>

            {checkedItems.length > 0 && (
              <button
                onClick={onClearCheckedShopping}
                className="text-xs text-stone-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 border border-dashed border-stone-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Wyczyść kupione ({checkedItems.length})
              </button>
            )}
          </div>

          {/* Unchecked Items List */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span>Do kupienia</span>
                <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold">
                  {uncheckedItems.length}
                </span>
              </h3>
            </div>

            {uncheckedItems.length === 0 ? (
              <div className="text-center py-6 text-stone-400 text-xs">
                Koszyk jest pusty! Wszystkie produkty zostały kupione 🎉
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {uncheckedItems
                  .filter((item) => filterCategory === 'all' || item.category === filterCategory)
                  .map((item) => {
                    const addedByMember = FAMILY_MEMBERS[item.addedBy] || FAMILY_MEMBERS.mama;
                    return (
                      <div
                        key={item.id}
                        className={`py-3 flex items-center justify-between gap-3 group transition-colors rounded-xl px-2 hover:bg-amber-50/40 ${
                          shopMode ? 'py-4 text-base' : ''
                        }`}
                      >
                        <button
                          onClick={() => onToggleShoppingItem(item.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <Circle className={`text-stone-400 hover:text-emerald-600 shrink-0 ${shopMode ? 'w-6 h-6' : 'w-5 h-5'}`} />
                          <div>
                            <span className={`font-semibold text-stone-900 ${shopMode ? 'text-base' : 'text-sm'}`}>
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                              <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                {item.amount}
                              </span>
                              <span className="text-stone-400">• {item.category}</span>
                              <span className="flex items-center gap-1 text-stone-400">
                                <img src={addedByMember.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" referrerPolicy="no-referrer" />
                                {addedByMember.name}
                              </span>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => onDeleteShoppingItem(item.id)}
                          className="p-1.5 text-stone-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Checked Items List */}
          {checkedItems.length > 0 && (
            <div className="bg-stone-50/80 rounded-3xl border border-stone-200 p-4 sm:p-5 space-y-2">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Kupione w koszyku ({checkedItems.length})
              </h4>
              <div className="divide-y divide-stone-200/60">
                {checkedItems.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between gap-3 text-xs opacity-60">
                    <button
                      onClick={() => onToggleShoppingItem(item.id)}
                      className="flex items-center gap-2.5 text-left flex-1 line-through text-stone-500"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                      <span>{item.name} ({item.amount})</span>
                    </button>
                    <button
                      onClick={() => onDeleteShoppingItem(item.id)}
                      className="text-stone-400 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: RECIPES BOOK & FAVORITES */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          
          {ingredientsCopiedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-600" />
              Składniki zostały pomyślnie dodane do listy zakupów!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {recipe.rating}.0
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-stone-800 text-[11px] px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    {recipe.prepTime}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {recipe.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.2 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 line-clamp-2 font-['Outfit',sans-serif]">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedRecipe(recipe)}
                      className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Zobacz przepis
                    </button>

                    <button
                      onClick={() => handleTransferIngredients(recipe)}
                      title="Dodaj składniki do listy zakupów"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 text-xs font-medium transition-colors"
                    >
                      <ListPlus className="w-3.5 h-3.5 text-amber-600" />
                      Do zakupów
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: WEEKLY MEAL PLAN */}
      {activeTab === 'plan' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
              Plan Obiadów na Nadchodzący Tydzień
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Co gotujemy w poszczególne dni i kto dzisiaj pełni rolę Szefa Kuchni.
            </p>
          </div>

          <div className="space-y-3">
            {mealPlan.map((day, idx) => {
              const cook = FAMILY_MEMBERS[day.cook] || FAMILY_MEMBERS.mama;
              const isToday = day.dayName.includes('Dziś');

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isToday
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-200'
                      : 'bg-stone-50/50 border-stone-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isToday ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {day.date}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                        {day.dayName}
                      </p>
                      <p className="text-sm font-bold text-stone-900">
                        {day.dishName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="flex items-center gap-1.5 text-xs bg-white px-2.5 py-1 rounded-xl border border-stone-200">
                      <img src={cook.avatar} alt="" className="w-4 h-4 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <span className="text-stone-600">Gotuje:</span>
                      <span className="font-bold text-stone-900">{cook.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="relative h-48 rounded-2xl overflow-hidden mb-2">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 text-xs"
              >
                ✕ Zamknij
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  ⏱️ {selectedRecipe.prepTime}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  ⭐⭐⭐⭐⭐ ({selectedRecipe.rating}.0)
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-['Outfit',sans-serif]">
                {selectedRecipe.title}
              </h3>
              <p className="text-xs text-stone-600 mt-1">{selectedRecipe.description}</p>
            </div>

            {/* Ingredients */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  🛒 Składniki:
                </h4>
                <button
                  onClick={() => handleTransferIngredients(selectedRecipe)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs"
                >
                  + Dodaj wszystkie do listy zakupów
                </button>
              </div>
              <ul className="space-y-1 text-xs text-stone-800">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                👨‍🍳 Sposób przygotowania:
              </h4>
              <ol className="space-y-2 text-xs text-stone-700">
                {selectedRecipe.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <span className="font-bold text-amber-700 shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipe Modal */}
      {showAddRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900 font-['Outfit',sans-serif]">
                Dodaj Nowy Rodzinny Przepis
              </h3>
              <button onClick={() => setShowAddRecipeModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleCreateRecipe} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nazwa potrawy *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Naleśniki ze szpinakiem i fetą..."
                  value={newRecTitle}
                  onChange={(e) => setNewRecTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Czas przygotowania</label>
                  <input
                    type="text"
                    placeholder="np. 20 min"
                    value={newRecTime}
                    onChange={(e) => setNewRecTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Ocena rodziny (1-5)</label>
                  <select
                    value={newRecRating}
                    onChange={(e) => setNewRecRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tagi (oddzielone przecinkami)</label>
                <input
                  type="text"
                  placeholder="np. Szybki obiad, Ulubione Tymka, Wegetariańskie"
                  value={newRecTags}
                  onChange={(e) => setNewRecTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Składniki (każdy w nowej linii)</label>
                <textarea
                  rows={3}
                  placeholder="300g makaronu&#10;200g łososia&#10;Śmietanka..."
                  value={newRecIngredients}
                  onChange={(e) => setNewRecIngredients(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Kroki przygotowania (każdy w nowej linii)</label>
                <textarea
                  rows={3}
                  placeholder="Ugotuj makaron...&#10;Podsmaż na maśle...&#10;Wymieszaj i podawaj..."
                  value={newRecSteps}
                  onChange={(e) => setNewRecSteps(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddRecipeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Zapisz przepis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
