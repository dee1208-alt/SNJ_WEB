/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Heart, 
  Award, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  FileText,
  CheckCircle,
  Stethoscope,
  BookOpen
} from 'lucide-react';

/* ==========================================
   ABOUT US VIEW
   ========================================== */
export function AboutUsView() {
  const leadership = [
    { name: 'Dr. Sanjana Gowda', role: 'Chief Veterinary Officer (CVO)', spec: 'Surgeon (M.V.Sc)', bio: '14+ years of professional surgery. Guided premium medical protocol establishment across all Mysore nodes.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80' },
    { name: 'Srinivas Prasad', role: 'Head of Pharmacy Operations', spec: 'Pharma (M.Pharm)', bio: 'Ensures cold-chain integrity and regulatory compliance for veterinary pharmaceutical routing in Mysore.', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-fade-in text-xs leading-relaxed">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">The Sanjeevini Legacy</span>
        <h1 className="font-display font-bold text-3xl text-slate-900 leading-tight">Mysore\'s Sovereign Pet Healthcare Channel</h1>
        <p className="text-slate-500 font-light text-sm">
          Established to bridge the gap between pet parents and verified veterinary clinics. We are committed exclusively to the welfare of Mysore\'s pet community.
        </p>
      </div>

      {/* Core Mission Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-100">
        <div className="space-y-4">
          <h2 className="font-display font-bold text-slate-950 text-base sm:text-lg">Our Sole Vision & Medical Mandate</h2>
          <p className="text-slate-600 font-light text-xs leading-relaxed">
            Sanjeevini was born out of a simple, powerful realization: pet care in Mysore deserved the same standards of speed, genuineness, and professional tracking as human healthcare. 
          </p>
          <p className="text-slate-600 font-light text-xs leading-relaxed">
            By establishing verified partnerships with Mysore\'s top clinics and licensing physical pharmacies, we coordinate a seamless digital reservation network. No counterfeit products, no medical delays, just pure, regulated healthcare.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-2 font-bold text-[11px] text-slate-800">
            <div className="flex items-center gap-1.5"><CheckCircle className="h-4.5 w-4.5 text-emerald-600" /> 100% Verified Vets</div>
            <div className="flex items-center gap-1.5"><CheckCircle className="h-4.5 w-4.5 text-emerald-600" /> Cold-Chain Delivery</div>
            <div className="flex items-center gap-1.5"><CheckCircle className="h-4.5 w-4.5 text-emerald-600" /> Mysore Circle Focus</div>
            <div className="flex items-center gap-1.5"><CheckCircle className="h-4.5 w-4.5 text-emerald-600" /> Zero Fake Pharmacies</div>
          </div>
        </div>
        <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border">
          <img 
            src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=600&q=80" 
            alt="Mysore Clinic Setup" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Core Values */}
      <section className="space-y-6">
        <h3 className="font-display font-bold text-slate-900 text-sm tracking-wide uppercase text-center">Our Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Clinical Quality Integrity', text: 'We audit every veterinary surgeon\'s license and clinic facilities prior to publishing booking calendars.', icon: <Stethoscope className="h-6 w-6 text-emerald-600" /> },
            { title: 'Pharmacy Transparency', text: 'All veterinary drugs are sourced directly from authorized manufacturers with Batch No. tracking on every tax invoice.', icon: <ShieldCheck className="h-6 w-6 text-emerald-600" /> },
            { title: 'Mysore First Commitment', text: 'We maintain localized logistics hubs in Gokulam and Kuvempunagar to ensure delivery speeds under 4 hours.', icon: <MapPin className="h-6 w-6 text-emerald-600" /> }
          ].map((val, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 text-center md:text-left">
              <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto md:mx-0">{val.icon}</div>
              <h4 className="font-bold text-slate-800">{val.title}</h4>
              <p className="text-slate-500 font-light leading-relaxed">{val.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clinical Leadership Team */}
      <section className="space-y-6">
        <h3 className="font-display font-bold text-slate-900 text-sm tracking-wide uppercase text-center">Medical & Administrative Leadership</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {leadership.map((lead, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center space-y-4">
              <img src={lead.image} alt={lead.name} className="h-28 w-28 rounded-full object-cover mx-auto border-2 border-emerald-50 shadow" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">{lead.name}</h4>
                <p className="text-emerald-700 font-semibold text-[10px] uppercase tracking-wider">{lead.role}</p>
                <p className="text-slate-400 text-[10px] font-medium">{lead.spec}</p>
              </div>
              <p className="text-slate-500 font-light leading-relaxed text-[11px]">{lead.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ==========================================
   CONTACT VIEW
   ========================================== */
export function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in text-xs">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Contact Sanjeevini</span>
        <h1 className="font-display font-bold text-3xl text-slate-900">Get in Touch With Us</h1>
        <p className="text-slate-500 font-light leading-relaxed text-sm">
          Have an inquiry regarding pharmacy orders or clinical registrations in Mysore? Our medical relations team is available to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Contact info cards */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0"><MapPin className="h-5 w-5" /></div>
              <div className="space-y-1">
                <span className="font-bold text-slate-800">Primary Logistics Hub</span>
                <p className="text-slate-500 font-light leading-relaxed">No. 124, 4th Cross, Contour Road, Gokulam 3rd Stage, Mysore, Karnataka - 570002</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0"><Mail className="h-5 w-5" /></div>
              <div className="space-y-1">
                <span className="font-bold text-slate-800">Email Correspondence</span>
                <p className="text-slate-500 font-light">support@sanjeevini.mysore.pet</p>
                <p className="text-slate-500 font-light">compliance@sanjeevini.mysore.pet</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0"><Phone className="h-5 w-5" /></div>
              <div className="space-y-1">
                <span className="font-bold text-slate-800">Customer Support Phone</span>
                <p className="text-slate-800 font-semibold">+91 (821) 2415-901</p>
                <p className="text-slate-400 font-light">Available: Mon - Sat (9:00 AM - 7:00 PM)</p>
              </div>
            </div>
          </div>

          {/* Mysore operation scope alert */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/30 text-[10px] text-slate-600 leading-relaxed font-light">
            <strong>⚠ Operating Exclusively in Mysore:</strong> Our delivery vehicles and clinical slots are assigned strictly to Mysore PIN codes. We cannot accept or dispatch external queries.
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">Write Message To Support</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Your Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Srinivas"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none font-medium text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="srinivas@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600">Message / Inquiry Details *</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can Sanjeevini help your pet parent journey today?"
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none resize-none font-medium text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
          >
            Submit Support Inquiry
          </button>

          {success && (
            <p className="text-xs font-bold text-emerald-600 text-center animate-pulse mt-2">✓ Thank you! Inquiry logged. Our Mysore office will email you shortly.</p>
          )}
        </form>
      </div>
    </div>
  );
}

/* ==========================================
   FAQS VIEW
   ========================================== */
export function FAQsView() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    { q: 'Is Sanjeevini an authorized pharmacy dealer in Mysore?', a: 'Yes. Sanjeevini operates a physical, drug-licensed veterinary pharmacy warehouse on Contour Road, Gokulam 3rd Stage. All prescription medicines are sourced directly from verified veterinary drug manufacturers with matching Batch Numbers listed on your tax invoice.' },
    { q: 'How does your veterinary booking process work?', a: 'Sanjeevini provides real-time calendar synchronization with partner clinical nodes. When you reserve a slot, the veterinarian is notified instantly. We deliver a verified booking receipt via WhatsApp containing doctor details and maps routing.' },
    { q: 'Are there delivery charges for Mysore doorstep dispatches?', a: 'We charge a flat ₹80 delivery fee across all Mysore PIN codes (starting with 570) to maintain cold-chain logistics. However, all supply orders with a products subtotal above ₹1,000 qualify for completely Free Delivery.' },
    { q: 'What is your policy for veterinary prescription medicines?', a: 'During checkout or doorstep delivery verification, our certified pharmacists will inspect your doctor\'s prescription script physically or via digital upload. Under Indian drug regulations, we cannot dispense Scheduled medications without a valid prescription.' },
    { q: 'Which Mysore PIN codes do you service?', a: 'We serve all registered Mysore PIN codes including Gokulam (570002), Kuvempunagar (570023), Vijayanagar (570017), JP Nagar, Siddartha Layout, and Central Mysore.' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10 animate-fade-in text-xs">
      <div className="text-center space-y-2">
        <HelpCircle className="h-10 w-10 text-emerald-600 mx-auto" />
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">Sanjeevini FAQ Portal</h1>
        <p className="text-slate-500 font-light leading-relaxed">Frequently asked questions by local pet parents in Mysore.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div 
              key={idx} 
              className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setActiveIndex(isOpen ? null : idx)}
                className="w-full p-4.5 text-left flex justify-between items-center gap-4 text-xs font-bold text-slate-800 hover:text-slate-950 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-4.5 pb-4.5 text-slate-500 font-light leading-relaxed border-t border-slate-50/50 pt-3 text-[11px]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================
   POLICIES VIEW
   ========================================== */
export function PoliciesView() {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'refund'>('privacy');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in text-xs leading-relaxed">
      {/* Selector banner */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold max-w-sm mx-auto justify-between">
        <button
          onClick={() => setActivePolicy('privacy')}
          className={`flex-grow text-center py-2 rounded-lg transition-colors ${activePolicy === 'privacy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActivePolicy('terms')}
          className={`flex-grow text-center py-2 rounded-lg transition-colors ${activePolicy === 'terms' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          Terms of Use
        </button>
        <button
          onClick={() => setActivePolicy('refund')}
          className={`flex-grow text-center py-2 rounded-lg transition-colors ${activePolicy === 'refund' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          Refund & Return
        </button>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm max-w-3xl mx-auto space-y-6">
        {activePolicy === 'privacy' && (
          <div className="space-y-4">
            <h1 className="font-display font-bold text-slate-950 text-base sm:text-lg border-b border-slate-50 pb-2">Privacy Policy & Patient Data Protection</h1>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Last Updated: October 2026</p>
            <p className="text-slate-600 font-light">
              Sanjeevini Premium Pet Healthcare is fully committed to protecting your personal information and clinical logs under Indian Information Technology Acts.
            </p>
            <h3 className="font-bold text-slate-800 pt-2 text-xs">1. Scope of Data Collected</h3>
            <p className="text-slate-500 font-light">
              We collect consignee shipping addresses, contact mobile phone numbers for WhatsApp tracking integrations, and clinical histories of registered pets to facilitate booking coordination with Mysore vet clinics.
            </p>
            <h3 className="font-bold text-slate-800 pt-2 text-xs">2. Patient History Privacy</h3>
            <p className="text-slate-500 font-light">
              Your pet\'s health data, vaccine timelines, and clinical consulting transcripts are shared EXCLUSIVELY with the verified veterinary doctor handling your scheduled appointment. We never sell or license clinical datasets to external marketing corporations.
            </p>
          </div>
        )}

        {activePolicy === 'terms' && (
          <div className="space-y-4">
            <h1 className="font-display font-bold text-slate-950 text-base sm:text-lg border-b border-slate-50 pb-2">Terms of Service & Regulatory Compliance</h1>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Last Updated: October 2026</p>
            <p className="text-slate-600 font-light">
              By accessing Sanjeevini, you agree to comply with Mysore district healthcare regulatory requirements.
            </p>
            <h3 className="font-bold text-slate-800 pt-2 text-xs">1. Veterinary Prescription Clause</h3>
            <p className="text-slate-500 font-light font-semibold text-emerald-800">
              Under Drug Rules, 1945, dispensing Schedule H / Schedule H1 veterinary drugs requires a physically signed doctor prescription. Sanjeevini reserves the absolute right to refuse fulfillment if matching clinical documentation is not furnished.
            </p>
            <h3 className="font-bold text-slate-800 pt-2 text-xs">2. Dynamic Slot Reservations</h3>
            <p className="text-slate-500 font-light">
              Reservations are coordinated dynamically based on clinic doctor availability. Sanjeevini is not liable for clinical delays occurring during emergencies at physical clinic nodes in Mysore.
            </p>
          </div>
        )}

        {activePolicy === 'refund' && (
          <div className="space-y-4">
            <h1 className="font-display font-bold text-slate-950 text-base sm:text-lg border-b border-slate-50 pb-2">Refund & Order Cancellation Policy</h1>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Last Updated: October 2026</p>
            <p className="text-slate-600 font-light font-medium text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-100/40">
              Note: Due to therapeutic stability and temperature control mandates, we cannot accept returns on refrigerated or temperature-sensitive vaccine products once dispatched from our Gokulam warehouse.
            </p>
            <h3 className="font-bold text-slate-800 pt-2 text-xs">1. Orders Cancellation</h3>
            <p className="text-slate-500 font-light">
              You can cancel your logistics order anytime prior to vehicle dispatch from our Mysore fulfillment hubs by visiting your Account dashboard or contacting customer support.
            </p>
            <h3 className="font-bold text-slate-800 pt-2 text-xs">2. Damaged Goods Refund</h3>
            <p className="text-slate-500 font-light">
              If a product arrives damaged or with broken pharmacy seals, we provide an immediate free 100% refund or physical replacement routing to your Mysore address within 4 hours of notification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
