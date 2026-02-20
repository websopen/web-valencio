import React from 'react';
import { ElementColors, ThemeColors } from '../services/storeService';

interface ColorElement {
    key: keyof ElementColors;
    label: string;
    description: string;
    showOpacity?: boolean;
}

const colorElements: ColorElement[] = [
    { key: 'navbarColor', label: '🎀 Barra Superior', description: 'Color de la barra de navegación', showOpacity: true },
    { key: 'background', label: '📄 Fondo de Página', description: 'Color del fondo general' },
    { key: 'cardBg', label: '🃏 Cards de Productos', description: 'Fondo de las tarjetas' },
    { key: 'text', label: '✍️ Texto Principal', description: 'Color del texto' },
    { key: 'accent', label: '🟢 Botón WhatsApp', description: 'Color del botón de pedido' },
];

interface ColorSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    themeColors: ThemeColors;
    currentTheme: 'light' | 'dark';
    onColorChange: (theme: 'light' | 'dark', key: keyof ElementColors, value: string | number) => void;
    onSelectElement: (element: ColorElement | null) => void;
    selectedElement: ColorElement | null;
}

export const ColorSidebar: React.FC<ColorSidebarProps> = ({
    isOpen,
    onClose,
    themeColors,
    currentTheme,
    onColorChange,
    onSelectElement,
    selectedElement,
}) => {
    const currentColors = themeColors[currentTheme];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen && !selectedElement ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Left Sidebar Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-72 max-w-[80vw] bg-white dark:bg-stone-900 z-50 transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen && !selectedElement ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🎨</span>
                        <div>
                            <h2 className="text-sm font-bold text-stone-800 dark:text-stone-100">
                                Personalizar Colores
                            </h2>
                            <p className="text-[10px] text-stone-500">
                                {currentTheme === 'light' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Element List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {colorElements.map((element) => (
                        <button
                            key={element.key}
                            onClick={() => onSelectElement(element)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all text-left group"
                        >
                            <div
                                className="w-8 h-8 rounded-lg border-2 border-stone-300 dark:border-stone-600 shadow-inner flex-shrink-0"
                                style={{
                                    backgroundColor: element.key === 'navbarColor'
                                        ? currentColors.navbarColor
                                        : currentColors[element.key] as string
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-stone-800 dark:text-stone-100 truncate">
                                    {element.label}
                                </p>
                                <p className="text-[10px] text-stone-500 truncate">
                                    {element.description}
                                </p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="p-3 border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                    <p className="text-[10px] text-stone-500 text-center">
                        💡 Tocá "Aplicar Cambios" para guardar
                    </p>
                </div>
            </div>

            {/* Floating Color Picker (when element selected) */}
            {selectedElement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Click outside to close */}
                    <div
                        className="absolute inset-0 bg-black/10"
                        onClick={() => onSelectElement(null)}
                    />

                    {/* Floating Picker Card */}
                    <div className="relative bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-5 mx-4 max-w-sm w-full animate-fade-in-up border border-stone-200 dark:border-stone-700">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{selectedElement.label.split(' ')[0]}</span>
                                <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                                    {selectedElement.label.split(' ').slice(1).join(' ')}
                                </span>
                            </div>
                            <button
                                onClick={() => onSelectElement(null)}
                                className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Color Picker */}
                        <div className="flex items-center gap-4 mb-4">
                            <input
                                type="color"
                                value={
                                    selectedElement.key === 'navbarColor'
                                        ? currentColors.navbarColor
                                        : currentColors[selectedElement.key] as string
                                }
                                onChange={(e) => onColorChange(currentTheme, selectedElement.key, e.target.value)}
                                className="w-16 h-16 rounded-xl border-2 border-stone-300 dark:border-stone-600 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={
                                        selectedElement.key === 'navbarColor'
                                            ? currentColors.navbarColor
                                            : currentColors[selectedElement.key] as string
                                    }
                                    onChange={(e) => onColorChange(currentTheme, selectedElement.key, e.target.value)}
                                    className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-lg px-3 py-2 text-sm font-mono text-stone-700 dark:text-stone-300"
                                    placeholder="#RRGGBB"
                                />
                            </div>
                        </div>

                        {/* Opacity Slider (only for navbar) */}
                        {selectedElement.showOpacity && (
                            <div className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <label className="text-xs text-stone-500">Transparencia</label>
                                    <span className="text-xs font-mono text-stone-600 dark:text-stone-400">
                                        {Math.round(currentColors.navbarOpacity * 100)}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={currentColors.navbarOpacity}
                                    onChange={(e) => onColorChange(currentTheme, 'navbarOpacity', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        )}

                        {/* Theme indicator */}
                        <div className="text-center pt-2 border-t border-stone-100 dark:border-stone-800">
                            <p className="text-[10px] text-stone-400">
                                Editando: {currentTheme === 'light' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Re-export colorElements for use in App.tsx
export { colorElements };
export type { ColorElement };
