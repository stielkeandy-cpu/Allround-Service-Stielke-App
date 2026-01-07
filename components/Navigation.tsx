
import React from 'react';

interface NavigationProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, setTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'fa-home' },
    { id: 'services', label: 'Services', icon: 'fa-tools' },
    { id: 'assistant', label: 'KI-Berater', icon: 'fa-robot' },
    { id: 'contact', label: 'Kontakt', icon: 'fa-envelope' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_25px_rgba(0,0,0,0.05)] px-4 pb-[env(safe-area-inset-bottom)] pt-2 md:top-0 md:bottom-auto md:px-12 flex justify-around md:justify-between items-center z-50 h-20 md:h-20 transition-all">
      <div 
        className="hidden md:flex items-center gap-3 font-bold text-slate-800 text-lg cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setTab('home')}
      >
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <i className="fa-solid fa-broom text-xl"></i>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-blue-600 font-black tracking-tight">ALLROUND SERVICE</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Stielke</span>
        </div>
      </div>
      <div className="flex w-full md:w-auto justify-around gap-2 md:gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-2xl transition-all ${
              currentTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`flex items-center justify-center transition-all ${currentTab === tab.id ? 'scale-110' : 'scale-100'}`}>
               <i className={`fa-solid ${tab.icon} text-xl md:text-xl`}></i>
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{tab.label}</span>
            {currentTab === tab.id && <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse md:hidden"></div>}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
