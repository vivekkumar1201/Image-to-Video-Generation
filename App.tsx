import React, { useState, useEffect, useCallback } from 'react';
import { checkApiKey, generateVideo } from './services/geminiService';
import { AspectRatio, GenerationStatus } from './types';
import ApiKeyModal from './components/ApiKeyModal';
import ImageUpload from './components/ImageUpload';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.Idle);
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Landscape);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyKey = useCallback(async () => {
    const keyExists = await checkApiKey();
    setHasKey(keyExists);
  }, []);

  useEffect(() => {
    verifyKey();
  }, [verifyKey]);

  const handleImageSelected = (base64: string, mimeType: string, previewUrl: string) => {
    setSelectedImage({ base64, mimeType, preview: previewUrl });
    setStatus(GenerationStatus.Idle);
    setVideoUrl(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setStatus(GenerationStatus.Generating);
    setError(null);
    setVideoUrl(null);

    try {
      const url = await generateVideo(
        selectedImage.base64,
        selectedImage.mimeType,
        prompt,
        aspectRatio
      );
      setVideoUrl(url);
      setStatus(GenerationStatus.Complete);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Something went wrong during generation.");
      setStatus(GenerationStatus.Error);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setVideoUrl(null);
    setPrompt('');
    setStatus(GenerationStatus.Idle);
    setError(null);
  };

  // If no API Key is selected, show modal
  if (!hasKey) {
    return <ApiKeyModal onKeySelected={verifyKey} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Veo
          </span>{" "}
          Motion
        </h1>
        <p className="text-lg text-slate-400">
          Transform your still photos into seamless looping videos using Google's Veo generative model.
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Input */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 shadow-xl">
            {!selectedImage ? (
              <ImageUpload onImageSelected={handleImageSelected} />
            ) : (
              <div className="space-y-6">
                <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                  <img 
                    src={selectedImage.preview} 
                    alt="Preview" 
                    className="w-full object-cover max-h-[400px]" 
                  />
                  {status === GenerationStatus.Idle && (
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-md"
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  )}
                </div>

                {status !== GenerationStatus.Generating && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Animation Prompt (Optional)
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the motion (e.g., 'Gentle breeze blowing through the flowers', 'Cinematic zoom')"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-24 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Aspect Ratio
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setAspectRatio(AspectRatio.Landscape)}
                          className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                            aspectRatio === AspectRatio.Landscape
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <span className="w-6 h-4 border-2 border-current rounded-sm"></span>
                          <span>16:9 Landscape</span>
                        </button>
                        <button
                          onClick={() => setAspectRatio(AspectRatio.Portrait)}
                          className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                            aspectRatio === AspectRatio.Portrait
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <span className="w-4 h-6 border-2 border-current rounded-sm"></span>
                          <span>9:16 Portrait</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky CTA */}
          {selectedImage && status !== GenerationStatus.Generating && status !== GenerationStatus.Complete && (
            <div className="sticky bottom-6 z-10">
               <button
                onClick={handleGenerate}
                disabled={status === GenerationStatus.Generating}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-bold rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <span>Generate Video</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-xl min-h-[500px] flex flex-col items-center justify-center">
          {status === GenerationStatus.Idle && !videoUrl && (
            <div className="text-center text-slate-500">
               <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l5 5-5 5"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>
               </div>
               <p className="text-lg">Your generated video will appear here.</p>
            </div>
          )}

          {status === GenerationStatus.Generating && (
            <Loader />
          )}

          {status === GenerationStatus.Error && (
             <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
                <p className="text-slate-400 mb-6">{error}</p>
                <button 
                  onClick={() => setStatus(GenerationStatus.Idle)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                >
                  Try Again
                </button>
             </div>
          )}

          {status === GenerationStatus.Complete && videoUrl && (
            <div className="w-full animate-fade-in-up space-y-6">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700 bg-black">
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full h-auto max-h-[600px] object-contain mx-auto"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={videoUrl} 
                  download="veo-motion.mp4"
                  className="flex-1 py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl text-center transition-colors flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>Download Video</span>
                </a>
                <button 
                  onClick={handleReset}
                  className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  <span>Create Another</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
