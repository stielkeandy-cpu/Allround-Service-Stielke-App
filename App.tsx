
import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import { ServiceType, BookingRequest } from './types';
import { getGeminiResponse } from './services/geminiService';

const APP_VERSION = "1.3.1"; // Contact Validation Update
const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR_SCHEDULE_ID"; // Platzhalter für Ihren Buchungslink

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Booking States
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>(ServiceType.GARDENING);
  const [bookingDesc, setBookingDesc] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Contact States
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [formAttempted, setFormAttempted] = useState(false);

  const services = [
    { type: ServiceType.GARDENING, title: 'Gartenpflege', desc: 'Rasenmähen, Heckenschnitt und Beetpflege für einen traumhaften Garten.', icon: 'fa-seedling', color: 'bg-green-100 text-green-600', accent: 'border-green-200' },
    { type: ServiceType.REPAIR, title: 'Hausmeisterservice', desc: 'Regelmäßige Kontrolle und Wartung Ihrer Immobilie.', icon: 'fa-screwdriver-wrench', color: 'bg-blue-100 text-blue-600', accent: 'border-blue-200' },
    { type: ServiceType.RENOVATION, title: 'Renovierung', desc: 'Malerarbeiten, Bodenlegen und kleine Trockenbau-Projekte.', icon: 'fa-brush', color: 'bg-orange-100 text-orange-600', accent: 'border-orange-200' },
    { type: ServiceType.CLEANING, title: 'Reinigung', desc: 'Gründliche Treppenhaus- und Fensterreinigung.', icon: 'fa-soap', color: 'bg-purple-100 text-purple-600', accent: 'border-purple-200' }
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setUserInput('');
    setIsTyping(true);

    const response = await getGeminiResponse(userMsg);
    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  const openBooking = (type: ServiceType) => {
    setSelectedService(type);
    setShowBookingForm(true);
    setActiveTab('services');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: BookingRequest = {
      id: Math.random().toString(36).substr(2, 9),
      serviceType: selectedService,
      description: bookingDesc,
      date: bookingDate,
      status: 'pending'
    };
    
    setBookings(prev => [...prev, newBooking]);
    setShowSuccess(true);
    setShowBookingForm(false);
    
    const subject = encodeURIComponent(`Service-Anfrage: ${selectedService} (App v${APP_VERSION})`);
    const body = encodeURIComponent(`Hallo Allround Service Stielke,\n\nich möchte folgende Leistung anfragen:\n\nService: ${selectedService}\nDatum: ${bookingDate}\nBeschreibung: ${bookingDesc}\n\nBitte um Rückmeldung.\n\n---\nGesendet via App v${APP_VERSION}`);
    
    window.location.href = `mailto:kontakt@allroundservicestielke.de?subject=${subject}&body=${body}`;
    
    setBookingDesc('');
    setBookingDate('');
    setTimeout(() => setShowSuccess(false), 8000);
  };

  const handleCalendarOpen = () => {
    window.open(GOOGLE_CALENDAR_URL, '_blank');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormAttempted(true);
    
    if (!contactName.trim() || !contactMessage.trim()) {
      setContactError("Bitte füllen Sie beide Felder aus.");
      return;
    }

    setContactError(null);
    const subject = encodeURIComponent(`Allround Service Stielke - Kontaktanfrage`);
    const body = encodeURIComponent(`Name: ${contactName}\n\nNachricht:\n${contactMessage}\n\n---\nGesendet via App v${APP_VERSION}`);
    window.location.href = `mailto:kontakt@allroundservicestielke.de?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pt-20">
      <Navigation currentTab={activeTab} setTab={setActiveTab} />
      
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        {showSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-white border border-green-100 px-6 py-4 rounded-3xl shadow-2xl flex flex-col items-center gap-2 animate-bounce">
            <div className="flex items-center gap-3 text-green-600 font-bold">
              <i className="fa-solid fa-circle-check text-2xl"></i>
              <span>E-Mail Entwurf wurde erstellt!</span>
            </div>
            <p className="text-xs text-slate-500 text-center">Sollte sich Ihr E-Mail Programm nicht geöffnet haben, senden Sie uns bitte direkt eine Nachricht an kontakt@allroundservicestielke.de</p>
          </div>
        )}

        {activeTab === 'home' && (
          <section className="animate-fade-in space-y-10 relative">
            {/* Hero Section */}
            <div className="relative h-96 md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center border-4 border-white">
              <img src="https://images.unsplash.com/photo-1581578731522-745d05cb972b?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover" alt="Service background" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/85"></div>
              
              <div className="relative z-10 flex flex-col items-center max-w-3xl">
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-8 transform hover:scale-105 transition-all duration-500 border border-slate-100 flex flex-col items-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-200">
                    <i className="fa-solid fa-screwdriver-wrench text-3xl md:text-5xl"></i>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Allround Service</span>
                    <span className="text-sm md:text-lg font-bold text-blue-600 uppercase tracking-widest mt-1">Stielke</span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-6xl font-black mb-4 text-white drop-shadow-2xl tracking-tight">
                  Ihr Partner in <span className="text-blue-400">Salzatal</span>
                </h1>
                <p className="text-base md:text-xl text-blue-50 opacity-95 mb-8 max-w-2xl font-medium">
                  Professionelle Haus- und Gartenpflege aus einer Hand.
                </p>

                <button 
                  onClick={() => setActiveTab('services')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  <i className="fa-solid fa-calendar-days"></i>
                  Termin buchen
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Schnellzugriff</h2>
              <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4">
                {services.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => openBooking(s.type)}
                    className={`flex-shrink-0 w-40 md:w-full bg-white p-5 rounded-[2rem] border-2 ${s.accent} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-3 group`}
                  >
                    <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{s.title} anfragen</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
                  <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-inner`}>
                    <i className={`fa-solid ${s.icon}`}></i>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-800">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">
              {isChatOpen && (
                <div className="w-[calc(100vw-3rem)] md:w-96 h-[500px] bg-slate-50 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden animate-slide-up pointer-events-auto mb-2">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                        <i className="fa-solid fa-robot"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">KI-Helfer</span>
                        <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Stielke Service</span>
                      </div>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 w-8 h-8 rounded-full transition-colors flex items-center justify-center">
                      <i className="fa-solid fa-minus"></i>
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {chatMessages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center px-4 opacity-40">
                         <i className="fa-solid fa-message-dots text-3xl mb-3"></i>
                         <p className="text-sm">Haben Sie eine Frage zu unseren Leistungen? Ich helfe Ihnen gerne weiter.</p>
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none' 
                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/50'
                        } text-sm leading-relaxed`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-200/50 p-3 rounded-2xl rounded-tl-none flex gap-1.5 shadow-sm">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                    <input 
                      type="text" 
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Ihre Nachricht..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!userInput.trim() || isTyping}
                      className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 shadow-md transition-all active:scale-90"
                    >
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                  </form>
                </div>
              )}
              
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 pointer-events-auto transform hover:scale-110 active:scale-95 ${
                  isChatOpen ? 'bg-slate-800 rotate-90' : 'bg-blue-600 animate-pulse-slow'
                }`}
              >
                <i className={`fa-solid ${isChatOpen ? 'fa-xmark' : 'fa-robot'} text-2xl`}></i>
              </button>
            </div>
          </section>
        )}

        {activeTab === 'services' && (
          <section className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Termin & Buchung</h2>
                <p className="text-slate-500 mt-2">Buchen Sie direkt online oder senden Sie uns eine Anfrage.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleCalendarOpen}
                  className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg"
                >
                  <i className="fa-solid fa-calendar-check"></i>
                  Direkt-Termin
                </button>
                {!showBookingForm && (
                  <button 
                    onClick={() => setShowBookingForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                    Anfrage senden
                  </button>
                )}
              </div>
            </div>

            {showBookingForm && (
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 p-6 md:p-10 animate-slide-up relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      Service anfragen
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 ml-13">Per E-Mail Entwurf</p>
                  </div>
                  <button onClick={() => setShowBookingForm(false)} className="bg-slate-50 text-slate-400 hover:text-slate-600 p-3 rounded-full transition-colors">
                    <i className="fa-solid fa-xmark text-xl"></i>
                  </button>
                </div>
                
                <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">LEISTUNG</label>
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value as ServiceType)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                      required
                    >
                      {Object.values(ServiceType).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">TERMINWUNSCH</label>
                    <input 
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">BESCHREIBUNG</label>
                    <textarea 
                      value={bookingDesc}
                      onChange={(e) => setBookingDesc(e.target.value)}
                      placeholder="Was können wir für Sie tun?"
                      rows={5}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none font-medium"
                      required
                    ></textarea>
                  </div>

                  <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-50">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                        <i className="fa-solid fa-calendar-check text-blue-600"></i>
                        <span>Alternative: Google Kalender</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Direkte Terminbuchung ohne Wartezeit.</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <button 
                        type="button"
                        onClick={handleCalendarOpen}
                        className="flex-1 md:flex-none px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="fa-brands fa-google"></i>
                        Kalender
                      </button>
                      <button 
                        type="submit"
                        className="flex-2 md:flex-none bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3"
                      >
                        <i className="fa-solid fa-envelope-open-text"></i>
                        E-Mail Entwurf
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((s, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  <div className="relative h-56 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${s.title}/800/600`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={s.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`absolute top-6 left-6 ${s.color} px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg`}>
                      QUALITÄT
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-xl shadow-inner`}>
                        <i className={`fa-solid ${s.icon}`}></i>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">{s.title}</h3>
                    </div>
                    <p className="text-slate-500 mb-8 flex-1 leading-relaxed">{s.desc}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleCalendarOpen}
                        className="flex-1 bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-slate-900 shadow-md"
                        title="Direkt im Google Kalender buchen"
                      >
                        <i className="fa-solid fa-calendar-check"></i>
                        Termin
                      </button>
                      <button 
                        onClick={() => openBooking(s.type)}
                        className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-blue-700 shadow-md shadow-blue-100"
                      >
                        Anfrage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'assistant' && (
          <section className="h-[calc(100vh-12rem)] flex flex-col bg-slate-50 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md text-white border border-white/10">
                  <i className="fa-solid fa-screwdriver-wrench text-2xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-xl leading-tight">Stielke Berater</h3>
                  <p className="text-xs opacity-80 flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                    KI-Assistent ist bereit
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatMessages.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner rotate-3 hover:rotate-0 transition-transform">
                    <i className="fa-solid fa-comments text-3xl"></i>
                  </div>
                  <h4 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Wie kann ich Ihnen helfen?</h4>
                  <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">Fragen Sie mich nach Preisen, freien Terminen oder speziellen Leistungen von Allround Service Stielke.</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                  <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[2rem] shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-blue-100' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/50'
                  } leading-relaxed`}>
                    <p className="text-sm md:text-base">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200/50 p-5 rounded-3xl rounded-tl-none flex gap-2 shadow-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="p-6 bg-white border-t border-slate-100 flex gap-4">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ihre Nachricht an uns..."
                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-700"
              />
              <button 
                type="submit"
                disabled={!userInput.trim() || isTyping}
                className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-100 transition-all hover:scale-105 active:scale-95"
              >
                <i className="fa-solid fa-paper-plane text-xl"></i>
              </button>
            </form>
          </section>
        )}

        {activeTab === 'contact' && (
          <section className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 animate-fade-in mb-12">
            <h2 className="text-4xl font-black mb-10 text-slate-800 tracking-tight">Kontakt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <i className="fa-solid fa-location-dot text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-400 text-xs uppercase tracking-widest mb-1">Anschrift</h4>
                    <p className="text-slate-700 font-bold">Naundorfer Weg 4</p>
                    <p className="text-slate-500">06198 Salzatal</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <i className="fa-solid fa-phone text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-400 text-xs uppercase tracking-widest mb-1">Telefon</h4>
                    <a href="tel:015123556495" className="text-slate-700 font-bold hover:text-blue-600 transition-colors">015123556495</a>
                  </div>
                </div>
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <i className="fa-solid fa-envelope text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-400 text-xs uppercase tracking-widest mb-1">E-Mail</h4>
                    <a href="mailto:kontakt@allroundservicestielke.de" className="text-blue-600 font-bold hover:underline break-all">kontakt@allroundservicestielke.de</a>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-50 flex items-center gap-2 opacity-40">
                  <i className="fa-solid fa-code-branch text-[10px]"></i>
                  <span className="text-[10px] font-bold tracking-widest uppercase">Version {APP_VERSION}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                <h4 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-paper-plane text-blue-600"></i>
                  Direktanfrage
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      placeholder="Ihr Name" 
                      value={contactName}
                      onChange={(e) => {
                        setContactName(e.target.value);
                        if (e.target.value.trim()) setContactError(null);
                      }}
                      className={`w-full bg-white border-2 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium ${
                        formAttempted && !contactName.trim() ? 'border-red-400 animate-shake' : 'border-slate-100'
                      }`} 
                    />
                  </div>
                  <div className="space-y-1">
                    <textarea 
                      placeholder="Nachricht..." 
                      rows={4} 
                      value={contactMessage}
                      onChange={(e) => {
                        setContactMessage(e.target.value);
                        if (e.target.value.trim()) setContactError(null);
                      }}
                      className={`w-full bg-white border-2 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none font-medium transition-all ${
                        formAttempted && !contactMessage.trim() ? 'border-red-400 animate-shake' : 'border-slate-100'
                      }`}
                    ></textarea>
                  </div>
                  
                  {contactError && (
                    <p className="text-xs text-red-500 font-bold ml-1 animate-fade-in">
                      <i className="fa-solid fa-circle-exclamation mr-1"></i>
                      {contactError}
                    </p>
                  )}

                  <button 
                    onClick={handleContactSubmit}
                    className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95"
                  >
                    <i className="fa-solid fa-envelope-open-text text-xl"></i>
                    E-Mail Entwurf
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                    Alle Anfragen werden per E-Mail an kontakt@allroundservicestielke.de weitergeleitet.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="hidden md:block py-16 text-center">
        <div className="max-w-xs mx-auto mb-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-lg">
            <i className="fa-solid fa-broom text-xl"></i>
          </div>
        </div>
        <p className="text-slate-400 text-sm">&copy; 2024 Allround Service Stielke. Alle Rechte vorbehalten.</p>
        <div className="flex justify-center gap-8 mt-4 items-center">
          <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors font-medium">Impressum</a>
          <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors font-medium">Datenschutz</a>
          <span className="text-[10px] text-slate-300 font-bold border border-slate-200 px-2 py-0.5 rounded-full">v{APP_VERSION}</span>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse-slow { 
          0%, 100% { transform: scale(1); box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3); }
          50% { transform: scale(1.05); box-shadow: 0 15px 45px rgba(37, 99, 235, 0.5); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        body { background-color: #f8fafc; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
