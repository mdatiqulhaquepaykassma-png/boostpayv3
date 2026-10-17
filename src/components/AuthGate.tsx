import { FC, useState } from 'react';
import { Shield, ArrowRight, Eye, EyeOff, Sparkles, Mail, Lock } from 'lucide-react';
import { BoostPayStore, copyToClipboard } from '../services/store';
import { User } from '../types';

interface Props {
  onLoginUser: (user: User) => void;
}

export const AuthGate: FC<Props> = ({ onLoginUser }) => {
  const [tab, setTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter your email address and password.');
      return;
    }

    const res = BoostPayStore.loginUser(loginEmail.trim(), loginPassword);
    if (!res.success || !res.user) {
      setLoginError(res.error || 'Invalid email or password.');
      return;
    }

    onLoginUser(res.user);
  };

  const completeSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    const cleanEmail = signupEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setSignupError('Please enter a valid email address.');
      return;
    }

    if (!signupPassword) {
      setSignupError('Please set a security password.');
      return;
    }

    if (signupPassword.length < 4) {
      setSignupError('Password must be at least 4 characters long.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    try {
      const newUser = BoostPayStore.registerUser(cleanEmail, signupPassword);
      onLoginUser(newUser);
    } catch (err: any) {
      setSignupError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-center px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/20 mb-3">
          <Sparkles className="w-7 h-7 fill-current" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">BoostPay</h1>
        <p className="text-xs text-zinc-400 mt-1">Smart Yield Engine & P2P Transfers</p>
      </div>

      {/* Auth Card */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-2xl backdrop-blur-xl">
        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-zinc-950 p-1 mb-5 border border-zinc-800/80">
          <button
            onClick={() => { setTab('LOGIN'); setLoginError(''); }}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition ${
              tab === 'LOGIN'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('SIGNUP'); setSignupError(''); }}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition ${
              tab === 'SIGNUP'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Sign In Form */}
        {tab === 'LOGIN' && (
          <form onSubmit={handleUserLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Address or Numeric ID
              </label>
              <input
                type="text"
                placeholder="e.g. user@gmail.com or 1"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Security Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Enter your account password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="rounded-xl bg-red-950/40 border border-red-500/30 p-2.5 text-xs text-red-400">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-amber-500 text-xs font-bold text-zinc-950 hover:bg-amber-400 active:scale-[0.98] transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              Sign In to Wallet <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Create Account Form */}
        {tab === 'SIGNUP' && (
          <form onSubmit={completeSignup} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. user@gmail.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Set Security Password
              </label>
              <div className="relative">
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showSignupPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {signupError && (
              <p className="rounded-xl bg-red-950/40 border border-red-500/30 p-2.5 text-xs text-red-400">
                {signupError}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-amber-500 text-xs font-bold text-zinc-950 hover:bg-amber-400 active:scale-[0.98] transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              Complete Registration <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
