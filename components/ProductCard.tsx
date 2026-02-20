import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemoveOne?: (product: Product) => void;
  onToggleStock?: (id: string) => void;
  onEditPriceRequest?: (product: Product) => void;
  countInCart: number;
  inStock: boolean;
  isAdmin: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onRemoveOne,
  onToggleStock, 
  onEditPriceRequest,
  countInCart, 
  inStock, 
  isAdmin 
}) => {
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleStock) onToggleStock(product.id);
  };

  const handlePriceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdmin && onEditPriceRequest) {
        onEditPriceRequest(product);
    }
  };

  // Define emoji based on category
  const categoryEmoji = product.category === 'milky' ? '🍦' : '🧊';

  return (
    <div 
      className={`relative flex flex-col bg-white dark:bg-stone-800 rounded-3xl overflow-visible transition-all duration-300 shadow-sm border border-white/40 dark:border-stone-700 ${
        inStock 
          ? isAdmin ? 'opacity-100 cursor-default' : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer active:scale-95' 
          : isAdmin ? 'opacity-100' : 'opacity-60 grayscale pointer-events-none'
      }`}
      onClick={() => {
          if (!isAdmin && inStock) {
              onAddToCart(product);
          }
      }}
    >
      {/* Visualización del Naranju / Marcianito */}
      <div className="aspect-[4/5] w-full relative flex items-center justify-center rounded-t-3xl overflow-hidden group">
        
        {/* FONDO DE COLOR (Suave) */}
        <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-20`}></div>
        <div className="absolute inset-0 bg-radial-white dark:bg-radial-dark opacity-50"></div>

        {/* EL MARCIANITO (Diseño Compacto y Realista) */}
        <div className="relative z-10 flex flex-col items-center transform -rotate-[12deg] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-[10deg]">
            
            {/* 1. SOBRANTE PLÁSTICO (Muy pequeño y sutil) */}
            <div className="flex justify-center items-end -mb-[1px] opacity-70">
                <div className="w-1.5 h-2 bg-white/40 border border-white/30 rounded-tl-sm skew-x-[-10deg] origin-bottom shadow-sm"></div>
                <div className="w-1.5 h-2.5 bg-white/40 border border-white/30 rounded-tr-sm skew-x-[10deg] origin-bottom shadow-sm"></div>
            </div>

            {/* 2. NUDITO (Minúsculo y apretado) */}
            <div className="w-2.5 h-1.5 bg-white/60 backdrop-blur-sm border border-white/50 rounded-[2px] shadow-sm z-20 relative ring-1 ring-black/5"></div>

            {/* 3. CUERPO DEL JUGO (Tubo: Arriba Redondo, Abajo Rectangular) */}
            <div className={`w-8 h-40 bg-gradient-to-b ${product.gradient} relative rounded-t-[20px] rounded-b-lg shadow-md z-10 overflow-hidden -mt-[1px]`}>
                
                {/* Capa de "Plástico" encima del color */}
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                
                {/* Reflejos del plástico tubular */}
                <div className="absolute top-0 bottom-0 left-1 w-1.5 bg-gradient-to-r from-white/60 to-transparent opacity-80 blur-[1px]"></div>
                <div className="absolute top-0 bottom-0 right-1.5 w-0.5 bg-white/30 blur-[0.5px]"></div>
                
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/10 to-transparent"></div>
                <div className="absolute inset-0 border border-white/20 rounded-t-[20px] rounded-b-lg pointer-events-none"></div>
            </div>

            {/* 4. BASE DEL PLÁSTICO (Pequeña aleta transparente abajo) */}
            <div className="w-8 h-1.5 bg-white/30 border-t-0 border border-white/40 rounded-b-md shadow-sm -mt-[1px] z-0"></div>
        </div>

        {/* ADMIN CONTROL: Stock Switch */}
        {isAdmin && (
          <div className="absolute top-3 left-3 z-30 flex items-center bg-white/80 backdrop-blur rounded-full px-2 py-1 shadow-sm border border-stone-100" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={handleToggle}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${inStock ? 'bg-green-500' : 'bg-red-400'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${inStock ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        )}

        {/* Quantity Controls: Minus Button + Badge */}
        {!isAdmin && countInCart > 0 && inStock && (
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2 animate-bounce-in">
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRemoveOne) onRemoveOne(product);
                }}
                className="w-8 h-8 bg-white/90 dark:bg-stone-800/90 backdrop-blur text-stone-800 dark:text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border border-stone-200 dark:border-stone-600 active:scale-90 transition-transform hover:bg-stone-50 dark:hover:bg-stone-700"
             >
               -
             </button>
             <div className="w-8 h-8 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full flex items-center justify-center font-bold text-sm shadow-xl border-2 border-white dark:border-stone-800">
               {countInCart}
             </div>
          </div>
        )}
        
        {/* Price Tag - Left aligned */}
        <div 
            onClick={handlePriceClick}
            className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-sm font-bold shadow-md backdrop-blur-md transition-transform z-30 flex items-center gap-1 min-w-[60px] justify-center ${
                isAdmin 
                ? 'bg-stone-800 text-white cursor-pointer hover:scale-105 active:scale-95 border border-stone-600' 
                : 'bg-white/95 dark:bg-stone-700/95 text-stone-800 dark:text-stone-100 border border-stone-100 dark:border-stone-600'
            }`}
        >
          {inStock ? `$${product.price}` : 'SIN STOCK'}
          {isAdmin && <span className="text-[10px] opacity-70">✎</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 pb-4 text-left relative z-20 bg-white dark:bg-stone-800 rounded-b-3xl -mt-2 border-t border-transparent">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-stone-800 dark:text-stone-100 text-lg leading-tight mb-0.5">{product.name}</h3>
            <span className="text-lg opacity-90 filter drop-shadow-sm" title={product.category === 'milky' ? 'Cremoso' : 'Hielo'}>
                {categoryEmoji}
            </span>
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-400 font-medium line-clamp-2">{product.description}</p>
        
        {isAdmin && (
           <div className="mt-2 text-[10px] text-stone-300 font-bold uppercase tracking-wider">
             Editando
           </div>
        )}
      </div>
    </div>
  );
};