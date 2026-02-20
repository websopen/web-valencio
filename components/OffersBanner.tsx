import React from 'react';
import { OfferType } from '../types';

interface OffersBannerProps {
  activeOffer: OfferType;
}

export const OffersBanner: React.FC<OffersBannerProps> = ({ activeOffer }) => {
  if (activeOffer === 'none') return null;

  let content = '';
  let gradient = '';
  let textColor = '';

  switch (activeOffer) {
    case '2x1_milky':
      content = '🍦 2X1 EN LICUADOS 🍦 LLEVATE DOS Y PAGÁ UNO 🍦 SOLO POR HOY 🍦 PROMO FLASH 🍦';
      gradient = 'bg-gradient-to-r from-yellow-200 via-orange-100 to-yellow-200';
      textColor = 'text-orange-900';
      break;
    case '2x1_water':
      content = '🧊 2X1 EN NARANJUS DE AGUA 🧊 LA OFERTA MÁS FRESCA 🧊 2X1 🧊 2X1 🧊 DISFRUTÁ MÁS POR MENOS 🧊';
      gradient = 'bg-gradient-to-r from-blue-200 via-cyan-100 to-blue-200';
      textColor = 'text-blue-900';
      break;
    case '2x1_all':
      content = '🚀 SUPER OFERTA 2X1 EN TODO EL MENU 🚀 LICUADOS Y AGUA 🚀 COMBINALOS COMO QUIERAS 🚀 2X1 YA MISMO 🚀';
      gradient = 'bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300';
      textColor = 'text-purple-900';
      break;
    default:
      return null;
  }

  // Repetimos el contenido para asegurar que el scroll infinito no tenga huecos
  const displayContent = `${content} • ${content} • ${content} • ${content}`;

  return (
    <div className={`fixed top-20 left-0 right-0 z-[35] h-8 flex items-center overflow-hidden shadow-sm border-b border-white/20 ${gradient}`}>
      <div className="w-full whitespace-nowrap overflow-hidden flex">
        <div className={`animate-marquee inline-block font-bold text-xs tracking-widest uppercase ${textColor}`}>
          {displayContent}
        </div>
      </div>
    </div>
  );
};