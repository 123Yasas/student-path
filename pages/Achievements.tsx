import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { suggestAchievements, refinePortfolioContent } from '../services/geminiService';
import { Trophy, Upload, Image as ImageIcon, Plus, Trash2, Award, ExternalLink, Calendar, CheckCircle2, Sparkles, Loader2, Wand2, X } from 'lucide-react';

const Achievements: React.FC = () => {
  const { achievements, addAchievement, deleteAchievement, updateAchievement, studyStats, roadmaps } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Certificate' as 'Certificate' | 'Project' | 'Milestone' | 'Skill Upgrade',
    image: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (achievements.length < 5) {
        setSuggesting(true);
        try {
          const res = await suggestAchievements(studyStats, roadmaps);
          setSuggestions(res);
        } catch (e) {
          console.error("Suggestion failed", e);
        }
        setSuggesting(false);
      }
    };
    loadSuggestions();
  }, [achievements.length]);

  const handleRefine = async (id: string, content: string) => {
    setRefiningId(id);
    try {
      const refined = await refinePortfolioContent(content);
      updateAchievement(id, { description: refined });
    } catch (e) {
      console.error("Refinement failed", e);
    }
    setRefiningId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size limit 2MB exceeded.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addAchievement({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      image: formData.image,
      icon: formData.category === 'Certificate' ? '📜' : 
            formData.category === 'Project' ? '🚀' : '✨'
    });

    setFormData({ title: '', description: '', category: 'Certificate', image: '' });
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplySuggestion = (s: any) => {
    setFormData({
      title: s.title,
      description: s.description,
      category: (s.category || 'Milestone') as any,
      image: ''
    });
    setIsAdding(true);
    setSuggestions(prev => prev.filter(item => item.title !== s.title));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Achievement Feed</h1>
          <p className="text-slate-500 font-medium">Build your legacy, one win at a time.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg ${
            isAdding 
              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          {isAdding ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> New Achievement</>}
        </button>
      </div>

      {!isAdding && suggestions.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 rounded-[2rem] text-white shadow-xl animate-fade-in relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
           <div className="flex items-center gap-2 mb-4">
             <Sparkles className="w-5 h-5 text-indigo-300" />
             <h2 className="text-lg font-black tracking-tight">AI Generated Milestones</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {suggestions.map((s, idx) => (
               <div key={idx} className="bg-white/10 border border-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all group relative overflow-hidden cursor-pointer" onClick={() => handleApplySuggestion(s)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{s.icon || '✨'}</span>
                    <button className="bg-white text-indigo-900 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm truncate">{s.title}</h4>
                  <p className="text-[10px] text-indigo-200 line-clamp-2 mt-1">{s.description}</p>
               </div>
             ))}
           </div>
        </div>
      )}

      {isAdding && (
        <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-100 shadow-2xl animate-scale-in">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Title</label>
                <input 
                  type="text" required value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full Stack Course"
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Certificate">Certificate</option>
                  <option value="Project">Project / Hackathon</option>
                  <option value="Milestone">Personal Milestone</option>
                  <option value="Skill Upgrade">Skill Upgrade</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={4} placeholder="Describe your achievement..."
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Proof Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center ${formData.image ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
                >
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="max-h-64 rounded-xl shadow-md object-contain" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-slate-500 text-xs font-medium">Click to upload photo evidence</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
              >
                Post Achievement
              </button>
            </div>
          </form>
        </div>
      )}

      {achievements.length === 0 && !isAdding ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
           <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-slate-400">No achievements yet.</h3>
           <p className="text-slate-400">Share your wins to build your path!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((ach) => (
            <div key={ach.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col">
              {ach.image && (
                <div className="h-52 overflow-hidden">
                   <img src={ach.image} className="w-full h-full object-cover" alt={ach.title} />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-slate-800 leading-tight">{ach.title}</h3>
                    <span className="text-2xl">{ach.icon}</span>
                 </div>
                 <p className="text-sm text-slate-600 mb-6 leading-relaxed flex-1 line-clamp-3">{ach.description}</p>
                 <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <button onClick={() => handleRefine(ach.id, ach.description)} disabled={!!refiningId} className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline">
                      {refiningId === ach.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} AI Refine
                    </button>
                    <button onClick={() => deleteAchievement(ach.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;