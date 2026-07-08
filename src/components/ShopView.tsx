/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Heart, 
  ShoppingCart, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Sparkles,
  Info,
  Scale,
  RefreshCw,
  X,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface ShopViewProps {
  products: Product[];
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  addToCart: (product: Product, qty?: number) => void;
  setView: (view: string, productId?: string) => void;
}

export default function ShopView({
  products,
  wishlist,
  toggleWishlist,
  addToCart,
  setView
}: ShopViewProps) {
  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(3500);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<string>('popular'); // popular, low-high, high-low, rating

  // Product Comparison state
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);

  // Recently Viewed state
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sanjeevini_recently_viewed');
      if (saved && products.length > 0) {
        const ids: string[] = JSON.parse(saved);
        const filtered = ids
          .map(id => products.find(p => p.id === id))
          .filter((p): p is Product => !!p);
        setRecentlyViewed(filtered.slice(0, 4));
      }
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Categories list derived from products plus standard list
  const categories = useMemo(() => {
    const list = new Set(products.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesPrice = p.price <= priceRange;
        const matchesStock = !onlyInStock || p.inventoryStatus !== 'Out of Stock';
        return matchesSearch && matchesCategory && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'low-high') return a.price - b.price;
        if (sortBy === 'high-low') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewsCount - a.reviewsCount; // popular
      });
  }, [products, searchQuery, selectedCategory, priceRange, onlyInStock, sortBy]);

  // Handle viewing product detail
  const handleViewProduct = (prod: Product) => {
    // Add to recently viewed
    try {
      const saved = localStorage.getItem('sanjeevini_recently_viewed');
      let ids: string[] = saved ? JSON.parse(saved) : [];
      ids = [prod.id, ...ids.filter(id => id !== prod.id)].slice(0, 6);
      localStorage.setItem('sanjeevini_recently_viewed', JSON.stringify(ids));
    } catch (e) {
      console.error(e);
    }
    setView('product-detail', prod.id);
  };

  // Toggle comparison item
  const handleToggleCompare = (prod: Product) => {
    if (compareList.some(p => p.id === prod.id)) {
      setCompareList(compareList.filter(p => p.id !== prod.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 products side-by-side.');
        return;
      }
      setCompareList([...compareList, prod]);
      setCompareDrawerOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner Area */}
      <div className="bg-[#F8FAFC] border border-slate-900/5 rounded-2xl text-slate-800 p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl pointer-events-none opacity-60" />
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[10px] bg-emerald-100 px-3 py-1 rounded-full text-emerald-800 font-semibold tracking-wider uppercase">
            Mysore Delivery Node
          </span>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900">Premium Pet Supplies Store</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
            Sourced directly from verified brands and pharmacy suppliers. Fast courier delivery across all Mysore neighborhoods. Enter coupons at checkout for flat savings!
          </p>
        </div>
      </div>

      {/* Control Panel: Search & Quick Sorting */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search medications, foods, leashes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-sm text-slate-800 outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold outline-none cursor-pointer text-slate-800"
            >
              <option value="popular">Popularity</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Storefront */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Filters (Desktop) */}
        <aside className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-100 space-y-6 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <SlidersHorizontal className="h-4.5 w-4.5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Filter Products</h3>
          </div>

          {/* Categories list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</h4>
            <div className="flex flex-col gap-1 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-2 rounded-lg text-xs transition-colors font-medium ${
                    selectedCategory === cat 
                      ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-widest">Max Price</span>
              <span className="font-semibold text-emerald-700">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="100"
              max="3500"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>₹100</span>
              <span>₹3,500</span>
            </div>
          </div>

          {/* Availability checkbox */}
          <div className="pt-2 border-t border-slate-50">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 accent-emerald-600"
              />
              <span className="font-medium">Hide Out of Stock Items</span>
            </label>
          </div>
        </aside>

        {/* Right Side Products Grid */}
        <section className="lg:col-span-9 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4">
              <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No Products Found</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                We couldn't find any products matching "{searchQuery}" under the selected filter criteria. Try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setPriceRange(3500);
                  setOnlyInStock(false);
                }}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                const isWishlisted = wishlist.includes(prod.id);
                const isCompared = compareList.some(p => p.id === prod.id);
                return (
                  <div 
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group relative"
                  >
                    {/* Top badging */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                      {prod.inventoryStatus === 'Out of Stock' ? (
                        <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <XCircle className="h-3 w-3" /> Out of Stock
                        </span>
                      ) : prod.inventoryStatus === 'Low Stock' ? (
                        <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <AlertTriangle className="h-3 w-3" /> Low Stock ({prod.stockCount})
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <CheckCircle className="h-3 w-3" /> In Stock
                        </span>
                      )}
                    </div>

                    {/* Quick wishlist action */}
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className={`absolute top-3 right-3 z-10 p-2 rounded-full border shadow-sm transition-all ${
                        isWishlisted 
                          ? 'bg-red-50 border-red-100 text-red-500 scale-105' 
                          : 'bg-white/90 backdrop-blur-md border-slate-100 text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                    </button>

                    {/* Product Image Area */}
                    <div 
                      className="h-48 overflow-hidden relative cursor-pointer bg-slate-50"
                      onClick={() => handleViewProduct(prod)}
                    >
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {prod.category}
                        </span>
                        <h3 
                          onClick={() => handleViewProduct(prod)}
                          className="font-bold text-slate-800 text-sm leading-snug hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2"
                        >
                          {prod.name}
                        </h3>
                        
                        {/* Rating row */}
                        <div className="flex items-center gap-1">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, idx) => (
                              <svg key={idx} className={`h-3 w-3 ${idx < Math.floor(prod.rating) ? 'fill-amber-400' : 'fill-slate-100'} stroke-current`} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.58 1.819l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.78-.573-.38-1.819.58-1.819h4.908a1 1 0 00.95-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">{prod.rating} ({prod.reviewsCount})</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-50">
                        {/* Pricing and Comparison Button */}
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-slate-900 font-display">₹{prod.price}</span>
                            {prod.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">₹{prod.originalPrice}</span>
                            )}
                          </div>
                          
                          {/* Add to Compare */}
                          <button
                            onClick={() => handleToggleCompare(prod)}
                            className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border transition-colors ${
                              isCompared 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                            }`}
                          >
                            <Scale className="h-3 w-3" />
                            {isCompared ? 'Compared' : 'Compare'}
                          </button>
                        </div>

                        {/* Card Buttons */}
                        <div className="grid grid-cols-5 gap-2 mt-4">
                          <button
                            onClick={() => handleViewProduct(prod)}
                            className="col-span-2 bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-700 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border border-slate-100 transition-colors"
                            title="Quick View"
                          >
                            <Eye className="h-4 w-4 text-slate-500" />
                            View
                          </button>
                          <button
                            disabled={prod.inventoryStatus === 'Out of Stock'}
                            onClick={() => addToCart(prod, 1)}
                            className={`col-span-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95 ${
                              prod.inventoryStatus === 'Out of Stock'
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow shadow-emerald-600/15'
                            }`}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Recommended Category Spot */}
      <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h3 className="font-display font-bold text-lg text-slate-900">Recommended For You</h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Top Mysore Picks</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.slice(0, 4).map((prod) => (
            <div 
              key={`rec-${prod.id}`}
              onClick={() => handleViewProduct(prod)}
              className="bg-white p-4 rounded-xl border border-slate-100 hover:border-emerald-100 cursor-pointer transition-all flex items-center gap-4 group"
            >
              <img src={prod.image} alt={prod.name} className="h-14 w-14 object-cover rounded-lg group-hover:scale-105 transition-transform" />
              <div className="space-y-1 overflow-hidden">
                <h4 className="text-xs font-bold text-slate-800 truncate leading-snug group-hover:text-emerald-600 transition-colors">{prod.name}</h4>
                <p className="text-xs font-bold text-slate-900">₹{prod.price}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span>{prod.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Viewed Shelf (Conditionally rendered) */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-emerald-600 animate-spin-slow" />
            <h3 className="font-display font-bold text-lg text-slate-900">Recently Viewed</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((prod) => (
              <div 
                key={`rv-${prod.id}`}
                onClick={() => handleViewProduct(prod)}
                className="bg-white p-4 rounded-xl border border-slate-100 hover:border-slate-200 cursor-pointer transition-all flex items-center gap-4 group"
              >
                <img src={prod.image} alt={prod.name} className="h-14 w-14 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                <div className="space-y-0.5 overflow-hidden">
                  <h4 className="text-xs font-semibold text-slate-700 truncate">{prod.name}</h4>
                  <p className="text-xs font-bold text-slate-900">₹{prod.price}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Serviced in Mysore</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Comparison Drawer Overlay (Staggered UI) */}
      <AnimatePresence>
        {compareDrawerOpen && compareList.length > 0 && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 150 }}
            className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 shadow-2xl z-50 rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Scale className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">Product Comparison Matrix</h3>
                  <p className="text-slate-500 text-xs font-light">Analyzing {compareList.length} products side-by-side (Max 3)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCompareList([])}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setCompareDrawerOpen(false)}
                  className="p-2 bg-slate-200/60 hover:bg-slate-200 rounded-full text-slate-600 hover:text-slate-800 transition-all"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto p-6 flex-grow">
              <table className="w-full text-left border-collapse min-w-[600px] text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 font-bold text-slate-400 uppercase tracking-widest w-1/4">Specification</th>
                    {compareList.map(p => (
                      <th key={p.id} className="py-4 px-6 w-1/4">
                        <div className="space-y-2 flex flex-col items-start">
                          <img src={p.image} alt={p.name} className="h-16 w-16 object-cover rounded-lg border border-slate-100 shadow-sm" />
                          <h4 className="font-bold text-slate-800 line-clamp-1 leading-snug">{p.name}</h4>
                          <span className="text-emerald-700 font-bold">₹{p.price}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="py-3.5 font-bold text-slate-500">Category</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-3.5 px-6 font-medium text-slate-700">{p.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 font-bold text-slate-500">Rating</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-3.5 px-6 text-slate-700 font-semibold">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span>{p.rating} ({p.reviewsCount} reviews)</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 font-bold text-slate-500">Availability</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-3.5 px-6">
                        <span className={`font-semibold ${p.inventoryStatus === 'In Stock' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {p.inventoryStatus}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 font-bold text-slate-500">Delivery Est.</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-3.5 px-6 text-slate-700 font-medium">Within {p.deliveryDaysEstimate} Day</td>
                    ))}
                  </tr>
                  {/* Dynamic specs rows based on aggregated spec keys */}
                  {['Brand', 'Weight', 'Suitable For', 'Life Stage', 'Form'].map(specKey => (
                    <tr key={specKey}>
                      <td className="py-3.5 font-bold text-slate-500">{specKey}</td>
                      {compareList.map(p => (
                        <td key={p.id} className="py-3.5 px-6 text-slate-600">
                          {p.specifications[specKey] || p.specifications[specKey.toLowerCase()] || 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4 font-bold text-slate-500">Actions</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(p, 1)}
                            disabled={p.inventoryStatus === 'Out of Stock'}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-sm disabled:bg-slate-100 disabled:text-slate-400 active:scale-95 transition-all"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleToggleCompare(p)}
                            className="text-slate-400 hover:text-red-500 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
