import React, { useState } from 'react';
import { generateFlavorMatch } from '../services/geminiService';
import { FlavorSuggestion } from '../types';

export const AiMixologist: React.FC = () => {
  const [mood, setMood] = useState('');
  const [suggestion, setSuggestion] = useState<FlavorSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    setSuggestion(null);
    const result = await generateFlavorMatch(mood);
    setSuggestion(result);
    setLoading(false);
  };

  return (
    <section id="ai-mix" className="py-20 bg-white border-t border-stone-100">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="text-naranju-pink font-bold tracking-wider text-sm uppercase">AI Mixologist</span>
        <h2 className="text-3xl font-serif font-bold text-stone-800 mt-2 mb-8">¿No sabes qué elegir?</h2>
        <p className="text-stone-500 mb-8 font-light">
          Dile a nuestra IA cómo te sientes hoy (ej. "tengo calor y estoy estresado" o "fiesta en la playa") y te diseñaremos el marcianito perfecto.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mb-12">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="¿Cuál es tu vibe hoy?"
            className="flex-1 appearance-none border border-stone-300 rounded-lg py-3 px-4 bg-white text-stone-700 placeholder-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-naranju-orange focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !mood}
            className={`px-6 py-3 rounded-lg font-medium text-white transition-all shadow-md ${
              loading || !mood 
              ? 'bg-stone-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-naranju-orange to-naranju-pink hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Mezclando...' : 'Inventar Sabor'}
          </button>
        </div>

        {suggestion && (
          <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100 shadow-xl max-w-md mx-auto transform transition-all animate-fade-in-up">
            <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-300 mb-6 flex items-center justify-center shadow-inner">
               <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2">{suggestion.name}</h3>
            <p className="text-stone-600 italic mb-6">"{suggestion.description}"</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {suggestion.ingredients.map((ing, idx) => (
                <span key={idx} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-stone-500 border border-stone-200">
                  {ing}
                </span>
              ))}
            </div>
            
            <button 
              className="w-full py-2 rounded-lg bg-stone-900 text-white text-sm hover:bg-stone-800 transition-colors"
              onClick={() => alert("¡Genial! Mándanos una captura por WhatsApp para pedir este sabor personalizado.")}
            >
              Pedir Personalizado
            </button>
          </div>
        )}
      </div>
    </section>
  );
};