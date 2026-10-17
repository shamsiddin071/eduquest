import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfiguredSupabase } from '../supabaseClient';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Gamepad2,
  Database
} from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const executeLocalAuth = (isCreatingAccount) => {
    const rawLocalUsers = localStorage.getItem('eduquest_local_users');
    let localUsers = [];
    try {
      localUsers = rawLocalUsers ? JSON.parse(rawLocalUsers) : [];
    } catch {
      localUsers = [];
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isCreatingAccount) {
      if (!fullName.trim()) {
        throw new Error('Please provide your full name to create an account.');
      }

      const existing = localUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      const newUser = {
        id: 'local_user_' + Date.now(),
        full_name: fullName.trim(),
        email: cleanEmail,
        current_level: 1,
        total_xp: 0,
        streak_days: 1
      };

      localUsers.push(newUser);
      localStorage.setItem('eduquest_local_users', JSON.stringify(localUsers));
      localStorage.setItem('eduquest_demo_user', JSON.stringify(newUser));

      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      let foundUser = localUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!foundUser) {
        // If not found locally, create a swift session so user is never locked out
        foundUser = {
          id: 'local_user_' + Date.now(),
          full_name: cleanEmail.split('@')[0].replace(/[._]/g, ' '),
          email: cleanEmail,
          current_level: 1,
          total_xp: 0,
          streak_days: 1
        };
        localUsers.push(foundUser);
        localStorage.setItem('eduquest_local_users', JSON.stringify(localUsers));
      }

      localStorage.setItem('eduquest_demo_user', JSON.stringify(foundUser));
      setSuccessMessage('Welcome back! Entering quest arena...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // If real Supabase keys are configured, attempt real remote authentication
      if (isConfiguredSupabase) {
        try {
          if (isSignUp) {
            if (!fullName.trim()) {
              throw new Error('Please provide your full name to create an account.');
            }

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: email.trim(),
              password: password,
              options: {
                data: {
                  full_name: fullName.trim()
                }
              }
            });

            if (signUpError) throw signUpError;

            if (signUpData.user) {
              await supabase.from('users').upsert({
                id: signUpData.user.id,
                full_name: fullName.trim(),
                email: email.trim(),
                current_level: 1,
                total_xp: 0,
                streak_days: 1
              });

              setSuccessMessage('Account created successfully! Redirecting...');
              setTimeout(() => {
                navigate('/dashboard');
              }, 1200);
              return;
            }
          } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password: password
            });

            if (signInError) throw signInError;

            navigate('/dashboard');
            return;
          }
        } catch (remoteError) {
          // If network / fetch failed (e.g. invalid Supabase domain or unreachable)
          if (remoteError.message?.toLowerCase().includes('fetch')) {
            console.warn('Supabase host unreachable, falling back to local storage profile:', remoteError);
            executeLocalAuth(isSignUp);
            return;
          }
          throw remoteError;
        }
      } else {
        // Instant local authentication mode
        executeLocalAuth(isSignUp);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const demoUser = {
      id: 'guest-demo-user',
      full_name: 'Guest Challenger',
      email: 'guest@eduquest.io',
      current_level: 3,
      total_xp: 450,
      streak_days: 3
    };
    localStorage.setItem('eduquest_demo_user', JSON.stringify(demoUser));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent">
            EduQuest
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Turn your mistakes into missions. Level up your mind.
          </p>

          <div className="mt-3 flex justify-center">
            {isConfiguredSupabase ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Database className="w-3 h-3" />
                <span>Supabase Cloud Connected</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Instant Play Mode (Ready to Sign Up)</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 p-1 bg-slate-800/80 rounded-xl mb-6 border border-slate-700/60">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              !isSignUp
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              isSignUp
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required={isSignUp}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@eduquest.io"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Player Account' : 'Enter Quest Arena'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">
              Or Instant Access
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span>Continue as Guest Challenger (Demo)</span>
        </button>
      </div>
    </div>
  );
}
