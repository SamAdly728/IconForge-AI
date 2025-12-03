import React, { useState } from 'react';
import { Wand2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { ResultDisplay } from './ResultDisplay';
import { generateIconFromPrompt } from '../services/geminiService';
import { IconGenerationState } from '../types';
import { GeneratorSEO } from './SeoContent';

interface IconGeneratorProps {
  appId: string;
  onNavigateToExport: (imageUrl: string) => void;
}

export const IconGenerator: React.FC<IconGeneratorProps> = ({ appId, onNavigateToExport }) => {
  const [prompt, setPrompt] = useState('');
  const [genState, setGenState] = useState<IconGenerationState>({
    status: 'idle',
    imageUrl: null,
    error: null,
  });

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

  return (
    <div className="space-y-16">
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
              onResize={() => genState.imageUrl && onNavigateToExport(genState.imageUrl)}
            />
            <p className="text-center text-slate-400 text-xs mt-6">
              App ID: {appId} • AI Model: gemini-2.5-flash-image
            </p>
        </div>
      </div>

      <GeneratorSEO />
    </div>
  );
};
