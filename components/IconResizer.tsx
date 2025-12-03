import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { Upload, Download, Package, CheckCircle, FileImage, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { ResizerSEO } from './SeoContent';

interface IconResizerProps {
  initialImage?: string | null;
}

const IOS_SIZES = [
  { name: 'AppIcon-20x20@2x.png', size: 40 },
  { name: 'AppIcon-20x20@3x.png', size: 60 },
  { name: 'AppIcon-29x29@2x.png', size: 58 },
  { name: 'AppIcon-29x29@3x.png', size: 87 },
  { name: 'AppIcon-40x40@2x.png', size: 80 },
  { name: 'AppIcon-40x40@3x.png', size: 120 },
  { name: 'AppIcon-60x60@2x.png', size: 120 },
  { name: 'AppIcon-60x60@3x.png', size: 180 },
  { name: 'AppIcon-76x76@2x.png', size: 152 },
  { name: 'AppIcon-83.5x83.5@2x.png', size: 167 },
  { name: 'AppIcon-1024x1024.png', size: 1024 },
];

const ANDROID_SIZES = [
  { name: 'mipmap-mdpi/ic_launcher.png', size: 48 },
  { name: 'mipmap-hdpi/ic_launcher.png', size: 72 },
  { name: 'mipmap-xhdpi/ic_launcher.png', size: 96 },
  { name: 'mipmap-xxhdpi/ic_launcher.png', size: 144 },
  { name: 'mipmap-xxxhdpi/ic_launcher.png', size: 192 },
  { name: 'playstore-icon.png', size: 512 },
];

export const IconResizer: React.FC<IconResizerProps> = ({ initialImage }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
    }
  }, [initialImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, etc).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setSelectedImage(event.target?.result as string);
          setError(null);
        };
        reader.readAsDataURL(file);
    }
  };

  const processAndZip = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const zip = new JSZip();
      const androidFolder = zip.folder("android");
      const iosFolder = zip.folder("ios");

      const img = new Image();
      img.src = selectedImage;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx || !androidFolder || !iosFolder) {
        throw new Error("Failed to initialize generation context");
      }

      // Helper to resize and add to zip
      const processSize = async (folder: JSZip, name: string, size: number) => {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        
        // High quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, size, size);

        return new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              folder.file(name, blob);
            }
            resolve();
          }, 'image/png');
        });
      };

      // Process Android
      for (const spec of ANDROID_SIZES) {
        await processSize(androidFolder, spec.name, spec.size);
      }

      // Process iOS
      for (const spec of IOS_SIZES) {
        await processSize(iosFolder, spec.name, spec.size);
      }

      // Generate Zip
      const content = await zip.generateAsync({ type: "blob" });
      
      // Trigger Download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = "app-icons-bundle.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err: any) {
      console.error(err);
      setError("Failed to process images. Please try a different source image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Export <span className="text-teal-600">Assets</span>
            </h1>
            <p className="text-lg text-slate-600">
              Upload your high-resolution logo (1024x1024 recommended). We'll automatically resize it for Android (Adaptive) and iOS (App Store) standards and bundle them into a ZIP.
            </p>
          </div>

          {/* Upload Zone */}
          <div 
            className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-50 hover:border-teal-400 cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="bg-teal-50 text-teal-600 p-4 rounded-full mb-4">
              <Upload size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Upload Logo</h3>
            <p className="text-slate-500 text-sm mt-1">Click to browse or drag & drop here</p>
            <p className="text-slate-400 text-xs mt-4">Supports PNG, JPG, WEBP</p>
          </div>

          {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <FileImage size={20} className="text-slate-400" />
                  Preview & Export
                </h3>
                {selectedImage && (
                  <span className="text-xs font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} /> Ready to process
                  </span>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              {selectedImage ? (
                <div className="relative mb-8">
                    <div className="w-48 h-48 rounded-3xl shadow-xl overflow-hidden bg-[url('https://bg-patterns.netlify.app/bg-checkers.svg')]">
                      <img src={selectedImage} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-white p-2 rounded-lg shadow-sm text-xs font-mono border border-slate-200 text-slate-500">
                      Source
                    </div>
                </div>
              ) : (
                  <div className="text-center text-slate-400">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No image selected</p>
                  </div>
              )}

              {selectedImage && (
                <div className="w-full max-w-sm space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 grid grid-cols-2 gap-2">
                      <div>
                          <span className="font-semibold block text-slate-800">{ANDROID_SIZES.length} Files</span>
                          <span className="text-xs">Android (Mipmap)</span>
                      </div>
                      <div>
                          <span className="font-semibold block text-slate-800">{IOS_SIZES.length} Files</span>
                          <span className="text-xs">iOS (App Icon Set)</span>
                      </div>
                  </div>

                  <Button 
                      variant="secondary" 
                      className="w-full py-4 text-lg" 
                      onClick={processAndZip}
                      isLoading={isProcessing}
                      icon={<Download size={20} />}
                    >
                    {isProcessing ? 'Generating Bundle...' : 'Download ZIP Bundle'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ResizerSEO />
    </div>
  );
};
