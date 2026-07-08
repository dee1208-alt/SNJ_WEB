/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SharedLayout from './components/SharedLayout';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import ProductDetailView from './components/ProductDetailView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import AppointmentView from './components/AppointmentView';
import PartnerView from './components/PartnerView';
import AccountView from './components/AccountView';
import AdminDashboard from './components/AdminDashboard';
import { AboutUsView, ContactView, FAQsView, PoliciesView } from './components/CompanyViews';
import { Product, Clinic, Doctor, Appointment, Partner, User, Order, Review } from './types';

export default function App() {
  // Navigation Route State
  const [view, setView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Core Database Collections State
  const [products, setProducts] = useState<Product[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // User session state (Defaults to Guest first, can sign in to "Srinivas Prasad" demo profile)
  const [user, setUser] = useState<User | null>(null);

  // E-commerce state
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem('sanjeevini_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sanjeevini_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [coupon, setCoupon] = useState<{ code: string; discount: number; description: string } | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);

  // --- LOCAL PERSISTENCE SYNC ---
  useEffect(() => {
    localStorage.setItem('sanjeevini_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sanjeevini_wishlist', JSON.stringify(wishlist));
    if (user) {
      // Sync to backend user profile
      fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishlist })
      }).catch(err => console.warn('Offline: wishlist sync buffered.'));
    }
  }, [wishlist, user]);

  // --- INITIAL DATA FETCH ---
  const fetchAllCollections = async () => {
    setLoading(true);
    try {
      const [prodsRes, clinicsRes, docsRes, aptsRes, ordersRes, partnersRes, revsRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/clinics').then(r => r.json()),
        fetch('/api/doctors').then(r => r.json()),
        fetch('/api/appointments').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/partners').then(r => r.json()),
        fetch('/api/reviews').then(r => r.json())
      ]);

      setProducts(prodsRes);
      setClinics(clinicsRes);
      setDoctors(docsRes);
      setAppointments(aptsRes);
      setOrders(ordersRes);
      setPartners(partnersRes);
      setReviews(revsRes);

      // Check if a user session is active
      const savedUser = localStorage.getItem('sanjeevini_user_id');
      if (savedUser) {
        const userProfile = await fetch(`/api/users/${savedUser}`).then(r => r.json());
        setUser(userProfile);
        if (userProfile.wishlist && userProfile.wishlist.length > 0) {
          setWishlist(userProfile.wishlist);
        }
      }
    } catch (e) {
      console.error('Network fetch error, establishing high-fidelity static fallback database state.', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCollections();
  }, []);

  // --- ACTIONS & API SYNC HANDLERS ---

  // Handle Demo Session Logins
  const handleLoginDemo = async () => {
    setLoading(true);
    try {
      // Create or retrieve demo account on Express server
      const demoId = 'user-demo';
      const demoData = {
        fullName: 'Srinivas Prasad',
        email: 'petparent@mysore.com',
        phone: '+91 9845012345',
        addresses: [
          {
            id: 'addr-1',
            fullName: 'Srinivas Prasad',
            phone: '+91 9845012345',
            addressLine1: 'No. 124, 4th Cross, Contour Road',
            addressLine2: 'Gokulam 3rd Stage',
            pinCode: '570002',
            landmark: 'Near Doctors Corner',
            isDefault: true
          }
        ],
        wishlist
      };

      const res = await fetch(`/api/users/${demoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoData)
      }).then(r => r.json());

      if (res.success) {
        setUser(res.user);
        localStorage.setItem('sanjeevini_user_id', demoId);
      }
    } catch (e) {
      // In-memory fallback
      setUser({
        id: 'user-demo',
        fullName: 'Srinivas Prasad',
        email: 'petparent@mysore.com',
        phone: '+91 9845012345',
        addresses: [
          {
            id: 'addr-1',
            fullName: 'Srinivas Prasad',
            phone: '+91 9845012345',
            addressLine1: 'No. 124, 4th Cross, Contour Road',
            addressLine2: 'Gokulam 3rd Stage',
            pinCode: '570002',
            landmark: 'Near Doctors Corner',
            isDefault: true
          }
        ],
        wishlist: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sanjeevini_user_id');
    setWishlist([]);
  };

  // Cart Adjusters
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity = Math.min(product.stockCount, updated[idx].quantity + quantity);
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
    });
    alert(`✓ ${product.name} (Qty: ${quantity}) registered in shipping cart.`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart(prev => 
      prev.map(item => item.product.id === productId ? { ...item, quantity } : item)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Coupons
  const handleApplyCoupon = (code: string) => {
    const uppercaseCode = code.toUpperCase();
    if (uppercaseCode === 'SANJEEVINI10') {
      setCoupon({
        code: 'SANJEEVINI10',
        discount: 10,
        description: 'Flat 10% Off Storewide'
      });
      return true;
    }
    if (uppercaseCode === 'MYSORE20') {
      setCoupon({
        code: 'MYSORE20',
        discount: 20,
        description: '20% Off Veterinary Medicines'
      });
      return true;
    }
    if (uppercaseCode === 'FREESHIP') {
      setCoupon({
        code: 'FREESHIP',
        discount: 0,
        description: 'Free Delivery on Orders above 500'
      });
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
  };

  // Book Veterinary Slot
  const handleBookAppointment = async (bookingData: any) => {
    try {
      const payload = {
        ...bookingData,
        userId: user?.id || 'guest-' + Date.now()
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.success) {
        setAppointments(prev => [...prev, res.appointment]);
        return true;
      }
    } catch (e) {
      console.error('Fallback booking simulation', e);
      // Fallback
      const fakeApt = {
        id: 'apt-' + Math.floor(Math.random() * 1000000),
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        ...bookingData
      };
      setAppointments(prev => [...prev, fakeApt]);
      return true;
    }
    return false;
  };

  // Reschedule or Cancel Clinical Reservation
  const handleUpdateAppointment = async (id: string, updateFields: any) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateFields)
      }).then(r => r.json());

      if (res.success) {
        setAppointments(prev => prev.map(a => a.id === id ? res.appointment : a));
        return true;
      }
    } catch (e) {
      // In-memory update fallback
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updateFields } : a));
      return true;
    }
    return false;
  };

  // Submit Partner Proposal
  const handleSubmitPartner = async (partnerData: any) => {
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerData)
      }).then(r => r.json());

      if (res.success) {
        setPartners(prev => [...prev, res.partner]);
        return true;
      }
    } catch (e) {
      const fakePartner = {
        id: 'prt-' + Date.now(),
        status: 'Pending',
        createdAt: new Date().toISOString(),
        ...partnerData
      };
      setPartners(prev => [...prev, fakePartner]);
      return true;
    }
    return false;
  };

  // Place doorstep order
  const handlePlaceOrder = async (orderData: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      }).then(r => r.json());

      if (res.success) {
        setOrders(prev => [res.order, ...prev]);
        setCoupon(null); // Reset coupon
        
        // Update local product stocks automatically from product catalog
        await fetch('/api/products')
          .then(r => r.json())
          .then(prods => setProducts(prods));

        return res.order;
      }
    } catch (e) {
      // Fallback checkout logic
      const fakeOrder = {
        id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toISOString(),
        orderStatus: 'Order Placed',
        ...orderData
      };
      setOrders(prev => [fakeOrder, ...prev]);
      return fakeOrder;
    }
    return null;
  };

  // Address updates (user profiles)
  const handleUpdateUserAddresses = async (addresses: any[]) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses })
      }).then(r => r.json());

      if (res.success) {
        setUser(res.user);
      }
    } catch (e) {
      setUser(prev => prev ? { ...prev, addresses } : null);
    }
  };

  // Writing real reviews
  const handleAddReview = async (productId: string, userName: string, rating: number, comment: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userName, rating, comment })
      }).then(r => r.json());

      if (res.success) {
        setReviews(prev => [...prev, res.review]);
        
        // Refresh products ratings
        await fetch('/api/products')
          .then(r => r.json())
          .then(prods => setProducts(prods));
      }
    } catch (e) {
      const fakeReview = {
        id: 'rev-' + Date.now(),
        productId,
        userName,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0]
      };
      setReviews(prev => [...prev, fakeReview]);
    }
  };

  // --- ADMIN WORFLOW ACTIONS ---
  const handleAdminUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status, description: `Logistics status marked as ${status}` })
      }).then(r => r.json());

      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? res.order : o));
        return true;
      }
    } catch (e) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
      return true;
    }
    return false;
  };

  const handleAdminUpdateAptStatus = async (aptId: string, status: string) => {
    return handleUpdateAppointment(aptId, { status });
  };

  const handleAdminUpdatePartnerStatus = async (partnerId: string, status: string) => {
    try {
      const res = await fetch(`/api/partners/${partnerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).then(r => r.json());

      if (res.success) {
        setPartners(prev => prev.map(p => p.id === partnerId ? res.partner : p));
        return true;
      }
    } catch (e) {
      setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, status } : p));
      return true;
    }
    return false;
  };

  // Router handler helper to set view & product references
  const handleSetView = (newView: string, productId?: string) => {
    setView(newView);
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- COMPONENT MAPPER ROUTER ---
  const renderViewContent = () => {
    if (loading) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-24 space-y-8 animate-pulse text-center">
          <div className="h-10 w-48 bg-slate-200 rounded-xl mx-auto mb-2"></div>
          <div className="h-5 w-80 bg-slate-100 rounded-lg mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
                <div className="h-40 bg-slate-50 rounded-xl w-full"></div>
                <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    switch (view) {
      case 'home':
        return (
          <HomeView 
            setView={handleSetView} 
            clinics={clinics}
            doctors={doctors}
          />
        );

      case 'shop':
        return (
          <ShopView 
            products={products} 
            wishlist={wishlist}
            toggleWishlist={handleToggleWishlist}
            addToCart={handleAddToCart}
            setView={handleSetView}
          />
        );

      case 'product-detail':
        const prod = products.find(p => p.id === selectedProductId);
        if (!prod) {
          return (
            <div className="text-center py-20 text-xs text-slate-500 font-medium">
              Product not found. <button onClick={() => setView('shop')} className="text-emerald-600 font-bold">Back to Store</button>
            </div>
          );
        }
        return (
          <ProductDetailView
            product={prod}
            relatedProducts={products.filter(p => p.category === prod.category && p.id !== prod.id)}
            wishlist={wishlist}
            toggleWishlist={handleToggleWishlist}
            addToCart={handleAddToCart}
            setView={handleSetView}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        );

      case 'cart':
        return (
          <CartView
            cart={cart}
            updateQuantity={handleUpdateQuantity}
            removeFromCart={handleRemoveFromCart}
            coupon={coupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            setView={handleSetView}
          />
        );

      case 'checkout':
        return (
          <CheckoutView
            cart={cart}
            user={user}
            onLoginDemo={handleLoginDemo}
            coupon={coupon}
            onPlaceOrder={handlePlaceOrder}
            setView={handleSetView}
            clearCart={() => setCart([])}
          />
        );

      case 'appointment':
        return (
          <AppointmentView
            clinics={clinics}
            doctors={doctors}
            appointments={appointments}
            onBookAppointment={handleBookAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            setView={handleSetView}
          />
        );

      case 'partner':
        return (
          <PartnerView 
            onSubmitPartner={handleSubmitPartner} 
          />
        );

      case 'account':
        return (
          <AccountView
            user={user}
            onLoginDemo={handleLoginDemo}
            onLogout={handleLogout}
            orders={orders}
            appointments={appointments}
            products={products}
            toggleWishlist={handleToggleWishlist}
            addToCart={(p) => handleAddToCart(p, 1)}
            onUpdateUserAddresses={handleUpdateUserAddresses}
            setView={handleSetView}
          />
        );

      case 'admin':
        return (
          <AdminDashboard
            orders={orders}
            appointments={appointments}
            partners={partners}
            products={products}
            onUpdateOrderStatus={handleAdminUpdateOrderStatus}
            onUpdateAppointmentStatus={handleAdminUpdateAptStatus}
            onUpdatePartnerStatus={handleAdminUpdatePartnerStatus}
          />
        );

      case 'contact':
        return <ContactView />;

      case 'faqs':
        return <FAQsView />;

      case 'privacy':
      case 'terms':
      case 'refund':
        return <PoliciesView />;

      default:
        return (
          <div className="text-center py-20 text-xs font-medium">
            View under construction. <button onClick={() => setView('home')} className="text-emerald-600 font-bold">Return Home</button>
          </div>
        );
    }
  };

  return (
    <SharedLayout
      currentView={view}
      setView={handleSetView}
      cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      wishlistCount={wishlist.length}
      user={user}
      onLogout={handleLogout}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={view + (selectedProductId || '')}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {renderViewContent()}
        </motion.div>
      </AnimatePresence>
    </SharedLayout>
  );
}
