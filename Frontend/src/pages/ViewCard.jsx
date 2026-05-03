import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Heart,
  Star,
  Gift,
  Sparkles,
  PartyPopper,
  Wand2,
  Home as HomeIcon,
  X
} from 'lucide-react';

const ViewCard = () => {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [senderImgError, setSenderImgError] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cards/${id}`);
        setCard(data);
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Card not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium">Opening your special wish...</p>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
          <Sparkles size={40} />
        </div>
        <h2 className="text-2xl font-bold text-maintext">{error || 'Something went wrong'}</h2>
        <Link to="/" className="btn btn-primary flex items-center gap-2">
          <HomeIcon size={18} />
          Go to Home
        </Link>
      </div>
    );
  }

  const { templateImageUrl, message, textStyle, decorations, senderName, senderProfilePic } = card;

  return (
    <div className="flex flex-col items-center py-12 px-12 animate-[fadeIn_0.5s_ease_out] max-w-4xl mx-auto overflow-x-visible">
      {/* Brand Tag */}
      <div className="mb-12">
        <Link to="/" className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-lg group hover:bg-white/20 transition-all flex items-center gap-3">
          <p className="text-xs font-black text-maintext/60 tracking-[0.2em] uppercase flex items-center gap-2">
            Created with CardCraft <span className="text-primary font-black flex items-center gap-1"> <Sparkles size={12} /></span>
          </p>
        </Link>
      </div>

      {/* Card Canvas Container */}
      <div className="relative w-full max-w-[440px] aspect-[4/5] rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.8)] bg-black ring-1 ring-white/10 overflow-visible">
        
        {/* Actual Card Body (clipped) */}
        <div className="absolute inset-0 rounded-[3rem] overflow-hidden">
          {/* Top Header Bar */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-[#261d18] flex items-center justify-center z-30 shadow-lg">
            <h3 className="text-3xl font-black text-white tracking-widest uppercase">
              {senderName || 'Wishes'}
            </h3>
          </div>

          {/* Main Image Layer */}
          <div className="absolute inset-0 pt-24 pb-0">
            <img
              src={templateImageUrl}
              alt="Card Background"
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Custom Wish Message Overlay */}
          <div className={`absolute inset-0 pt-32 p-12 flex flex-col pointer-events-none z-20 text-center ${
            textStyle.position === 'top' ? 'justify-start' : 
            textStyle.position === 'bottom' ? 'justify-end pb-24' : 
            'justify-center'
          }`}>
            <p
              className="font-black leading-tight italic tracking-tight drop-shadow-2xl"
              style={{
                fontSize: `${textStyle.fontSize}px`,
                color: textStyle.color,
                fontFamily: textStyle.fontFamily,
                textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)'
              }}
            >
              {message}
            </p>
          </div>

          {/* Decorations Layer */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {decorations && decorations.map((deco) => {
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
        </div>

        {/* Floating Profile Picture (Outside clipped area to overlap edge) */}
        <div className="absolute top-20 lg:-left-6 md:-left-4 -left-2 z-50 lg:w-24 lg:h-24 md:w-20 md:h-20 w-12 h-12 animate-[fadeIn_0.5s_ease_out]">
          <div className="relative w-full h-full p-1.5 bg-[#22c55e] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.4)] ring-4 ring-black/20">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {senderProfilePic && !senderImgError ? (
                <img
                  src={senderProfilePic}
                  alt="Sender"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                  onError={() => setSenderImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/80 to-secondary/80 text-white font-black text-4xl">
                  {senderName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full border-4 border-[#261d18] flex items-center justify-center shadow-lg">
              <Sparkles size={14} className="text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Call to Action */}
      <div className="mt-16 text-center flex flex-col items-center gap-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Want to create your own?</h3>
        <p className="text-gray-400 max-w-sm">Surprise your loved ones with a personalized generated wish card.</p>
        <Link to="/" className="btn btn-primary px-10 py-4 rounded-2xl flex items-center gap-3 group shadow-[0_20px_40px_rgba(99,102,241,0.4)]">
          <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="font-black tracking-wide">Start Creating</span>
        </Link>
      </div>
    </div>
  );
};

export default ViewCard;
