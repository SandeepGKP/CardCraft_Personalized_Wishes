import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/authSlice';
import axios from 'axios';
import { X, Camera, Trash2, CheckCircle2 } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [removePhoto, setRemovePhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);


  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setPreviewUrl(user.profilePicture || '');
      setImageFile(null);
      setRemovePhoto(false);
      setSuccess(false);
      setError('');
      setImgError(false);

    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemovePhoto(false);
      setImgError(false);

    }
  };

  const handleRemovePhoto = () => {
    setImageFile(null);
    setPreviewUrl('');
    setRemovePhoto(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (removePhoto) {
      formData.append('removePhoto', 'true');
    }

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,

        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      dispatch(updateUser(data));
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-[fadeIn_0.3s_ease_out]">
      <div className="glass-panel w-full max-w-md overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] border-white/10 ring-1 ring-white/10">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Profile Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 animate-[fadeIn_0.4s_ease_out]">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-primary animate-[scale_0.3s_ease_out]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Profile Updated!</h3>
              <p className="text-gray-400">Your changes have been synced successfully.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              
              {/* Avatar Section */}
              <div className="mb-10 flex flex-col items-center gap-4">
                <div className="relative group">
                  <div 
                    onClick={handleImageClick}
                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary transition-all cursor-pointer relative shadow-2xl ring-4 ring-black"
                  >
                    {previewUrl && !imgError ? (
                      <img 
                        src={previewUrl} 
                        alt="Avatar" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-4xl font-bold text-gray-500">
                        {name.charAt(0) || '?'}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera size={24} className="text-white mb-1" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Change</span>
                    </div>
                  </div>
                  
                  {previewUrl && (
                    <button 
                      onClick={handleRemovePhoto}
                      className="absolute -bottom-1 -right-1 bg-red-500 hover:bg-red-600 p-2.5 rounded-full border-4 border-black text-white shadow-xl transition-all hover:scale-110 active:scale-95"
                      title="Remove Photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Click image to upload</p>
              </div>

              {error && (
                <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-xs text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleUpdate} className="flex flex-col gap-6 text-left w-full">
                {/* User Info Details */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Account Status</span>
                    {user?.isPremium ? (
                      <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black px-2 py-0.5 rounded border border-yellow-500/20">👑 PRO</span>
                    ) : (
                      <span className="bg-white/10 text-gray-400 text-[10px] font-black px-2 py-0.5 rounded border border-white/10">FREE PLAN</span>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Email Address</p>
                    <p className="text-sm text-gray-300 font-medium">{user?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Display Name</label>
                  <input
                    type="text"
                    className="bg-black/30 border border-white/10 p-3.5 rounded-xl focus:outline-none focus:border-primary transition-colors text-white font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="btn btn-outline flex-1 h-12 text-sm font-bold border-white/10 hover:bg-white/5 transition-all text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary flex-1 h-12 text-sm font-bold shadow-[0_10px_20px_rgba(99,102,241,0.3)]" 
                    disabled={loading}
                  >
                    {loading ? 'Syncing...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
    </div>
  );
};

export default ProfileModal;

