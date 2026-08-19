import React, { useState } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  Bell, 
  Filter, 
  Brush, 
  CreditCard, 
  Home, 
  Dog, 
  Baby
} from 'lucide-react';
import { TaskItem, TaskCategory, MemberId } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface TasksSectionProps {
  tasks: TaskItem[];
  activeMemberId: MemberId;
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  activeMemberId,
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMember, setFilterMember] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('cleaning');
  const [assignedTo, setAssignedTo] = useState<MemberId>(activeMemberId);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('18:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [reminderSet, setReminderSet] = useState(true);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      assignedTo,
      dueDate,
      dueTime: dueTime || undefined,
      priority,
      completed: false,
      recurrence,
      reminderSet
    });

    setTitle('');
    setShowAddModal(false);
  };

  const getCategoryDetails = (cat: TaskCategory) => {
    switch (cat) {
      case 'cleaning':
        return { label: 'Sprzątanie', icon: <Brush className="w-3.5 h-3.5" />, color: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'deadlines':
        return { label: 'Ważny Termin', icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'bills':
        return { label: 'Rachunki i Płatności', icon: <CreditCard className="w-3.5 h-3.5" />, color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'kids':
        return { label: 'Dla Dziecka', icon: <Baby className="w-3.5 h-3.5" />, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'pet':
        return { label: 'Pies Aria', icon: <Dog className="w-3.5 h-3.5" />, color: 'bg-amber-50 text-amber-800 border-amber-200' };
      default:
        return { label: 'Dom i Inne', icon: <Home className="w-3.5 h-3.5" />, color: 'bg-stone-50 text-stone-800 border-stone-200' };
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (!showCompleted && t.completed) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterMember !== 'all' && t.assignedTo !== filterMember) return false;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const cleaningCount = tasks.filter((t) => t.category === 'cleaning' && !t.completed).length;
  const deadlinesCount = tasks.filter((t) => t.category === 'deadlines' && !t.completed).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-stone-900 font-['Outfit',sans-serif]">
                Zadania Domowe i Terminy
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Harmonogram sprzątania, opłaty, sprawy urzędowe i codzienne obowiązki.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            Dodaj zadanie
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-stone-100">
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3">
            <p className="text-[11px] font-semibold text-amber-900">Do zrobienia</p>
            <p className="text-xl font-bold text-amber-800">{pendingCount}</p>
          </div>
          <div className="bg-teal-50/70 border border-teal-200/70 rounded-2xl p-3">
            <p className="text-[11px] font-semibold text-teal-900">Sprzątanie</p>
            <p className="text-xl font-bold text-teal-800">{cleaningCount}</p>
          </div>
          <div className="bg-rose-50/70 border border-rose-200/70 rounded-2xl p-3">
            <p className="text-[11px] font-semibold text-rose-900">Ważne Terminy</p>
            <p className="text-xl font-bold text-rose-800">{deadlinesCount}</p>
          </div>
          <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-3">
            <p className="text-[11px] font-semibold text-emerald-900">Ukończone</p>
            <p className="text-xl font-bold text-emerald-800">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-3 shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Kategoria:
          </span>
          {[
            { id: 'all', label: 'Wszystkie' },
            { id: 'cleaning', label: '🧹 Sprzątanie' },
            { id: 'deadlines', label: '⏰ Terminy' },
            { id: 'kids', label: '👶 Dla Dziecka' },
            { id: 'pet', label: '🐾 Aria' },
            { id: 'bills', label: '💳 Opłaty' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100 flex-wrap gap-2 text-xs">
          {/* Filter by Member */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500">Przypisane do:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterMember('all')}
                className={`px-2 py-0.5 rounded-lg text-xs ${filterMember === 'all' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
              >
                Wszyscy
              </button>
              {Object.values(FAMILY_MEMBERS).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setFilterMember(m.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs ${
                    filterMember === m.id ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <img src={m.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" referrerPolicy="no-referrer" />
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-stone-600 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-400"
            />
            Pokaż ukończone zadania
          </label>
        </div>
      </div>

      {/* Task Items List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-stone-700">Brak zadań w wybranej kategorii</p>
            <p className="text-xs text-stone-400">Wszystkie obowiązki domowe są wykonane! Możesz odpocząć lub dodać nowe zadanie.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const catDetails = getCategoryDetails(task.category);
            const assigned = FAMILY_MEMBERS[task.assignedTo] || FAMILY_MEMBERS.mama;
            const isOverdue = !task.completed && new Date(task.dueDate).getTime() < new Date().setHours(0,0,0,0);

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl border transition-all p-4 flex items-start justify-between gap-3 shadow-2xs group ${
                  task.completed
                    ? 'border-stone-200/60 bg-stone-50/50 opacity-60'
                    : isOverdue
                    ? 'border-rose-300 bg-rose-50/20'
                    : 'border-stone-200/90 hover:border-amber-300'
                }`}
              >
                {/* Left: Checkbox & Details */}
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 transition-transform active:scale-90"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-400 hover:text-amber-600" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${task.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {task.title}
                      </span>

                      {/* Category Badge */}
                      <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catDetails.color}`}>
                        {catDetails.icon}
                        {catDetails.label}
                      </span>

                      {/* Priority */}
                      {task.priority === 'high' && !task.completed && (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-100 text-rose-700 border border-rose-300">
                          Pilne
                        </span>
                      )}

                      {/* Recurrence */}
                      {task.recurrence && task.recurrence !== 'none' && (
                        <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.2 rounded-full border border-stone-200 flex items-center gap-1">
                          <RotateCcw className="w-2.5 h-2.5" />
                          {task.recurrence === 'daily' ? 'Codziennie' : task.recurrence === 'weekly' ? 'Co tydzień' : 'Co miesiąc'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-500 flex-wrap pt-0.5">
                      {/* Due date */}
                      <span className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-rose-700 font-bold' : 'text-stone-600'}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {task.dueDate} {task.dueTime ? `(${task.dueTime})` : ''}
                      </span>

                      {/* Reminder */}
                      {task.reminderSet && (
                        <span className="flex items-center gap-1 text-amber-700 text-[11px]">
                          <Bell className="w-3 h-3" /> Przypomnienie
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Assignee & Delete */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/80">
                    <img
                      src={assigned.avatar}
                      alt={assigned.name}
                      className="w-5 h-5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-semibold text-stone-700 hidden sm:inline">
                      {assigned.name}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Usuń zadanie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900 font-['Outfit',sans-serif]">
                Dodaj Nowe Zadanie / Termin
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Co jest do zrobienia? *
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Odkurzanie salonu, Opłata rachunku za prąd, Szczepienie Arii..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kategoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value="cleaning">🧹 Harmonogram sprzątania</option>
                    <option value="deadlines">⏰ Ważny termin / deadline</option>
                    <option value="bills">💳 Opłaty i finanse</option>
                    <option value="kids">👶 Sprawy dziecka (Tymek)</option>
                    <option value="pet">🐾 Pies Aria</option>
                    <option value="home">🏡 Dom i zakupy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Przypisz do osoby</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value as MemberId)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    {Object.values(FAMILY_MEMBERS).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Termin wykonania (data)</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Godzina przypomnienia</label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Priorytet</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni standardowy</option>
                    <option value="high">Wysoki / Pilny</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Powtarzalność</label>
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as 'none' | 'daily' | 'weekly' | 'monthly')}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value="none">Jednorazowo</option>
                    <option value="daily">Codziennie</option>
                    <option value="weekly">Co tydzień</option>
                    <option value="monthly">Co miesiąc</option>
                  </select>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminderSet}
                    onChange={(e) => setReminderSet(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-400"
                  />
                  Włącz powiadomienie / przypomnienie o terminie
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Zapisz zadanie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
