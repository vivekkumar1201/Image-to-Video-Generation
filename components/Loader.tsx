import React, { useEffect, useState } from 'react';

const Loader: React.FC = () => {
  const [message, setMessage] = useState("Initializing Veo model...");
  
  useEffect(() => {
    const messages = [
      "Analyzing image composition...",
      "Dreaming up motion...",
      "Rendering frames...",
      "Polishing pixels...",
      "Adding movie magic...",
      "Almost there...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setMessage(messages[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin reverse-spin"></div>
        <div className="absolute inset-4 border-b-4 border-pink-500 rounded-full animate-spin"></div>
      </div>
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse">
        Generating Video
      </h3>
      <p className="text-slate-400 mt-2 max-w-xs mx-auto text-sm animate-fade-in">
        {message}
      </p>
      <style>{`
        .reverse-spin { animation-direction: reverse; animation-duration: 1.5s; }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Loader;
