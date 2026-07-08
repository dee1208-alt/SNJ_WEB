/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  QrCode, 
  Smartphone,
  Info,
  DollarSign,
  Printer,
  ShoppingBag as BagIcon,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Product, User, Order } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutViewProps {
  cart: CartItem[];
  user: User | null;
  onLoginDemo: () => void;
  coupon: { code: string; discount: number; description: string } | null;
  onPlaceOrder: (orderData: any) => Promise<Order | null>;
  setView: (view: string) => void;
  clearCart: () => void;
}

export default function CheckoutView({
  cart,
  user,
  onLoginDemo,
  coupon,
  onPlaceOrder,
  setView,
  clearCart
}: CheckoutViewProps) {
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  
  // Checkout steps: 'auth' (if not logged in & not guest), 'address', 'payment', 'confirmation'
  const [step, setStep] = useState<'auth' | 'address' | 'payment' | 'confirmation'>(
    user ? 'address' : 'auth'
  );

  // Address State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState(user?.addresses[0]?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(user?.addresses[0]?.addressLine2 || '');
  const [pinCode, setPinCode] = useState(user?.addresses[0]?.pinCode || '570002');
  const [landmark, setLandmark] = useState(user?.addresses[0]?.landmark || '');
  const [addressError, setAddressError] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('petparent@okaxis');
  
  // Placement State
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Math totals
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.code === 'MYSORE20') {
      const medsTotal = cart
        .filter(item => item.product.category === 'Veterinary Medicines')
        .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return Math.round(medsTotal * 0.2);
    }
    if (coupon.code === 'SANJEEVINI10') {
      return Math.round(subtotal * 0.1);
    }
    return 0;
  }, [coupon, cart, subtotal]);

  const deliveryCharge = useMemo(() => {
    if (subtotal === 0 || subtotal >= 1000) return 0;
    if (coupon?.code === 'FREESHIP' && subtotal >= 500) return 0;
    return 80;
  }, [subtotal, coupon]);

  const taxAmount = useMemo(() => {
    return Math.round((subtotal - discountAmount) * 0.18);
  }, [subtotal, discountAmount]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + deliveryCharge);
  }, [subtotal, discountAmount, deliveryCharge]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail || !guestName || !guestPhone) {
      alert('Please fill out guest credentials to proceed.');
      return;
    }
    setFullName(guestName);
    setPhone(guestPhone);
    setStep('address');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');

    if (!fullName || !phone || !addressLine1 || !pinCode) {
      setAddressError('Please fill out all mandatory shipping details.');
      return;
    }

    if (!pinCode.startsWith('570') || pinCode.trim().length !== 6) {
      setAddressError('⚠ Sanjeevini currently services Mysore only. PIN codes must be valid 6-digit Mysore pins starting with 570 (e.g. 570002).');
      return;
    }

    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    const orderDetails = {
      userId: user?.id || 'guest-' + Date.now(),
      items: cart.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      })),
      subtotal,
      deliveryCharge,
      tax: taxAmount,
      discount: discountAmount,
      grandTotal,
      couponCode: coupon?.code,
      deliveryAddress: {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        pinCode,
        landmark
      },
      paymentMethod
    };

    const result = await onPlaceOrder(orderDetails);
    setIsPlacing(false);
    if (result) {
      setPlacedOrder(result);
      setStep('confirmation');
      clearCart();
    } else {
      alert('Failed to place your order. Please check connection and try again.');
    }
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Tracker Bar */}
      {step !== 'confirmation' && (
        <div className="flex items-center justify-between max-w-md mx-auto text-xs font-bold text-slate-400">
          <span className={`${step === 'auth' ? 'text-emerald-600' : 'text-slate-700'}`}>1. LOGIN</span>
          <ChevronRight className="h-4 w-4" />
          <span className={`${step === 'address' ? 'text-emerald-600' : step === 'payment' ? 'text-slate-700' : 'text-slate-400'}`}>2. ADDRESS</span>
          <ChevronRight className="h-4 w-4" />
          <span className={`${step === 'payment' ? 'text-emerald-600' : 'text-slate-400'}`}>3. PAYMENT</span>
        </div>
      )}

      {/* STEP 1: AUTH (Guest or login) */}
      {step === 'auth' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          {/* Option A: Quick prefill Demo Sign In */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <UserCheck className="h-6 w-6" />
              </div>
              <h2 className="font-display font-bold text-slate-900 text-lg">Mysore Pet Parent Sign In</h2>
              <p className="text-slate-500 text-xs leading-relaxed font-light">
                Sign in with our secure Sanjeevini demo account to access your saved addresses, manage appointment calendars, and review order dispatches.
              </p>
            </div>
            
            <button
              onClick={() => {
                onLoginDemo();
                setFullName('Srinivas Prasad');
                setPhone('+91 9845012345');
                setAddressLine1('No. 124, 4th Cross');
                setAddressLine2('Contour Road, Gokulam 3rd Stage');
                setPinCode('570002');
                setLandmark('Near Doctors Corner');
                setStep('address');
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-95 text-center"
            >
              Log In With Demo Profile (1-Click)
            </button>
          </div>

          {/* Option B: Guest Checkout */}
          <form onSubmit={handleAuthSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <h2 className="font-display font-bold text-slate-900 text-lg">Continue as Guest</h2>
            <p className="text-slate-400 text-xs">No password required. We will send invoices directly to your email.</p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Full Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Siddharth Gowda"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs px-3.5 py-2.5 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Email Address</label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="siddharth@mysore.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs px-3.5 py-2.5 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91 98450 XXXXX"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs px-3.5 py-2.5 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Checkout as Guest
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: ADDRESS MANAGEMENT */}
      {step === 'address' && (
        <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Address entry form */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <h2 className="font-display font-bold text-slate-950 text-base">Mysore Shipping Logistics Address</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Consignee Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Srinivas Prasad"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3.5 py-2.5 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9845012345"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Street Address & Flat No. *</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="No. 124, 4th Cross, Contour Road"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3.5 py-2.5 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Area / Colony / Extension</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Gokulam 3rd Stage"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3.5 py-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Mysore PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="570002"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3.5 py-2.5 outline-none font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Famous Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near Doctors Corner"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>
            </div>

            {addressError && (
              <p className="text-xs font-semibold text-red-500 leading-relaxed pt-1">{addressError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10"
            >
              Continue to Payments
            </button>
          </div>

          {/* Checkout Right Column: Summary Panel */}
          <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider pb-2 border-b border-slate-50">
              Order Summary
            </h3>
            
            <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-50 pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="py-2.5 flex justify-between gap-4 text-xs">
                  <div className="space-y-0.5 max-w-[70%]">
                    <p className="font-semibold text-slate-800 line-clamp-1">{item.product.name}</p>
                    <p className="text-slate-400 font-light">Qty: {item.quantity} x ₹{item.product.price}</p>
                  </div>
                  <span className="font-bold text-slate-800">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({coupon.code})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Mysore Delivery</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-light">
                <span>GST (18% included)</span>
                <span>₹{taxAmount}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-slate-900 font-bold">
                <span className="text-xs">Payable Amount</span>
                <span className="text-base text-emerald-700 font-display">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* STEP 3: PAYMENT WIDGET */}
      {step === 'payment' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Payment selection panel */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <h2 className="font-display font-bold text-slate-950 text-base">Select Razorpay Sandbox Payment</h2>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">SECURE PASSWAY</span>
            </div>

            {/* Payment triggers */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'UPI', label: 'UPI / Scan Code', sub: 'Instant Sandbox scan' },
                { id: 'Card', label: 'Credit / Debit Card', sub: 'Simulated processor' },
                { id: 'NetBanking', label: 'Net Banking', sub: 'All Mysore Banks' },
                { id: 'COD', label: 'Cash on Delivery', sub: 'Pay in hand' }
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 text-left rounded-xl border transition-all ${
                    paymentMethod === method.id 
                      ? 'border-emerald-600 bg-emerald-50/40 text-emerald-950 scale-102 ring-2 ring-emerald-100/50' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-700 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold block">{method.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 block">{method.sub}</span>
                </button>
              ))}
            </div>

            {/* Simulated Razorpay Inputs based on active method */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
              {paymentMethod === 'UPI' && (
                <div className="space-y-4 text-center sm:text-left">
                  <span className="text-xs font-bold text-slate-600 uppercase block">Scan UPI Dynamic QR Code</span>
                  <div className="flex flex-col sm:flex-row gap-5 items-center bg-white p-4 rounded-xl border border-slate-100">
                    <div className="p-2 bg-slate-50 rounded-lg border">
                      <QrCode className="h-28 w-28 text-slate-800" />
                    </div>
                    <div className="space-y-2 text-xs">
                      <p className="font-semibold text-slate-800 flex items-center gap-1">
                        <Smartphone className="h-4 w-4 text-emerald-600" /> Pay using BHIM, PhonePe, GPay, or Paytm
                      </p>
                      <p className="text-slate-400 font-light leading-relaxed">
                        Open your preferred UPI mobile app and scan the sandbox QR code. The invoice will auto-generate once the transfer registers.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="bg-slate-50 border rounded p-1.5 font-mono text-[10px]"
                        />
                        <button type="button" className="text-[10px] text-emerald-700 font-bold">Verified UPI ID</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-600 uppercase block">Enter Card Details (Sandbox Mode)</span>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Srinivas Prasad"
                        className="w-full bg-white border border-slate-200 rounded-lg text-xs px-3 py-2 outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 7182 9102 3456"
                        className="w-full bg-white border border-slate-200 rounded-lg text-xs px-3 py-2 outline-none font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full bg-white border border-slate-200 rounded-lg text-xs px-3 py-2 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase">CVV Code</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="***"
                          className="w-full bg-white border border-slate-200 rounded-lg text-xs px-3 py-2 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'NetBanking' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-600 uppercase block">Select Preferred Retail Bank</span>
                  <select className="w-full bg-white border border-slate-200 rounded-lg text-xs p-2.5 outline-none font-semibold">
                    <option>State Bank of India (SBI) - Mysore Branch</option>
                    <option>HDFC Bank Mysore</option>
                    <option>ICICI Bank Gokulam</option>
                    <option>Canara Bank Kuvempunagar</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="space-y-1 text-slate-700 text-xs">
                  <p className="font-bold flex items-center gap-1 text-emerald-800">
                    <CheckCircle className="h-4 w-4" /> Cash / UPI on Doorstep Delivery Allowed
                  </p>
                  <p className="font-light text-slate-500 leading-relaxed pt-1">
                    Pay our delivery rider during physical delivery. You can pay via cash or by scanning the rider\'s static QR code at your gate.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isPlacing ? 'Authenticating Payment...' : `Authorize & Pay ₹${grandTotal}`}
            </button>
          </div>

          {/* Delivery Area Summary */}
          <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider pb-2 border-b border-slate-50">
              Delivery Logistics Location
            </h3>
            <div className="text-xs space-y-3 text-slate-600">
              <div className="flex gap-2.5 items-start">
                <MapPin className="h-4.5 w-4.5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">{fullName}</p>
                  <p className="font-light mt-0.5">{addressLine1}, {addressLine2}</p>
                  <p className="font-semibold text-slate-800 mt-1">PIN: {pinCode} (Mysore Circle)</p>
                  <p className="font-light text-slate-400 text-[10px] mt-0.5">Landmark: {landmark}</p>
                </div>
              </div>
              <div className="border-t border-slate-50 pt-3">
                <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider block">Est. Delivery Schedule</span>
                <p className="text-xs font-semibold text-slate-800 mt-1">Expected delivery: Within 24 Hours</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: ORDER CONFIRMATION & INVOICE */}
      {step === 'confirmation' && placedOrder && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm text-center max-w-2xl mx-auto space-y-6">
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-display font-bold text-slate-900 text-2xl sm:text-3xl">Order Confirmed!</h1>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Thank you for choosing Sanjeevini. Your premium pet supplies have been registered for doorstep dispatch. An SMS confirmation with a tracking link has been sent to {placedOrder.deliveryAddress.phone}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-xs border-y border-slate-100 py-4">
              <div>
                <span className="text-slate-400 font-medium block">Order Number</span>
                <span className="font-bold text-slate-800">{placedOrder.id}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Grand Total Paid</span>
                <span className="font-bold text-emerald-700">₹{placedOrder.grandTotal}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <button
                onClick={printInvoice}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" /> Print / Download Invoice
              </button>
              <button
                onClick={() => setView('shop')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Printable visual Invoice layout sheet (Prints nicely or acts as viewable receipt) */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-lg max-w-3xl mx-auto space-y-8 print:border-0 print:shadow-none print:p-0">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <div className="h-8 w-8 bg-emerald-600 text-white rounded font-bold flex items-center justify-center font-display">S</div>
                  <span className="font-display font-bold text-lg tracking-tight text-slate-900">SANJEEVINI</span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1">Mysore Pet Healthcare Dispatch Node</p>
              </div>
              <div className="text-left sm:text-right text-xs">
                <p className="font-bold text-slate-800">TAX INVOICE</p>
                <p className="text-slate-400 mt-1">Invoice Ref: {placedOrder.id}</p>
                <p className="text-slate-400">Date: {placedOrder.createdAt.split('T')[0]}</p>
              </div>
            </div>

            {/* Address Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed">
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-widest mb-1.5">Supplier Details</p>
                <p className="font-bold text-slate-800">Sanjeevini Premium Pharmacy Hub</p>
                <p className="text-slate-500 font-light">Contour Road, Gokulam 3rd Stage</p>
                <p className="text-slate-500 font-light">Mysore, Karnataka - 570002</p>
                <p className="text-slate-500 font-light">DL No: KA-MYS-129381-V</p>
              </div>

              <div>
                <p className="font-bold text-slate-400 uppercase tracking-widest mb-1.5">Consignee Address</p>
                <p className="font-bold text-slate-800">{placedOrder.deliveryAddress.fullName}</p>
                <p className="text-slate-500 font-light">{placedOrder.deliveryAddress.addressLine1}</p>
                {placedOrder.deliveryAddress.addressLine2 && <p className="text-slate-500 font-light">{placedOrder.deliveryAddress.addressLine2}</p>}
                <p className="text-slate-800 font-semibold">PIN: {placedOrder.deliveryAddress.pinCode} (Mysore Circle)</p>
                <p className="text-slate-500 font-light">Phone: {placedOrder.deliveryAddress.phone}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 w-1/2">Product Description</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {placedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">₹{item.price}</td>
                      <td className="py-3 text-right font-semibold">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Row */}
            <div className="flex justify-end pt-4 border-t border-slate-100 text-xs">
              <div className="w-64 space-y-2.5">
                <div className="flex justify-between text-slate-500 font-light">
                  <span>Products Subtotal</span>
                  <span>₹{placedOrder.subtotal}</span>
                </div>
                {placedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount Code Applied</span>
                    <span>- ₹{placedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 font-light">
                  <span>Doorstep Delivery Charge</span>
                  <span>{placedOrder.deliveryCharge === 0 ? 'FREE' : `₹${placedOrder.deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-light">
                  <span>Incl. 18% GST component</span>
                  <span>₹{placedOrder.tax}</span>
                </div>
                <div className="border-t-2 border-slate-100 pt-3 flex justify-between font-bold text-slate-900">
                  <span className="text-sm">Total Paid Amount</span>
                  <span className="text-sm text-emerald-700 font-display">₹{placedOrder.grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Footer Terms */}
            <div className="border-t border-slate-100 pt-6 text-[10px] text-slate-400 text-center leading-relaxed">
              <p>This is a computer-generated tax invoice issued on behalf of Sanjeevini Premium Pet Healthcare, Mysore.</p>
              <p className="mt-1">All medications are packed under pharmacist-supervised sanitization protocols. For returns or cancellation requests, consult our Refund Policy.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
