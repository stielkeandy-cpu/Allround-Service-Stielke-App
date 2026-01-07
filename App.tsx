
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import { ServiceType, BookingRequest } from './types';
import { getGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
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

  const services = [
    { type: ServiceType.GARDENING, title: 'Gartenpflege', desc: 'Rasenmähen, Heckenschnitt und Beetpflege für einen traumhaften Garten.', icon: 'fa-leaf', color: 'bg-green-100 text-green-600' },
    { type: ServiceType.REPAIR, title: 'Hausmeisterservice', desc: 'Regelmäßige Kontrolle und Wartung Ihrer Immobilie.', icon: 'fa-key', color: 'bg-blue-100 text-blue-600' },
    { type: ServiceType.RENOVATION, title: 'Renovierung', desc: 'Malerarbeiten, Bodenlegen und kleine Trockenbau-Projekte.', icon: 'fa-paint-roller', color: 'bg-orange-100 text-orange-600' },
    { type: ServiceType.CLEANING, title: 'Reinigung', desc: 'Gründliche Treppenhaus- und Fensterreinigung.', icon: 'fa-broom', color: 'bg-purple-100 text-purple-600' }
  ];

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    const subject = encodeURIComponent(`Service-Anfrage: ${selectedService}`);
    const body = encodeURIComponent(`Hallo Allround Service Stielke,\n\nich möchte folgende Leistung anfragen:\n\nService: ${selectedService}\nDatum: ${bookingDate}\nBeschreibung: ${bookingDesc}\n\nBitte um Rückmeldung.`);
    
    window.location.href = `mailto:kontakt@allroundservicestielke.de?subject=${subject}&body=${body}`;
    
    setBookingDesc('');
    setBookingDate('');
    setTimeout(() => setShowSuccess(false), 8000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Allround Service Stielke - Kontaktanfrage`);
    const body = encodeURIComponent(`Name: ${contactName}\n\nNachricht:\n${contactMessage}`);
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
          <section className="animate-fade-in space-y-8">
            <div className="relative h-96 md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center border-4 border-white">
              <img src="https://images.unsplash.com/photo-1581578731522-745d05cb972b?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover" alt="Service background" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/85"></div>
              
              <div className="relative z-10 flex flex-col items-center max-w-3xl">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-8 transform hover:scale-105 transition-all duration-500 border border-slate-100 flex flex-col items-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-200">
                    <i className="fa-solid fa-broom text-5xl md:text-7xl"></i>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">ALLROUND SERVICE</span>
                    <span className="text-sm md:text-lg font-bold text-blue-600 uppercase tracking-widest mt-1">Stielke</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black mb-4 text-white drop-shadow-2xl tracking-tight">
                  Allround Service <span className="text-blue-400">Stielke</span>
                </h1>
                <p className="text-lg md:text-2xl text-blue-50 opacity-95 mb-10 max-w-2xl font-medium">
                  Kompetenter Service rund um Haus, Garten und Hof in Salzatal.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => setActiveTab('services')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all transform hover:scale-105 shadow-xl shadow-blue-900/30 flex items-center gap-3"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    Dienste entdecken
                  </button>
                  <button 
                    onClick={() => setActiveTab('contact')}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-2 border-white/30 font-bold py-4 px-10 rounded-2xl transition-all transform hover:scale-105"
                  >
                    Kontakt aufnehmen
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-inner`}>
                    <i className={`fa-solid ${s.icon}`}></i>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-800">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'services' && (
          <section className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Unsere Dienstleistungen</h2>
                <p className="text-slate-500 mt-2">Wählen Sie einen Service für eine Direktanfrage per E-Mail.</p>
              </div>
              {!showBookingForm && (
                <button 
                  onClick={() => setShowBookingForm(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  Jetzt anfragen
                </button>
              )}
            </div>

            {showBookingForm && (
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 p-6 md:p-10 animate-slide-up relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    Anfrage senden
                  </h3>
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
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">TERMIN</label>
                    <input 
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">DETAILS</label>
                    <textarea 
                      value={bookingDesc}
                      onChange={(e) => setBookingDesc(e.target.value)}
                      placeholder="Was können wir für Sie tun? Bitte beschreiben Sie Ihr Anliegen so genau wie möglich."
                      rows={5}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none font-medium"
                      required
                    ></textarea>
                  </div>

                  <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-slate-400">
                      <i className="fa-solid fa-circle-info text-blue-400"></i>
                      <p className="text-xs leading-relaxed">
                        Wir leiten Sie direkt zu Ihrem E-Mail Programm weiter an Allround Service Stielke.
                      </p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <button 
                        type="button"
                        onClick={() => setShowBookingForm(false)}
                        className="flex-1 md:flex-none px-8 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
                      >
                        Abbrechen
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 md:flex-none bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3"
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
                    <button 
                      onClick={() => openBooking(s.type)}
                      className="w-full bg-slate-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white border-2 border-blue-50 group-hover:border-blue-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300"
                    >
                      Jetzt Kontaktieren <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'assistant' && (
          <section className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
            <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md text-white">
                  <i className="fa-solid fa-broom text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Stielke Berater</h3>
                  <p className="text-xs opacity-75 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online & Hilfsbereit
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {chatMessages.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-comment-dots text-3xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Wie kann ich helfen?</h4>
                  <p className="text-slate-500 max-w-sm mx-auto">Fragen Sie nach unseren Preisen, freien Terminen oder speziellen Leistungen bei Allround Service Stielke.</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm ${
                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-5 rounded-3xl rounded-tl-none flex gap-1.5 shadow-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="p-6 bg-white border-t border-slate-100 flex gap-4">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Frage eingeben..."
                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
              />
              <button 
                type="submit"
                disabled={!userInput.trim() || isTyping}
                className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all hover:scale-105"
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
              </div>

              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                <h4 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-paper-plane text-blue-600"></i>
                  Direktanfrage
                </h4>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Ihr Name" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium" 
                  />
                  <textarea 
                    placeholder="Nachricht..." 
                    rows={4} 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none font-medium"
                  ></textarea>
                  <button 
                    onClick={handleContactSubmit}
                    className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100"
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
        <div className="flex justify-center gap-8 mt-4">
          <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors font-medium">Impressum</a>
          <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors font-medium">Datenschutz</a>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        body { background-color: #f8fafc; }
      `}</style>
    </div>
  );
};

export default App;
