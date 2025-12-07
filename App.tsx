import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from './components/ImageUploader';
import ControlPanel from './components/ControlPanel';
import Gallery from './components/Gallery';
import { MARKETING_SCENARIOS, MAX_GENERATED_HISTORY } from './constants';
import { GeneratedImage, GenerationStatus } from './types';
import { generateImageEdit } from './services/geminiService';
import { saveImageToDB, getImagesFromDB, deleteImageFromDB } from './services/storageService';

const App: React.FC = () => {
  // Initialize source state from localStorage
  const [sourceImage, setSourceImage] = useState<string | null>(() => {
    return localStorage.getItem('sourceImage');
  });

  // History state - starts empty, loads from DB asynchronously
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<number>(0);
  
  // Dark mode state initialized from localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Persist Source Image (localStorage is fine for single string)
  useEffect(() => {
    if (sourceImage) {
      try {
        localStorage.setItem('sourceImage', sourceImage);
      } catch (e) {
        console.warn('Failed to save source image (quota exceeded?)', e);
      }
    } else {
      localStorage.removeItem('sourceImage');
    }
  }, [sourceImage]);

  // Load History from IndexedDB on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const images = await getImagesFromDB();
        setGeneratedImages(images);
      } catch (e) {
        console.error("Failed to load history from DB:", e);
      }
    };
    loadHistory();
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) window.clearInterval(progressInterval.current);
    };
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleImageSelected = (imageDataUrl: string) => {
    setSourceImage(imageDataUrl);
    setErrorMsg(null);
  };

  const handleGenerate = async (prompt: string, type: 'scenario' | 'edit', overrideSourceUrl?: string) => {
    const activeSource = overrideSourceUrl || sourceImage;
    if (!activeSource) return;

    setStatus('loading');
    setErrorMsg(null);
    setProgress(0);

    // Simulate progress
    if (progressInterval.current) window.clearInterval(progressInterval.current);
    progressInterval.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90; // Stall at 90%
        // Decelerating progress curve
        const remaining = 95 - prev;
        const jump = Math.max(0.5, remaining / 15);
        return prev + jump;
      });
    }, 200);

    try {
      const generatedDataUrl = await generateImageEdit(activeSource, prompt);

      // Finish progress
      if (progressInterval.current) window.clearInterval(progressInterval.current);
      setProgress(100);

      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: generatedDataUrl,
        prompt: prompt,
        type: type,
        timestamp: Date.now()
      };

      // Save to DB
      await saveImageToDB(newImage);

      // Update State
      setGeneratedImages(prev => {
        const updated = [newImage, ...prev];
        
        // Enforce Limit in DB if needed (optional, but good practice)
        if (updated.length > MAX_GENERATED_HISTORY) {
           const oldest = updated[updated.length - 1];
           deleteImageFromDB(oldest.id).catch(console.error);
           return updated.slice(0, MAX_GENERATED_HISTORY);
        }
        return updated;
      });

      setStatus('success');
    } catch (err: any) {
      if (progressInterval.current) window.clearInterval(progressInterval.current);
      setProgress(0);
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to generate image. Please try again.');
    } finally {
      if (status !== 'error') {
         setTimeout(() => {
           setStatus('idle');
           setProgress(0);
         }, 800);
      } else {
        setStatus('idle');
      }
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImageFromDB(id);
      setGeneratedImages(prev => prev.filter(img => img.id !== id));
    } catch (e) {
      console.error("Failed to delete image:", e);
    }
  };

  const onGenerateScenario = (scenarioId: string) => {
    const scenario = MARKETING_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      handleGenerate(scenario.promptTemplate, 'scenario');
    }
  };

  const onGenerateCustom = (prompt: string, useHistorySource: boolean) => {
    const imageToEdit = (useHistorySource && generatedImages.length > 0) 
      ? generatedImages[0].url 
      : undefined;
    
    handleGenerate(prompt, 'edit', imageToEdit);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
               </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              ProductViz
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Dark Mode Toggle */}
             <button 
               onClick={toggleDarkMode}
               className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
               title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
               {isDarkMode ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                 </svg>
               )}
             </button>

             <div className="hidden md:block text-xs font-mono text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 dark:text-slate-500">
               Gemini 2.5 Flash Image
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload & Source */}
          <div className="lg:col-span-4 space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">1. Source Product</h2>
              <ImageUploader 
                onImageSelected={handleImageSelected} 
                selectedImage={sourceImage}
              />
            </section>
          </div>

          {/* Right Column: Controls & Output */}
          <div className="lg:col-span-8 space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">2. Generation Controls</h2>
              <ControlPanel 
                onGenerateScenario={onGenerateScenario} 
                onGenerateCustom={onGenerateCustom}
                status={status}
                disabled={!sourceImage}
                hasHistory={generatedImages.length > 0}
              />
              
              {status === 'loading' && (
                <div className="mt-6 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all duration-300">
                   <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        {progress < 100 ? (
                           <div className="w-4 h-4 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-500 animate-bounce">
                             <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                           </svg>
                        )}
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {progress === 100 ? 'Finishing up...' : 'Generating Variation...'}
                        </span>
                     </div>
                     <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                       {Math.round(progress)}%
                     </span>
                   </div>
                   
                   <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                     <div 
                       className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(99,102,241,0.6)] bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" 
                       style={{ width: `${progress}%` }}
                     ></div>
                   </div>
                   
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                     Gemini 2.5 Flash is imagining your product in a new context...
                   </p>
                </div>
              )}

              {errorMsg && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg flex items-start gap-3 animate-fade-in">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                   </svg>
                   <p className="text-red-700 dark:text-red-300 font-medium text-sm">{errorMsg}</p>
                </div>
              )}
            </section>

            <section>
               <Gallery images={generatedImages} onDelete={handleDeleteImage} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;