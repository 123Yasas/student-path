import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { GraduationCap, Mail, Lock, User, BookOpen, ArrowRight, AlertCircle, Calendar, Hash } from 'lucide-react';

const Auth: React.FC = () => {
  const { login, signup } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    grade: '', // Specialization/Stream
    year: '',  // Current Year
    dateOfBirth: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(formData.email, formData.password);
      if (!success) setError('Invalid email or password.');
    } else {
      if (!formData.name || !formData.grade || !formData.year || !formData.dateOfBirth) {
        setError('Please fill in all fields.');
        return;
      }
      signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        grade: formData.grade,
        year: formData.year,
        dateOfBirth: formData.dateOfBirth
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Left Side: Branding */}
        <div className="bg-indigo-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white p-2 rounded-xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-indigo-700" />
              </div>
              <span className="text-2xl font-black tracking-tighter">StudentPath</span>
            </div>
            
            <h1 className="text-4xl font-black leading-tight mb-4">
              Master Your <br /> 
              <span className="text-indigo-300">Engineering</span> Future.
            </h1>
            <p className="text-indigo-100 text-lg opacity-80 leading-relaxed">
              Join thousands of students building their portfolios, tracking goals, and finding their path with AI.
            </p>
          </div>

          <div className="relative z-10 pt-12">
            <div className="flex -space-x-3 mb-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className={`w-10 h-10 rounded-full border-2 border-indigo-700 bg-indigo-${i+2}00 flex items-center justify-center text-[10px] font-bold`}>
                   {['JS', 'PY', 'AI', 'ME'][i-1]}
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-indigo-700 bg-white/20 flex items-center justify-center text-[10px] font-bold">
                 +12k
               </div>
            </div>
            <p className="text-xs font-bold text-indigo-200">ACTIVE STUDENTS GLOBALLY</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[90vh]">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {isLogin ? "Continue your growth journey." : "Start tracking your achievements today."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-sm font-semibold animate-shake">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Stream / Grade</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text"
                        required
                        value={formData.grade}
                        onChange={e => setFormData({...formData, grade: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="e.g. Science, CSE"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Year</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select 
                        required
                        value={formData.year}
                        onChange={e => setFormData({...formData, year: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                      >
                        <option value="">Year</option>
                        <option value="9th Grade">9th Grade</option>
                        <option value="10th Grade">10th Grade</option>
                        <option value="11th Grade">11th Grade</option>
                        <option value="12th Grade">12th Grade</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="Final Year">Final Year</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="date" 
                      required
                      value={formData.dateOfBirth}
                      onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group mt-6"
            >
              {isLogin ? 'Sign In' : 'Get Started'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-500 font-bold hover:text-indigo-600 transition-colors text-sm"
            >
              {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;