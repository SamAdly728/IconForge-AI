import React from 'react';
import { Download, Share2, Sparkles, Package } from 'lucide-react';
import { Button } from './Button';

interface ResultDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  onDownload: () => void;
  onResize?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, isLoading, onDownload, onResize }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[350px]">
      {isLoading ? (
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-48 h-48 bg-slate-100 rounded-2xl mb-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent animate-shimmer" style={{ transform: 'skewX(-20deg) translateX(-150%)' }}></div>
          </div>
          <div className="h-4 w-32 bg-slate-100 rounded mb-2"></div>
          <div className="h-3 w-48 bg-slate-50 rounded"></div>
        </div>
      ) : imageUrl ? (
        <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-300">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <img 
              src={imageUrl} 
              alt="Generated Icon" 
              className="relative w-64 h-64 object-cover rounded-2xl shadow-xl border border-white/50"
            />
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm">
            <Button variant="outline" icon={<Download size={16} />} onClick={onDownload}>
              Download
            </Button>
            {onResize && (
              <Button variant="secondary" icon={<Package size={16} />} onClick={onResize}>
                Resize & ZIP
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 mb-4">
            <Sparkles size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to Create</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Describe your vision above and watch our AI craft the perfect icon for your project.
          </p>
        </div>
      )}
    </div>
  );
};