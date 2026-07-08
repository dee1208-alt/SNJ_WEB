/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  ShoppingBag, 
  CalendarDays, 
  Heart, 
  MapPin, 
  Bell, 
  Settings, 
  HeartCrack, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Truck, 
  RefreshCw,
  Award,
  Lock,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Star
} from 'lucide-react';
import { User, Order, Appointment, Product } from '../types';

interface AccountViewProps {
  user: User | null;
  onLoginDemo: () => void;
  onLogout: () => void;
  orders: Order[];
  appointments: Appointment[];
  products: Product[];
  toggleWishlist: (id: string) => void;
  addToCart: (product: Product) => void;
  onUpdateUserAddresses: (addresses: any[]) => void;
  setView: (view: string, id?: string) => void;
}

export default function AccountView({
  user,
  onLoginDemo,
  onLogout,
  orders,
  appointments,
  products,
  toggleWishlist,
  addToCart,
  onUpdateUserAddresses,
  setView
}: AccountViewProps) {
  // Navigation tabs: 'profile', 'addresses', 'orders', 'appointments', 'wishlist', 'settings'
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'appointments' | 'wishlist' | 'settings'>('orders');

  // Address add form fields
  const [addAddressMode, setAddAddressMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [pinCode, setPinCode] = useState('570002');
  const [landmark, setLandmark] = useState('');

  // OTP Verification Simulation State
  const [phoneLoginInput, setPhoneLoginInput] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const wishlistProducts = products.filter(p => user?.wishlist.includes(p.id));

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine1 || !pinCode) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    if (!pinCode.startsWith('570') || pinCode.trim().length !== 6) {
      alert('⚠ Sanjeevini currently services Mysore only. PIN codes must start with 570.');
      return;
    }

    if (!user) return;

    const newAddress = {
      id: 'addr-' + Date.now(),
      fullName,
      phone,
      addressLine1,
      addressLine2,
      pinCode,
      landmark,
      isDefault: user.addresses.length === 0
    };

    onUpdateUserAddresses([...user.addresses, newAddress]);
    setAddAddressMode(false);
    
    // Clear forms
    setFullName('');
    setPhone('');
    setAddressLine1('');
    setAddressLine2('');
    setPinCode('570002');
    setLandmark('');
  };

  const handleDeleteAddress = (id: string) => {
    if (!user) return;
    const filtered = user.addresses.filter(addr => addr.id !== id);
    onUpdateUserAddresses(filtered);
  };

  // Re-order past order products helper
  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod);
      }
    });
    setView('cart');
  };

  // OTP Login Trigger simulation
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneLoginInput) return;
    setShowOtpScreen(true);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '1234') {
      onLoginDemo();
      setShowOtpScreen(false);
      setPhoneLoginInput('');
      setOtpInput('');
    } else {
      alert('Invalid OTP code. Please enter the prefill test code 1234.');
    }
  };

  // If user is not logged in, render authentication screens
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-8 animate-fade-in">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="font-display font-bold text-slate-900 text-xl sm:text-2xl">Log In to Sanjeevini</h2>
            <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
              Verify your mobile phone using one-time password (OTP) credentials to access diagnostic schedules & dispatch details.
            </p>
          </div>

          {!showOtpScreen ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Mobile Phone Number *</label>
                <div className="flex bg-slate-50 border border-slate-200 focus-within:border-emerald-500 rounded-lg p-2.5 outline-none">
                  <span className="text-slate-400 font-bold shrink-0 pr-2 border-r border-slate-200">+91</span>
                  <input
                    type="tel"
                    required
                    value={phoneLoginInput}
                    onChange={(e) => setPhoneLoginInput(e.target.value)}
                    placeholder="98450 12345"
                    className="flex-grow bg-transparent outline-none pl-2 font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Request OTP Code
              </button>

              <div className="border-t border-slate-100 my-4 pt-4">
                <button
                  type="button"
                  onClick={onLoginDemo}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-95"
                >
                  Quick Sign In Demo User
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpVerify} className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100/60 text-emerald-900 font-medium">
                  OTP Code has been sent to +91 {phoneLoginInput}. Enter **1234** to login immediately.
                </div>
                <label className="font-bold text-slate-600 block uppercase tracking-wider text-[10px]">Verification OTP Code *</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="1 2 3 4"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-center font-bold text-lg tracking-widest p-2.5 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Verify & Sign In
              </button>
              
              <button
                type="button"
                onClick={() => setShowOtpScreen(false)}
                className="w-full text-center text-[10px] text-slate-400 font-semibold uppercase hover:text-slate-600"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Profile Header banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold font-display shadow-md shadow-emerald-600/20">
            {user.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="space-y-1">
            <h1 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-tight">{user.fullName}</h1>
            <p className="text-slate-400 text-xs font-medium">{user.email} • Mobile: {user.phone}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider rounded-xl border border-red-100/40 transition-colors flex items-center gap-1.5"
        >
          <HeartCrack className="h-4 w-4" /> Logout Demo Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 border-b border-slate-50 pb-2">Account Hub</h3>
          <div className="flex flex-col gap-1">
            {[
              { id: 'orders', label: 'Order History & Track', icon: <ShoppingBag className="h-4 w-4" /> },
              { id: 'appointments', label: 'Clinical Appointments', icon: <CalendarDays className="h-4 w-4" /> },
              { id: 'wishlist', label: 'My Pet Wishlist', icon: <Heart className="h-4 w-4" /> },
              { id: 'addresses', label: 'Saved Shipping Addresses', icon: <MapPin className="h-4 w-4" /> },
              { id: 'profile', label: 'Update Profile Details', icon: <UserIcon className="h-4 w-4" /> },
              { id: 'settings', label: 'Notifications & Alerts', icon: <Settings className="h-4 w-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 text-left px-4.5 py-3 rounded-xl text-xs transition-colors font-medium ${
                  activeTab === tab.id 
                    ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' 
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content Display Panel */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          {/* TAB 1: ORDER LOGISTICS TRACKER */}
          {activeTab === 'orders' && (
            <div className="space-y-8 text-xs">
              <h2 className="font-display font-bold text-slate-950 text-base border-b border-slate-50 pb-3">Doorstep Delivery History & Active Tracking</h2>
              
              {orders.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto" />
                  <p className="text-slate-400 font-medium">No order history available.</p>
                  <button
                    onClick={() => setView('shop')}
                    className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg"
                  >
                    Shop Supplies Now
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20 space-y-4">
                      {/* Order general banner */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-50 pb-3">
                        <div>
                          <span className="font-bold text-slate-800">Order ID: {order.id}</span>
                          <span className="text-slate-400 font-light ml-2">Placed: {order.createdAt.split('T')[0]}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-800">Total: ₹{order.grandTotal}</span>
                          <span className="bg-emerald-50 text-emerald-700 font-bold text-[9px] px-2 py-0.5 rounded border border-emerald-100 uppercase">{order.orderStatus}</span>
                        </div>
                      </div>

                      {/* Timeline status track */}
                      <div className="space-y-4 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Logistics Route Tracker</span>
                        <div className="grid grid-cols-5 text-center gap-1.5 font-bold text-[9px] relative pb-2 border-b border-slate-50">
                          {[
                            { name: 'Order Placed', icon: <CheckCircle className="h-4.5 w-4.5 mx-auto text-emerald-600" /> },
                            { name: 'Processing', icon: <Clock className="h-4.5 w-4.5 mx-auto text-emerald-600" /> },
                            { name: 'Dispatched', icon: <Truck className="h-4.5 w-4.5 mx-auto text-slate-300" /> },
                            { name: 'On Road', icon: <Truck className="h-4.5 w-4.5 mx-auto text-slate-300 animate-pulse" /> },
                            { name: 'Delivered', icon: <CheckCircle className="h-4.5 w-4.5 mx-auto text-slate-300" /> }
                          ].map((step, idx) => {
                            // Simple logic to highlight completed steps
                            const statuses = ['Order Placed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'];
                            const activeIdx = statuses.indexOf(order.orderStatus);
                            const currentStepIdx = idx;
                            const isCompleted = currentStepIdx <= activeIdx;
                            return (
                              <div key={idx} className="space-y-1">
                                <div className={isCompleted ? 'text-emerald-600' : 'text-slate-300'}>
                                  {step.icon}
                                </div>
                                <span className={isCompleted ? 'text-slate-800 font-extrabold' : 'text-slate-300'}>{step.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="text-slate-600 font-light">{item.name} x {item.quantity}</span>
                            <span className="font-semibold text-slate-800">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 justify-end pt-2">
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all text-xs"
                        >
                          Reorder Items
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLINIC APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 text-xs">
              <h2 className="font-display font-bold text-slate-950 text-base border-b border-slate-50 pb-3">My Scheduled Clinical Consultations</h2>
              {appointments.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p>No clinics booked yet.</p>
                  <button onClick={() => setView('appointment')} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded font-bold">Book Slot</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 space-y-3">
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-50">
                        <span className="font-bold text-slate-800">{apt.doctorName}</span>
                        <span className="bg-emerald-50 text-emerald-700 font-bold text-[9px] px-2.5 py-0.5 rounded">{apt.status}</span>
                      </div>
                      <div className="space-y-1 text-slate-500 font-light">
                        <p className="font-bold text-slate-800">{apt.clinicName}</p>
                        <p className="flex items-center gap-1 text-slate-800"><Clock className="h-3.5 w-3.5 text-slate-400" /> {apt.date} @ {apt.timeSlot}</p>
                        <p>Pet: <strong className="font-semibold text-slate-800">{apt.petName}</strong> ({apt.petType})</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6 text-xs">
              <h2 className="font-display font-bold text-slate-950 text-base border-b border-slate-50 pb-3">My Saved Pet Supplies</h2>
              
              {wishlistProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p>Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map(prod => (
                    <div key={prod.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/20 items-center justify-between group">
                      <div className="flex gap-3 items-center overflow-hidden">
                        <img src={prod.image} alt={prod.name} className="h-12 w-12 object-cover rounded-lg border shadow-sm shrink-0" />
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-slate-800 truncate leading-snug">{prod.name}</h4>
                          <p className="font-bold text-emerald-800">₹{prod.price}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => addToCart(prod)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg border"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <h2 className="font-display font-bold text-slate-950 text-base">Mysore Logistics Addresses</h2>
                <button
                  onClick={() => setAddAddressMode(!addAddressMode)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-lg font-bold flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> New Address
                </button>
              </div>

              {addAddressMode && (
                <form onSubmit={handleAddAddressSubmit} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h3 className="font-bold text-slate-800">Add Mysore Delivery Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Street / Flat *</label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-2 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Landmark</label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 outline-none"
                      />
                    </div>
                  </div>

                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded font-bold">Save Address</button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800">{addr.fullName} {addr.isDefault && <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[8px] px-1.5 py-0.5 rounded ml-1.5 uppercase">Default</span>}</p>
                      <p className="text-slate-500 font-light">{addr.addressLine1}, {addr.addressLine2}</p>
                      <p className="font-semibold text-slate-800">PIN Code: {addr.pinCode}</p>
                      <p className="text-slate-400 font-light">Phone: {addr.phone}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE EDIT */}
          {activeTab === 'profile' && (
            <div className="space-y-6 text-xs">
              <h2 className="font-display font-bold text-slate-950 text-base border-b border-slate-50 pb-3">Update Profile Details</h2>
              <div className="max-w-md space-y-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Parent Name</label>
                  <input type="text" defaultValue={user.fullName} className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 outline-none font-semibold text-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Email Address</label>
                  <input type="email" defaultValue={user.email} className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 outline-none font-semibold text-slate-800" />
                </div>
                <button onClick={() => alert('Profile credentials updated on server!')} className="px-5 py-2.5 bg-slate-900 text-white rounded font-bold">Update Profile</button>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS & ALERTS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
              <h2 className="font-display font-bold text-slate-950 text-base border-b border-slate-50 pb-3">Notifications & Alerts Settings</h2>
              <div className="space-y-4 max-w-md">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600 accent-emerald-600 h-4 w-4" />
                  <div>
                    <span className="font-bold block text-slate-800">WhatsApp Delivery Progress Alerts</span>
                    <span className="text-[10px] text-slate-400 font-light">Receive real-time progress updates on shipping.</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600 accent-emerald-600 h-4 w-4" />
                  <div>
                    <span className="font-bold block text-slate-800">Clinical Booking Reminders</span>
                    <span className="text-[10px] text-slate-400 font-light">Remind me via WhatsApp 2 hours before the veterinary visit.</span>
                  </div>
                </label>
                <button onClick={() => alert('Alert settings updated on server!')} className="px-5 py-2.5 bg-slate-900 text-white rounded font-bold">Update Alerts</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
