import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Free shipping threshold: Rs. 2499
  const FREE_SHIPPING_THRESHOLD = 2499;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const discount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 199;
  const total = subtotal - discount + shipping;

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MOKIYO-WILD10') {
      setAppliedPromo('MOKIYO-WILD10');
    } else {
      alert('Invalid code. Try using: MOKIYO-WILD10');
    }
  };

  const handleCheckout = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setCheckoutComplete(true);
    setTimeout(() => {
      setCheckoutComplete(false);
      onClearCart && onClearCart();
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="w-screen max-w-md bg-white text-black shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight uppercase font-display">
                    YOUR BAG ({cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)})
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">
                    MOKIYO STREETWEAR DIRECT
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-none transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="bg-zinc-100 p-3.5 border-b border-zinc-200">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  {amountToFreeShipping > 0 ? (
                    <span>
                      Add <strong className="text-[#FF4D00]">Rs.{amountToFreeShipping}</strong> for Free Express Delivery!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      🎉 Free Worldwide Express Shipping Unlocked!
                    </span>
                  )}
                  <span className="font-mono text-zinc-500">{freeShippingProgress}%</span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5 overflow-hidden">
                  <div
                    className="bg-black h-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="py-20 text-center text-zinc-400">
                    <p className="text-sm font-semibold uppercase tracking-wider mb-2">
                      Your bag is empty
                    </p>
                    <p className="text-xs text-zinc-500">
                      Explore the collection and add your statement silhouettes.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={`${item._id || item.slug}-${item.selectedSize || 'default'}`}
                      className="flex gap-4 p-3 border border-zinc-100 bg-zinc-50/50"
                    >
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=200&auto=format&fit=crop'}
                        alt={item.name}
                        className="w-18 h-24 object-cover shrink-0 bg-zinc-200"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-black uppercase tracking-tight">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item)}
                              className="text-zinc-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            Size: {item.selectedSize || 'L (Oversized)'}
                          </div>
                          <div className="text-xs font-bold text-black mt-1">
                            Rs.{item.price}
                          </div>
                        </div>

                        {/* Quantity Controller */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item, (item.quantity || 1) - 1)}
                            className="w-6 h-6 border border-zinc-300 flex items-center justify-center hover:bg-zinc-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold w-4 text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item, (item.quantity || 1) + 1)}
                            className="w-6 h-6 border border-zinc-300 flex items-center justify-center hover:bg-zinc-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Summary */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-3">
                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code (e.g. MOKIYO-WILD10)"
                        className="w-full pl-8 pr-2 py-1.5 text-xs uppercase font-mono border border-zinc-300 bg-white focus:outline-none focus:border-black"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black"
                    >
                      Apply
                    </button>
                  </form>
                  {appliedPromo && (
                    <span className="text-[11px] text-emerald-700 font-mono block">
                      ✓ Promo code {appliedPromo} applied (-10%)
                    </span>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-200">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-black font-semibold">Rs.{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>VIP Discount (10%)</span>
                        <span className="font-mono font-semibold">-Rs.{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span className="font-mono text-black">
                        {shipping === 0 ? 'FREE' : `Rs.${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-zinc-200">
                      <span>TOTAL</span>
                      <span className="font-mono">Rs.{total}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutComplete}
                    className="w-full py-3.5 bg-black hover:bg-[#FF4D00] text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                  >
                    {checkoutComplete ? (
                      'ORDER CONFIRMED! REDIRECTING...'
                    ) : (
                      <>
                        <span>PROCEED TO CHECKOUT</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit Encrypted High-Security Checkout</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

