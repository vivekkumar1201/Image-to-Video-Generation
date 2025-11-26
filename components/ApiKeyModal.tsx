import React from 'react';
import { requestApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  onKeySelected: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    try {
      await requestApiKey();
      // Assume success if no error thrown, calling callback to re-check
      onKeySelected();
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Required</h2>
        <p className="text-slate-400 mb-8">
          To generate high-quality videos with Veo, you need to connect a paid Google Cloud Project with billing enabled.
        </p>
        
        <button
          onClick={handleSelectKey}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
        >
          Select API Key
        </button>
        
        <div className="mt-6 text-xs text-slate-500">
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-slate-400"
          >
            Read about billing and pricing
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
