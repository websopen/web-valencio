import { Product } from './types';

export const PRODUCTS: Product[] = [
  // --- PANTALONES (categoría interna 'water') ---
  {
    id: 'w1',
    name: 'Pantalón Cargo Negro',
    description: 'Estilo urbano, múltiples bolsillos.',
    price: 35000,
    category: 'water',
    gradient: 'from-stone-700 to-stone-900',
  },
  {
    id: 'w2',
    name: 'Jeans Clásico Azul',
    description: 'El jean que no puede faltar en tu ropero.',
    price: 32000,
    category: 'water',
    gradient: 'from-blue-600 to-blue-800',
  },
  {
    id: 'w3',
    name: 'Pantalón Jogger Gris',
    description: 'Comodidad extrema para tu día a día.',
    price: 28000,
    category: 'water',
    gradient: 'from-gray-300 to-gray-500',
  },
  {
    id: 'w4',
    name: 'Pantalón Chino Beige',
    description: 'Elegancia y confort para ocasiones casuales.',
    price: 34000,
    category: 'water',
    gradient: 'from-stone-200 to-stone-400',
  },

  // --- REMERAS (categoría interna 'milky') ---
  {
    id: 'm1',
    name: 'Remera Básica Blanca',
    description: '100% Algodón peinado. Un must-have.',
    price: 15000,
    category: 'milky',
    gradient: 'from-gray-100 to-white',
  },
  {
    id: 'm2',
    name: 'Remera Oversize Negra',
    description: 'Corte amplio y moderno.',
    price: 18000,
    category: 'milky',
    gradient: 'from-stone-800 to-black',
  },
  {
    id: 'm3',
    name: 'Remera Estampada Rock',
    description: 'Diseño exclusivo con vibras vintage.',
    price: 19500,
    category: 'milky',
    gradient: 'from-red-800 to-stone-900',
  },
  {
    id: 'm4',
    name: 'Musculosa Deportiva',
    description: 'Tela respirable, ideal para entrenar.',
    price: 13000,
    category: 'milky',
    gradient: 'from-blue-400 to-blue-600',
  },
];