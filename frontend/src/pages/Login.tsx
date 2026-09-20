import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { authApi } from '../api/client';
import { ShieldAlert, Loader2 } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken, setUser } = useAppStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await authApi.login(username, password);
      setToken(data.token);
      setUser(data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const autofill = (role: 'admin' | 'supervisor' | 'investigator' = 'investigator') => {
    const creds = {
      admin: { username: 'admin', password: 'admin123' },
      supervisor: { username: 'supervisor', password: 'super123' },
      investigator: { username: 'investigator', password: 'inv123' },
    };
    setUsername(creds[role].username);
    setPassword(creds[role].password);
  };

  return (
    <div className="min-h-screen bg-sandhan-blue-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sandhan-orange-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sandhan-blue-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="glass p-10 rounded-2xl w-full max-w-md z-10 border border-sandhan-blue-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-sandhan-blue-800 rounded-2xl border border-sandhan-blue-600 flex items-center justify-center shadow-lg shadow-black/50">
              <span className="text-3xl text-sandhan-orange-500 font-devanagari">सं</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">SANDHAN</h1>
          <p className="text-gray-400 text-sm">Secure Authentication</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-sandhan-blue-900/50 border border-sandhan-blue-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sandhan-orange-500 focus:ring-1 focus:ring-sandhan-orange-500 transition-all"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-sandhan-blue-900/50 border border-sandhan-blue-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sandhan-orange-500 focus:ring-1 focus:ring-sandhan-orange-500 transition-all"
              placeholder="Enter password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-sandhan-orange-500 hover:bg-sandhan-orange-600 text-white font-bold rounded-lg shadow-lg shadow-sandhan-orange-500/20 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Login to System'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-sandhan-blue-800 text-center">
          <p className="text-xs text-gray-500 mb-3">Demo Credentials</p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => autofill('investigator')}
              className="text-xs px-3 py-1.5 rounded bg-sandhan-blue-800 border border-sandhan-blue-700 text-sandhan-orange-400 hover:border-sandhan-orange-500 transition-colors"
            >
              Investigator
            </button>
            <button
              type="button"
              onClick={() => autofill('supervisor')}
              className="text-xs px-3 py-1.5 rounded bg-sandhan-blue-800 border border-sandhan-blue-700 text-sandhan-orange-400 hover:border-sandhan-orange-500 transition-colors"
            >
              Supervisor
            </button>
            <button
              type="button"
              onClick={() => autofill('admin')}
              className="text-xs px-3 py-1.5 rounded bg-sandhan-blue-800 border border-sandhan-blue-700 text-sandhan-orange-400 hover:border-sandhan-orange-500 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-xs text-gray-600 text-center">
        SANDHAN Cyber Investigation Engine v1.0<br/>
        Authorized Personnel Only
      </div>
    </div>
  );
};

export default Login;
