import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { analyzeStudentProfile, generateLearningRoadmap } from '../services/geminiService';
import { 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  Target, 
  ArrowRight, 
  ArrowLeft,
  BrainCircuit,
  Cpu,
  ShieldCheck,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { Question } from '../types';
import { useNavigate } from 'react-router-dom';

const questions: Question[] = [
  {
    id: 1,
    text: "When solving a problem, what is your first instinct?",
    options: [
      "Break it down into logical steps and analyze data",
      "Think about how it affects people and emotions",
      "Look for a creative or out-of-the-box solution",
      "Start building/fixing immediately with my hands",
    ],
  },
  {
    id: 2,
    text: "Which school subject did you genuinely enjoy the most?",
    options: [
      "Mathematics & Logic",
      "Physics & Mechanics",
      "Computer Science & Coding",
      "Arts & Design",
    ],
  },
  {
    id: 3,
    text: "In a group project, what role do you naturally take?",
    options: [
      "The Leader (Planning & Organizing)",
      "The Builder (Doing the technical work)",
      "The Presenter (Communicating ideas)",
      "The Researcher (Gathering information)",
    ],
  },
  {
    id: 4,
    text: "What interests you more about technology?",
    options: [
      "How software and apps are built",
      "How physical machines and robots move",
      "How electronics and circuits function",
      "How technology impacts society and environment",
    ],
  },
  {
    id: 5,
    text: "Choose a weekend activity:",
    options: [
      "Solving puzzles or playing strategy games",
      "Building a DIY project or repairing something",
      "Drawing, painting, or designing",
      "Reading about new scientific discoveries",
    ],
  }
];

const ANALYSIS_STAGES = [
  "Deep-scanning technical interests...",
  "Synthesizing behavioral data...",
  "Cross-referencing industry roles...",
  "Architecting your path...",
  "Compiling results..."
];

const Discovery: React.FC = () => {
  const { user, testResult, setTestResult, roadmaps, saveRoadmap } = useStore();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [generatingDomain, setGeneratingDomain] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalysisStage(prev => (prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="p-4 bg-yellow-50 text-yellow-600 rounded-full">
           <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Profile Required</h2>
        <p className="text-slate-500">Finish your profile before taking the Discovery Test.</p>
        <button onClick={() => navigate('/profile')} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">Go to Profile</button>
      </div>
    );
  }

  const handleOptionSelect = async (option: string) => {
    setSelectedOption(option);
    const updatedAnswers = [...answers];
    updatedAnswers[currentStep] = { question: questions[currentStep].text, answer: option };
    setAnswers(updatedAnswers);

    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setSelectedOption(null);
      }, 300);
    } else {
      // LAST QUESTION logic
      setIsTransitioning(true);
      // Wait for the progress bar to hit 100% visually
      setTimeout(() => {
        startAnalysis(updatedAnswers);
      }, 600);
    }
  };

  const startAnalysis = async (finalAnswers: { question: string; answer: string }[]) => {
    setIsAnalyzing(true);
    setIsTransitioning(false);
    setError(null);
    try {
      const result = await analyzeStudentProfile(finalAnswers);
      // Small delay for psychological impact of "Deep Analysis"
      await new Promise(r => setTimeout(r, 1500));
      setTestResult(result);
    } catch (err) {
      setError("AI analysis timed out. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const handleInitializePath = async (domain: string) => {
    setGeneratingDomain(domain);
    try {
      let existing = roadmaps.find(r => r.domain === domain);
      if (!existing) {
        const roadmap = await generateLearningRoadmap(domain);
        saveRoadmap(roadmap);
      }
      navigate('/roadmap');
    } catch (err) {
      setError(`Failed to generate path for ${domain}.`);
    } finally {
      setGeneratingDomain(null);
    }
  };

  // 1. LOADING SCREEN
  if (isAnalyzing && !testResult) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh] text-center space-y-12 animate-fade-in">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <BrainCircuit className="w-12 h-12 text-indigo-600 animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Processing Career DNA</h2>
           <p className="text-slate-500 font-medium text-lg min-h-[1.5em]">
             {ANALYSIS_STAGES[analysisStage]}
           </p>
           <div className="w-72 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(79,70,229,0.3)]" 
                style={{ width: `${((analysisStage + 1) / ANALYSIS_STAGES.length) * 100}%` }}
              ></div>
           </div>
        </div>
      </div>
    );
  }

  // 2. RESULTS VIEW
  if (testResult) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 bg-indigo-600 h-full"></div>
          <div className="bg-indigo-50 p-6 rounded-3xl shrink-0">
             <Sparkles className="w-16 h-16 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Career Architecture Ready</h1>
            <p className="text-slate-500 mt-2 font-medium leading-relaxed max-w-2xl">
              We've mapped your cognitive profile. Select a branch below to build your roadmap.
            </p>
          </div>
          <button 
            onClick={() => { setTestResult(null as any); setCurrentStep(0); setAnswers([]); setSelectedOption(null); setIsAnalyzing(false); }}
            className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-indigo-600 font-bold transition-all border border-slate-100 rounded-2xl hover:bg-slate-50"
          >
             <RotateCcw className="w-4 h-4" /> Restart
          </button>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
           <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2 relative z-10">
              <ShieldCheck className="w-5 h-5" /> Cognitive Profile
           </h2>
           <p className="text-xl md:text-2xl font-bold leading-relaxed relative z-10">{testResult.personalitySummary}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-indigo-600" /> Top Matches
              </h3>
              <div className="grid gap-4">
                 {testResult.recommendedBranches.map((rec, idx) => (
                   <button 
                     key={idx}
                     onClick={() => handleInitializePath(rec.branch)}
                     disabled={!!generatingDomain}
                     className="w-full text-left bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all group relative overflow-hidden"
                   >
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                           <Cpu className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        {generatingDomain === rec.branch ? (
                          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> Preparing...
                          </div>
                        ) : (
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Select Path</div>
                        )}
                     </div>
                     <h4 className="font-black text-xl text-slate-900 mb-2">{rec.branch}</h4>
                     <p className="text-slate-500 text-sm leading-relaxed mb-6">{rec.reason}</p>
                     <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                        View Roadmap <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                 <Target className="w-5 h-5 text-blue-600" /> Trending Niches
              </h3>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-3">
                 {testResult.subDomains.map((domain, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleInitializePath(domain)}
                     disabled={!!generatingDomain}
                     className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all group"
                   >
                      <span className="font-bold text-slate-700 text-sm">{domain}</span>
                      {generatingDomain === domain ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  // 3. QUIZ INTERFACE
  const progressPercent = isTransitioning ? 100 : Math.round((currentStep / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in min-h-[80vh] flex flex-col">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
           <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Self-Discovery Quiz</p>
              <h3 className="text-xl font-black text-slate-800">Section {currentStep + 1} of {questions.length}</h3>
           </div>
           <span className="text-3xl font-black text-slate-300">{progressPercent}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-xl border border-slate-100 space-y-12 relative overflow-hidden">
          {isTransitioning && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                   <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                   <p className="font-black text-slate-800">Finalizing Answers...</p>
                </div>
             </div>
          )}
          
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full opacity-40"></div>
          
          <div className="space-y-4 relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-[1.15] tracking-tight">
                {questions[currentStep]?.text}
              </h2>
              <p className="text-slate-400 font-medium">Be authentic. Your first instinct is usually the best.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 relative z-10">
            {questions[currentStep]?.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null || isTransitioning}
                  className={`
                    w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center justify-between group
                    ${isSelected 
                      ? 'bg-indigo-50 border-indigo-600 ring-4 ring-indigo-50 shadow-md' 
                      : 'bg-slate-50 border-slate-50 hover:border-indigo-400 hover:bg-white hover:shadow-lg'}
                  `}
                >
                  <span className={`text-lg font-bold transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {option}
                  </span>
                  <div className={`
                    w-8 h-8 rounded-full border flex items-center justify-center transition-all
                    ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200 group-hover:border-indigo-400'}
                  `}>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-slate-50 relative z-10">
             <button 
               onClick={() => { if(currentStep > 0) { setCurrentStep(prev => prev - 1); setSelectedOption(null); } }}
               disabled={currentStep === 0 || selectedOption !== null || isTransitioning}
               className={`flex items-center gap-2 font-bold transition-all ${currentStep === 0 ? 'opacity-0' : 'text-slate-400 hover:text-indigo-600'}`}
             >
                <ArrowLeft className="w-4 h-4" /> Go Back
             </button>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Question {currentStep + 1} / 5</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 font-bold text-sm border border-red-100 animate-shake">
           <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
    </div>
  );
};

export default Discovery;