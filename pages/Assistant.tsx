import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { GoogleGenAI } from "@google/genai";
import { Send, Loader2, Sparkles, User, Bot, Trash2 } from 'lucide-react';

const Assistant: React.FC = () => {
  const { user, roadmaps, goals, studyStats } = useStore();
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: `Hi ${user?.name || 'there'}! I'm your StudentPath AI Assistant. How can I help you today with your learning journey?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        You are an expert AI Study Assistant for StudentPath.
        User Context:
        - Name: ${user?.name}
        - Grade: ${user?.grade}
        - Current Roadmaps: ${roadmaps.map(r => r.domain).join(', ')}
        - Daily Goals: ${goals.filter(g => g.type === 'daily' && !g.completed).map(g => g.text).join(', ')}
        - Study Stats: ${studyStats.studyHours} study hours, ${studyStats.problemsSolved} problems solved.

        Be supportive, technical but beginner-friendly, and always encourage the user based on their specific progress.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction,
        },
      });

      const botText = response.text || "I'm sorry, I couldn't process that. Can you try again?";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to AI. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
           <div className="bg-white/20 p-2 rounded-xl">
              <Sparkles className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-xl font-bold">AI Study Assistant</h1>
              <p className="text-xs text-indigo-100 opacity-80">Online & Ready to Guide</p>
           </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'bot', text: "Chat cleared. What's on your mind?" }])}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-100'}`}>
                {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-indigo-600" />}
              </div>
              <div className={`p-4 rounded-3xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'} shadow-sm text-sm leading-relaxed whitespace-pre-wrap`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                 <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              </div>
              <div className="bg-slate-100 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-100">
        <form onSubmit={handleSend} className="relative flex gap-3">
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Ask about coding, roadmaps, or doubts..."
             className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
           />
           <button 
             type="submit"
             disabled={isLoading || !input.trim()}
             className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
           >
             <Send className="w-6 h-6" />
           </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-bold uppercase tracking-widest">Powered by Gemini AI</p>
      </div>
    </div>
  );
};

export default Assistant;