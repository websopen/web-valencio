import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-naranju-cream pt-16 pb-32">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-800 mb-6 tracking-tight">
          Refresca tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-naranju-orange to-naranju-pink">Alma</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-stone-500 font-light">
          Marcianitos artesanales hechos con fruta real. Una explosión de sabor congelado diseñada para tus momentos más chill.
        </p>
        <div className="mt-10 flex gap-4">
          <a href="#menu" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 transition-all">
            Ver Sabores
          </a>
          <a href="#ai-mix" className="inline-flex items-center px-8 py-3 border border-stone-300 text-base font-medium rounded-full text-stone-700 bg-white hover:bg-stone-50 focus:outline-none transition-all">
            Crear Mix con IA
          </a>
        </div>
      </div>
      
      {/* Abstract Shapes Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-naranju-yellow rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-naranju-pink rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-naranju-green rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
};