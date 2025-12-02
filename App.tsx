import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { Wand2, AlertCircle, LayoutGrid } from 'lucide-react';

import { Button } from './components/Button';
import { ResultDisplay } from './components/ResultDisplay';
import { generateIconFromPrompt } from './services/geminiService';
import { UserState, IconGenerationState } from './types';

// Configuration retrieval from environment globals or defaults
const APP_ID = typeof window !== 'undefined' && window.__app_id ? window.__app_id : 'icon-forge-dev';
const FIREBASE_CONFIG = typeof window !== 'undefined' && window.__firebase_config ? JSON.parse(window.__firebase_config) : {};
const INITIAL_AUTH_TOKEN = typeof window !== 'undefined' && window.__initial_auth_token ? window.__initial_auth_token : null;

const App: React.FC = () => {
  // Auth State
  const [userState, setUserState] = useState<UserState>({
    uid: null,
    isAuthenticated: false,
    isReady: false,
  });

  // App State
  const [prompt, setPrompt] = useState('');
  const [genState, setGenState] = useState<IconGenerationState>({
    status: 'idle',
    imageUrl: null,
    error: null,
  });

  // Initialize Firebase Auth
  useEffect(() => {
    let unsubscribe: () => void;
    
    const initAuth = async () => {
      try {
        // Only initialize if config is present, otherwise mock ready for dev/preview
        if (Object.keys(FIREBASE_CONFIG).length === 0) {
           console.warn("No Firebase config found. Running in UI-only mode.");
           setUserState({ uid: 'dev-user', isAuthenticated: true, isReady: true });
           return;
        }

        const app = initializeApp(FIREBASE_CONFIG);
        const auth = getAuth(app);

        unsubscribe = onAuthStateChanged(auth, (user) => {
          setUserState({
            uid: user ? user.uid : null,
            isAuthenticated: !!user,
            isReady: true,
          });
        });

        await setPersistence(auth, browserSessionPersistence);
        
        if (INITIAL_AUTH_TOKEN) {
          await signInWithCustomToken(auth, INITIAL_AUTH_TOKEN);
        } else {
          await signInAnonymously(auth);
        }

      } catch (error) {
        console.error("Auth initialization failed:", error);
        // Allow app to render even if auth fails, but restricted
        setUserState(prev => ({ ...prev, isReady: true }));
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setGenState({ status: 'loading', imageUrl: null, error: null });

    try {
      const base64Image = await generateIconFromPrompt(prompt);
      setGenState({
        status: 'success',
        imageUrl: base64Image,
        error: null
      });
    } catch (err: any) {
      setGenState({
        status: 'error',
        imageUrl: null,
        error: err.message || "Something went wrong during generation."
      });
    }
  };

  const handleDownload = () => {
    if (genState.imageUrl) {
      const link = document.createElement('a');
      link.href = genState.imageUrl;
      link.download = `icon-forge-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!userState.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutGrid className="text-white h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">IconForge AI</span>
            </div>
            <div className="flex items-center gap-4">
               {userState.uid && (
                 <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                   {userState.uid.slice(0, 8)}...
                 </span>
               )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Generate stunning <span className="text-indigo-600">icons</span> in seconds.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Describe your ideal app icon, and let our advanced AI model render it instantly. Perfect for MVPs, side projects, and production apps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-2">
                  What should your icon look like?
                </label>
                <textarea
                  id="prompt"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-800 placeholder:text-slate-400"
                  placeholder="e.g. A stylized fox head, geometric style, orange and purple gradients, dark background..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={genState.status === 'loading'}
                />
              </div>

              {genState.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{genState.error}</p>
                </div>
              )}

              <Button 
                onClick={handleGenerate} 
                isLoading={genState.status === 'loading'}
                disabled={!prompt.trim()}
                className="w-full text-lg py-4"
                icon={<Wand2 className="w-5 h-5" />}
              >
                Generate Icon
              </Button>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
              <p className="font-semibold mb-1">💡 Pro Tip</p>
              <p>Be specific about style. Try adding keywords like "flat", "3D", "neon", "pastel", or "isometric" for better results.</p>
            </div>
          </div>

          {/* Right Column: Display */}
          <div className="lg:col-span-7 flex flex-col justify-center">
             <ResultDisplay 
               imageUrl={genState.imageUrl}
               isLoading={genState.status === 'loading'}
               onDownload={handleDownload}
             />
             <p className="text-center text-slate-400 text-xs mt-6">
                App ID: {APP_ID} • AI Model: gemini-2.5-flash-image
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
