
import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import { ServiceType } from './types';
import { getGeminiResponse } from './services/geminiService';

const PHONE_NUMBER = "015123556495";
const WHATSAPP_NUMBER = "4915123556495";

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex flex-col leading-none items-center md:items-start ${className}`}>
    <div className="flex items-center gap-2">
      <span className="text-slate-900 font-black tracking-tighter text-2xl md:text-3xl uppercase">Allround Service</span>
    </div>
    <div className="flex items-center gap-2 mt-1">
      <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
      <span className="text-blue-600 font-black text-sm md:text-lg tracking-[0.4em] uppercase">Stielke</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  const handleWhatsAppOpen = (msg?: string) => {
    const text = msg || "Ich habe eine Anfrage über die App.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;
    const msg = userInput;
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setUserInput('');
    setIsTyping(true);
    const response = await getGeminiResponse(msg);
    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  const tarife = [
    { title: "Standard-Reinigung", price: "ab 99 € / Monat", details: ["SmartClean Basis", "ComfortCare", "PremiumPro"], icon: "fa-house-chimney-window", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Ferienwohnungen", price: "ab 49 € / Reinigung", details: ["Endreinigung", "Wäscheservice", "HolidayPlus"], icon: "fa-umbrella-beach", color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Monteurwohnungen", price: "ab 69 € / Woche", details: ["WorkerClean", "WorkerPro Täglich", "Wäscheservice"], icon: "fa-helmet-safety", color: "text-slate-600", bg: "bg-slate-100" },
    { title: "Glasreinigung", price: "ab 3,50 € / Fenster", details: ["Rahmen & Falz", "Nano-Versiegelung", "Gewerbe"], icon: "fa-sparkles", color: "text-cyan-500", bg: "bg-cyan-50" },
    { title: "Büroreinigung", price: "ab 149 € / Monat", details: ["OfficeClean", "Desinfektion", "Teppichpflege"], icon: "fa-briefcase", color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Industriereinigung", price: "ab 399 € / Monat", details: ["Produktionsflächen", "Maschinenpflege", "IndustriPro"], icon: "fa-industry", color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-0 md:pt-24 bg-slate-50">
      <Navigation currentTab={activeTab} setTab={setActiveTab} />
      
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        
        {activeTab === 'home' && (
          <section className="animate-fade-in space-y-8">
            <div className="relative h-[450px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center">
              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
              <div className="absolute inset-0 bg-slate-900/60"></div>
              <div className="relative z-10 space-y-6">
                <div className="bg-white/95 p-8 rounded-[2.5rem] inline-block mb-4 shadow-xl">
                  <Logo />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Ihre Reinigungsprofis <br/>aus Salzatal</h1>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button onClick={() => setActiveTab('services')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-transform">Unsere Tarife</button>
                  <button onClick={() => setActiveTab('assistant')} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <i className="fa-solid fa-robot"></i> KI-Berater
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                 <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl"><i className="fa-solid fa-shield-check"></i></div>
                 <div>
                    <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Verlässlich</h3>
                    <p className="font-bold text-slate-800">100% Servicegarantie</p>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl"><i className="fa-solid fa-leaf"></i></div>
                 <div>
                    <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Ökologisch</h3>
                    <p className="font-bold text-slate-800">Schonende Reinigung</p>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                 <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl"><i className="fa-solid fa-clock-rotate-left"></i></div>
                 <div>
                    <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Express</h3>
                    <p className="font-bold text-slate-800">Service in 24h</p>
                 </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'services' && (
          <section className="space-y-8 animate-fade-in pb-10">
            <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black uppercase tracking-tight">Unsere Reinigungstarife</h2>
                <p className="opacity-80 mt-2">Professionell, zuverlässig und fair kalkuliert.</p>
              </div>
              <i className="fa-solid fa-broom absolute right-[-20px] bottom-[-20px] text-[120px] opacity-10 rotate-12"></i>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tarife.map((t, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                  <div>
                    <div className={`w-14 h-14 ${t.bg} ${t.color} rounded-2xl flex items-center justify-center text-2xl mb-6 transition-transform group-hover:scale-110`}>
                      <i className={`fa-solid ${t.icon}`}></i>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">{t.title}</h3>
                    <div className="text-blue-600 font-black text-lg mb-4">{t.price}</div>
                    <ul className="space-y-2 mb-8">
                      {t.details.map((d, idx) => (
                        <li key={idx} className="text-slate-500 text-sm flex items-center gap-2">
                          <i className="fa-solid fa-check text-[10px] text-green-500"></i> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    onClick={() => handleWhatsAppOpen(`Anfrage zu Tarif: ${t.title}`)} 
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-colors active:scale-95"
                  >
                    Details Anfragen
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-white text-orange-600 rounded-full flex items-center justify-center text-2xl shadow-sm"><i className="fa-solid fa-bolt"></i></div>
                 <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-tight">Express-Service benötigt?</h4>
                    <p className="text-slate-600 text-sm">Reinigung innerhalb von 24 Stunden möglich.</p>
                 </div>
               </div>
               <button onClick={() => handleWhatsAppOpen("EILANFRAGE: Express-Reinigung benötigt!")} className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-orange-200">Sofort-Check</button>
            </div>
          </section>
        )}

        {activeTab === 'assistant' && (
          <section className="h-[calc(100vh-16rem)] bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden animate-fade-in relative">
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <i className="fa-solid fa-robot text-sm"></i>
                </div>
                <span className="font-black text-xs uppercase tracking-widest">KI-Fachberater</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isTyping ? 'text-blue-400' : 'text-green-400'}`}>
                  {isTyping ? 'Erstellt Antwort...' : 'Online'}
                </span>
                <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-blue-400 animate-ping' : 'bg-green-500 animate-pulse'}`}></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 relative">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-30">
                   <i className="fa-solid fa-comments text-4xl mb-4 text-slate-400"></i>
                   <p className="font-bold uppercase text-xs tracking-[0.2em] px-10">Fragen Sie nach unseren Reinigungstarifen oder Dienstleistungen!</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white text-slate-800 border border-slate-100 shadow-sm p-4 rounded-2xl rounded-tl-none flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Stielke-KI denkt...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <form onSubmit={handleChatSubmit} className="flex gap-2 items-center">
                <input 
                  type="text" 
                  value={userInput} 
                  onChange={(e) => setUserInput(e.target.value)} 
                  disabled={isTyping}
                  placeholder={isTyping ? "Bitte kurz warten..." : "Was kostet die Reinigung?"} 
                  className={`flex-1 bg-slate-100 rounded-xl px-4 py-4 text-sm outline-none transition-all ${isTyping ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-100'}`} 
                />
                <button 
                  type="submit" 
                  disabled={isTyping || !userInput.trim()}
                  className={`bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${isTyping || !userInput.trim() ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-blue-700 shadow-blue-200'}`}
                >
                  <i className={`fa-solid ${isTyping ? 'fa-circle-notch fa-spin' : 'fa-paper-plane'}`}></i>
                </button>
              </form>
            </div>
          </section>
        )}

        {activeTab === 'contact' && (
          <section className="space-y-8 animate-fade-in pb-10">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-12 text-center md:text-left">
              <Logo className="mx-auto md:mx-0" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-5 p-6 bg-blue-50 rounded-2xl border border-blue-100 active:scale-95 transition-transform">
                  <div className="w-14 h-14 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><i className="fa-solid fa-phone text-xl"></i></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anrufen</p>
                    <p className="font-black text-slate-800">{PHONE_NUMBER}</p>
                  </div>
                </a>
                <button onClick={() => handleWhatsAppOpen()} className="flex items-center gap-5 p-6 bg-green-50 rounded-2xl border border-green-100 active:scale-95 transition-transform text-left w-full">
                  <div className="w-14 h-14 bg-white text-green-600 rounded-xl flex items-center justify-center shadow-sm"><i className="fa-brands fa-whatsapp text-2xl"></i></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</p>
                    <p className="font-black text-slate-800">Schnellanfrage</p>
                  </div>
                </button>
                <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-14 h-14 bg-white text-slate-600 rounded-xl flex items-center justify-center shadow-sm"><i className="fa-solid fa-location-dot text-xl"></i></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standort</p>
                    <p className="font-black text-slate-800">Salzatal</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-[2rem] p-8 space-y-4 max-w-md mx-auto md:mx-0">
                <h3 className="font-black uppercase tracking-widest text-xs text-blue-400 text-center mb-4">Kontakt Details</h3>
                <p className="text-sm text-slate-400 text-center md:text-left">Naundorfer Weg 4, 06198 Salzatal</p>
                <div className="h-px bg-slate-800 my-4"></div>
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <span>Montag - Freitag</span>
                  <span>08:00 - 18:00 Uhr</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Floating Action WhatsApp */}
      <div className="fixed bottom-28 right-6 z-40">
        <button 
          onClick={() => handleWhatsAppOpen()} 
          className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
        >
          <i className="fa-brands fa-whatsapp text-3xl"></i>
        </button>
      </div>

    </div>
  );
};

export default App;
