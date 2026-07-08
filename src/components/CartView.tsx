/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  X, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartViewProps {
  cart: CartItem[];
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  coupon: { code: string; discount: number; description: string } | null;
  onApplyCoupon: (code: string) => boolean; // returns true if applied
  onRemoveCoupon: () => void;
  setView: (view: string) => void;
}

export default function CartView({
  cart,
  updateQuantity,
  removeFromCart,
  coupon,
  onApplyCoupon,
  onRemoveCoupon,
  setView
}: CartViewProps) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // 1. Math totals
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  // Determine if there are veterinary medicines (for MYSORE20)
  const containsMeds = useMemo(() => {
    return cart.some(item => item.product.category === 'Veterinary Medicines');
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.code === 'MYSORE20') {
      // 20% off on vet meds ONLY
      const medsTotal = cart
        .filter(item => item.product.category === 'Veterinary Medicines')
        .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return Math.round(medsTotal * 0.2);
    }
    if (coupon.code === 'SANJEEVINI10') {
      return Math.round(subtotal * 0.1);
    }
    if (coupon.code === 'FREESHIP') {
      return 0; // Handled in delivery charge reduction
    }
    return 0;
  }, [coupon, cart, subtotal]);

  // Delivery charge (Standard 80 INR across Mysore, free above 1000 INR or if FREESHIP applied)
  const deliveryCharge = useMemo(() => {
    if (subtotal === 0) return 0;
    if (subtotal >= 1000) return 0;
    if (coupon?.code === 'FREESHIP' && subtotal >= 500) return 0;
    return 80;
  }, [subtotal, coupon]);

  // Tax calculation: GST 18% (already included in retail prices, but displayed as a tax component for professional invoicing)
  const taxAmount = useMemo(() => {
    return Math.round((subtotal - discountAmount) * 0.18);
  }, [subtotal, discountAmount]);

  const grandTotal = useMemo(() => {
    const value = subtotal - discountAmount + deliveryCharge;
    return Math.max(0, value);
  }, [subtotal, discountAmount, deliveryCharge]);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'MYSORE20' && !containsMeds) {
      setCouponError('Coupon MYSORE20 is only applicable for Veterinary Medicines.');
      return;
    }

    const success = onApplyCoupon(code);
    if (success) {
      setCouponInput('');
    } else {
      setCouponError('Invalid promo code. Try MYSORE20 or SANJEEVINI10.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-bold text-slate-900 text-xl sm:text-2xl">Your Shopping Cart is Empty</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
            You haven't cataloged any items for doorstep delivery yet. Browse our premium vet food, medicines, and accessories catalog!
          </p>
        </div>
        <button
          onClick={() => setView('shop')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-95"
        >
          Browse Supplies Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Your Logistics Pouch</span>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">Review Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
            {cart.map((item) => (
              <div key={item.product.id} className="p-5 flex flex-col sm:flex-row gap-5 items-stretch sm:items-center justify-between">
                {/* Product Meta */}
                <div className="flex gap-4 items-center flex-grow">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="h-16 w-16 object-cover rounded-xl border border-slate-100 shadow-sm"
                  />
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">{item.product.category}</span>
                    <h3 
                      onClick={() => setView('shop')}
                      className="font-bold text-slate-800 text-sm line-clamp-1 hover:text-emerald-600 cursor-pointer"
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs font-bold text-emerald-700">₹{item.product.price} <span className="text-[10px] text-slate-400 font-medium">per item</span></p>
                  </div>
                </div>

                {/* Adjuster and Math */}
                <div className="flex sm:flex-row items-center gap-6 justify-between sm:justify-end shrink-0 border-t border-slate-50 sm:border-t-0 pt-3 sm:pt-0">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
                    <button
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="text-slate-500 hover:text-slate-800 disabled:text-slate-300 font-extrabold text-sm px-1.5"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                    <button
                      disabled={item.quantity >= item.product.stockCount}
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="text-slate-500 hover:text-slate-800 font-extrabold text-sm px-1.5"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right space-y-0.5 min-w-[70px]">
                    <p className="text-xs text-slate-400 font-medium">Total Price</p>
                    <p className="text-xs font-bold text-slate-800">₹{item.product.price * item.quantity}</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg border border-slate-100 hover:border-red-100 transition-colors"
                    title="Remove from Cart"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Prompt banner for additional shopping */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/40 gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
              <p className="text-xs font-medium text-emerald-800">
                Want free delivery? Add ₹{Math.max(0, 1000 - subtotal)} more value for free doorstep routing across Mysore!
              </p>
            </div>
            <button
              onClick={() => setView('shop')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 shrink-0 transition-colors flex items-center gap-0.5"
            >
              Continue Shopping <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Price Summary Panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-slate-800 text-sm tracking-wide uppercase border-b border-slate-50 pb-3">
            Logistics Invoice Breakdown
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Products Subtotal</span>
              <span className="text-slate-800 font-bold">₹{subtotal}</span>
            </div>

            {coupon && (
              <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/60 p-2 rounded-lg border border-emerald-100/40">
                <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Coupon Discount ({coupon.code})</span>
                <span>- ₹{discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                Mysore Delivery Fee
                <span className="group relative cursor-help">
                  <Info className="h-3.5 w-3.5 text-slate-300 hover:text-slate-400" />
                  <span className="absolute hidden group-hover:block bg-slate-900 text-white text-[10px] rounded p-2 -top-16 left-1/2 -translate-x-1/2 w-48 shadow-lg z-10 leading-relaxed font-light">
                    Flat ₹80 across Mysore. Free on orders above ₹1,000.
                  </span>
                </span>
              </span>
              <span className="text-slate-800 font-bold">
                {deliveryCharge === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryCharge}`}
              </span>
            </div>

            <div className="flex justify-between text-slate-400 font-light">
              <span>Incl. GST (18%)</span>
              <span>₹{taxAmount}</span>
            </div>

            <div className="border-t border-slate-100 my-2.5 pt-4 flex justify-between items-baseline text-slate-900">
              <span className="font-display font-bold text-sm">Grand Total (INR)</span>
              <span className="font-display font-extrabold text-lg text-emerald-700">₹{grandTotal}</span>
            </div>
          </div>

          {/* Coupon Entry section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="text-xs font-bold text-slate-600">Apply Mysore Promo Code</div>
            {coupon ? (
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-slate-800">{coupon.code}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{coupon.description}</p>
                </div>
                <button
                  onClick={onRemoveCoupon}
                  className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600"
                  title="Remove coupon"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SANJEEVINI10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-lg text-xs px-3.5 py-2 outline-none focus:border-emerald-500 placeholder-slate-400 font-semibold"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && (
              <p className="text-[10px] font-bold text-red-500">{couponError}</p>
            )}
            
            {/* Display Available Coupons for 1-click apply */}
            {!coupon && (
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Available Mysore Coupons:</p>
                <div className="grid grid-cols-1 gap-1">
                  <button 
                    onClick={() => { onApplyCoupon('SANJEEVINI10'); }}
                    className="text-left bg-slate-50 hover:bg-emerald-50 p-2 rounded-lg border border-slate-100 hover:border-emerald-200 transition-all text-[10px] flex justify-between items-center"
                  >
                    <span><strong>SANJEEVINI10</strong> (Flat 10% Off Storewide)</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                  </button>
                  <button 
                    disabled={!containsMeds}
                    onClick={() => { onApplyCoupon('MYSORE20'); }}
                    className={`text-left bg-slate-50 p-2 rounded-lg border transition-all text-[10px] flex justify-between items-center ${
                      containsMeds 
                        ? 'hover:bg-emerald-50 border-slate-100 hover:border-emerald-200 cursor-pointer' 
                        : 'opacity-50 border-slate-100 cursor-not-allowed'
                    }`}
                  >
                    <span><strong>MYSORE20</strong> (20% Off Veterinary Medicines)</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Secure Checkout CTA */}
          <button
            onClick={() => setView('checkout')}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/15 flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight className="h-4.5 w-4.5" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium pt-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Sanjeevini Regulated Delivery Channel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
