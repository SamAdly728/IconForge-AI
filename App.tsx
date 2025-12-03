import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { LayoutGrid, PenTool, Download } from 'lucide-react';

import { UserState } from './types';
import { IconGenerator } from './components/IconGenerator';
import { IconResizer } from './components/IconResizer';

// Configuration retrieval from environment globals or defaults
const APP_ID = typeof window !== 'undefined' && window.__app_id ? window.__app_id : 'icon-forge-dev';
const FIREBASE_CONFIG = typeof window !== 'undefined' && window.__firebase_config ? JSON.parse(window.__firebase_config) : {};
const INITIAL_AUTH_TOKEN = typeof window !== 'undefined' && window.__initial_auth_token ? window.__initial_auth_token : null;

type Tab = 'generate' | 'resize';

const App: React.FC = () => {
  // Auth State
  const [userState, setUserState] = useState<UserState>({
    uid: null,
    isAuthenticated: false,
    isReady: false,
  });

  // Set default tab to 'resize' to make it the main page
  const [activeTab, setActiveTab] = useState<Tab>('resize');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

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

  const handleNavigateToExport = (imageUrl: string) => {
    setGeneratedImage(imageUrl);
    setActiveTab('resize');
  };

  if (!userState.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800 flex flex-col">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('resize')}>
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutGrid className="text-white h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">IconForge AI</span>
            </div>

            {/* Tab Navigation */}
            <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('resize')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'resize' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <Download size={16} />
                Export Assets
              </button>
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'generate' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <PenTool size={16} />
                AI Generator
              </button>
            </div>

            <div className="flex items-center gap-4">
               {userState.uid && (
                 <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200 hidden sm:block">
                   {userState.uid.slice(0, 8)}...
                 </span>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden border-b border-slate-200 bg-white px-4 py-2 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('resize')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'resize' 
                ? 'bg-teal-50 text-teal-700 border border-teal-100' 
                : 'text-slate-600 border border-transparent'
            }`}
          >
            <Download size={16} />
            Export Assets
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'generate' 
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                : 'text-slate-600 border border-transparent'
            }`}
          >
            <PenTool size={16} />
            AI Generator
          </button>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'generate' ? (
            <IconGenerator 
              appId={APP_ID} 
              onNavigateToExport={handleNavigateToExport} 
            />
          ) : (
            <IconResizer initialImage={generatedImage} />
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="bg-indigo-600 p-1.5 rounded-lg">
                <LayoutGrid className="text-white h-4 w-4" />
              </div>
              <span className="font-semibold text-slate-800">IconForge AI</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} IconForge AI. Powered by Gemini.
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;