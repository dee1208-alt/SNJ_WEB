/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Calendar, 
  UserCheck, 
  CheckCircle, 
  Heart, 
  ShoppingBag, 
  Star, 
  Award,
  ChevronRight,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { motion } from 'motion/react';
import { Clinic, Doctor } from '../types';

interface HomeViewProps {
  setView: (view: string, productId?: string) => void;
  clinics: Clinic[];
  doctors: Doctor[];
}

export default function HomeView({ setView, clinics, doctors }: HomeViewProps) {
  // Highlight some premium partners
  const premiumClinics = clinics.slice(0, 3);
  const featuredDoctors = doctors.slice(0, 3);

  const productCategories = [
    { name: 'Dog Food', count: '12+ Varieties', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80', searchCat: 'Dog Food' },
    { name: 'Cat Food', count: '8+ Varieties', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', searchCat: 'Cat Food' },
    { name: 'Veterinary Medicines', count: '100% Genuine', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80', searchCat: 'Veterinary Medicines' },
    { name: 'Pet Essentials', count: 'Curated Accessories', image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1da0?auto=format&fit=crop&w=400&q=80', searchCat: 'Pet Essentials' },
  ];

  const steps = [
    {
      icon: <Calendar className="h-6 w-6 text-emerald-600" />,
      title: '1. Book an Appointment',
      desc: 'Browse verified, premium veterinary clinics and qualified doctors in Mysore. Pick a guaranteed date and slot instantly.'
    },
    {
      icon: <Truck className="h-6 w-6 text-emerald-600" />,
      title: '2. Doorstep Logistics',
      desc: 'Order critical veterinary medicines, pet foods, or lifestyle accessories. Enjoy same-day premium delivery directly across Mysore.'
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
      title: '3. Complete Vet Healing',
      desc: 'Visit the clinic with zero queues or receive premium medicines at home, knowing your pet is in the safest local hands.'
    }
  ];

  const faqs = [
    {
      q: 'Does Sanjeevini deliver medicines to all areas of Mysore?',
      a: 'Yes, we deliver genuine veterinary medicines and pet supplies to all main locations in Mysore including Gokulam, Kuvempunagar, Vijayanagar, Devaraj Urs Road, Vidyaranyapuram, Siddartha Layout, J.P. Nagar, and Chamundipuram. Delivery is usually completed within 24 hours.'
    },
    {
      q: 'Are the medicines sold on Sanjeevini certified and genuine?',
      a: 'Absolutely. We partner exclusively with certified, licensed pharmaceutical distributors and leading pet care manufacturers. Every batch of medication undergoes rigorous shelf-life and authenticity tracking before dispatch.'
    },
    {
      q: 'How does clinic booking work? Do I pay online?',
      a: 'You can browse qualified veterinarians, select an open slot, and secure your booking on our portal. You will receive a WhatsApp confirmation immediately. The nominal consultation fee can be paid directly at the clinic.'
    },
    {
      q: 'Can I reschedule or cancel my booked appointment?',
      a: 'Yes! Simply visit your "My Account" page, find your booked slot, and click Reschedule or Cancel. There are no cancellation penalties because we value your flexibility.'
    },
    {
      q: 'Do you offer online video consultations or home vet visits?',
      a: 'No. To maintain the absolute highest standards of veterinary diagnostics, we believe pets must be physically examined in an equipped clinic environment. Thus, we focus exclusively on booking trusted, physical appointments with Mysore\'s premium, fully-equipped veterinary clinics.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Large Premium Hero Section */}
      <section className="relative bg-[#F8FAFC] overflow-hidden py-20 sm:py-24 border-b border-slate-900/5">
        {/* Subtle minimalist background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl pointer-events-none opacity-60" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Currently Serving Mysore, Karnataka</span>
              </div>
              
              <h1 className="font-sans font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-slate-900">
                Everything Your Pet Needs, <br className="hidden sm:inline" />
                <span className="text-emerald-600">Delivered Across Mysore.</span>
              </h1>
              
              <p className="text-slate-500 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Book trusted veterinary appointments and order genuine pet medicines, food, and pet essentials—all from one platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => setView('appointment')}
                  className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold px-8 py-3.5 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4.5 w-4.5" />
                  Book Appointment
                </button>
                <button
                  onClick={() => setView('shop')}
                  className="bg-transparent hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 active:scale-95 font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  Shop Supplies
                </button>
              </div>

              {/* Minimalist Micro Badges */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-900/5 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-emerald-600 font-sans">100%</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Genuine Meds</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-emerald-600 font-sans">24Hr</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Doorstep Delivery</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-emerald-600 font-sans">10+</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Verified Clinics</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Column */}
            <div className="lg:col-span-5 relative min-h-[380px] w-full mt-10 lg:mt-0 flex items-center justify-center">
              {/* Main image behind or clean frame */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-sm border border-slate-900/10 bg-slate-50 select-none">
                <img 
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80" 
                  alt="Happy Dog in Mysore"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              {/* Vet Card */}
              <div className="absolute w-72 bg-white rounded-2xl border border-slate-900/10 shadow-lg shadow-slate-950/5 p-5 z-10 -top-4 -right-2 sm:-right-8 transform rotate-[2deg] hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80" 
                      alt="Dr. Arjun Sharma" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Dr. Arjun Sharma</div>
                    <div className="text-xs text-slate-500">Senior Veterinarian</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Available Today
                  </div>
                  <button 
                    onClick={() => setView('appointment')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>

              {/* Med Card */}
              <div className="absolute w-64 bg-white rounded-2xl border border-slate-900/10 shadow-lg shadow-slate-950/5 p-5 z-20 -bottom-6 -left-2 sm:-left-8 transform -rotate-[3deg] hover:rotate-0 transition-transform duration-300">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-900/5 rounded-xl flex items-center justify-center text-xl select-none shrink-0">
                    💊
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900">Genuine Medicines</div>
                    <div className="text-xs text-slate-500 mb-2">Verified & Tracked</div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Badges / Quick Accents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">100% Genuine Pharmacy</h4>
              <p className="text-xs text-slate-500 mt-0.5">Sourced directly from certified suppliers</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Fast Mysore Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">Delivered to your doorstep in 24 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Verified Veterinarians</h4>
              <p className="text-xs text-slate-500 mt-0.5">Top-rated registered clinics on call</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Zero Online Consultation Fee</h4>
              <p className="text-xs text-slate-500 mt-0.5">Pay standard clinic fees during physical visit</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Sanjeevini Store</span>
          <h2 className="font-display text-3xl font-bold text-slate-900">Explore Premium Pet Supplies</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            From highly specified veterinary formulations to premium nutritional kibbles and safety accessories, all items are cataloged specifically for Mysore pet owners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCategories.map((cat, i) => (
            <div 
              key={i}
              onClick={() => setView('shop')}
              className="group cursor-pointer bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-sm">
                  {cat.count}
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Delivery Across Mysore</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Process Blueprint</span>
            <h2 className="font-display text-3xl font-bold text-slate-900">How Sanjeevini Works</h2>
            <p className="text-slate-500 text-sm">
              We connect certified veterinary resources and direct delivery dispatch routes to bring optimal healthcare convenience straight to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Doorstep Delivery Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8FAFC] border border-slate-900/5 rounded-3xl text-slate-800 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle decorative radial gradient */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Truck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Genuine Pharmacy Dispatch</span>
              </div>
              <h2 className="font-sans text-3xl sm:text-4xl font-bold leading-tight text-slate-900">
                Veterinary Medicines & Daily Supplies Delivered Safely.
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl font-light">
                Simply enter your pet prescriptions, browse authentic formulations, select veterinary diet pouches, and complete your order. Our cold-chain delivery riders dispatch orders straight to your address anywhere in Mysore.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-900/5 shadow-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">Tamper-Proof Seals</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-900/5 shadow-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">Cold Chain Med Logistics</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-900/5 shadow-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">Prescription Auditing</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white border border-slate-900/5 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-sm">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Standard Mysore Dispatch Area</span>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span>Gokulam (3rd Stage, Contour Rd)</span>
                    <span className="text-xs font-bold text-emerald-600">Within 4 Hrs</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span>Kuvempunagar & Double Road</span>
                    <span className="text-xs font-bold text-emerald-600">Within 6 Hrs</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span>Vijayanagar & Siddartha Layout</span>
                    <span className="text-xs font-bold text-emerald-600">Within 8 Hrs</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Other Mysore PIN codes</span>
                    <span className="text-xs font-bold text-emerald-600">Same-Day</span>
                  </li>
                </ul>
                <button
                  onClick={() => setView('shop')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm"
                >
                  Order Medicines Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Partner Clinics & Veterinarians Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Verified Veterinary Infrastructure</span>
            <h2 className="font-display text-3xl font-bold text-slate-900">Partner Clinics & Top Doctors</h2>
            <p className="text-slate-500 text-sm">
              We collaborate with Mysore\'s premier clinics to guarantee professional physical environments, seasoned veterinarans, and standard clinical sanitation protocols.
            </p>
          </div>
          <button
            onClick={() => setView('appointment')}
            className="group flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold text-sm transition-colors"
          >
            Browse All Doctors
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {premiumClinics.map((clinic) => (
            <div 
              key={clinic.id} 
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="h-40 overflow-hidden relative bg-slate-100">
                <img 
                  src={clinic.image} 
                  alt={clinic.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>{clinic.rating} ({clinic.reviewsCount} verified reviews)</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{clinic.name}</h3>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">{clinic.area}, Mysore</p>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{clinic.address}</p>
                <button
                  onClick={() => setView('appointment')}
                  className="w-full py-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-lg transition-colors border border-slate-100 hover:border-emerald-200"
                >
                  Book Appointment Slot
                </button>
              </div>
            </div>
          ))}

          {/* Prompt Card */}
          <div className="bg-emerald-50/40 rounded-2xl border-2 border-dashed border-emerald-200/60 p-6 flex flex-col justify-between items-start space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <Award className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-emerald-950 text-base leading-tight">Are you a Mysore Veterinarian or Clinic Owner?</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Join Mysore\'s premium pet platform. Increase clinical bookings, sync patient profiles, and optimize medicine delivery.
              </p>
            </div>
            <button
              onClick={() => setView('partner')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors"
            >
              Partner with Sanjeevini
            </button>
          </div>
        </div>
      </section>

      {/* 7. Why Choose Us (Local Mysore Value Proposition) */}
      <section className="bg-white border-y border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Block Left */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg h-[400px] bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
                  alt="Mysore Veterinary Center" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating review card */}
              <div className="absolute -bottom-6 -right-6 bg-white text-slate-800 p-5 rounded-2xl shadow-xl max-w-xs space-y-3 border border-slate-900/10">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs font-light italic leading-relaxed text-slate-500">
                  "Booked Dr. Sanjana at the Gokulam branch. No waiting times, clean space, and the prescriptions were delivered to my flat in Vidyaranyapuram before I got back!"
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center font-bold text-[9px]">S</div>
                  <span className="text-[10px] font-bold text-slate-700">Shobha N., Golden Retriever parent</span>
                </div>
              </div>
            </div>

            {/* Why Choose Us Bullet Lists */}
            <div className="space-y-8 lg:pl-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Why Choose Sanjeevini</span>
                <h2 className="font-display text-3xl font-bold text-slate-900">Customized Pet Care Infrastructure</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We are deeply committed to Mysore\'s pet community. Our platform bypasses complex, unverified nationwide shipping loops to deliver immediate clinical precision and localized logistics support.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Mysore Exclusive Dispatch Hub</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      All orders dispatch from our premium center right here in Mysore. That means absolute transparency, freshness audits, and zero delay.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Clinically Verified Doctors</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      Every clinic listed is licensed under the Karnataka Veterinary Council regulations. Veterinarians carry verified state council qualifications.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Zero Hidden Fees, Direct Billing</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      No online convenience marks on appointments. You get instant slots for free and pay standard consulting fees at the clinic counters.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Local Mysore Pet Parents Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Client Reviews</span>
          <h2 className="font-display text-3xl font-bold text-slate-900">Loved by Mysore Pet Parents</h2>
          <p className="text-slate-500 text-sm">
            Discover real-life experiences of residents who trust Sanjeevini with veterinary scheduling and essential doorstep supply logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
            <p className="text-slate-600 text-sm leading-relaxed italic">
              "Finding authentic cardiac veterinary supplements used to be a weekly struggle across pharmacies. Sanjeevini not only has every formulation in stock but delivers them directly to my house in Gokulam. Absolutely stellar service!"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center text-xs">RM</div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Raghavendra M.</h4>
                <p className="text-slate-400 text-[10px]">Gokulam, Mysore • Persian Cat Parent</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
            <p className="text-slate-600 text-sm leading-relaxed italic">
              "My Labrador needed an orthopedic bed and digestive vet food. Sanjeevini had the exact specs. The delivery guy was extremely polite and brought it up to my apartment on the 3rd floor. Very professional!"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center text-xs">SK</div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Suneetha K.</h4>
                <p className="text-slate-400 text-[10px]">Vijayanagar, Mysore • Labrador Parent</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
            <p className="text-slate-600 text-sm leading-relaxed italic">
              "Booking appointments for my parrot was simplified. No waiting in lines. Dr. Rakesh Prasad at Chamundi Veterinary Hospital was incredibly compassionate, highly recommend the platform to everyone."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center text-xs">VN</div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Vinay Nagaraj</h4>
                <p className="text-slate-400 text-[10px]">Kuvempunagar, Mysore • Budgerigar Parent</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Got Questions?</span>
          <h2 className="font-display text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-100">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group border-b border-slate-100 pb-4 last:border-0 last:pb-0 cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-800 text-sm list-none py-2.5 hover:text-emerald-600 transition-colors">
                <span>{faq.q}</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
              </summary>
              <p className="text-slate-500 text-xs leading-relaxed mt-2 pl-1 select-none">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 10. Newsletter Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-6 border border-slate-800 relative overflow-hidden">
          {/* Subtle light effects */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Sanjeevini Dispatch Digest</span>
            <h2 className="font-display text-3xl font-bold text-white tracking-tight">Stay Updated on Mysore Pet Care</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Subscribe to get seasonal veterinary advisories, alerts on new qualified clinic listings in Mysore, and exclusive promo codes.
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully! Check your inbox for exclusive Mysore promo codes.'); }} className="flex flex-col sm:flex-row gap-3 pt-4 max-w-md mx-auto">
              <input 
                type="email" 
                required
                placeholder="Enter your email address"
                className="flex-grow bg-slate-800/80 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              />
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
              >
                Subscribe Now
              </button>
            </form>
            <p className="text-[10px] text-slate-500">We respect your privacy. No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
