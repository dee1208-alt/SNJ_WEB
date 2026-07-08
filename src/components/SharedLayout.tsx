/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  Settings, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  RefreshCw,
  HeartCrack,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, User } from '../types';

interface SharedLayoutProps {
  currentView: string;
  setView: (view: string, productId?: string) => void;
  cartCount: number;
  wishlistCount: number;
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function SharedLayout({
  currentView,
  setView,
  cartCount,
  wishlistCount,
  user,
  onLogout,
  children
}: SharedLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Shop', view: 'shop' },
    { label: 'Book Appointment', view: 'appointment' },
    { label: 'Partner With Us', view: 'partner' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans">
      {/* Exclusive Mysore Banner Alert */}
      <div className="bg-emerald-950 text-emerald-300 py-2.5 px-4 text-xs font-medium tracking-wide text-center flex items-center justify-center gap-2 border-b border-emerald-900/40">
        <MapPin className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
        <span>Currently serving <strong>exclusively across Mysore, Karnataka</strong>. Verified veterinary clinic appointments & doorstep delivery.</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-900/5 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setView('home')}
            >
              <div className="flex flex-col">
                <span className="font-sans font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                  Sanjeevini
                  <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 mt-1 leading-none">
                  Premium Petcare • Mysore
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = currentView === item.view || (item.view === 'shop' && ['product-detail', 'cart', 'checkout'].includes(currentView));
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      setView(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'text-emerald-600 font-semibold' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Wishlist */}
              <button 
                onClick={() => setView('account')} 
                className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-600 hover:text-red-500 group"
                title="Wishlist"
              >
                <Heart className="h-5.5 w-5.5 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag */}
              <button 
                onClick={() => setView('cart')} 
                className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-600 hover:text-emerald-600 group"
                title="Shopping Cart"
              >
                <ShoppingBag className="h-5.5 w-5.5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center shadow-sm animate-fade-in">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Acccount Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-700"
                >
                  <UserIcon className="h-5 w-5 text-slate-500" />
                  <span className="text-xs font-semibold max-w-[100px] truncate">
                    {user ? user.fullName.split(' ')[0] : 'Sign In'}
                  </span>
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2.5 w-60 bg-white rounded-xl shadow-xl border border-slate-100 z-40 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                          <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">{user?.fullName || 'Demo Parent'}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email || 'petparent@mysore.com'}</p>
                        </div>
                        
                        <button
                          onClick={() => {
                            setView('account');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors flex items-center gap-2"
                        >
                          <UserIcon className="h-4 w-4" />
                          My Account Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            setView('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors flex items-center gap-2 border-t border-slate-100"
                        >
                          <Settings className="h-4 w-4 text-emerald-600" />
                          Sanjeevini Admin Hub
                        </button>

                        <div className="border-t border-slate-100 my-1"></div>
                        <button
                          onClick={() => {
                            onLogout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <HeartCrack className="h-4 w-4" />
                          Log Out Demo User
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Actions and Burger */}
            <div className="flex md:hidden items-center gap-3">
              <button 
                onClick={() => setView('cart')} 
                className="relative p-2 hover:bg-slate-100 rounded-lg text-slate-600"
              >
                <ShoppingBag className="h-5.5 w-5.5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-emerald-600 text-white font-bold text-[8px] h-4 w-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        setView(item.view);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
                <div className="border-t border-slate-100 my-2"></div>
                <button
                  onClick={() => {
                    setView('account');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <UserIcon className="h-4.5 w-4.5 text-slate-400" />
                  My Account Profile & Wishlist
                </button>
                <button
                  onClick={() => {
                    setView('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 flex items-center gap-2"
                >
                  <Settings className="h-4.5 w-4.5 text-emerald-600" />
                  Sanjeevini Admin Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Bottom Sticky CTA for Quick Access in Mysore */}
      <div className="bg-white border-t border-slate-100 py-3 px-4 shadow-md sticky bottom-0 z-30 md:hidden flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">Mysore Veterinary Help</span>
          <span className="text-xs font-semibold text-slate-800">Need immediate booking?</span>
        </div>
        <button
          onClick={() => setView('appointment')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm transition-colors active:scale-95"
        >
          Book Appointment
        </button>
      </div>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Column 1: Brand & Mysore Focus */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center font-display font-bold">
                  S
                </div>
                <span className="font-display font-bold text-xl tracking-tight text-white">
                  SANJEEVINI
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Premium veterinary healthcare and pet supplies platform. Operating exclusively across the royal city of Mysore to deliver unmatched medical and supply convenience for pets.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider bg-slate-800/60 py-2 px-3 rounded-lg w-fit border border-slate-700/50">
                <MapPin className="h-3.5 w-3.5" />
                Mysore Hub Only
              </div>
            </div>

            {/* Column 2: Browse Links */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Navigation</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button onClick={() => setView('home')} className="hover:text-emerald-400 transition-colors">Home</button>
                </li>
                <li>
                  <button onClick={() => setView('shop')} className="hover:text-emerald-400 transition-colors">Shop All Products</button>
                </li>
                <li>
                  <button onClick={() => setView('appointment')} className="hover:text-emerald-400 transition-colors">Book Veterinary Appointment</button>
                </li>
                <li>
                  <button onClick={() => setView('partner')} className="hover:text-emerald-400 transition-colors">Join as Partner</button>
                </li>
                <li>
                  <button onClick={() => setView('contact')} className="hover:text-emerald-400 transition-colors">Contact Support</button>
                </li>
              </ul>
            </div>

            {/* Column 3: Trust & Policies */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Trust & Policies</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <button onClick={() => setView('privacy')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Privacy Policy</button>
                </li>
                <li>
                  <button onClick={() => setView('terms')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Terms & Conditions</button>
                </li>
                <li>
                  <button onClick={() => setView('refund')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Refund Policy</button>
                </li>
                <li>
                  <button onClick={() => setView('faqs')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions</button>
                </li>
              </ul>
            </div>

            {/* Column 4: Location Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Mysore HQ</h3>
              <div className="text-sm space-y-3">
                <div className="flex gap-2.5 items-start">
                  <MapPin className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-slate-400 leading-relaxed">
                    Sanjeevini Premium Vet Hub,<br />
                    Contour Road, Gokulam 3rd Stage,<br />
                    Mysore, Karnataka - 570002
                  </p>
                </div>
                <div className="flex gap-2.5 items-center">
                  <Phone className="h-4.5 w-4.5 text-emerald-500" />
                  <span className="text-slate-400">+91 821 2415901</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <p>© {new Date().getFullYear()} Sanjeevini Pet Healthcare Platform. All rights reserved.</p>
              <p className="mt-1">Regulated veterinary pharmacy and booking facilitation operating solely within Mysore, Karnataka.</p>
            </div>
            <div className="flex gap-6">
              <span className="hover:text-slate-300 transition-colors">Verified Doctors</span>
              <span className="hover:text-slate-300 transition-colors">Doorstep Delivery</span>
              <span className="hover:text-slate-300 transition-colors">100% Genuine Supplies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
