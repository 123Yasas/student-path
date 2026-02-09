
import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { refinePortfolioContent } from '../services/geminiService';
import { 
  Download, 
  Sparkles, 
  Palette, 
  Eye, 
  Settings, 
  Clock, 
  Trophy, 
  Code, 
  Briefcase,
  Loader2,
  FileCode,
  Info,
  Upload,
  FileText
} from 'lucide-react';

const PortfolioBuilder: React.FC = () => {
  const { user, studyStats, achievements, roadmaps, portfolioSettings, updatePortfolioSettings, testResult } = useStore();
  const [isRefining, setIsRefining] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'code'>('design');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    window.print();
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        // Simple heuristic: if it looks like CSS in a separate file, we might need a different approach, 
        // but typically users upload HTML here.
        updatePortfolioSettings({ customTemplate: content, template: 'custom' });
      };
      reader.readAsText(file);
    }
  };

  const handleRefine = async () => {
    setIsRefining(true);
    if (achievements.length > 0) {
      const refined = await refinePortfolioContent(achievements[0].description);
      alert(`AI Suggestion for your top achievement: ${refined}`);
    } else {
      alert("Post some achievements first for the AI to enhance!");
    }
    setIsRefining(false);
  };

  // Expanded Placeholder Mapping
  const renderedCustomHtml = useMemo(() => {
    if (!user || !portfolioSettings.customTemplate) return '';

    const achievementsHtml = achievements.map(ach => `
      <div class="achievement-item">
        <div class="achievement-header">
          <span class="achievement-icon">${ach.icon}</span>
          <h4>${ach.title}</h4>
          <span class="achievement-category">${ach.category}</span>
        </div>
        <p>${ach.description}</p>
        ${ach.image ? `<img src="${ach.image}" class="achievement-img" />` : ''}
      </div>
    `).join('');

    const careerPath = testResult?.recommendedBranches?.[0]?.branch || user.grade;
    const skillList = roadmaps.map(r => r.domain).join(', ') || "Learning in progress...";

    const placeholders: Record<string, string> = {
      'name': user.name,
      'email': user.email,
      'grade': user.grade,
      'year': user.year,
      'dob': user.dateOfBirth,
      'career_path': careerPath,
      'skills': skillList,
      'study_hours': studyStats.studyHours.toString(),
      'coding_stats': studyStats.problemsSolved.toString(),
      'stats_hours': studyStats.studyHours.toString(), // Alias for backward compatibility
      'stats_problems': studyStats.problemsSolved.toString(), // Alias
      'achievements': achievementsHtml, // Legacy
      'achievements_html': achievementsHtml,
      'projects': achievementsHtml // Alias
    };

    let finalHtml = portfolioSettings.customTemplate;
    Object.keys(placeholders).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      finalHtml = finalHtml.replace(regex, placeholders[key]);
    });

    return finalHtml;
  }, [user, portfolioSettings.customTemplate, achievements, studyStats, roadmaps, testResult]);

  if (!user) return null;

  const isCustomMode = portfolioSettings.template === 'custom';

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 animate-fade-in overflow-hidden pb-10">
      
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Tab Selection */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex gap-1">
           <button 
             onClick={() => setActiveTab('design')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'design' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <Palette className="w-4 h-4" /> Global Design
           </button>
           <button 
             onClick={() => setActiveTab('code')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <FileCode className="w-4 h-4" /> Custom Template
           </button>
        </div>

        {activeTab === 'design' ? (
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-black text-slate-800">Customizer</h2>
            </div>

            {/* Template Selection */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Base Template</label>
              <div className="grid grid-cols-2 gap-2">
                {(['minimal', 'technical', 'creative', 'academic', 'custom'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => updatePortfolioSettings({ template: t })}
                    className={`
                      px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize
                      ${portfolioSettings.template === t 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'}
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Scheme */}
            {!isCustomMode && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Primary Accent</label>
                <div className="flex gap-2">
                  {['#4f46e5', '#0ea5e9', '#10b981', '#f43f5e', '#f59e0b'].map(c => (
                    <button
                      key={c}
                      onClick={() => updatePortfolioSettings({ primaryColor: c })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${portfolioSettings.primaryColor === c ? 'border-slate-800' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Toggles */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Visible Sections</label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                <span className="text-xs font-bold text-slate-700">Analytics Stats</span>
                <input 
                  type="checkbox" 
                  checked={portfolioSettings.showStats} 
                  onChange={e => updatePortfolioSettings({ showStats: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                <span className="text-xs font-bold text-slate-700">Skill Roadmaps</span>
                <input 
                  type="checkbox" 
                  checked={portfolioSettings.showRoadmaps} 
                  onChange={e => updatePortfolioSettings({ showRoadmaps: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <FileCode className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-black text-slate-800">Advanced Mode</h2>
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all text-xs font-bold"
            >
              <Upload className="w-4 h-4" /> Upload HTML Template
              <input type="file" ref={fileInputRef} onChange={handleTemplateUpload} accept=".html" className="hidden" />
            </button>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-3">
               <Info className="w-5 h-5 text-indigo-600 shrink-0" />
               <div className="space-y-1">
                 <p className="text-[10px] font-bold text-indigo-800 uppercase">Available Placeholders</p>
                 <div className="flex flex-wrap gap-1">
                   {['name', 'email', 'career_path', 'skills', 'projects', 'study_hours', 'coding_stats'].map(p => (
                     <span key={p} className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600 font-mono">
                       {/* Fixed: Use backticks to safely render the double-brace placeholder string in JSX */}
                       {`{{${p}}}`}
                     </span>
                   ))}
                 </div>
               </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block flex justify-between">
                  HTML Structure
                  <span className="text-indigo-400 font-bold lowercase">.html</span>
                </label>
                <textarea 
                  className="w-full h-48 bg-slate-900 text-indigo-300 p-4 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none custom-scrollbar"
                  value={portfolioSettings.customTemplate}
                  onChange={(e) => updatePortfolioSettings({ customTemplate: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block flex justify-between">
                  CSS Styling
                  <span className="text-indigo-400 font-bold lowercase">.css</span>
                </label>
                <textarea 
                  className="w-full h-48 bg-slate-900 text-indigo-300 p-4 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none custom-scrollbar"
                  value={portfolioSettings.customCss}
                  onChange={(e) => updatePortfolioSettings({ customCss: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-indigo-900 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
           <div className="relative z-10">
             <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-300" /> AI Content Engine
             </h3>
             <p className="text-xs text-indigo-100 opacity-80 mb-6 leading-relaxed">
                Transform your raw achievements into professional resume-grade descriptions instantly.
             </p>
             <button 
               onClick={handleRefine}
               disabled={isRefining}
               className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-50"
             >
               {isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : "Auto-Refine Descriptions"}
             </button>
           </div>
        </div>

        <button 
          onClick={handleDownload}
          className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-3 mt-auto"
        >
          <Download className="w-5 h-5" /> Download PDF Portfolio
        </button>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 bg-slate-100 rounded-[2.5rem] border border-slate-200 overflow-hidden relative flex flex-col">
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Student View Preview</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-12 print:p-0 bg-slate-200/30">
          <div 
            ref={previewRef}
            className={`
              max-w-4xl mx-auto bg-white shadow-2xl min-h-[11in] p-12 print:shadow-none print:m-0 rounded-2xl transition-all duration-500
              ${!isCustomMode && portfolioSettings.template === 'academic' ? 'font-serif' : 'font-sans'}
            `}
            style={!isCustomMode ? { borderTop: `12px solid ${portfolioSettings.primaryColor}` } : undefined}
          >
            {isCustomMode ? (
              <div dangerouslySetInnerHTML={{ __html: renderedCustomHtml }} className="custom-render-container" />
            ) : (
              <>
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter" style={{ color: portfolioSettings.primaryColor }}>{user.name}</h1>
                    <p className="text-xl text-slate-500 font-medium">{user.grade} Student • {user.year}</p>
                    <div className="flex gap-4 mt-4 text-sm font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Joined {new Date().getFullYear()}</span>
                      <span className="flex items-center gap-1"><Trophy className="w-4 h-4" /> {achievements.length} Achievements</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Portfolio Verified By</p>
                      <p className="text-sm font-black text-indigo-600">StudentPath Platform</p>
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-1 space-y-10">
                    {portfolioSettings.showStats && (
                      <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 border-b pb-2">Academic Vitals</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-indigo-500" />
                              <span className="text-sm font-bold text-slate-600">Focus Hours</span>
                            </div>
                            <span className="font-black text-slate-800">{studyStats.studyHours}h</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-bold text-slate-600">Problems</span>
                            </div>
                            <span className="font-black text-slate-800">{studyStats.problemsSolved}</span>
                          </div>
                        </div>
                      </section>
                    )}
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 border-b pb-2">Contact</h3>
                      <div className="text-sm font-bold text-slate-600 break-words">{user.email}</div>
                      <div className="text-sm text-slate-400 mt-1">DOB: {user.dateOfBirth}</div>
                    </section>
                    {portfolioSettings.showRoadmaps && roadmaps.length > 0 && (
                      <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 border-b pb-2">Active Mastery</h3>
                        <div className="space-y-3">
                          {roadmaps.map(r => (
                            <div key={r.id}>
                              <p className="text-xs font-bold text-slate-700 mb-1">{r.domain}</p>
                              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500" 
                                  style={{ width: `${Math.round((r.phases.reduce((acc, p) => acc + p.topics.filter(t => t.completed).length, 0) / r.phases.reduce((acc, p) => acc + p.topics.length, 0)) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-12">
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Professional Achievements
                      </h3>
                      <div className="space-y-10">
                        {achievements.length === 0 ? (
                          <p className="text-slate-400 italic">No public achievements posted yet. Start adding your wins!</p>
                        ) : (
                          achievements.map((ach) => (
                            <div key={ach.id} className="relative pl-6 border-l-2 border-slate-100">
                              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-indigo-500"></div>
                              <h4 className="text-lg font-black text-slate-800">{ach.title}</h4>
                              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{ach.description}</p>
                              {ach.image && <img src={ach.image} className="max-h-52 w-full object-cover rounded-xl shadow-sm" />}
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <style>{`
        ${isCustomMode ? portfolioSettings.customCss : ''}
        
        /* Ensure images inside custom HTML don't break layout */
        .custom-render-container img {
          max-width: 100%;
          height: auto;
        }

        @media print {
          aside, nav { display: none !important; }
          main { overflow: visible !important; height: auto !important; width: 100% !important; background: white !important; padding: 0 !important; }
          .max-w-4xl { max-width: 100% !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; }
          body { background: white !important; }
          #root { display: block !important; padding: 0 !important; }
          .h-[calc(100vh-100px)] { height: auto !important; }
          .rounded-2xl { border-radius: 0 !important; }
          .p-12 { padding: 0 !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PortfolioBuilder;
