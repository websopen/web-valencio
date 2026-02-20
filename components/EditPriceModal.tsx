import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface EditPriceModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (id: string, newPrice: number) => void;
}

export const EditPriceModal: React.FC<EditPriceModalProps> = ({ isOpen, product, onClose, onSave }) => {
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (isOpen && product) {
      setPrice(product.price.toString());
    }
  }, [isOpen, product]);

  const handleSave = () => {
    if (!product) return;
    const val = parseInt(price);
    if (!isNaN(val) && val >= 0) {
      onSave(product.id, val);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[70] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Bottom Sheet Panel */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[80] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-4 pb-2" onClick={onClose}>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        {product && (
            <div className="px-6 pt-2 pb-8">
                <div className="text-center mb-6">
                    <h3 className="font-serif font-bold text-stone-800 text-2xl">Editar Precio</h3>
                    <p className="text-stone-500 mt-1">{product.name}</p>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="relative max-w-[200px] mx-auto w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-2xl">$</span>
                        <input 
                            type="number" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl pl-10 pr-4 py-4 text-4xl font-bold text-stone-800 text-center focus:outline-none focus:border-green-500 transition-colors"
                            autoFocus
                        />
                    </div>

                    <button 
                        onClick={handleSave}
                        className="w-full py-4 rounded-xl font-bold text-lg text-white bg-green-500 hover:bg-green-600 active:scale-[0.98] transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                    >
                        <span>Confirmar Cambios</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                    
                    <button onClick={onClose} className="text-stone-400 font-medium text-sm py-2">
                        Cancelar
                    </button>
                </div>
            </div>
        )}
      </div>
    </>
  );
};