/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Truck, 
  Calendar, 
  Star, 
  Share2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  FileText,
  Bookmark,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Review } from '../types';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  addToCart: (product: Product, qty: number) => void;
  setView: (view: string, productId?: string) => void;
  reviews: Review[];
  onAddReview: (productId: string, userName: string, rating: number, comment: string) => void;
}

export default function ProductDetailView({
  product,
  relatedProducts,
  wishlist,
  toggleWishlist,
  addToCart,
  setView,
  reviews,
  onAddReview
}: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  
  // Mysore PIN Code checker state
  const [pinCode, setPinCode] = useState('');
  const [pinStatus, setPinStatus] = useState<{ status: 'valid' | 'invalid' | 'none'; message: string }>({ status: 'none', message: '' });

  // Review form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  // Validate Mysore Pins
  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinCode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPinStatus({ status: 'invalid', message: 'Please enter a valid 6-digit PIN code.' });
      return;
    }

    // Mysore Pin codes start with 570
    if (cleanPin.startsWith('570')) {
      let area = 'Mysore Central Node';
      let estimate = 'Dispatches in 3 hours. Delivers by tonight!';
      
      if (cleanPin === '570002') {
        area = 'Gokulam / Contour Road Node';
        estimate = 'Immediate cold-chain routing. Delivers in 2 hours!';
      } else if (cleanPin === '570023') {
        area = 'Kuvempunagar / Double Road Node';
        estimate = 'Dispatches from local hub. Delivers in 4 hours!';
      } else if (cleanPin === '570017') {
        area = 'Vijayanagar Node';
        estimate = 'Dispatches from local hub. Delivers in 4 hours!';
      }

      setPinStatus({ 
        status: 'valid', 
        message: `✓ Currently serving ${area}. ${estimate}` 
      });
    } else {
      setPinStatus({ 
        status: 'invalid', 
        message: '⚠ Sanjeevini currently operates EXCLUSIVELY in Mysore, Karnataka. This PIN code is outside our active delivery radius.' 
      });
    }
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      alert('Sanjeevini link copied to clipboard! Share it with local pet parents in Mysore.');
    } catch (e) {
      alert('https://sanjeevini.mysore.pet/supplies/' + product.id);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) {
      alert('Please fill out all fields to submit your review.');
      return;
    }
    onAddReview(product.id, reviewerName, reviewRating, reviewComment);
    setReviewerName('');
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const productReviews = useMemo(() => {
    return reviews.filter(r => r.productId === product.id);
  }, [reviews, product.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back button link */}
      <div>
        <button
          onClick={() => setView('shop')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors bg-white px-3.5 py-2 rounded-lg border border-slate-100 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop Catalog
        </button>
      </div>

      {/* Main product card column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm items-start">
        {/* Gallery column (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              {product.inventoryStatus === 'In Stock' ? (
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> In Stock
                </span>
              ) : (
                <span className="bg-amber-500 text-white font-bold text-[10px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Low Stock
                </span>
              )}
            </div>
          </div>

          {/* Mini thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {[product.image, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1541599540903-216a46ca1da0?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=150&q=80'].map((thumb, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(thumb)}
                className={`aspect-square bg-slate-50 rounded-xl overflow-hidden border transition-all ${
                  activeImage === thumb 
                    ? 'border-emerald-600 ring-2 ring-emerald-50' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details column (Right) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-600">
              {product.category} • Mysore Stocked
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
              {product.name}
            </h1>
            
            {/* Rating summary */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'fill-slate-100'} stroke-current`} />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-200">|</span>
              <span className="text-xs text-slate-500 font-medium">{productReviews.length} Verified Customer Reviews</span>
            </div>
          </div>

          {/* Pricing area */}
          <div className="bg-slate-50 p-5 rounded-2xl flex items-center justify-between border border-slate-100/50">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Standard Mysore Retail Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-display">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                100% Genuine Pharmacy Guarantee
              </span>
              <p className="text-[10px] text-slate-400 mt-1.5">No counterfeit guarantee</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed font-light">
            {product.description}
          </p>

          {/* Mysore PIN Delivery check */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mysore Doorstep Delivery Estimator</h4>
            </div>
            <form onSubmit={handleCheckDelivery} className="flex gap-2.5 max-w-sm">
              <input
                type="text"
                placeholder="Enter Mysore PIN (e.g. 570002)"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="flex-grow bg-slate-50 border border-slate-200 rounded-lg text-xs px-3.5 py-2.5 outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 rounded-lg shadow-sm transition-colors"
              >
                Estimate
              </button>
            </form>
            {pinStatus.status !== 'none' && (
              <p className={`text-xs font-semibold ${pinStatus.status === 'valid' ? 'text-emerald-700' : 'text-red-500'}`}>
                {pinStatus.message}
              </p>
            )}
          </div>

          {/* Quantity selector and Cart controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch pt-2 border-t border-slate-50">
            {/* Quantity incrementor */}
            <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3 bg-slate-50 py-2 sm:py-0">
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity(quantity - 1)}
                className="text-slate-500 hover:text-slate-800 disabled:text-slate-300 font-extrabold text-lg px-2"
              >
                -
              </button>
              <span className="text-sm font-bold text-slate-800 px-4 select-none">{quantity}</span>
              <button
                disabled={quantity >= product.stockCount}
                onClick={() => setQuantity(quantity + 1)}
                className="text-slate-500 hover:text-slate-800 font-extrabold text-lg px-2"
              >
                +
              </button>
            </div>

            {/* CTA action buttons */}
            <div className="flex-grow grid grid-cols-5 gap-3">
              <button
                disabled={product.inventoryStatus === 'Out of Stock'}
                onClick={() => addToCart(product, quantity)}
                className={`col-span-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md ${
                  product.inventoryStatus === 'Out of Stock'
                    ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                }`}
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                Add To Shopping Cart
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-center transition-all ${
                  isWishlisted 
                    ? 'bg-red-50 border-red-100 text-red-500 scale-105 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick share visual row */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <button onClick={handleShare} className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
              <Share2 className="h-4 w-4" /> Share Product
            </button>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Bookmark className="h-4 w-4 text-emerald-600" />
              <span>In Stock: {product.stockCount} items ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Spec details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-4">
          <h3 className="font-display font-bold text-slate-900 text-base border-b border-slate-50 pb-2">Technical Specifications</h3>
          <dl className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <React.Fragment key={key}>
                <dt className="text-slate-400 font-medium">{key}</dt>
                <dd className="text-slate-800 font-semibold text-right sm:text-left">{val}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>

        <div className="space-y-4">
          <h3 className="font-display font-bold text-slate-900 text-base border-b border-slate-50 pb-2">Ingredients & Usage</h3>
          <div className="space-y-3 text-xs leading-relaxed">
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Key Formulations / Ingredients:</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded text-slate-600 font-medium">{ing}</span>
                  ))}
                </div>
              </div>
            )}
            {product.directions && (
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Directions For Use:</h4>
                <p className="text-slate-500 font-light leading-relaxed">{product.directions}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
        {/* Reviews Left: Write review */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-slate-900">Write a Premium Review</h3>
            <p className="text-slate-500 text-xs">Your real feedback helps other Mysore pet parents make safer clinical decisions.</p>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Your Name</label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Srinivas Prasad"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3.5 py-2.5 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Rating Stars</label>
              <div className="flex gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`h-6 w-6 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Detailed Comment</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How did this product help your pet?"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3.5 py-2.5 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors active:scale-95"
            >
              Submit Verified Review
            </button>
            {reviewSuccess && (
              <p className="text-xs font-bold text-emerald-600 text-center animate-pulse">✓ Thank you! Review published instantly.</p>
            )}
          </form>
        </div>

        {/* Reviews Right: List reviews */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-50 pb-2">Customer Feedback</h3>
          
          {productReviews.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-xs text-slate-400 font-medium">No reviews for this product yet.</p>
              <p className="text-[10px] text-slate-400">Be the first to share your experience with Mysore pet parents!</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {productReviews.map((rev) => (
                <div key={rev.id} className="space-y-2 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className={`h-3 w-3 ${idx < rev.rating ? 'fill-amber-400' : 'fill-slate-100'} stroke-current`} />
                    ))}
                  </div>
                  <p className="text-xs font-light leading-relaxed text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products row */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-slate-900">Related Pet Essentials</h3>
            <span className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Selected For You</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((prod) => (
              <div 
                key={`rel-${prod.id}`}
                onClick={() => setView('product-detail', prod.id)}
                className="bg-white p-4 rounded-xl border border-slate-100 hover:border-emerald-100 cursor-pointer transition-all flex items-center gap-4 group"
              >
                <img src={prod.image} alt={prod.name} className="h-14 w-14 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                <div className="space-y-0.5 overflow-hidden">
                  <h4 className="text-xs font-semibold text-slate-700 truncate leading-snug group-hover:text-emerald-600 transition-colors">{prod.name}</h4>
                  <p className="text-xs font-bold text-slate-900">₹{prod.price}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Serviced in Mysore</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
