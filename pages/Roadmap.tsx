import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { generateLearningRoadmap } from '../services/geminiService';
import { Plus, Trash2, Map, Clock, CheckCircle, Loader2, Bookmark, Check, Briefcase, Award, Zap } from 'lucide-react';

const Roadmap: React.FC = () => {
  const { roadmaps, saveRoadmap, deleteRoadmap, testResult, toggleRoadmapTopic } = useStore();
  const [customDomain, setCustomDomain] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (domain: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const roadmap = await generateLearningRoadmap(domain);
      saveRoadmap(roadmap);
      setCustomDomain('');
    } catch (err) {
      setError("Failed to generate roadmap. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Suggestions from test results or defaults
  const suggestions = testResult 
    ? testResult.subDomains.slice(0, 4) 
    : ["Web Development", "Data Science", "Cyber Security", "Robotics"];

  // Calculate Portfolio Stats
  const totalTopics = roadmaps.reduce((acc, r) => acc + r.phases.reduce((pAcc, p) => pAcc + p.topics.length, 0), 0);
  const completedTopics = roadmaps.reduce((acc, r) => acc + r.phases.reduce((pAcc, p) => pAcc + p.topics.filter(t => t.completed).length, 0), 0);
  const portfolioProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const getRoadmapProgress = (phases: any[]) => {
    const total = phases.reduce((acc, p) => acc + p.topics.length, 0);
    const completed = phases.reduce((acc, p) => acc + p.topics.filter((t: any) => t.completed).length, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Portfolio Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-yellow-400" />
              My Skill Portfolio
            </h1>
            <p className="text-indigo-200 mt-2">Track your journey from beginner to expert.</p>
          </div>
          {roadmaps.length > 0 && (
            <div className="mt-4 md:mt-0 bg-white/10 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
               <span className="text-xs text-indigo-300 uppercase tracking-wider font-bold">Overall Proficiency</span>
               <div className="text-3xl font-bold text-white">{portfolioProgress}%</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
             <div className="flex items-center gap-2 text-indigo-300 text-sm mb-1">
               <Award className="w-4 h-4" /> Skills Mastered
             </div>
             <div className="text-2xl font-bold">{completedTopics}</div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
             <div className="flex items-center gap-2 text-indigo-300 text-sm mb-1">
               <Map className="w-4 h-4" /> Active Paths
             </div>
             <div className="text-2xl font-bold">{roadmaps.length}</div>
          </div>
           <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-2">
             <div className="flex items-center gap-2 text-indigo-300 text-sm mb-2">
               <Zap className="w-4 h-4" /> Progress Bar
             </div>
             <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${portfolioProgress}%` }}
                ></div>
             </div>
          </div>
        </div>
      </div>

      {/* Generator Section */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
           Generate New Roadmap
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input 
            type="text" 
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="Enter a skill (e.g., Python, UI Design, IoT)..."
            className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button 
            onClick={() => customDomain && handleGenerate(customDomain)}
            disabled={isGenerating || !customDomain}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px] shadow-lg shadow-indigo-200"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Generate</>}
          </button>
        </div>

        {/* Quick Suggestions */}
        <div>
          <p className="text-sm text-slate-400 mb-3 uppercase tracking-wider font-semibold">Suggested for you:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleGenerate(s)}
                disabled={isGenerating}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-lg text-sm transition-colors font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        
        {error && <p className="text-red-600 mt-4 text-sm bg-red-50 p-2 rounded inline-block border border-red-100">{error}</p>}
      </div>

      {/* Saved Roadmaps */}
      {roadmaps.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
          <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No roadmaps yet. Generate one above to start building your portfolio!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {roadmaps.map((roadmap) => {
            const progress = getRoadmapProgress(roadmap.phases);
            
            return (
              <div key={roadmap.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Roadmap Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-slate-800">{roadmap.domain}</h3>
                        <div className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                          {progress}% Complete
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteRoadmap(roadmap.id)}
                      className="ml-4 text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 relative">
                   {/* Vertical Line */}
                   <div className="absolute left-6 md:left-8 top-6 bottom-6 w-0.5 bg-slate-200"></div>
  
                   <div className="space-y-8">
                      {roadmap.phases.map((phase, pIdx) => (
                        <div key={pIdx} className="relative pl-8 md:pl-10">
                          {/* Dot */}
                          <div className={`
                            absolute left-[-5px] md:left-[-4px] top-1.5 w-3 h-3 rounded-full ring-4 transition-colors
                            ${phase.topics.every(t => t.completed) 
                              ? 'bg-green-500 ring-green-50' 
                              : 'bg-indigo-600 ring-indigo-50'}
                          `}></div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                             <h4 className="font-bold text-lg text-slate-800">{phase.title}</h4>
                             <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                               <Clock className="w-3 h-3" /> {phase.duration}
                             </span>
                          </div>
                          
                          <div className="space-y-2 mt-2">
                            {phase.topics.map((topic, tIdx) => (
                              <div 
                                key={tIdx} 
                                className={`
                                  flex items-start gap-3 p-2 rounded-lg transition-all cursor-pointer group
                                  ${topic.completed ? 'bg-green-50/50' : 'hover:bg-slate-50'}
                                `}
                                onClick={() => toggleRoadmapTopic(roadmap.id, pIdx, tIdx)}
                              >
                                <div className={`
                                  mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0
                                  ${topic.completed 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'border-slate-300 bg-white group-hover:border-indigo-400'}
                                `}>
                                  {topic.completed && <Check className="w-3.5 h-3.5" />}
                                </div>
                                <span className={`text-sm transition-colors ${topic.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                  {topic.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Roadmap;