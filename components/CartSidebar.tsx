import React, { useState, useMemo, useEffect } from 'react';
import { CartItem } from '../types';

interface StoreSettings {
    deliveryAvailable: boolean;
    pickupAvailable: boolean;
    isOpen: boolean; // New prop
}

interface CartSheetProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, delta: number) => void;
    storeSettings: StoreSettings;
    whatsapp?: string;
}

export const CartSidebar: React.FC<CartSheetProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, storeSettings, whatsapp = '5491155146230' }) => {
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');

    // Logic to auto-select available method if one is disabled
    useEffect(() => {
        if (storeSettings.deliveryAvailable && !storeSettings.pickupAvailable) {
            setDeliveryMethod('delivery');
        } else if (!storeSettings.deliveryAvailable && storeSettings.pickupAvailable) {
            setDeliveryMethod('pickup');
        }
    }, [storeSettings, isOpen]);

    const total = useMemo(() => items.reduce((acc, item) => acc + (item.price * item.quantity), 0), [items]);

    // Logic helpers
    const noMethodsAvailable = !storeSettings.deliveryAvailable && !storeSettings.pickupAvailable;

    // Form Validation
    // Si no hay métodos disponibles, permitimos el envío sin validar dirección/método, asumiendo "A coordinar"
    const isFormValid = items.length > 0 &&
        (noMethodsAvailable || deliveryMethod === 'pickup' || address.trim() !== '') &&
        paymentMethod !== '' &&
        (paymentMethod !== 'Efectivo' || paymentAmount.trim() !== '');

    const handleWhatsAppRedirect = () => {
        if (!isFormValid) return;

        const itemsList = items.map(i => `• ${i.quantity}x ${i.name} ($${(i.price * i.quantity).toFixed(2)})`).join('\n');

        // Construct message based on availability
        const methodText = noMethodsAvailable
            ? `🤝 *Entrega:* A coordinar con el vendedor`
            : (deliveryMethod === 'delivery' ? `📍 *Envío a Domicilio*` : `🛍️ *Retiro por Local*`);

        const addressText = (!noMethodsAvailable && deliveryMethod === 'delivery')
            ? `🏠 *Dirección:* ${address}\n`
            : '';

        // Header changes if closed
        const header = storeSettings.isOpen
            ? `*Hola Valencio! 👋 Quiero hacer un pedido:*`
            : `*Hola! 👋 Quiero DEJAR PROGRAMADO un pedido (vi que están cerrados):*`;

        const closedTag = !storeSettings.isOpen ? `\n⚠️ *[PEDIDO PARA EL PRÓXIMO TURNO]*` : '';

        const message = `${header}\n\n` +
            `*Productos:*\n${itemsList}\n\n` +
            `*Total a pagar: $${total.toFixed(2)}*\n\n` +
            `------------------\n` +
            `${methodText}\n` +
            addressText +
            `💳 *Método de Pago:* ${paymentMethod}\n` +
            (paymentMethod === 'Efectivo' ? `💵 *Abona con:* $${paymentAmount}\n` : '') +
            `------------------` +
            closedTag;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsapp}?text=${encodedMessage}`, '_blank');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Bottom Sheet Panel */}
            <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 rounded-t-3xl z-50 transform transition-transform duration-300 ease-out shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>

                {/* Handle for dragging visual */}
                <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-stone-700 rounded-full"></div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Tu Pedido</h2>
                        <span className="text-xl font-bold text-naranju-orange">${total.toFixed(2)}</span>
                    </div>

                    {/* CLOSED STORE WARNING */}
                    {!storeSettings.isOpen && (
                        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl flex gap-3 items-start animate-fade-in-up">
                            <span className="text-xl">🌙</span>
                            <div className="text-sm text-indigo-900 dark:text-indigo-200">
                                <p className="font-bold">El local está cerrado ahora.</p>
                                <p className="opacity-80">Puedes enviar tu pedido igual y lo prepararemos apenas abramos en el próximo turno.</p>
                            </div>
                        </div>
                    )}

                    {/* Cart Items List (Compact) */}
                    <div className="space-y-3 mb-8">
                        {items.length === 0 ? (
                            <p className="text-stone-400 dark:text-stone-500 text-center py-4">Selecciona productos arriba para comenzar.</p>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-100 dark:border-stone-700">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-lg shadow-sm`}>
                                            {item.category === 'milky' ? '🍦' : '🧊'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-stone-800 dark:text-stone-200 text-sm">{item.name}</span>
                                            <span className="text-xs text-stone-500 dark:text-stone-400">${item.price} c/u</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 rounded-full bg-white dark:bg-stone-700 shadow flex items-center justify-center text-stone-600 dark:text-stone-200 font-bold hover:bg-stone-100 dark:hover:bg-stone-600">-</button>
                                        <span className="text-sm font-medium w-4 text-center text-stone-800 dark:text-stone-200">{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 rounded-full bg-white dark:bg-stone-700 shadow flex items-center justify-center text-stone-600 dark:text-stone-200 font-bold hover:bg-stone-100 dark:hover:bg-stone-600">+</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Form */}
                    {items.length > 0 && (
                        <div className="space-y-4 mb-24">

                            {/* Method Selector */}
                            {!noMethodsAvailable && (
                                <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-xl flex mb-6">
                                    {storeSettings.deliveryAvailable && (
                                        <button
                                            onClick={() => setDeliveryMethod('delivery')}
                                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${deliveryMethod === 'delivery' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' : 'text-stone-400 dark:text-stone-500'}`}
                                        >
                                            🛵 Envío
                                        </button>
                                    )}
                                    {storeSettings.pickupAvailable && (
                                        <button
                                            onClick={() => setDeliveryMethod('pickup')}
                                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${deliveryMethod === 'pickup' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' : 'text-stone-400 dark:text-stone-500'}`}
                                        >
                                            🛍️ Retiro
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* NO METHODS AVAILABLE MESSAGE */}
                            {noMethodsAvailable && (
                                <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 rounded-xl flex items-start gap-3 animate-fade-in-up">
                                    <span className="text-xl mt-0.5">🤝</span>
                                    <div className="text-sm">
                                        <p className="font-bold text-stone-800 dark:text-stone-200">Entrega a coordinar</p>
                                        <p className="text-stone-500 dark:text-stone-400">El método de entrega se acordará directamente con el vendedor.</p>
                                    </div>
                                </div>
                            )}

                            {/* Delivery Address */}
                            {deliveryMethod === 'delivery' && storeSettings.deliveryAvailable && !noMethodsAvailable && (
                                <div className="animate-fade-in-up">
                                    <label className="block text-sm font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">Dirección de Envío</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Calle, Altura, Piso..."
                                        className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:ring-2 focus:ring-stone-800 dark:focus:ring-stone-500"
                                    />
                                </div>
                            )}

                            {/* Pickup Info */}
                            {deliveryMethod === 'pickup' && storeSettings.pickupAvailable && !noMethodsAvailable && (
                                <div className="animate-fade-in-up bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-4 flex items-start gap-3">
                                    <span className="text-xl">📍</span>
                                    <div>
                                        <p className="text-sm font-bold text-stone-800 dark:text-stone-200">Retiro por Local</p>
                                        <p className="text-xs text-stone-500 dark:text-stone-400">Te enviaremos la ubicación exacta al confirmar el pedido.</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">Pago</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800 dark:focus:ring-stone-500 appearance-none"
                                    >
                                        <option value="">Elegir...</option>
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Transferencia">Transferencia</option>
                                    </select>
                                </div>

                                {paymentMethod === 'Efectivo' && (
                                    <div className="animate-fade-in-up">
                                        <label className="block text-sm font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">Abono con</label>
                                        <input
                                            type="text"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            placeholder="$..."
                                            className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:ring-2 focus:ring-stone-800 dark:focus:ring-stone-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky Send Button Area */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
                    <button
                        onClick={handleWhatsAppRedirect}
                        disabled={!isFormValid}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${isFormValid
                            ? storeSettings.isOpen
                                ? 'bg-[#25D366] text-white hover:bg-[#20bd5a] hover:scale-[1.02]'
                                : 'bg-indigo-600 text-white hover:bg-indigo-500' // Botón diferente si está cerrado
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                            }`}
                    >
                        {storeSettings.isOpen && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.466 0-9.902 4.434-9.905 9.891-.001 1.744.455 3.45 1.321 4.953l-1.402 5.122z" />
                            </svg>
                        )}
                        <span>{storeSettings.isOpen ? 'Enviar Pedido por WhatsApp' : 'Dejar Pedido Programado'}</span>
                    </button>
                </div>
            </div>
        </>
    );
};
