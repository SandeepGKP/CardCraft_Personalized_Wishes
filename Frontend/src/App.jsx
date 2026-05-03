import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from './store/authSlice';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ViewCard from './pages/ViewCard';


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);
  const { currentTheme } = useSelector((state) => state.theme);
  
  // More robust path detection
  const hideNavbar = location.pathname.includes('/card/');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      if (token) {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch(updateUser(data));
        } catch (error) {
          console.error('Session sync failed:', error);
        }
      }
    };
    fetchLatestProfile();
  }, [token, dispatch]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/card/:id" element={<ViewCard />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
