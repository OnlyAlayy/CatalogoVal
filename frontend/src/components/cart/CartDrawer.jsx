import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotalPrice, getMaxAdvanceHours } = useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
  };

  const handleSendOrder = () => {
    if (items.length === 0) return;

    let message = `¡Hola Val! Me gustaría hacer el siguiente pedido:\n\n`;
    
    items.forEach(item => {
      const variantText = item.variant ? ` (${item.variant.name || item.variant.label})` : '';
      message += `📦 *${item.quantity}x ${item.product.name}*${variantText}\n`;
    });

    message += `\n💰 *Total estimado: ${formatPrice(getTotalPrice())}*`;

    const maxAdvance = getMaxAdvanceHours();
    if (maxAdvance > 0) {
      message += `\n⏱️ _Nota: Sé que algunos productos requieren ${maxAdvance}hs de anticipación._`;
    }

    const waUrl = `https://wa.me/59892612169?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    onClose();
  };

  if (!isOpen && items.length === 0) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.05]">
              <h2 className="text-xl font-serif font-medium text-text-primary flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-primary" />
                Tu Pedido
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-bg-secondary transition-colors duration-200"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* Content (Items) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-text-muted">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-serif text-xl mb-2 text-text-primary">Tu carrito está vacío</p>
                  <p className="font-sans text-sm font-light">Agregá postres desde el catálogo para armar tu pedido.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.cartItemId} className="flex gap-4 bg-bg-secondary p-3 rounded-2xl border border-black/[0.03]">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0">
                      {item.product.images?.length > 0 ? (
                        <img src={item.product.images[0]?.url || item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-brand-light/20 flex items-center justify-center">🍰</div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col flex-1 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-serif text-base text-text-primary leading-tight pr-4">{item.product.name}</h4>
                        <button 
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-text-muted hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.variant && (
                        <span className="text-[11px] font-sans text-text-secondary bg-white px-2 py-0.5 rounded-full border border-black/[0.05] w-fit mb-2">
                          {item.variant.name || item.variant.label}
                        </span>
                      )}
                      
                      <div className="mt-auto flex items-end justify-between">
                        <span className="font-sans font-semibold text-brand-primary">
                          {formatPrice(item.variant ? item.variant.price : item.product.price)}
                        </span>
                        
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 bg-white rounded-full px-1.5 py-1 border border-black/[0.05]">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-bg-secondary text-text-primary transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="font-sans font-medium text-[13px] w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-bg-secondary text-text-primary transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-bg-secondary border-t border-black/[0.05]">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="block text-[11px] font-sans uppercase tracking-[0.2em] text-text-muted mb-1">Total a Pagar</span>
                    {getMaxAdvanceHours() > 0 && (
                      <span className="block text-[11px] text-text-secondary font-sans font-medium">
                        Requiere {getMaxAdvanceHours()}hs anticipación
                      </span>
                    )}
                  </div>
                  <span className="font-serif text-3xl text-brand-primary">{formatPrice(getTotalPrice())}</span>
                </div>
                
                <button
                  onClick={handleSendOrder}
                  className="w-full rounded-full py-4 flex items-center justify-center gap-3 bg-brand-primary hover:bg-brand-dark text-white shadow-xl shadow-brand-primary/20 transition-all duration-300 border-none uppercase tracking-widest text-[13px] font-semibold hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enviar pedido por WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
