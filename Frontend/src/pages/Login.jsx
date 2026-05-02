import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { login } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {

        token: credentialResponse.credential
      });
      dispatch(login({ user: data, token: data.token }));
      navigate('/');
    } catch (error) {
      alert('Google authentication failed on server');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister ? { name, email, password } : { email, password };
      
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, payload);

      dispatch(login({ user: data, token: data.token }));
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/guest`);

      dispatch(login({ user: data, token: data.token }));
      navigate('/');
    } catch (error) {
      alert('Guest login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-150px)] animate-[fadeIn_0.4s_ease_forwards]">
      <div className="glass-panel w-full max-w-md p-10 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to CardCraft ✨
        </h1>
        <p className="text-gray-400 mb-8">Create beautiful personalized greeting cards</p>
        
        <form onSubmit={handleAuth} className="text-left flex flex-col gap-5">
          {isRegister && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400 font-medium">Name</label>
              <input
                type="text"
                className="bg-black/20 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-primary transition-colors text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-medium">Email</label>
            <input
              type="email"
              className="bg-black/20 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-primary transition-colors text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-medium">Password</label>
            <input
              type="password"
              className="bg-black/20 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-primary transition-colors text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <div className="flex items-center my-8 text-gray-500">
          <div className="flex-1 border-b border-white/10"></div>
          <span className="px-4 text-sm font-medium">OR</span>
          <div className="flex-1 border-b border-white/10"></div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert('Google Login Failed')}
              theme="outline"
              size="large"
              text="continue_with"
            />
          </div>
          
          <button className="btn btn-outline w-full" onClick={handleGuestLogin} disabled={loading}>
            Continue as Guest
          </button>
        </div>

        <p className="mt-8 text-gray-400 text-sm">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span className="text-primary font-semibold cursor-pointer hover:underline" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
