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
  Search,
  Settings2
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
  const [backgroundMode, setBackgroundMode] = useState('image');
  const [backgroundColor, setBackgroundColor] = useState('#6366f1');
  const [outerBgColor, setOuterBgColor] = useState('#a19e9eff');
  const [cardSize, setCardSize] = useState(440);
  const [fontFamily, setFontFamily] = useState("'Dancing Script', cursive");
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
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

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
        templateImageUrl: backgroundMode === 'image' ? selectedTemplate.imageUrl : null,
        templateName: selectedTemplate.name || selectedTemplate.category,
        backgroundMode: backgroundMode,
        backgroundColor: backgroundColor,
        outerBgColor: outerBgColor,
        cardSize: cardSize,
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
      // 1. Generate the image instantly using wide-angle area
      const captureElement = document.getElementById('capture-area');
      const canvas = await html2canvas(captureElement, {
        useCORS: true,
        scale: 3,
        backgroundColor: outerBgColor,
        logging: false,
        x: 0,
        width: captureElement.offsetWidth,
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
      // Use wide-angle capture area to include floating profile pic
      const captureElement = document.getElementById('capture-area');
      const canvas = await html2canvas(captureElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: outerBgColor,
        scale: 2,
        logging: false,
        x: 0,
        width: captureElement.offsetWidth,
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
            <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0a0a] bg-[radial-gradient(circle_at_50%_-20%,#3d3d3d,transparent)] flex items-start justify-center p-4 md:p-12">
              <div className="w-full max-w-[1400px] min-h-full flex flex-col animate-[slideUp_0.4s_ease_out]">
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

                  <div className="flex flex-col xl:grid xl:grid-cols-2 gap-8 lg:h-[85vh] pb-24 xl:pb-0">
                    {/* Canvas */}
                    <div id="capture-area" className="p-10 flex items-center justify-center overflow-visible transition-colors duration-500" style={{ backgroundColor: outerBgColor }}>
                      <div id="card-preview" className="relative w-full aspect-[4/5] rounded-[0.5rem] shadow-2xl bg-black ring-1 ring-white/10 overflow-visible transition-all duration-300" style={{ maxWidth: `${cardSize}px` }}>
                        
                        {/* Inner body to clip background images but not profile pic */}
                        <div className="absolute inset-0 rounded-[0.5rem] zigzag-top-bottom overflow-hidden">
                          {/* Zigzag Top SVG Overlay */}
                          <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none h-4">
                            <svg width="100%" height="100%" viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full">
                              <polygon points="0,0 2.5,10 5,0 7.5,10 10,0 12.5,10 15,0 17.5,10 20,0 22.5,10 25,0 27.5,10 30,0 32.5,10 35,0 37.5,10 40,0 42.5,10 45,0 47.5,10 50,0 52.5,10 55,0 57.5,10 60,0 62.5,10 65,0 67.5,10 70,0 72.5,10 75,0 77.5,10 80,0 82.5,10 85,0 87.5,10 90,0 92.5,10 95,0 97.5,10 100,0 100,10 0,10" fill={outerBgColor} />
                            </svg>
                          </div>

                          {/* Top Header Bar (Matching Reference) */}
                          <div className="absolute top-0 left-0 right-0 h-24 bg-gray-500 flex items-center justify-center z-30 shadow-lg">
                            <h3 className="text-2xl font-black text-white tracking-widest uppercase">
                              {user?.name || 'Wishes'}
                            </h3>
                          </div>

                          {/* Main Image Layer or Color Layer */}
                          <div className="absolute inset-0 pt-24 pb-0">
                            {backgroundMode === 'image' ? (
                              <>
                                <img src={selectedTemplate.imageUrl} alt="" crossOrigin="anonymous" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                              </>
                            ) : (
                              <div
                                className="w-full h-full animate-[fadeIn_0.5s_ease_out]"
                                style={{ background: backgroundColor }}
                              ></div>
                            )}
                          </div>

                          {/* Custom Wish Message Overlay */}
                          <div className={`absolute inset-0 pt-32 p-12 flex flex-col pointer-events-none z-20 text-center ${textPosition === 'top' ? 'justify-start' :
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
                            {/* Zigzag Bottom SVG Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none h-4">
                            <svg width="100%" height="100%" viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full">
                              <polygon points="0,10 2.5,0 5,10 7.5,0 10,10 12.5,0 15,10 17.5,0 20,10 22.5,0 25,10 27.5,0 30,10 32.5,0 35,10 37.5,0 40,10 42.5,0 45,10 47.5,0 50,10 52.5,0 55,10 57.5,0 60,10 62.5,0 65,10 67.5,0 70,10 72.5,0 75,10 77.5,0 80,10 82.5,0 85,10 87.5,0 90,10 92.5,0 95,10 97.5,0 100,10 100,0 0,0" fill={outerBgColor} />
                            </svg>
                          </div>
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
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                  <defs>
                                    <linearGradient id="homeAvatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#6366f1" />
                                      <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                  </defs>
                                  <rect width="100" height="100" fill="url(#homeAvatarGrad)" />
                                  <text
                                    x="50%"
                                    y="50%"
                                    dominantBaseline="central"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="50"
                                    fontWeight="900"
                                    fontFamily="sans-serif"
                                  >
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                  </text>
                                </svg>
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-black flex items-center justify-center">
                              <Sparkles size={10} className="text-black" />
                            </div>
                          </div>
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

                    {/* Controls (Desktop only) */}
                    <div className="hidden xl:flex glass-panel p-8 flex-col h-full overflow-hidden">
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
                          
                          <div className="flex flex-col gap-4 pt-4 border-t  border-white/5">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Layout & Sharing</label>
                            <div className="flex justify-between w-full gap-4">
                              <div className="flex flex-col gap-2 w-1/2">
                                <label className="text-[9px] text-gray-500 font-bold uppercase px-1">Card Size</label>
                                <div className="h-10 flex items-center bg-white/5 px-2 rounded-xl border border-white/10"><input type="range" min="320" max="600" className="w-full accent-primary" value={cardSize} onChange={(e) => setCardSize(parseInt(e.target.value))} /></div>
                              </div>
                              <div className="flex flex-col gap-2 mr-10">
                                <label className="text-[9px] text-gray-500 font-bold uppercase px-1">Outer BG</label>
                                <div className="h-10 w-10 flex items-center bg-white/5 px-2 rounded-xl border border-white/10"><input type="color" value={outerBgColor} onChange={(e) => setOuterBgColor(e.target.value)} className="w-10 h-6 bg-transparent cursor-pointer" /></div>
                              </div>
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
                                className={`bg-primary hover:bg-primary-dark text-black font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all ${(isNativeSharing) ? 'opacity-50 cursor-wait' : ''
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

                  {/* Mobile Bottom Bar (WhatsApp Style) */}
                  <div className="xl:hidden fixed bottom-6 left-4 right-4 z-[70] flex flex-col gap-2 animate-[slideUp_0.3s_ease_out]">
                    {generatedLink ? (
                      <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded-[2rem] shadow-2xl flex flex-col gap-4 backdrop-blur-xl w-full">
                        <div className="flex gap-2">
                           <div className="flex-1 bg-surface/50 border border-primary/10 px-4 py-3 rounded-xl text-xs text-gray-300 truncate font-mono flex items-center">{generatedLink}</div>
                           <button onClick={copyToClipboard} className={`p-3 rounded-xl transition-all flex-shrink-0 ${isCopied ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>{isCopied ? <Check size={18} /> : <Copy size={18} />}</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <button onClick={shareCard} disabled={isNativeSharing} className={`bg-primary text-black font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all ${(isNativeSharing) ? 'opacity-50 cursor-wait' : 'active:scale-95'}`}>
                             {(isNativeSharing) ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><Share2 size={16} /> Share</>}
                           </button>
                           <button onClick={downloadImage} disabled={isDownloading} className="bg-white/10 text-white font-black py-3 rounded-xl text-xs border border-white/10 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                             {isDownloading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Download size={16} /> Save</>}
                           </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <button 
                          onClick={() => setIsMobileSettingsOpen(true)}
                          className="w-12 h-12 flex-shrink-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-all shadow-2xl"
                        >
                          <Settings2 size={20} />
                        </button>
                        <div className="flex-1 relative flex items-center">
                          <input 
                            type="text" 
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            placeholder="Type your wish..."
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 p-4 pr-12 rounded-[2rem] text-white text-sm focus:outline-none focus:border-primary/50 shadow-2xl"
                          />
                          <button 
                             onClick={handleShare}
                             disabled={isGenerating}
                             className="absolute right-2 w-9 h-9 bg-primary text-black rounded-full flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
                          >
                            {isGenerating ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Wand2 size={18} />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Settings Modal */}
                  {isMobileSettingsOpen && (
                    <div className="fixed inset-0 z-[80] xl:hidden flex items-end justify-center p-0 md:p-4">
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileSettingsOpen(false)}></div>
                      <div className="relative w-full max-w-lg bg-[#1a1a1a] border-t border-white/10 rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 animate-[slideUp_0.3s_ease_out] max-h-[85vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                           <h3 className="text-xl font-black text-white">Design Tools</h3>
                           <button onClick={() => setIsMobileSettingsOpen(false)} className="p-2 bg-white/5 rounded-xl text-gray-400"><X size={20} /></button>
                        </div>
                        
                        {/* Reuse the controls content (Simplified for mobile) */}
                        <div className="flex flex-col gap-8 pb-10">
                           {/* Typography & Size */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                          {/* Layout & Sharing */}
                          <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Layout & Sharing</label>
                            <div className="flex justify-between w-full gap-4">
                              <div className="flex flex-col gap-2 w-1/2">
                                <span className="text-[10px] text-gray-500 font-bold uppercase">Card Size</span>
                                <div className="h-full flex items-center bg-surface/30 p-2 rounded-xl border border-white/5">
                                  <input type="range" min="320" max="600" step="10" className="w-full accent-secondary" value={cardSize} onChange={(e) => setCardSize(parseInt(e.target.value))} />
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <span className="text-[10px] text-gray-500 font-bold uppercase">Outer Bg</span>
                                <div className="flex items-center gap-2 bg-surface/30 p-2 rounded-xl border border-white/5">
                                  <input type="color" value={outerBgColor} onChange={(e) => setOuterBgColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Color & Position */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-3">
                              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Color</label>
                              <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-2xl border border-white/10 overflow-x-auto max-h-32">
                                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer flex-shrink-0" title="Custom Color" />
                                {['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'].map((color) => (
                                  <button key={color} onClick={() => setTextColor(color)} className={`w-10 h-10 rounded-xl border-2 transition-all ${textColor === color ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-80'}`} style={{ backgroundColor: color }} />
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-3">
                              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Position</label>
                              <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 h-16">
                                {['top', 'center', 'bottom'].map((pos) => (
                                  <button key={pos} onClick={() => setTextPosition(pos)} className={`flex-1 flex items-center justify-center rounded-xl transition-all ${textPosition === pos ? 'bg-primary text-black shadow-lg scale-100' : 'text-gray-400 hover:bg-white/5'}`}>
                                    {pos === 'top' ? <Minus className="rotate-0 -translate-y-2" size={24} /> : pos === 'center' ? <Minus size={24} /> : <Minus className="translate-y-2" size={24} />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Stickers (Simplified for mobile) */}
                          <div className="flex flex-col gap-4">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Stickers</label>
                            <div className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/10 overflow-x-auto">
                              {['heart', 'star', 'gift', 'sparkle', 'party'].map((type) => (
                                <button key={type} onClick={() => addDecoration(type)} className="flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-surface/50 rounded-xl border border-white/5 hover:border-primary/50 transition-all active:scale-95">
                                  {{ 'heart': <Heart className="text-red-400" size={20} />, 'star': <Star className="text-yellow-400" size={20} />, 'gift': <Gift className="text-pink-400" size={20} />, 'sparkle': <Sparkles className="text-cyan-400" size={20} />, 'party': <PartyPopper className="text-orange-400" size={20} /> }[type]}
                                  <span className="text-[8px] font-black uppercase text-gray-500">{type}</span>
                                </button>
                              ))}
                            </div>
                            
                            {/* Internet Sticker Search (Mobile) */}
                            <div className="flex gap-2">
                              <div className="flex-1 relative">
                                <input 
                                  type="text" 
                                  placeholder="Search internet stickers..." 
                                  value={stickerSearchQuery}
                                  onChange={(e) => setStickerSearchQuery(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && searchInternetStickers()}
                                  className="w-full bg-white/5 border border-white/10 p-3.5 pl-10 rounded-2xl text-xs text-white outline-none focus:border-primary/50"
                                />
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                              </div>
                              <button onClick={searchInternetStickers} className="p-3.5 bg-primary text-black rounded-2xl active:scale-95 transition-all">
                                {isSearchingStickers ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Search size={16} />}
                              </button>
                            </div>
                            {internetStickers.length > 0 && (
                              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {internetStickers.map((sticker) => (
                                  <button key={sticker.id} onClick={() => addDecoration('internet', sticker.url)} className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-black/40 border border-white/5 active:scale-90 transition-all">
                                    <img src={sticker.previewUrl} alt="" className="w-full h-full object-contain" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-8">
                           <button 
                             onClick={() => setIsMobileSettingsOpen(false)}
                             className="w-full bg-gradient-to-r from-primary to-secondary text-black font-black py-4 rounded-2xl text-sm shadow-xl"
                           >
                             Save Changes
                           </button>
                        </div>
                      </div>
                    </div>
                  )}
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
