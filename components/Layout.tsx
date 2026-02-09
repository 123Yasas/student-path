import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  LayoutDashboard, 
  Compass, 
  Map, 
  Target, 
  Library, 
  UserCircle,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  Trophy,
  LogOut,
  Star
} from 'lucide-react';

const Layout: React.FC = () => {
  const { logout, user } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Study Space", icon: LayoutDashboard },
    { to: "/discovery", label: "Discovery", icon: Compass },
    { to: "/roadmap", label: "Roadmaps", icon: Map },
    { to: "/achievements", label: "Achievements", icon: Trophy },
    { to: "/portfolio", label: "Build Portfolio", icon: Star },
    { to: "/assistant", label: "AI Assistant", icon: Sparkles },
    { to: "/goals", label: "Goals", icon: Target },
    { to: "/resources", label: "Resources", icon: Library },
    { to: "/profile", label: "Profile", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center shadow-md z-20">
        <div className="flex items-center gap-2 font-bold text-lg">
          <GraduationCap className="w-6 h-6" />
          <span>StudentPath</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-indigo-800 text-white transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 flex flex-col shadow-xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3 font-black text-2xl border-b border-indigo-700">
          <GraduationCap className="w-8 h-8 text-indigo-300" />
          <span>StudentPath</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            const isPortfolio = item.to === '/portfolio';

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group
                  ${isActive 
                    ? 'bg-white text-indigo-900 shadow-xl font-bold translate-x-1' 
                    : isPortfolio 
                      ? 'bg-indigo-700/50 text-yellow-400 hover:bg-indigo-600'
                      : 'text-indigo-100 hover:bg-indigo-700/50 hover:text-white'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : isPortfolio ? 'text-yellow-400' : 'group-hover:scale-110 transition-transform'}`} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-700 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-indigo-900/40 rounded-xl border border-indigo-700/50">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">
                {user?.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user?.name}</p>
                <p className="text-[10px] text-indigo-300 truncate opacity-70">{user?.email}</p>
             </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-indigo-200 hover:text-white hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;