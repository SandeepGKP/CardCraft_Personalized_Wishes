import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/authSlice';
import axios from 'axios';

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(user?.name || '');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('image', imageFile);
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
      setMessage('Profile updated successfully! ✨');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 animate-[fadeIn_0.4s_ease_out]">
      <div className="glass-panel p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-white w-full text-left">Profile Settings</h1>
        
        {message && (
          <div className="w-full bg-primary/20 text-primary border border-primary/30 p-4 rounded-2xl mb-8 text-center font-medium">
            {message}
          </div>
        )}

        <div className="relative group cursor-pointer mb-10" onClick={handleImageClick}>
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/50 group-hover:border-primary transition-all shadow-2xl relative">
            {previewUrl && !loading ? (
              <img 
                src={previewUrl} 
                alt="Profile" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setPreviewUrl('')}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl font-black text-white leading-none">
                <span className="mb-2">{user?.name?.charAt(0) || 'U'}</span>
              </div>
            )}
            
            {/* Upload Overlay / Tooltip */}
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Change Photo</span>
            </div>
          </div>
          
          {/* Decorative Ring */}
          <div className="absolute -inset-2 border border-primary/20 rounded-full animate-[pulse_3s_infinite] -z-10"></div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <form onSubmit={handleUpdate} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider ml-1">Display Name</label>
            <input
              type="text"
              className="bg-black/40 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-primary transition-colors text-white text-lg"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              className="bg-black/10 border border-white/5 p-4 rounded-2xl text-gray-500 cursor-not-allowed text-lg"
              value={user?.email || 'N/A'}
              disabled
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4 h-14 text-lg" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Changes...
              </div>
            ) : 'Save Profile Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

