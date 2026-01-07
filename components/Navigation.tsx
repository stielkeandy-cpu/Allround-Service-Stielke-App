
import React from 'react';

interface NavigationProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, setTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'fa-house' },
    { id: 'services', label: 'Leistungen', icon: 'fa-screwdriver-wrench' },
    { id: 'assistant', label: 'KI-Berater', icon: 'fa-robot' },
    { id: 'contact', label: 'Kontakt', icon: 'fa-address-book' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b safe-pb">
      <div className="max-w-5xl mx-auto px-6 h-20 md:h-24 flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 px-3 transition-all ${
              currentTab === tab.id ? 'text-blue-600 scale-105' : 'text-slate-400'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-xl md:text-2xl`}></i>
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
              {tab.label}
            </span>
            {currentTab === tab.id && (
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
