import React from 'react';

interface NavbarProps {
  showAdminSwitch: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
  storeOpen: boolean;
  onLogoClick: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  sectionOrder: 'milky-first' | 'water-first';
  onToggleSectionOrder: () => void;
  onOpenColorSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  showAdminSwitch,
  isEditing,
  onToggleEdit,
  storeOpen,
  onLogoClick,
  isDarkMode,
  toggleTheme,
  sectionOrder,
  onToggleSectionOrder,
  onOpenColorSidebar
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 liquid-nav h-20 px-6 transition-all duration-300">
      <div className="max-w-lg mx-auto h-full relative flex items-center justify-between">

        {/* IZQUIERDA: Logo Mariposa + Section Order Toggle */}
        <div className="flex items-center gap-2 z-50">
          {/* Logo Mariposa - Click opens color sidebar when editing */}
          <div
            className={`flex-shrink-0 transition-transform z-50 ${showAdminSwitch && isEditing
              ? 'cursor-pointer active:scale-90 ring-2 ring-pink-400 ring-offset-2 ring-offset-transparent rounded-full'
              : ''
              }`}
            onClick={() => {
              if (showAdminSwitch && isEditing) {
                onOpenColorSidebar();
              } else {
                onLogoClick();
              }
            }}
            title={showAdminSwitch && isEditing ? 'Personalizar colores' : undefined}
          >
            <div className="w-10 h-10 bg-white/60 dark:bg-black/30 rounded-full flex items-center justify-center shadow-sm border border-white/50 dark:border-white/10 backdrop-blur-sm relative">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C12 12 5 14 3 9C1 4 6 2 9 5C10.5 6.5 12 12 12 12Z" fill="#FB923C" />
                <path d="M12 12C12 12 5 14 3 9C1 4 6 2 9 5C10.5 6.5 12 12 12 12Z" fill="url(#paint0_linear)" fillOpacity="0.6" />
                <path d="M12 12C12 12 19 14 21 9C23 4 18 2 15 5C13.5 6.5 12 12 12 12Z" fill="#F472B6" />
                <path d="M12 12C12 12 6 15 6 18C6 21 11 21 12 15" fill="#4ADE80" />
                <path d="M12 12C12 12 18 15 18 18C18 21 13 21 12 15" fill="#60A5FA" />
                <path d="M12 4C11.5 4 11.5 5 12 5C12.5 5 12.5 4 12 4ZM12 6V18" stroke={isDarkMode ? "#E7E5E4" : "#44403C"} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 5L10 3" stroke={isDarkMode ? "#E7E5E4" : "#44403C"} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 5L14 3" stroke={isDarkMode ? "#E7E5E4" : "#44403C"} strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="paint0_linear" x1="3" y1="2" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F472B6" />
                    <stop offset="1" stopColor="#FB923C" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Color indicator when editing */}
              {showAdminSwitch && isEditing && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full border-2 border-white dark:border-stone-900" />
              )}
            </div>
          </div>

          {/* Section Order Toggle (Moved to LEFT, next to butterfly) */}
          {showAdminSwitch && isEditing && (
            <button
              onClick={onToggleSectionOrder}
              className="flex items-center gap-0.5 bg-white/50 dark:bg-black/20 px-2 py-1.5 rounded-full border border-white/40 dark:border-white/10 shadow-sm backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/30 transition-all active:scale-95"
              title={sectionOrder === 'milky-first' ? 'Mostrar De Agua primero' : 'Mostrar Licuados primero'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-600 dark:text-pink-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          )}
        </div>

        {/* CENTRO: Tipografía 'Valencio' */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-end text-3xl font-serif font-bold tracking-tight text-stone-800 dark:text-pink-50 leading-none pb-1 pointer-events-none">
          <span>Valencio</span>
        </div>

        {/* DERECHA: Admin Switch + Theme Toggle */}
        <div className="flex items-center gap-3 z-50">

          {/* Admin Edit Toggle (Solo visible si es admin) */}
          {showAdminSwitch && (
            <div className="flex items-center bg-white/50 dark:bg-black/20 px-2 py-1 rounded-full border border-white/40 dark:border-white/10 shadow-sm backdrop-blur-sm">
              <button
                onClick={onToggleEdit}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${isEditing ? 'bg-stone-800 dark:bg-pink-200' : 'bg-stone-300 dark:bg-white/20'
                  }`}
              >
                <span
                  className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white dark:bg-stone-900 transition-transform ${isEditing ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                />
              </button>
            </div>
          )}

          {/* Sun/Moon Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/15 shadow-sm backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/40 transition-all active:scale-95"
            title={isDarkMode ? "Cambiar a modo Día" : "Cambiar a modo Noche"}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-stone-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};