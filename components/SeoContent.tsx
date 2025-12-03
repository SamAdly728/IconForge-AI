import React from 'react';
import { HelpCircle, Layers, Smartphone, Zap } from 'lucide-react';

export const ResizerSEO: React.FC = () => (
  <section className="mt-20 border-t border-slate-200 pt-16">
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Comprehensive App Icon Resizing Guide</h2>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <Smartphone className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">iOS App Store Standards</h3>
          <p className="text-slate-600">
            We automatically generate the required sizes for Xcode Asset Catalogs, including 
            <span className="font-mono text-xs bg-slate-100 p-1 mx-1 rounded">20pt</span>,
            <span className="font-mono text-xs bg-slate-100 p-1 mx-1 rounded">29pt</span>,
            <span className="font-mono text-xs bg-slate-100 p-1 mx-1 rounded">40pt</span>,
            <span className="font-mono text-xs bg-slate-100 p-1 mx-1 rounded">60pt</span>,
            and the massive <span className="font-mono text-xs bg-slate-100 p-1 mx-1 rounded">1024x1024</span> marketing icon.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <Layers className="w-8 h-8 text-teal-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Android Adaptive Icons</h3>
          <p className="text-slate-600">
            Our tool creates the full density bucket spectrum for Android Studio:
            <span className="font-mono text-xs bg-slate-100 p-1 mx-1 rounded">mdpi</span>,
            <span className="font-mono text-xs bg-slate-100 p-1 mx-1 rounded">hdpi</span>,
            <span className="font-mono text-xs bg-slate-100 p-1 mx-1 rounded">xhdpi</span>,
            <span className="font-mono text-xs bg-slate-100 p-1 mx-1 rounded">xxhdpi</span>, and
            <span className="font-mono text-xs bg-slate-100 p-1 mx-1 rounded">xxxhdpi</span>.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <Zap className="w-8 h-8 text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Instant ZIP Export</h3>
          <p className="text-slate-600">
            Don't waste time manually resizing in Photoshop or Figma. Upload your high-resolution logo once, and download a structured ZIP file ready to drop directly into your project's resource folders.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h3>
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-semibold text-lg text-slate-900 mb-2">What is the best resolution for an app icon upload?</h4>
            <p className="text-slate-600">For best results, upload a square image of at least 1024x1024 pixels. This ensures that the largest required assets (App Store Marketing Icon and Google Play Store Icon) are crisp and sharp.</p>
          </div>
          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-semibold text-lg text-slate-900 mb-2">Does this support transparent backgrounds?</h4>
            <p className="text-slate-600">Yes! If you upload a PNG with transparency, we preserve it. However, note that iOS App Store icons do not support transparency (they are rendered on a black background if transparent), so we recommend using a solid background for production builds.</p>
          </div>
          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-semibold text-lg text-slate-900 mb-2">Is this tool free for commercial apps?</h4>
            <p className="text-slate-600">Absolutely. You can use the generated assets for any commercial project, indie app, or client work without attribution.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const GeneratorSEO: React.FC = () => (
  <section className="mt-20 border-t border-slate-200 pt-16">
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">AI-Powered App Icon Generation</h2>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Why use AI for App Icons?</h3>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Speed:</strong> Go from idea to visual asset in under 5 seconds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Uniqueness:</strong> Generate completely original designs that don't look like generic stock assets.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Style Consistency:</strong> Request specific styles like "Flat", "Neumorphism", "Pixel Art", or "3D Isometric" to match your app's UI.</span>
            </li>
          </ul>
        </div>
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <HelpCircle size={20} /> Prompt Engineering Tips
          </h3>
          <p className="text-indigo-800 mb-4 text-sm">To get the best results from our Gemini-powered engine:</p>
          <ul className="list-disc list-inside space-y-2 text-indigo-700 text-sm">
            <li><strong>Be Specific:</strong> Instead of "cat", try "Minimalist geometric orange cat head, white background".</li>
            <li><strong>Define Style:</strong> Use keywords like "Vector art", "Gradient", "Matte finish", or "Glossy".</li>
            <li><strong>Keep it Simple:</strong> App icons work best with simple shapes and high contrast. Avoid complex details.</li>
          </ul>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Generated Icon Usage Rights</h3>
        <p className="text-slate-600 mb-4">
          Images generated by IconForge AI are created using Google's Imagen technology. As the creator of the prompt, you generally own the rights to the output for use in your applications on the Apple App Store and Google Play Store.
        </p>
        <p className="text-slate-600">
          We recommend always checking the generated images for visual artifacts before publishing to a live store listing.
        </p>
      </div>
    </div>
  </section>
);
