import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getDailyMentorTip } from '../services/geminiService';
import { MentorTip } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Target, Lightbulb, Clock, Code, Flame, BookOpen, Plus, Minus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, testResult, goals, roadmaps, studyStats, updateStats, achievements } = useStore();
  const [tip, setTip] = useState<MentorTip | null>(null);
  const [loadingTip, setLoadingTip] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const result = await getDailyMentorTip();
        setTip(result);
      } catch (error) {
        console.error("Failed to fetch tip");
      } finally {
        setLoadingTip(false);
      }
    };
    fetchTip();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-lg border border-slate-100">
          <div className="bg-indigo-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
             <Trophy className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Your Future Starts Here.</h1>
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">
            Create your engineering portfolio, track your coding streaks, and get personalized roadmaps.
          </p>
          <Link 
            to="/profile" 
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  // Calculate overall roadmap progress
  const totalTopics = roadmaps.reduce((acc, r) => acc + r.phases.reduce((pAcc, p) => pAcc + p.topics.length, 0), 0);
  const completedTopics = roadmaps.reduce((acc, r) => acc + r.phases.reduce((pAcc, p) => pAcc + p.topics.filter(t => t.completed).length, 0), 0);
  const roadmapProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const handleStatUpdate = (key: 'studyHours' | 'problemsSolved' | 'codingHours', delta: number) => {
    const newValue = Math.max(0, studyStats[key] + delta);
    updateStats({ [key]: newValue });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Personal Study Space</h1>
          <p className="text-slate-500 font-medium mt-1">Hello, {user.name}. Focus and dominate the day.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="bg-orange-100 p-2 rounded-xl">
             <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Day Streak</p>
            <p className="text-lg font-black text-slate-800">{studyStats.streak} Days</p>
          </div>
        </div>
      </div>

      {/* Main Trackers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Study Hours */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Clock className="w-6 h-6" />
             </div>
             <div className="flex gap-2">
                <button onClick={() => handleStatUpdate('studyHours', -1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><Minus className="w-4 h-4"/></button>
                <button onClick={() => handleStatUpdate('studyHours', 1)} className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600"><Plus className="w-4 h-4"/></button>
             </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Focus Time</h3>
            <p className="text-3xl font-black text-slate-900">{studyStats.studyHours}h</p>
            <p className="text-xs text-slate-500 mt-1">Total academic study hours recorded.</p>
          </div>
        </div>

        {/* Coding Problems */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Code className="w-6 h-6" />
             </div>
             <div className="flex gap-2">
                <button onClick={() => handleStatUpdate('problemsSolved', -1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><Minus className="w-4 h-4"/></button>
                <button onClick={() => handleStatUpdate('problemsSolved', 1)} className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600"><Plus className="w-4 h-4"/></button>
             </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Problems Solved</h3>
            <p className="text-3xl font-black text-slate-900">{studyStats.problemsSolved}</p>
            <p className="text-xs text-slate-500 mt-1">Questions tackled on LC/GFG/etc.</p>
          </div>
        </div>

        {/* Growth Progress */}
        <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Mastery Rank</h3>
               <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
               <p className="text-4xl font-black mb-2">{roadmapProgress}%</p>
               <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                  <div className="bg-indigo-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${roadmapProgress}%` }}></div>
               </div>
               <p className="text-xs text-indigo-200">Total roadmap completion across all domains.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity & Goals */}
        <div className="lg:col-span-2 space-y-8">
          {/* Achievement Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Recent Achievements
             </h2>
             {achievements.length === 0 ? (
               <div className="text-center py-6">
                  <p className="text-slate-400 italic">Complete goals and roadmaps to earn badges!</p>
               </div>
             ) : (
               <div className="flex gap-4 overflow-x-auto pb-2">
                 {achievements.map((ach) => (
                   <div key={ach.id} className="flex-shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center w-32 group hover:bg-indigo-50 transition-colors">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{ach.icon}</div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{ach.title}</p>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Goals Quick Access */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Priority Goals</h2>
                <Link to="/goals" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
             </div>
             <div className="space-y-3">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className={`w-3 h-3 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-slate-300 animate-pulse'}`}></div>
                     <span className={`flex-1 font-medium ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{goal.text}</span>
                  </div>
                ))}
                {goals.length === 0 && <p className="text-slate-400 italic py-4">No active goals. Stay hungry!</p>}
             </div>
          </div>
        </div>

        {/* Right Column: AI Mentor Tip */}
        <div className="space-y-8">
          <div className="bg-gradient-to-b from-indigo-50 to-white p-8 rounded-[2rem] border border-indigo-100 shadow-sm h-full flex flex-col">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                   <Lightbulb className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-800">Mentor Corner</h2>
             </div>
             
             {loadingTip ? (
                <div className="space-y-4 animate-pulse">
                   <div className="h-4 bg-slate-200 rounded w-full"></div>
                   <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                   <div className="h-20 bg-slate-100 rounded-2xl w-full mt-6"></div>
                </div>
             ) : tip ? (
                <div className="flex-1 flex flex-col">
                   <blockquote className="text-xl font-serif italic text-slate-700 leading-relaxed mb-4">
                     "{tip.quote}"
                   </blockquote>
                   <p className="text-indigo-600 font-bold mb-8">— {tip.author}</p>
                   
                   <div className="mt-auto bg-white p-6 rounded-2xl border border-indigo-100 shadow-inner">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Practical Strategy</span>
                      <p className="text-slate-600 font-medium leading-tight">{tip.tip}</p>
                   </div>
                </div>
             ) : (
                <p className="text-slate-400 italic">Restoring mentor connection...</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;