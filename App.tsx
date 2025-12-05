import React, { useState } from 'react';
import { Header } from './components/Header';
import { AudioPlayer } from './components/AudioPlayer';
import { generateSpeech } from './services/geminiService';
import { AudioGenerationState } from './types';
import { Loader2, Send, Quote, AlertCircle, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AudioGenerationState>({
    isLoading: false,
    audioUrl: null,
    error: null,
    text: '',
  });

  const handleGenerate = async () => {
    if (!state.text.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, audioUrl: null }));

    try {
      const url = await generateSpeech(state.text);
      setState(prev => ({ ...prev, isLoading: false, audioUrl: url }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Something went wrong. Please try again."
      }));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({ ...prev, text: e.target.value }));
  };

  const sampleTexts = [
    "Welcome to ZECODE! We are happy to announce a 50% flat discount on all summer wear.",
    "Attention customers, the store will be closing in 15 minutes. Please head to the billing counters.",
    "Visit our new electronics section on the first floor for exclusive deals on smartphones.",
    "ZECODE members, please visit the customer service desk to collect your loyalty points voucher."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-8">
        
        <div className="text-center mb-10 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <ShoppingBag className="w-8 h-8 text-indigo-600" />
              <span>ZECODE <span className="text-indigo-600">Announcer</span></span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Generate professional in-store announcements with a welcoming Indian voice persona.
            </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="p-1">
            <div className="relative">
              <textarea
                value={state.text}
                onChange={handleTextChange}
                placeholder="Type your store announcement here (up to 5000 characters)..."
                className="w-full h-96 p-6 text-lg text-gray-700 bg-transparent resize-none focus:outline-none placeholder:text-gray-300"
                maxLength={5000}
              />
              <div className="absolute bottom-4 right-6 text-xs text-gray-400 font-medium">
                {state.text.length}/5000
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {sampleTexts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setState(prev => ({ ...prev, text: sample }))}
                  className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
                >
                  {sample.length > 30 ? sample.substring(0, 30) + '...' : sample}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={state.isLoading || !state.text.trim()}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all shadow-lg shadow-indigo-200
                ${state.isLoading || !state.text.trim() 
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Generate Audio</span>
                </>
              )}
            </button>
          </div>
        </div>

        {state.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p>{state.error}</p>
            </div>
        )}

        {state.audioUrl && (
          <div className="animate-fade-in-up">
             <AudioPlayer src={state.audioUrl} />
             
             <div className="mt-6 flex gap-4 justify-center">
                 <div className="flex items-center gap-2 text-sm text-gray-400 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    <Quote className="w-4 h-4 text-indigo-300" />
                    <span className="italic">"{state.text.length > 60 ? state.text.substring(0, 60) + '...' : state.text}"</span>
                 </div>
             </div>
          </div>
        )}

      </main>

      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} ZECODE. Powered by Gemini 2.5 Flash TTS.</p>
      </footer>
    </div>
  );
};

export default App;