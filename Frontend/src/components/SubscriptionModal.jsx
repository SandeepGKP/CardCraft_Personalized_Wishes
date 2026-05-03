import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/authSlice';
import { Check, Crown, X, Star, Zap, Infinity } from 'lucide-react';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$1.99',
      period: '/mo',
      icon: <Zap size={18} />,
      desc: 'Flexibility for short term',
      tag: 'Basic'
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$19.99',
      period: '/yr',
      icon: <Star size={18} />,
      desc: 'Save 40% annually',
      tag: 'Best Value',
      popular: true
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$49.99',
      period: 'once',
      icon: <Infinity size={18} />,
      desc: 'One payment, forever',
      tag: 'Infinite'
    }
  ];

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // We pass the selected plan to the backend
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/upgrade`,
        { plan: selectedPlan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateUser(data));
      onClose();
      alert(`Congratulations! You are now a ${selectedPlan.toUpperCase()} Premium member! 👑`);
    } catch (error) {
      alert('Upgrade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-[fadeIn_0.3s_ease_out]">
      <div className="glass-panel w-full max-w-2xl relative overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] border-white/10">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-premium/10 rounded-full blur-[80px]"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-all hover:bg-white/10 z-10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Features */}
          <div className="flex-1 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.02]">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-premium/10 border border-premium/20 rounded-full mb-4">
              <Crown size={14} className="text-premium" />
              <span className="text-[10px] font-black text-premium uppercase tracking-[0.2em]">Premium Access</span>
            </div>
            
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Elevate Your <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium to-amber-500">Wishes</span>
            </h2>
            
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Unlock the full potential of CardCraft and create memories that last forever.
            </p>

            <div className="space-y-4">
              {[
                'Unlimited Premium Templates',
                'High-Resolution AI Export',
                'No Watermarks on Shared Links',
                'Priority Sticker Library Access',
                'Custom Typography Engine'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-gray-300 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Plans */}
          <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Choose Your Plan</h3>
            
            <div className="space-y-3 mb-8">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 active:scale-95 ${
                    selectedPlan === plan.id 
                    ? 'bg-premium/10 border-premium shadow-[0_0_20px_rgba(251,191,36,0.15)]' 
                    : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-premium text-[8px] font-black text-black rounded uppercase tracking-widest">
                      Popular
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedPlan === plan.id ? 'bg-premium text-black' : 'bg-white/5 text-gray-400'
                    }`}>
                      {plan.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${selectedPlan === plan.id ? 'text-white' : 'text-gray-400'}`}>
                          {plan.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold">{plan.desc}</p>
                    </div>

                    <div className="text-right">
                      <span className={`text-lg font-black ${selectedPlan === plan.id ? 'text-premium' : 'text-white'}`}>
                        {plan.price}
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold">{plan.period}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-black bg-gradient-to-r from-premium to-amber-500 hover:from-yellow-300 hover:to-amber-400 transform transition-all active:scale-[0.98] shadow-[0_15px_30px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Processing...' : `Upgrade to ${plans.find(p => p.id === selectedPlan).name}`}
                {!loading && <Check size={18} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
            
            <p className="mt-4 text-[9px] text-gray-600 text-center font-bold uppercase tracking-widest leading-loose">
              Secure SSL Encrypted Payment <br /> Cancel Anytime for Monthly/Yearly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
