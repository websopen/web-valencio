import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { EditPriceModal } from './components/EditPriceModal';
import { StoreClosedModal } from './components/StoreClosedModal';
import { AdminModal } from './components/AdminModal';
import { OffersBanner } from './components/OffersBanner';
import { Footer } from './components/Footer';
import { ColorSidebar, ColorElement } from './components/ColorSidebar';
import { PRODUCTS } from './constants';
import { Product, CartItem, OfferType } from './types';
import { checkAuth, validateToken, activateAdmin, getTokenFromUrl, clearTokenFromUrl } from './services/authService';
import { loadStoreData, saveStoreData, StoreData, SocialLinks, CustomColors, ThemeColors, ElementColors, defaultSocialLinks, defaultCustomColors, defaultThemeColors } from './services/storeService';

const App: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Token from URL for admin activation
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  // Dark Mode Logic
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);



  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // State for Price Editing
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // State for Batch Updates
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Store data from KV
  const [stockStatus, setStockStatus] = useState<{ [key: string]: boolean }>(() => {
    const initial: { [key: string]: boolean } = {};
    PRODUCTS.forEach(p => initial[p.id] = true);
    return initial;
  });
  const [customPrices, setCustomPrices] = useState<{ [key: string]: number }>({});
  const [storeSettings, setStoreSettings] = useState({
    isOpen: true,
    deliveryAvailable: true,
    pickupAvailable: true
  });
  const [activeOffer, setActiveOffer] = useState<OfferType>('none');
  const [sectionOrder, setSectionOrder] = useState<'milky-first' | 'water-first'>('milky-first');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocialLinks);
  const [customColors, setCustomColors] = useState<CustomColors>(defaultCustomColors);
  const [themeColors, setThemeColors] = useState<ThemeColors>(defaultThemeColors);
  const [colorSidebarOpen, setColorSidebarOpen] = useState(false);
  const [selectedColorElement, setSelectedColorElement] = useState<ColorElement | null>(null);

  // Helper to convert hex to RGB string
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    }
    return '255, 185, 210'; // fallback
  };

  // Apply theme colors as CSS custom properties for real-time preview
  useEffect(() => {
    if (!isEditing) return; // Only apply when editing

    const root = document.documentElement;
    const currentTheme = theme === 'dark' ? 'dark' : 'light';
    const colors = themeColors[currentTheme];

    // Apply navbar colors using RGB values for transparency support
    root.style.setProperty('--navbar-color', hexToRgb(colors.navbarColor));
    root.style.setProperty('--navbar-opacity', colors.navbarOpacity.toString());

    // Apply other colors
    root.style.setProperty('--valencio-background', colors.background);
    root.style.setProperty('--valencio-card-bg', colors.cardBg);
    root.style.setProperty('--valencio-text', colors.text);
    root.style.setProperty('--valencio-accent', colors.accent);
  }, [themeColors, theme, isEditing]);

  // Product List with Custom Prices
  const [currentProducts, setCurrentProducts] = useState<Product[]>(PRODUCTS);

  // Initial load: check auth and load store data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      // Check if there's a token in the URL
      const token = getTokenFromUrl();
      if (token) {
        const result = await validateToken(token);
        if (result.valid) {
          setPendingToken(token);
          setShowPinModal(true);
          clearTokenFromUrl();
        } else if (result.alreadyAssociated) {
          // Store already has an admin, check if this user is the admin
          clearTokenFromUrl();
        }
      }

      // Check if current user is admin (via cookie)
      const authStatus = await checkAuth();
      setHasAdminAccess(authStatus.isAdmin);

      // Load store data from KV
      const data = await loadStoreData();
      if (Object.keys(data.stock).length > 0) {
        setStockStatus(prev => ({ ...prev, ...data.stock }));
      }
      if (Object.keys(data.prices).length > 0) {
        setCustomPrices(data.prices);
      }
      setStoreSettings(data.settings);
      setActiveOffer(data.offer as OfferType);
      setSectionOrder(data.sectionOrder || 'milky-first');
      setSocialLinks(data.socialLinks || defaultSocialLinks);
      setCustomColors(data.customColors || defaultCustomColors);
      if (data.themeColors) {
        setThemeColors(data.themeColors);
      }

      setIsLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    const updated = PRODUCTS.map(p => ({
      ...p,
      price: customPrices[p.id] || p.price
    }));
    setCurrentProducts(updated);
  }, [customPrices]);

  // Handle PIN validation
  const handleValidatePin = async (pin: string): Promise<boolean> => {
    if (!pendingToken) return false;

    const result = await activateAdmin(pendingToken, pin);
    if (result.success) {
      setHasAdminAccess(true);
      setIsEditing(true);
      setPendingToken(null);
      return true;
    }
    return false;
  };

  // --- BATCH UPDATE LOGIC ---
  const saveAllChanges = async () => {
    const result = await saveStoreData({
      stock: stockStatus,
      prices: customPrices,
      settings: storeSettings,
      offer: activeOffer,
      sectionOrder: sectionOrder,
      socialLinks: socialLinks,
      customColors: customColors,
      themeColors: themeColors,
    });

    if (result.success) {
      setHasUnsavedChanges(false);
      alert("¡Cambios aplicados correctamente!");
    } else {
      alert("Error al guardar: " + (result.error || 'Unknown error'));
    }
  };

  const handleToggleStock = (id: string) => {
    if (!hasAdminAccess || !isEditing) return;
    setStockStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setHasUnsavedChanges(true);
  };

  const handleEditPriceRequest = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSavePrice = (id: string, newPrice: number) => {
    if (!hasAdminAccess || !isEditing) return;
    setCustomPrices(prev => ({
      ...prev,
      [id]: newPrice
    }));
    setHasUnsavedChanges(true);
  };

  const toggleStoreSetting = (setting: 'deliveryAvailable' | 'pickupAvailable' | 'isOpen') => {
    setStoreSettings((prev: any) => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    setHasUnsavedChanges(true);
  };

  const handleOfferChange = (offer: OfferType) => {
    setActiveOffer(offer);
    setHasUnsavedChanges(true);
  };

  const handleToggleSectionOrder = () => {
    setSectionOrder(prev => prev === 'milky-first' ? 'water-first' : 'milky-first');
    setHasUnsavedChanges(true);
  };

  const handleSocialLinkChange = (key: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleColorChange = (key: keyof CustomColors, value: string) => {
    setCustomColors(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  // Handler for theme-aware color changes
  const handleThemeColorChange = (themePart: 'light' | 'dark', key: keyof ElementColors, value: string | number) => {
    setThemeColors(prev => ({
      ...prev,
      [themePart]: {
        ...prev[themePart],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddToCart = (product: Product) => {
    if (isEditing) return;
    if (!stockStatus[product.id]) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const getProductCount = (id: string) => cart.find(item => item.id === id)?.quantity || 0;

  const sortStockStrategy = (a: Product, b: Product) => {
    const stockA = stockStatus[a.id] ?? true;
    const stockB = stockStatus[b.id] ?? true;
    if (stockA && !stockB) return -1;
    if (!stockA && stockB) return 1;
    return 0;
  };

  const waterProducts = currentProducts.filter(p => p.category === 'water').sort(sortStockStrategy);
  const milkyProducts = currentProducts.filter(p => p.category === 'milky').sort(sortStockStrategy);

  const mainPaddingTop = activeOffer !== 'none' ? 'pt-36' : 'pt-28';

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-glacial-bg dark:bg-glacial-dark">
        <div className="animate-spin w-10 h-10 border-4 border-stone-300 border-t-stone-800 rounded-full"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen text-stone-800 dark:text-stone-100 bg-glacial-bg dark:bg-glacial-dark transition-colors duration-300 bg-marble ${isEditing && colorSidebarOpen ? 'color-preview-enabled' : ''}`}
      style={{
        backgroundColor: isEditing ? customColors.background : undefined,
        color: isEditing ? customColors.text : undefined
      }}
    >
      <Navbar
        showAdminSwitch={hasAdminAccess}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        storeOpen={storeSettings.isOpen}
        onLogoClick={() => { }}
        isDarkMode={theme === 'dark'}
        toggleTheme={toggleTheme}
        sectionOrder={sectionOrder}
        onToggleSectionOrder={handleToggleSectionOrder}
        onOpenColorSidebar={() => setColorSidebarOpen(true)}
      />

      <OffersBanner activeOffer={activeOffer} />

      <StoreClosedModal isOpen={storeSettings.isOpen} />

      <main className={`${mainPaddingTop} px-4 max-w-lg mx-auto transition-all duration-300`}>

        {/* ADMIN PANEL */}
        {isEditing && (
          <div className="mb-8 bg-stone-900 dark:bg-stone-800 rounded-2xl p-5 shadow-xl text-white animate-fade-in-up border border-stone-800 dark:border-stone-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="font-bold uppercase tracking-wider text-xs">Panel de Control</h3>
              </div>

              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                Admin Activo
              </span>
            </div>

            <button
              onClick={() => toggleStoreSetting('isOpen')}
              className={`w-full py-3 rounded-xl font-bold text-lg mb-4 transition-all shadow-md flex items-center justify-center gap-2 ${storeSettings.isOpen
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                : 'bg-stone-700 text-stone-300'
                }`}
            >
              <span className="text-2xl">{storeSettings.isOpen ? '🔓' : '🔒'}</span>
              {storeSettings.isOpen ? 'LOCAL ABIERTO' : 'LOCAL CERRADO'}
            </button>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => toggleStoreSetting('deliveryAvailable')}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${storeSettings.deliveryAvailable ? 'bg-stone-800 border-green-500/50 text-green-400' : 'bg-stone-800 border-stone-700 text-stone-500'}`}
              >
                <span className="font-bold text-sm mb-1">🛵 Envíos</span>
                <span className="text-xs">{storeSettings.deliveryAvailable ? 'ACTIVO' : 'INACTIVO'}</span>
              </button>

              <button
                onClick={() => toggleStoreSetting('pickupAvailable')}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${storeSettings.pickupAvailable ? 'bg-stone-800 border-blue-500/50 text-blue-400' : 'bg-stone-800 border-stone-700 text-stone-500'}`}
              >
                <span className="font-bold text-sm mb-1">🛍️ Retiro</span>
                <span className="text-xs">{storeSettings.pickupAvailable ? 'ACTIVO' : 'INACTIVO'}</span>
              </button>
            </div>

            <div className="border-t border-stone-700 pt-4">
              <h4 className="text-xs font-bold uppercase text-stone-400 mb-3 tracking-wider">Activar Oferta (Banner)</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOfferChange('none')}
                  className={`text-xs py-2 px-1 rounded-lg border transition-all ${activeOffer === 'none' ? 'bg-stone-700 border-stone-500 text-white' : 'border-stone-800 text-stone-500'}`}
                >
                  Sin Oferta
                </button>
                <button
                  onClick={() => handleOfferChange('2x1_all')}
                  className={`text-xs py-2 px-1 rounded-lg border font-bold transition-all ${activeOffer === '2x1_all' ? 'bg-gradient-to-r from-pink-500 to-orange-500 border-transparent text-white' : 'border-stone-800 text-stone-500'}`}
                >
                  2x1 TODO
                </button>
                <button
                  onClick={() => handleOfferChange('2x1_milky')}
                  className={`text-xs py-2 px-1 rounded-lg border transition-all ${activeOffer === '2x1_milky' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'border-stone-800 text-stone-500'}`}
                >
                  2x1 Remeras
                </button>
                <button
                  onClick={() => handleOfferChange('2x1_water')}
                  className={`text-xs py-2 px-1 rounded-lg border transition-all ${activeOffer === '2x1_water' ? 'bg-blue-100 border-blue-300 text-blue-800' : 'border-stone-800 text-stone-500'}`}
                >
                  2x1 Pantalones
                </button>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="border-t border-stone-700 pt-4 mt-4">
              <h4 className="text-xs font-bold uppercase text-stone-400 mb-3 tracking-wider">📱 Redes Sociales</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Instagram (@usuario)</label>
                  <input
                    type="text"
                    value={socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="@tu_instagram"
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">TikTok (@usuario)</label>
                  <input
                    type="text"
                    value={socialLinks.tiktok}
                    onChange={(e) => handleSocialLinkChange('tiktok', e.target.value)}
                    placeholder="@tu_tiktok"
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">WhatsApp (número con código país)</label>
                  <input
                    type="text"
                    value={socialLinks.whatsapp}
                    onChange={(e) => handleSocialLinkChange('whatsapp', e.target.value)}
                    placeholder="5491155146230"
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                  />
                  <p className="text-[10px] text-stone-600 mt-1">Ej: 5491155146230 (sin + ni espacios)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIONES DE PRODUCTOS - Orden configurable */}
        {(() => {
          const MilkySection = (
            <div className="mb-8" key="milky">
              <div className="mb-5 flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-2xl bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm border border-white/60 dark:border-stone-700 shadow-sm flex items-center justify-center text-xl">
                  👕
                </div>
                <div className="flex flex-col">
                  <h2 className="font-serif font-bold text-2xl text-stone-800 dark:text-stone-100 leading-none">Remeras</h2>
                  <span className="text-xs text-stone-400 font-medium tracking-wide">BASES & ESTAMPADOS</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {milkyProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onRemoveOne={() => handleUpdateQuantity(product.id, -1)}
                    onToggleStock={handleToggleStock}
                    onEditPriceRequest={handleEditPriceRequest}
                    countInCart={getProductCount(product.id)}
                    inStock={stockStatus[product.id] ?? true}
                    isAdmin={isEditing}
                  />
                ))}
              </div>
            </div>
          );

          const WaterSection = (
            <div className="mb-10" key="water">
              <div className="mb-5 flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-2xl bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm border border-white/60 dark:border-stone-700 shadow-sm flex items-center justify-center text-xl">
                  👖
                </div>
                <div className="flex flex-col">
                  <h2 className="font-serif font-bold text-2xl text-stone-800 dark:text-stone-100 leading-none">Pantalones</h2>
                  <span className="text-xs text-stone-400 font-medium tracking-wide">JEANS & CARGOS</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {waterProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onRemoveOne={() => handleUpdateQuantity(product.id, -1)}
                    onToggleStock={handleToggleStock}
                    onEditPriceRequest={handleEditPriceRequest}
                    countInCart={getProductCount(product.id)}
                    inStock={stockStatus[product.id] ?? true}
                    isAdmin={isEditing}
                  />
                ))}
              </div>
            </div>
          );

          return sectionOrder === 'milky-first'
            ? [MilkySection, WaterSection]
            : [WaterSection, MilkySection];
        })()}

        {/* FOOTER */}
        <Footer socialLinks={socialLinks} />

      </main>

      {/* ADMIN SAVE BUTTON */}
      {isEditing && hasUnsavedChanges && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none">
          <div className="w-full max-w-sm pointer-events-auto animate-bounce-in flex flex-col gap-2">
            {/* Discard Button */}
            <button
              onClick={async () => {
                if (confirm('¿Seguro que querés descartar los cambios?')) {
                  const data = await loadStoreData();
                  setStockStatus(prev => ({ ...prev, ...data.stock }));
                  setCustomPrices(data.prices);
                  setStoreSettings(data.settings);
                  setActiveOffer(data.offer as OfferType);
                  setSectionOrder(data.sectionOrder || 'milky-first');
                  setSocialLinks(data.socialLinks || defaultSocialLinks);
                  setCustomColors(data.customColors || defaultCustomColors);
                  if (data.themeColors) setThemeColors(data.themeColors);
                  setHasUnsavedChanges(false);
                }
              }}
              className="w-full py-3 rounded-full bg-stone-800/80 dark:bg-stone-200/80 text-white dark:text-stone-900 font-medium text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/10 dark:border-stone-900/10 backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Descartar Cambios</span>
            </button>
            {/* Save Button */}
            <button
              onClick={saveAllChanges}
              className="w-full py-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/20"
            >
              <span>Aplicar Cambios</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* CLIENT CART BUTTON */}
      {!isEditing && (
        <button
          disabled={totalItems === 0}
          onClick={() => setIsSheetOpen(true)}
          className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-40 ${totalItems > 0
            ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 scale-100 cursor-pointer'
            : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 scale-50 opacity-0 pointer-events-none'
            }`}
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
        </button>
      )}

      <CartSidebar
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        items={cart}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        storeSettings={storeSettings}
        whatsapp={socialLinks.whatsapp}
      />

      <EditPriceModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSavePrice}
      />

      <AdminModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onActivateSuccess={() => setShowPinModal(false)}
        token={pendingToken}
        onValidatePin={handleValidatePin}
      />

      <ColorSidebar
        isOpen={colorSidebarOpen}
        onClose={() => {
          setColorSidebarOpen(false);
          setSelectedColorElement(null);
        }}
        themeColors={themeColors}
        currentTheme={theme === 'dark' ? 'dark' : 'light'}
        onColorChange={handleThemeColorChange}
        onSelectElement={setSelectedColorElement}
        selectedElement={selectedColorElement}
      />
    </div>
  );
};

export default App;