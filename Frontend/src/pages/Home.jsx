import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import html2canvas from 'html2canvas';
import SubscriptionModal from '../components/SubscriptionModal';
import { 
  Sparkles, 
  Cake, 
  Heart, 
  Flame, 
  HeartHandshake, 
  Zap, 
  Plane, 
  Leaf, 
  Briefcase, 
  Palette, 
  Minus, 
  Music, 
  Edit3,
  Menu,
  X,
  Wand2,
  Crown,
  Star,
  Gift,
  PartyPopper,
  Copy,
  Check,
  Link2,
  Share2,
  Download,
  Search
} from 'lucide-react';


const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [textSize, setTextSize] = useState(32);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textPosition, setTextPosition] = useState('center');
  const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");
  const [decorations, setDecorations] = useState([]);
  const [isDragging, setIsDragging] = useState(null);
  const [isResizing, setIsResizing] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Internet Sticker States
  const [stickerSearchQuery, setStickerSearchQuery] = useState('');
  const [internetStickers, setInternetStickers] = useState([]);
  const [isSearchingStickers, setIsSearchingStickers] = useState(false);
  
  // Link Generation States
  const [generatedLink, setGeneratedLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isNativeSharing, setIsNativeSharing] = useState(false);
  const [preparedShareFile, setPreparedShareFile] = useState(null);
  const [profileImgError, setProfileImgError] = useState(false);

  // Reset image error when profile picture changes
  useEffect(() => {
    setProfileImgError(false);
  }, [user?.profilePicture]);

  const addDecoration = (type, url = "") => {
    const newDeco = {
      id: Date.now(),
      type,
      url: url || "", // Ensure url is never null
      x: 50,
      y: 50,
      size: type === 'internet' ? 100 : 40 
    };
    setDecorations([...decorations, newDeco]);
  };

  const handleDrag = (id, e) => {
    if (isDragging !== id || isResizing) return;
    
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDecorations(decorations.map(d => 
      d.id === id ? { 
        ...d, 
        x: Math.max(0, Math.min(100, x || 0)), 
        y: Math.max(0, Math.min(100, y || 0)) 
      } : d
    ));
  };

  const handleResize = (id, e) => {
    if (isResizing !== id) return;
    e.stopPropagation();

    const decoration = decorations.find(d => d.id === id);
    const rect = document.getElementById(`deco-${id}`).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
    const newSize = Math.max(20, Math.min(200, (dist * 2) || 40));

    setDecorations(decorations.map(d => 
      d.id === id ? { ...d, size: newSize } : d
    ));
  };

  const [showSubscription, setShowSubscription] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = [
    { id: 'All', label: 'All Designs', icon: Sparkles },
    { id: 'Birthday', label: 'Birthday', icon: Cake },
    { id: 'Anniversary', label: 'Anniversary', icon: Heart },
    { id: 'Festivals', label: 'Festivals', icon: Flame },
    { id: 'Love', label: 'Love & Romance', icon: HeartHandshake },
    { id: 'Motivation', label: 'Motivation', icon: Zap },
    { id: 'Travel', label: 'Travel', icon: Plane },
    { id: 'Nature', label: 'Nature', icon: Leaf },
    { id: 'Business', label: 'Business', icon: Briefcase },
    { id: 'Abstract', label: 'Abstract', icon: Palette },
    { id: 'Minimal', label: 'Minimalist', icon: Minus },
    { id: 'Party', label: 'Party Vibes', icon: Music },
    { id: 'Custom', label: 'Custom', icon: Edit3 },
  ];

  const fetchTemplates = async (query = '', cat = 'All') => {
    setLoading(true);
    try {
      const categoryParam = cat !== 'All' ? `&category=${cat}` : '';
      const searchParam = query ? `&search=${query}` : '';
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/templates?t=${Date.now()}${categoryParam}${searchParam}`);

      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates('', selectedCategory);
  }, [selectedCategory]);

  // Fetch default stickers on mount
  useEffect(() => {
    const fetchDefaultStickers = async () => {
      setIsSearchingStickers(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/stickers?search=party`);
        if (data.success) {
          setInternetStickers(data.stickers);
        }
      } catch (error) {
        console.error('Failed to fetch default stickers:', error);
      } finally {
        setIsSearchingStickers(false);
      }
    };
    fetchDefaultStickers();
  }, []);

  const searchInternetStickers = async () => {
    if (!stickerSearchQuery) return;
    setIsSearchingStickers(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/stickers?search=${stickerSearchQuery}`);
      if (data.success) {
        setInternetStickers(data.stickers);
      }
    } catch (error) {
      console.error('Failed to fetch stickers:', error);
    } finally {
      setIsSearchingStickers(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTemplates(searchTerm, selectedCategory);
  };

  const handleTemplateClick = (template) => {
    if (template.isPremium && !user?.isPremium) {
      setShowSubscription(true);
    } else {
      setSelectedTemplate(template);
      const defaults = {
        'Birthday': 'Wishing you a day filled with happiness and a year filled with joy! Happy Birthday!',
        'Anniversary': 'May your love continue to grow stronger with each passing year. Happy Anniversary!',
        'Festivals': 'May this festival bring light, prosperity, and endless happiness to your home.',
        'Love': 'Every moment with you is a beautiful dream come true. You are my everything.',
        'Motivation': 'The only way to do great work is to love what you do. Keep pushing forward!',
        'Travel': 'Adventure is worthwhile in itself. Wishing you the journey of a lifetime!',
        'Nature': 'In every walk with nature, one receives far more than he seeks. Stay wild.',
        'Business': 'Wishing you continued success, growth, and prosperity in all your professional endeavors.',
        'Abstract': 'Art is the only way to run away without leaving home. Express yourself.',
        'Minimal': 'Simplicity is the ultimate sophistication. Finding beauty in the simple things.',
        'Party': 'Life is a party, dress like it! Wishing you an unforgettable night of celebration.',
        'Custom': 'May your day be as special and unique as you are! Best wishes always.'
      };
      setCustomMessage(defaults[template.id] || defaults[template.category] || 'Sending you my best wishes and positive vibes!');
      setGeneratedLink('');
      setDecorations([]);
    }
  };

  const handleShare = async () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    try {
      const cardData = {
        templateImageUrl: selectedTemplate.imageUrl,
        templateName: selectedTemplate.name || selectedTemplate.category,
        message: customMessage || "",
        textStyle: {
          fontSize: textSize || 24,
          color: textColor || "#ffffff",
          position: textPosition || "center",
          fontFamily: fontFamily || "inherit"
        },
        decorations: decorations.map(d => ({
          id: d.id,
          type: d.type,
          url: d.url || "",
          x: Number(d.x) || 0,
          y: Number(d.y) || 0,
          size: Number(d.size) || 40
        })),
        senderName: user?.name || 'Guest User',
        senderProfilePic: user?.profilePicture || ""
      };
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cards`, cardData);
      setGeneratedLink(`${window.location.origin}/card/${data._id}`);
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareCard = async () => {
    const element = document.getElementById('card-preview');
    if (!element || isNativeSharing) return;

    setIsNativeSharing(true);
    try {
      // 1. Generate the image instantly
      const canvas = await html2canvas(element, { 
        useCORS: true, 
        scale: 3, 
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('card-preview');
          if (clonedElement) clonedElement.style.transform = 'none';
        }
      });

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'cardcraft-wish.png', { type: 'image/png' });

      // 2. Share the FILE directly
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Your Personalized Wish'
        });
      } else {
        // Fallback: If browser doesn't support file share, trigger download so they have the file
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cardcraft-wish.png';
        a.click();
        URL.revokeObjectURL(url);
        alert("Native image sharing is not supported on this browser. Your card has been downloaded instead!");
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Direct Share Error:', err);
      }
    } finally {
      setIsNativeSharing(false);
    }
  };

  const downloadImage = async () => {
    const element = document.getElementById('card-preview');
    if (!element) return;
    setIsDownloading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      // Use the capture wrapper to ensure floating elements aren't cut off
      const canvas = await html2canvas(document.getElementById('capture-area'), {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2, // High quality
        logging: false
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cardcraft-wish.png';
      a.click();
    } catch (err) { 
      console.error(err); 
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex flex-col gap-8 pb-12 animate-[fadeIn_0.5s_ease_out]">
      <SubscriptionModal isOpen={showSubscription} onClose={() => setShowSubscription(false)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden sticky top-24 z-40 flex items-center justify-between glass-panel px-6 py-4 mb-8 bg-black/60 backdrop-blur-xl border-white/5">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-primary hover:bg-white/10 transition-all"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-3 text-right">
            <div className="text-right">
              <h3 className="text-sm font-black text-maintext leading-none">Studio Filters</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{selectedCategory}</p>
            </div>
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`fixed inset-0 z-[60] lg:relative lg:inset-auto lg:z-0 lg:col-span-3 ${isSidebarOpen ? 'flex' : 'hidden lg:flex'}`}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="glass-panel p-6 sticky top-28 h-full max-h-[calc(100vh-140px)] flex flex-col w-[85%] max-w-[320px] lg:w-full lg:max-w-none relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20"><Palette size={22} /></div>
                <div>
                  <h2 className="text-xl font-black text-maintext leading-none tracking-tight">Design Studio</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Categories</p>
                </div>
              </div>
              <button className="lg:hidden p-2 text-gray-500" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setIsSidebarOpen(false); }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${selectedCategory === cat.id ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg' : 'hover:bg-white/5 text-gray-400 hover:text-maintext'}`}>
                  <cat.icon size={20} />
                  <span className="font-bold text-sm tracking-wide">{cat.label}</span>
                </button>
              ))}
            </div>
            {user && !user.isPremium && (
              <div className="mt-4 p-4 bg-gradient-to-br from-premium-dark to-black rounded-3xl border border-yellow-500/20 cursor-pointer" onClick={() => setShowSubscription(true)}>
                <p className="text-[10px] font-black text-yellow-500 mb-1 tracking-[0.2em]">PREMIUM PLAN</p>
                <p className="text-xs text-gray-300 font-bold mb-4">Unlock 1M+ HD templates & unlimited shares.</p>
                <div className="w-full py-3 bg-yellow-500 text-black text-[10px] font-black rounded-xl text-center uppercase tracking-widest">Upgrade</div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          
          {/* Design Studio Overlay */}
          {selectedTemplate && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl animate-[fadeIn_0.3s_ease_out] overflow-y-auto">
              <div className="relative w-full max-w-7xl mx-auto flex flex-col gap-6 my-auto">
                
                <div className="flex justify-between items-center px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary"><Edit3 size={20} /></div>
                    <div>
                      <h2 className="text-xl font-black text-white leading-none">Design Studio</h2>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Personalizing your {selectedTemplate.category} wish</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTemplate(null)} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white"><X size={24} /></button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:h-[85vh]">
                  {/* Canvas */}
                  <div id="capture-area" className="p-10 flex items-center justify-center overflow-visible">
                    <div id="card-preview" className="relative w-full max-w-[440px] aspect-[4/5] rounded-[2.5rem] shadow-2xl bg-black ring-1 ring-white/10 overflow-visible">
                      
                      {/* Inner body to clip background images but not profile pic */}
                      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                        {/* Top Header Bar (Matching Reference) */}
                        <div className="absolute top-0 left-0 right-0 h-24 bg-[#261d18] flex items-center justify-center z-30 shadow-lg">
                          <h3 className="text-2xl font-black text-white tracking-widest uppercase">
                            {user?.name || 'Wishes'}
                          </h3>
                        </div>

                        {/* Main Image Layer */}
                        <div className="absolute inset-0 pt-24 pb-0">
                          <img src={selectedTemplate.imageUrl} alt="" crossOrigin="anonymous" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        </div>
                        
                        {/* Custom Wish Message Overlay */}
                        <div className={`absolute inset-0 pt-32 p-12 flex flex-col pointer-events-none z-20 text-center ${
                          textPosition === 'top' ? 'justify-start' : 
                          textPosition === 'bottom' ? 'justify-end pb-24' : 
                          'justify-center'
                        }`}>
                          <p
                            className="font-black leading-tight italic tracking-tight drop-shadow-2xl"
                            style={{
                              fontSize: `${textSize}px`,
                              color: textColor,
                              fontFamily: fontFamily,
                              textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)'
                            }}
                          >
                            {customMessage || 'Type your message...'}
                          </p>
                        </div>

                        {/* Decorations Layer */}
                        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                          {decorations.map((deco) => {
                            const config = {
                              'heart': { icon: Heart, color: '#ef4444' },
                              'star': { icon: Star, color: '#eab308' },
                              'gift': { icon: Gift, color: '#ec4899' },
                              'sparkle': { icon: Sparkles, color: '#06b6d4' },
                              'party': { icon: PartyPopper, color: '#f97316' }
                            }[deco.type] || { icon: Sparkles, color: '#6366f1' };
                            const Icon = config.icon;
                            return (
                              <div
                                key={deco.id}
                                className="absolute"
                                style={{
                                  left: `${deco.x}%`,
                                  top: `${deco.y}%`,
                                  width: `${deco.size}px`,
                                  height: `${deco.size}px`,
                                  transform: 'translate(-50%, -50%)',
                                  filter: `drop-shadow(0 4px 12px ${config.color}40)`
                                }}
                              >
                                {deco.type === 'internet' ? (
                                  <img src={deco.url} alt="" className="w-full h-full object-contain drop-shadow-lg" crossOrigin="anonymous" />
                                ) : (
                                  <Icon size={deco.size} style={{ color: '#ffffff', fill: config.color }} className="w-full h-full drop-shadow-md" strokeWidth={2.5} stroke="currentColor" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Floating Profile Picture (Matching Reference) - Outside clip area */}
                      <div className="absolute top-20 lg:-left-6 md:-left-4 -left-2 z-50 lg:w-24 lg:h-24 md:w-20 md:h-20 w-12 h-12">
                        <div className="relative w-full h-full p-1.5 bg-[#22c55e] rounded-full shadow-2xl ring-4 ring-black/20">
                          <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            {user?.profilePicture && !profileImgError ? (
                              <img
                                src={user.profilePicture}
                                alt="Sender"
                                crossOrigin="anonymous"
                                className="w-full h-full object-cover"
                                onError={() => setProfileImgError(true)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/80 to-secondary/80 text-white font-black text-3xl">
                                {user?.name?.charAt(0) || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-black flex items-center justify-center">
                            <Sparkles size={10} className="text-black" />
                          </div>
                        </div>
                      </div>

                      {/* Decorations Layer */}
                      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                        {decorations.map((deco) => {
                          const config = {
                            'heart': { icon: Heart, color: '#ef4444' },
                            'star': { icon: Star, color: '#eab308' },
                            'gift': { icon: Gift, color: '#ec4899' },
                            'sparkle': { icon: Sparkles, color: '#06b6d4' },
                            'party': { icon: PartyPopper, color: '#f97316' }
                          }[deco.type] || { icon: Sparkles, color: '#6366f1' };
                          const Icon = config.icon;
                          return (
                            <div
                              key={deco.id}
                              className="absolute"
                              style={{
                                left: `${deco.x}%`,
                                top: `${deco.y}%`,
                                width: `${deco.size}px`,
                                height: `${deco.size}px`,
                                transform: 'translate(-50%, -50%)',
                                filter: `drop-shadow(0 4px 12px ${config.color}40)`
                              }}
                            >
                              {deco.type === 'internet' ? (
                                <img src={deco.url} alt="" className="w-full h-full object-contain drop-shadow-lg" crossOrigin="anonymous" />
                              ) : (
                                <Icon size={deco.size} style={{ color: '#ffffff', fill: config.color }} className="w-full h-full drop-shadow-md" strokeWidth={2.5} />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="absolute inset-0 z-40 pointer-events-auto overflow-hidden"
                        onMouseMove={(e) => { if (isDragging) handleDrag(isDragging, e); if (isResizing) handleResize(isResizing, e); }}
                        onMouseUp={() => { setIsDragging(null); setIsResizing(null); }}
                        onMouseLeave={() => { setIsDragging(null); setIsResizing(null); }}
                      >
                        {decorations.map((deco) => {
                          const config = { 'heart': { icon: Heart, color: '#ef4444' }, 'star': { icon: Star, color: '#eab308' }, 'gift': { icon: Gift, color: '#ec4899' }, 'sparkle': { icon: Sparkles, color: '#06b6d4' }, 'party': { icon: PartyPopper, color: '#f97316' } }[deco.type] || { icon: Sparkles, color: '#6366f1' };
                          const Icon = config.icon;
                          return (
                            <div key={deco.id} id={`deco-${deco.id}`} className="absolute cursor-move group select-none" style={{ left: `${deco.x}%`, top: `${deco.y}%`, width: `${deco.size}px`, height: `${deco.size}px`, transform: 'translate(-50%, -50%)' }} onMouseDown={(e) => { e.stopPropagation(); setIsDragging(deco.id); }}>
                              {deco.type === 'internet' ? <img src={deco.url} className="w-full h-full object-contain" /> : <Icon size={deco.size} style={{ fill: config.color, color: '#fff' }} />}
                              <button className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); setDecorations(decorations.filter(d => d.id !== deco.id)); }}><X size={12} /></button>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-primary cursor-nwse-resize opacity-0 group-hover:opacity-100" onMouseDown={(e) => { e.stopPropagation(); setIsResizing(deco.id); }}></div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>

                  {/* Controls */}
                  <div className="glass-panel p-8 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      <div className="flex flex-col gap-8 pb-10">
                        <div className="flex flex-col gap-3">
                          <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Your Wish</label>
                          <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-[1.5rem] text-white" rows="3" value={customMessage} onChange={(e) => setCustomMessage(e.target.value)}></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex flex-col gap-3">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Typography</label>
                            <div className="relative group">
                              <select 
                                className="w-full bg-white/5 border border-white/10 p-3.5 pr-10 rounded-2xl text-sm text-white font-bold cursor-pointer focus:border-primary/50 transition-all outline-none appearance-none" 
                                value={fontFamily} 
                                onChange={(e) => setFontFamily(e.target.value)}
                              >
                                <option value="'Inter', sans-serif" className="bg-surface text-white">Modern Sans</option>
                                <option value="'Playfair Display', serif" className="bg-surface text-white">Elegant Serif</option>
                                <option value="'Montserrat', sans-serif" className="bg-surface text-white">Bold Impact</option>
                                <option value="'Pacifico', cursive" className="bg-surface text-white">Artistic Script</option>
                                <option value="'Dancing Script', cursive" className="bg-surface text-white">Handwriting</option>
                                <option value="'Orbitron', sans-serif" className="bg-surface text-white">Futuristic</option>
                                <option value="'Lobster', cursive" className="bg-surface text-white">Retro Bold</option>
                                <option value="'Pinyon Script', cursive" className="bg-surface text-white">Royal Script</option>
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Size ({textSize}px)</label>
                            <div className="h-full flex items-center bg-surface/50 p-2 rounded-2xl border border-primary/10"><input type="range" min="16" max="72" className="w-full accent-primary" value={textSize} onChange={(e) => setTextSize(parseInt(e.target.value))} /></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex flex-col gap-3">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Color</label>
                            <div className="flex items-center gap-3 bg-surface/50 p-2 rounded-2xl border border-primary/10"><input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer p-0" /></div>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Position</label>
                            <div className="flex bg-surface/50 p-1 rounded-2xl border border-primary/10 h-14">
                              {['top', 'center', 'bottom'].map(pos => <button key={pos} onClick={() => setTextPosition(pos)} className={`flex-1 flex items-center justify-center rounded-xl transition-all ${textPosition === pos ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'}`}><div className={`w-4 h-0.5 bg-current ${pos === 'top' ? 'mb-2' : pos === 'bottom' ? 'mt-2' : ''}`}></div></button>)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Stickers</label>
                          <div className="bg-surface/30 p-2 rounded-3xl border border-primary/10">
                            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                              {[
                                { type: 'heart', icon: Heart, label: 'Love', color: 'text-red-500' },
                                { type: 'star', icon: Star, label: 'Star', color: 'text-yellow-500' },
                                { type: 'gift', icon: Gift, label: 'Gift', color: 'text-pink-500' },
                                { type: 'sparkle', icon: Sparkles, label: 'Magic', color: 'text-cyan-500' },
                                { type: 'party', icon: PartyPopper, label: 'Party', color: 'text-orange-500' }
                              ].map((deco) => (
                                <button key={deco.type} onClick={() => addDecoration(deco.type)} className="flex flex-col items-center gap-2 p-3 min-w-[70px] rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                                  <deco.icon size={20} className={`${deco.color}`} />
                                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{deco.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input 
                                type="text" placeholder="Search live stickers..." 
                                className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 rounded-xl text-xs text-white focus:border-primary/50 transition-all outline-none" 
                                value={stickerSearchQuery} 
                                onChange={(e) => setStickerSearchQuery(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && searchInternetStickers()} 
                              />
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Search size={14} />
                              </div>
                            </div>
                            <button onClick={searchInternetStickers} disabled={isSearchingStickers} className="bg-primary text-black px-4 rounded-xl active:scale-95 disabled:opacity-50 flex items-center justify-center">
                              {isSearchingStickers ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Search size={18} />}
                            </button>
                          </div>
                          {internetStickers.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
                              {internetStickers.map((sticker, idx) => (
                                <button 
                                  key={idx} 
                                  onClick={() => addDecoration('internet', sticker.previewUrl)} 
                                  className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden hover:ring-2 ring-primary transition-all active:scale-90 bg-black/40 border border-white/5"
                                >
                                  <img src={sticker.previewUrl} alt="" className="w-full h-full object-contain" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
                      {generatedLink ? (
                        <div className="flex flex-col gap-3 animate-[fadeIn_0.3s_ease_out]">
                          <div className="flex gap-2">
                            <div className="flex-1 bg-surface/50 border border-primary/10 px-4 py-2.5 rounded-xl text-xs text-gray-300 truncate font-mono">{generatedLink}</div>
                            <button onClick={copyToClipboard} className={`p-2.5 rounded-xl transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>{isCopied ? <Check size={18} /> : <Copy size={18} />}</button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={shareCard} 
                              disabled={isNativeSharing}
                              className={`bg-primary hover:bg-primary-dark text-black font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all ${
                                (isNativeSharing) ? 'opacity-50 cursor-wait' : ''
                              }`}
                            >
                              {(isNativeSharing) ? (
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <><Share2 size={16} /> Native Share</>
                              )}
                            </button>
                            <button onClick={downloadImage} disabled={isDownloading} className="bg-white/10 hover:bg-white/20 text-white font-black py-3 rounded-xl text-xs border border-white/10 flex items-center justify-center gap-2 disabled:opacity-50">
                              {isDownloading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Download size={16} /> Download</>}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={handleShare} disabled={isGenerating} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-black py-4 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50">
                          {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Wand2 size={20} /><span className="tracking-wide uppercase text-sm">Generate</span></>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Template Grid */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-black text-maintext mb-2 tracking-tight">Explore <span className="text-primary">{selectedCategory}</span> Designs</h2>
                <p className="text-gray-500 text-sm font-medium">Fresh templates fetched live for your unique wishes</p>
              </div>
              <form onSubmit={handleSearch} className="w-full md:w-96 relative group">
                <input type="text" placeholder={`Search ${selectedCategory.toLowerCase()} templates...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:outline-none focus:border-primary/50 text-maintext font-medium shadow-xl" />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <button type="submit" className="hidden"></button>
              </form>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-[2.5rem] border border-white/5"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {templates.map(template => (
                  <div key={template._id} onClick={() => handleTemplateClick(template)} className={`relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl ${selectedTemplate?._id === template._id ? 'ring-4 ring-primary' : 'ring-1 ring-white/10'}`}>
                    <img src={template.imageUrl} alt="" crossOrigin="anonymous" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 transform transition-transform duration-500 group-hover:translate-x-1">
                      {user?.profilePicture ? <img src={user.profilePicture} alt="" crossOrigin="anonymous" className="w-8 h-8 rounded-full border border-white/50 object-cover" /> : <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold border border-white/50 text-white">{user?.name?.charAt(0) || 'U'}</div>}
                      <div className="flex-1 min-w-0">
                        <p className="text-[8px] text-primary font-bold tracking-tighter uppercase opacity-70">Best Wishes</p>
                        <p className="text-xs font-bold text-white truncate">{user?.name || 'Guest User'}</p>
                      </div>
                    </div>
                    {template.isPremium && <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded shadow-xl flex items-center gap-1 z-10"><Crown size={10} /> PRO</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
