import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Check, Trash, Calendar, CalendarDays } from 'lucide-react';

const Goals: React.FC = () => {
  const { goals, addGoal, toggleGoal, deleteGoal } = useStore();
  const [newGoalText, setNewGoalText] = useState('');
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    addGoal(newGoalText, activeTab);
    setNewGoalText('');
  };

  const filteredGoals = goals.filter(g => g.type === activeTab);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Your Goals</h1>
        <p className="text-slate-500">Track your progress one step at a time.</p>
      </div>

      <div className="flex justify-center md:justify-start gap-4 mb-6">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all ${
            activeTab === 'daily' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'bg-white text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" /> Daily
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all ${
            activeTab === 'weekly' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'bg-white text-slate-500 hover:bg-slate-100'
          }`}
        >
          <CalendarDays className="w-4 h-4" /> Weekly
        </button>
      </div>

      {/* Input */}
      <form onSubmit={handleAdd} className="relative">
        <input
          type="text"
          value={newGoalText}
          onChange={(e) => setNewGoalText(e.target.value)}
          placeholder={`Add a new ${activeTab} goal...`}
          className="w-full pl-6 pr-20 py-4 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-indigo-500 text-slate-700 text-lg placeholder-slate-400"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p>No {activeTab} goals set yet. Add one above!</p>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div 
              key={goal.id} 
              className={`
                group flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                ${goal.completed ? 'bg-green-50/50' : 'bg-white shadow-sm border border-slate-100'}
              `}
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                    ${goal.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-slate-300 text-transparent hover:border-green-500'}
                  `}
                >
                  <Check className="w-5 h-5" />
                </button>
                <span className={`text-lg transition-all ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {goal.text}
                </span>
              </div>
              
              <button 
                onClick={() => deleteGoal(goal.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Goals;
