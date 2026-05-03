import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { setTheme } from '../store/themeSlice';
import { LogOut, User as UserIcon, Crown, Sun, Moon, Sparkles, Palette } from 'lucide-react';
import ProfileModal from './ProfileModal';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { currentTheme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [imgError, setImgError] = useState(false);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const themes = [
    { id: 'midnight', name: 'Midnight', icon: Moon, color: 'bg-[#0a0a0f]' },
    { id: 'cloud', name: 'Cloud', icon: Sun, color: 'bg-[#f8fafc]' },
    { id: 'royal', name: 'Royal', icon: Sparkles, color: 'bg-[#140a23]' },
  ];

  return (
    <nav className="sticky top-4 z-50 mb-8 mx-auto w-full md:max-w-6xl lg:max-w-6xl px-4 md:px-0">
      
      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />

      <div className="glass-panel px-6 py-4 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <Link to="/" className="text-xl sm:text-2xl font-black flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transform transition-transform hover:scale-105 active:scale-95">
          {/* <span className="text-xl sm:text-2xl drop-shadow-lg">✨</span> */}
          <span className="hidden min-[360px]:block">CardCraft</span>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-6">

          {/* Theme Toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-primary hover:border-primary/30 transition-all active:scale-95 group"
              title="Change Theme"
            >
              <Palette size={20} className="group-hover:rotate-12 transition-transform" />
            </button>

            {showThemeMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)}></div>
                <div className="absolute top-full right-0 mt-3 w-48 glass-panel p-2 shadow-2xl z-50 animate-[fadeInUp_0.3s_ease_out] border-white/10">
                  <div className="p-2 mb-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Select Theme</p>
                  </div>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        dispatch(setTheme(t.id));
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${
                        currentTheme === t.id 
                          ? 'bg-primary/20 text-primary border border-primary/20' 
                          : 'hover:bg-white/5 text-gray-400 border border-transparent'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${t.color} border border-white/10 flex items-center justify-center`}>
                        <t.icon size={8} className={t.id === 'cloud' ? 'text-orange-500' : 'text-white'} />
                      </div>
                      <span className="text-xs font-bold">{t.name}</span>
                      {currentTheme === t.id && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {isAuthenticated ? (
            <>
              {user?.isPremium && (
                <div className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-600 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/10">
                  <Crown size={12} fill="black" /> Premium
                </div>
              )}

              
              <div 
                key={user?._id + (user?.profilePicture || 'no-photo')}
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-3 cursor-pointer group p-1 pr-4 rounded-full bg-white/5 border border-white/5 hover:border-primary/30 transition-all active:scale-95 shadow-lg"
              >
                <div className="relative flex-shrink-0">
                  {user?.profilePicture && !imgError ? (
                    <img 
                      src={user.profilePicture} 
                      alt="User Profile" 
                      crossOrigin="anonymous"
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary shadow-2xl transition-all duration-300 group-hover:scale-105" 
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-2xl font-bold">
                      {user?.name?.charAt(0) || <UserIcon size={18} />}
                    </div>
                  )}

                  {user?.isPremium && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-black flex items-center justify-center text-[8px] shadow-lg animate-bounce z-10">
                      👑
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em] mb-0.5 opacity-70">Account</p>
                  <div className="flex items-center gap-1.5">
                    <p className="font-black text-white text-xs leading-none group-hover:text-primary transition-colors truncate max-w-[80px]">
                      {user?.name?.split(' ')[0] || 'User'}
                    </p>
                    {user?.isPremium && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>}
                  </div>
                </div>
              </div>

              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-red-400/5">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary !px-4 sm:!px-6 !py-2 !sm:py-2.5 !rounded-full shadow-xl text-sm sm:text-base">Login</Link>

          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

