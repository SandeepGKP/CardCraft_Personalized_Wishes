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
  Link2
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


  const addDecoration = (type, url = null) => {
    const newDeco = {
      id: Date.now(),
      type,
      url,
      x: 50,
      y: 50,
      size: type === 'internet' ? 100 : 40 // Internet stickers start a bit larger
    };
    setDecorations([...decorations, newDeco]);
  };

  const handleDrag = (id, e) => {
    if (isDragging !== id || isResizing) return;
    
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDecorations(decorations.map(d => 
      d.id === id ? { ...d, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : d
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
    const newSize = Math.max(20, Math.min(200, dist * 2));

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

  // Fetch Internet Stickers
  useEffect(() => {
    const fetchStickers = async () => {
      setIsSearchingStickers(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/stickers${stickerSearchQuery ? `?search=${stickerSearchQuery}` : ''}`);

        if (data.success) {
          setInternetStickers(data.stickers);
        }
      } catch (error) {
        console.error('Failed to fetch stickers:', error);
      } finally {
        setIsSearchingStickers(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchStickers();
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [stickerSearchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTemplates(searchTerm, selectedCategory);
  };

  const handleTemplateClick = (template) => {
    if (template.isPremium && !user?.isPremium) {
      setShowSubscription(true);
    } else {
      setSelectedTemplate(template);
      
      // Smart default messages for all 13 categories
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
      
      // Auto-set message based on category (ID or Name)
      setCustomMessage(defaults[template.id] || defaults[template.category] || 'Sending you my best wishes and positive vibes!');
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShare = async () => {
    if (!selectedTemplate) return;
    
    const element = document.getElementById('card-preview');
    if (!element) return;

    setIsGenerating(true);
    try {
      // 1. Save card configuration to backend first
      const cardData = {
        templateImageUrl: selectedTemplate.imageUrl,
        templateName: selectedTemplate.name || selectedTemplate.category,
        message: customMessage || (selectedTemplate.id || selectedTemplate.category),
        textStyle: {
          fontSize: textSize,
          color: textColor,
          position: textPosition,
          fontFamily: fontFamily
        },
        decorations: decorations,
        senderName: user?.name || 'Guest User',
        senderProfilePic: user?.profilePicture
      };


      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cards`, cardData);

      const shareLink = `${window.location.origin}/card/${data._id}`;
      setGeneratedLink(shareLink);

      // 2. Capture Image for native sharing/download (Existing Functionality)
      // Longer delay to ensure stickers, fonts, and profile pics are 100% rendered
      await new Promise(r => setTimeout(r, 800));

      const canvas = await html2canvas(element, { 
        useCORS: true, 
        allowTaint: false,
        logging: false,
        scale: 2,
        backgroundColor: null,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: element.offsetWidth,
        height: element.offsetHeight + 20,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('card-preview');
          clonedElement.style.transform = 'none';
        }
      });
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
      const file = new File([blob], 'cardcraft-wish.png', { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Personalized Wish',
          text: `Check out this personalized wish I made for you! ✨\n\nYou can also view it here: ${shareLink}`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cardcraft-wish.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };


  return (
    <div className="flex flex-col gap-8 pb-12 animate-[fadeIn_0.5s_ease_out]">
      
      <SubscriptionModal 
        isOpen={showSubscription} 
        onClose={() => setShowSubscription(false)} 
      />

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

        {/* Sidebar / Categories */}
        <div className={`
          fixed inset-0 z-[60] lg:relative lg:inset-auto lg:z-0 lg:col-span-3 
          ${isSidebarOpen ? 'flex' : 'hidden lg:flex'}
        `}>
          {/* Mobile Overlay Background */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          <div className="glass-panel p-6 sticky top-28 h-full max-h-[calc(100vh-140px)] flex flex-col w-[85%] max-w-[320px] lg:w-full lg:max-w-none relative z-10 animate-[slideInLeft_0.3s_ease_out]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center shadow-lg border border-primary/20">
                  <Palette size={22} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-maintext leading-none tracking-tight">Design Studio</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Categories</p>
                </div>
              </div>
              <button 
                className="lg:hidden p-2 text-gray-500 hover:text-maintext"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setIsSidebarOpen(false); // Close on selection for mobile
                  }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    selectedCategory === cat.id 
                    ? 'bg-gradient-to-r from-primary/30 to-primary/5 text-primary border border-primary/20 shadow-lg' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-maintext'
                  }`}
                >
                  <span className={`transition-transform group-hover:scale-110 ${selectedCategory === cat.id ? 'scale-110' : ''}`}>
                    <cat.icon size={20} strokeWidth={selectedCategory === cat.id ? 2.5 : 2} />
                  </span>
                  <span className="font-bold text-sm tracking-wide">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>

            {user && !user.isPremium && (
              <div className="mt-4 p-2 bg-gradient-to-br from-premium-dark to-black rounded-3xl border border-yellow-500/20 shadow-2xl overflow-hidden relative group cursor-pointer" onClick={() => setShowSubscription(true)}>
                {/* <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-500/10 rounded-full blur-3xl transition-all group-hover:bg-yellow-500/20"></div> */}
                <p className="text-[10px] font-black text-yellow-500 mb-1 tracking-[0.2em]">PREMIUM PLAN</p>
                <p className="text-xs text-gray-300 font-bold mb-4 relative z-10">Unlock 1M+ HD templates & unlimited shares.</p>
                <div className="w-full py-3 bg-yellow-500 text-black text-[10px] font-black rounded-xl hover:bg-yellow-400 transition-all text-center shadow-lg shadow-yellow-500/20 relative z-10 uppercase tracking-widest">
                  Upgrade
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          
          {/* Editor / Preview Area */}
          {selectedTemplate ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-[fadeIn_0.4s_ease_out]">
              
              {/* Card Preview */}
              <div className="glass-panel p-4 md:p-8 flex flex-col items-center">
                <div className="flex justify-between items-center w-full mb-6">
                  <h2 className="text-xl font-black text-maintext flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    Live Canvas
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400 uppercase tracking-widest font-black">
                      {selectedTemplate.category} Mode
                    </span>
                  </div>
                </div>
                
                <div 
                  id="card-preview"
                  className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)] bg-black ring-1 ring-white/10"
                >
                  <img 
                    src={selectedTemplate.imageUrl} 
                    alt="Background Template" 
                    crossOrigin="anonymous"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  
                  {/* Premium Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>
                  
                  {/* Custom Wish Message Overlay */}
                  <div className={`absolute inset-0 p-12 flex flex-col pointer-events-none ${
                    textPosition === 'top' ? 'justify-start mt-12' : 
                    textPosition === 'bottom' ? 'justify-end mb-32' : 
                    'justify-center'
                  } text-center`}>
                    <p 
                      className="font-black leading-tight italic tracking-tight mb-4 transition-all duration-300"
                      style={{ 
                        fontSize: `${textSize}px`, 
                        color: textColor,
                        fontFamily: fontFamily,
                        textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)'
                      }}
                    >
                      {customMessage || 'Write your heart out...'}
                    </p>
                    <div className="w-12 h-1 bg-primary/60 mx-auto rounded-full shadow-lg"></div>
                  </div>

                  {/* Draggable Decorations Layer */}
                  <div 
                    className="absolute inset-0 z-20 pointer-events-auto overflow-hidden"
                    onMouseMove={(e) => {
                      if (isDragging) handleDrag(isDragging, e);
                      if (isResizing) handleResize(isResizing, e);
                    }}
                    onMouseUp={() => {
                      setIsDragging(null);
                      setIsResizing(null);
                    }}
                    onMouseLeave={() => {
                      setIsDragging(null);
                      setIsResizing(null);
                    }}
                  >
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
                          id={`deco-${deco.id}`}
                          className="absolute cursor-move group select-none transition-transform"
                          style={{ 
                            left: `${deco.x}%`, 
                            top: `${deco.y}%`,
                            width: `${deco.size}px`,
                            height: `${deco.size}px`,
                            transform: 'translate(-50%, -50%)',
                            filter: `drop-shadow(0 4px 12px ${config.color}40)`
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setIsDragging(deco.id);
                          }}
                        >
                          {deco.type === 'internet' ? (
                            <img 
                              src={deco.url} 
                              alt="Internet Sticker" 
                              className="w-full h-full object-contain drop-shadow-lg"
                              crossOrigin="anonymous"
                              style={{ width: deco.size, height: deco.size }}
                            />
                          ) : (
                            <Icon 
                              size={deco.size} 
                              style={{ 
                                color: '#ffffff', // White outline
                                fill: config.color, // Solid color inside
                              }}
                              className="w-full h-full drop-shadow-md" 
                              strokeWidth={2.5} 
                            />
                          )}
                          
                          {/* Delete Button */}
                          <button 
                            className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-maintext rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-30"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDecorations(decorations.filter(d => d.id !== deco.id));
                            }}
                          >
                            <X size={12} strokeWidth={3} />
                          </button>

                          {/* Resize Handle */}
                          <div 
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-primary cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-md"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setIsResizing(deco.id);
                            }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Automatic User Profile Overlay - The "Company Style" look */}
                  <div className="absolute bottom-16 left-10 right-10 flex items-center gap-6 p-6 rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl animate-[fadeInUp_0.5s_ease_out] z-50">
                    <div className="relative">
                      {user?.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt="User" 
                          crossOrigin="anonymous" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-2xl" 
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-black shadow-2xl border-2 border-primary text-maintext">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-black flex items-center justify-center">
                        <Sparkles size={10} className="text-black" />
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-1">Personalized By</p>
                      <h3 className="text-2xl font-black text-maintext truncate py-1 leading-normal">
                        {user?.name || 'Your Name'}
                      </h3>
                    </div>
                  </div>

                  {/* Brand Tag */}
                  <div className="absolute top-8 right-8">
                    <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
                      <p className="text-[10px] font-black text-maintext/60 tracking-[0.2em] uppercase flex items-center gap-2">
                        CardCraft <span className="text-primary font-black flex items-center gap-1">AI <Sparkles size={10} /></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="glass-panel p-8 flex flex-col gap-8 shadow-2xl border-white/10">
                <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-maintext leading-none">Personalize</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Make it unique</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => setSelectedTemplate(null)} 
                        className="flex-1 sm:flex-none h-10 px-4 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all text-xs flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 8.959 8.959 0 01-18 0z" />
                        </svg>
                        Back
                      </button>
                      <button 
                        onClick={handleShare} 
                        disabled={isGenerating}
                        className={`flex-[2] sm:flex-none h-10 px-5 btn btn-primary !rounded-xl shadow-[0_10px_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 group overflow-hidden ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isGenerating ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                        )}
                        <span className="font-black text-xs tracking-wide">
                          {isGenerating ? 'Generating...' : 'Generate & Share'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Generated Link Section */}
                  {generatedLink && (
                    <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-2xl animate-[slideInUp_0.3s_ease_out]">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <label className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-2">
                          <Link2 size={12} /> Shareable Link
                        </label>
                        {isCopied && (
                          <span className="text-[10px] text-green-400 font-bold flex items-center gap-1 animate-bounce">
                            <Check size={10} /> Copied!
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-surface/50 border border-primary/10 px-4 py-2.5 rounded-xl text-xs text-gray-300 truncate font-mono">
                          {generatedLink}
                        </div>
                        <button 
                          onClick={copyToClipboard}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                            isCopied ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-maintext'
                          }`}
                        >
                          {isCopied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  )}


                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Your Message</label>
                    <textarea 
                      className="bg-black/60 border border-white/10 p-5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-maintext min-h-[120px] resize-none text-base leading-relaxed font-medium placeholder:text-gray-700 shadow-inner mb-4"
                      placeholder="What's your heartfelt wish?"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                  </div>

                  {/* Text Adjustment Controls */}
                  <div className="flex flex-col gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 mb-8">
                    
                    {/* Font Type Selector */}
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Typography</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {[
                          { name: 'Modern', family: "'Inter', sans-serif" },
                          { name: 'Elegant', family: "'Playfair Display', serif" },
                          { name: 'Artistic', family: "'Pacifico', cursive" },
                          { name: 'Bold', family: "'Montserrat', sans-serif" },
                          { name: 'Classic', family: "'serif'" }
                        ].map(f => (
                          <button
                            key={f.name}
                            onClick={() => setFontFamily(f.family)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl border transition-all text-sm ${
                              fontFamily === f.family ? 'bg-primary text-black border-primary font-black' : 'bg-black/40 text-gray-400 border-white/5 hover:border-white/20'
                            }`}
                            style={{ fontFamily: f.family }}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Text Size</label>
                        <span className="text-[10px] font-black text-primary">{textSize}px</span>
                      </div>
                      <input 
                        type="range" min="16" max="64" value={textSize} 
                        onChange={(e) => setTextSize(e.target.value)}
                        className="w-full accent-primary h-1.5 bg-primary/10 border border-primary/10 rounded-lg appearance-none cursor-pointer"

                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-3">
                        <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Color</label>
                        <div className="flex items-center gap-3 bg-surface/50 p-2 rounded-2xl border border-primary/10">
                          <input 
                            type="color" value={textColor} 
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer p-0"
                          />
                          <span className="text-[10px] font-mono text-gray-500 uppercase">{textColor}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">Position</label>
                        <div className="flex bg-surface/50 p-1 rounded-2xl border border-primary/10 h-14">

                          {[
                            { id: 'top', icon: <div className="w-4 h-0.5 bg-current mb-2"></div> },
                            { id: 'center', icon: <div className="w-4 h-0.5 bg-current"></div> },
                            { id: 'bottom', icon: <div className="w-4 h-0.5 bg-current mt-2"></div> }
                          ].map(pos => (
                            <button
                              key={pos.id}
                              onClick={() => setTextPosition(pos.id)}
                              className={`flex-1 flex items-center justify-center rounded-xl transition-all ${
                                textPosition === pos.id ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-maintext'
                              }`}
                            >
                              {pos.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stickers Tray */}
                  <div className="flex flex-col gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 mb-8">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Stickers & Decorations</label>
                      <button 
                        onClick={() => setDecorations([])}
                        className="text-[10px] text-red-500 font-bold hover:underline"
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Internet Sticker Search */}
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Search for real stickers (e.g., 'birthday', 'cat')..."
                        value={stickerSearchQuery}
                        onChange={(e) => setStickerSearchQuery(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-maintext placeholder:text-gray-600"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>

                    {/* Internet Stickers Grid */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar min-h-[70px]">
                      {isSearchingStickers ? (
                        <div className="text-xs text-gray-500 flex items-center gap-2 px-2">
                          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          Searching stickers...
                        </div>
                      ) : internetStickers.length > 0 ? (
                        internetStickers.map(sticker => (
                          <button
                            key={sticker.id}
                            onClick={() => addDecoration('internet', sticker.url)}
                            className="w-16 h-16 flex-shrink-0 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all hover:scale-105 active:scale-95 group overflow-hidden p-1"
                          >
                            <img src={sticker.previewUrl} alt={sticker.title} className="w-full h-full object-contain" />
                          </button>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 px-2 italic">No stickers found. Try a different search!</div>
                      )}
                    </div>

                    {/* Classic Vector Stickers */}
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest px-1">Classic Vectors</label>
                      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {[
                          { type: 'heart', icon: Heart },
                          { type: 'star', icon: Star },
                          { type: 'gift', icon: Gift },
                          { type: 'sparkle', icon: Sparkles },
                          { type: 'party', icon: PartyPopper }
                        ].map(s => (
                          <button
                            key={s.type}
                            onClick={() => addDecoration(s.type)}
                            className="w-12 h-12 flex-shrink-0 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/20 transition-all hover:scale-105 active:scale-95 group"
                          >
                            <s.icon size={20} className="group-hover:rotate-12 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons moved to top header */}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center bg-primary/5 border-dashed border-primary/30">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wand2 size={40} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Create Your Masterpiece</h2>
              <p className="text-gray-400 max-w-md mx-auto">Select a beautiful template from our collection below to start personalizing your message.</p>
            </div>
          )}

          {/* Template Grid */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-black text-maintext mb-2 tracking-tight">
                  Explore <span className="text-primary">{selectedCategory}</span> Designs
                </h2>
                <p className="text-gray-500 text-sm font-medium">Fresh templates fetched live for your unique wishes</p>
              </div>
              
              {/* Live Search Bar */}
              <form onSubmit={handleSearch} className="w-full md:w-96 relative group">
                <input 
                  type="text"
                  placeholder={`Search ${selectedCategory.toLowerCase()} templates...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:outline-none focus:border-primary/50 transition-all text-maintext font-medium placeholder:text-gray-600 shadow-xl"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button type="submit" className="hidden"></button>
              </form>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-[2.5rem] border border-white/5"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {templates.map(template => (
                  <div 
                    key={template._id} 
                    onClick={() => handleTemplateClick(template)}
                    className={`relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(99,102,241,0.3)] ${selectedTemplate?._id === template._id ? 'ring-4 ring-primary' : 'ring-1 ring-white/10'}`}
                  >
                    <img 
                      src={template.imageUrl} 
                      alt={template.name} 
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80';
                        e.target.className = 'w-full h-full object-cover opacity-50';
                      }}
                    />
                    
                    {/* Live Preview Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>
                    
                    {/* Mini Profile Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 transform transition-transform duration-500 group-hover:translate-x-1">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="" crossOrigin="anonymous" className="w-8 h-8 rounded-full border border-white/50 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold border border-white/50 text-white">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[8px] text-primary font-bold tracking-tighter uppercase opacity-70">Best Wishes</p>
                        <p className="text-xs font-bold text-white truncate">{user?.name || 'Guest User'}</p>
                      </div>
                    </div>
                    
                    {template.isPremium && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded shadow-xl flex items-center gap-1 z-10">
                        <Crown size={10} /> PRO
                      </div>
                    )}
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

