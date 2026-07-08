/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, 
  UserCheck, 
  Truck, 
  Store, 
  Briefcase, 
  CheckCircle, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldAlert,
  ChevronRight,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface PartnerViewProps {
  onSubmitPartner: (partnerData: any) => Promise<boolean>;
}

export default function PartnerView({ onSubmitPartner }: PartnerViewProps) {
  // Active partner form tab: 'veterinarian' | 'clinic' | 'medicine_supplier' | 'pet_store' | 'brand_partnership'
  const [activeTab, setActiveTab] = useState<'veterinarian' | 'clinic' | 'medicine_supplier' | 'pet_store' | 'brand_partnership'>('veterinarian');

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYear, setExperienceYear] = useState('');
  const [message, setMessage] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const tabs = [
    { id: 'veterinarian', label: 'Veterinarians', icon: <UserCheck className="h-4 w-4" /> },
    { id: 'clinic', label: 'Clinic Owners', icon: <Building className="h-4 w-4" /> },
    { id: 'medicine_supplier', label: 'Medicine Suppliers', icon: <Truck className="h-4 w-4" /> },
    { id: 'pet_store', label: 'Pet Stores', icon: <Store className="h-4 w-4" /> },
    { id: 'brand_partnership', label: 'Brand Collaborations', icon: <Briefcase className="h-4 w-4" /> }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setIsSubmitting(true);

    if (!fullName || !email || !phone || !address) {
      setValidationError('Please fill out all mandatory fields.');
      setIsSubmitting(false);
      return;
    }

    // Phone validation (10 digits)
    if (!/^\+?\d{10,13}$/.test(phone.trim())) {
      setValidationError('Please enter a valid mobile phone number.');
      setIsSubmitting(false);
      return;
    }

    const partnerData = {
      type: activeTab,
      fullName,
      businessName: businessName || fullName,
      email,
      phone,
      address,
      experienceOrEstablishmentYear: experienceYear,
      licenseNumber: licenseNumber || 'PENDING-VERIFICATION',
      message
    };

    const success = await onSubmitPartner(partnerData);
    setIsSubmitting(false);
    if (success) {
      setIsSuccess(true);
      // Reset forms
      setFullName('');
      setBusinessName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setLicenseNumber('');
      setExperienceYear('');
      setMessage('');
    } else {
      setValidationError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Sanjeevini Ecosystem Alliance</span>
        <h1 className="font-display font-bold text-3xl text-slate-900">Partner With Sanjeevini</h1>
        <p className="text-slate-500 text-sm leading-relaxed font-light">
          We collaborate with Mysore\'s absolute finest veterinarians, clinics, pharmacies, and manufacturers. Together, we establish a premium pet healthcare logistics circle.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm text-center max-w-xl mx-auto space-y-6">
          <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-bold text-slate-900 text-xl sm:text-2xl">Application Registered!</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
              Your partnership proposal has been securely logged on our server. The Sanjeevini Mysore Compliance Team will review your certifications (such as KVC registrations or drug licensing) and initiate phone screening within 24 hours.
            </p>
          </div>
          <button
            onClick={() => setIsSuccess(false)}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Submit Another Proposal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left panel: Tab selection */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 border-b border-slate-50 pb-2">Partnership Hub</h3>
            <div className="flex flex-col gap-1.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setValidationError('');
                  }}
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

            <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/30 space-y-2">
              <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold block"> Mysore Exclusive Audits</span>
              <p className="text-[10px] text-slate-600 leading-relaxed font-light">
                To guarantee the strict standard of the Sanjeevini Platform, we verify every clinical qualification or pharmacy license physically in Mysore prior to activation.
              </p>
            </div>
          </div>

          {/* Right panel: Active form */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="pb-3 border-b border-slate-50">
              <h2 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2 uppercase tracking-wide text-sm">
                <FileText className="h-5 w-5 text-emerald-600" />
                {activeTab.replace('_', ' ')} Registration Application
              </h2>
              <p className="text-slate-400 text-xs mt-1 font-light">Fill out your professional credentials to initiate validation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">
                  {activeTab === 'veterinarian' ? 'Full Name of Doctor *' : 'Primary Contact Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Sanjana Gowda"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none"
                />
              </div>

              {/* Business Name (for clinics / stores / brands) */}
              {activeTab !== 'veterinarian' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Business / Establishment Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Gokulam Pharmacy Hub"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none"
                  />
                </div>
              )}

              {/* Contact Email */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. contact@vet clinic.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none"
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Contact Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9845012345"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none"
                />
              </div>

              {/* Years Experience / Establishment Year */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">
                  {activeTab === 'veterinarian' ? 'Years of Veterinary Experience *' : 'Year of Establishment *'}
                </label>
                <input
                  type="number"
                  required
                  value={experienceYear}
                  onChange={(e) => setExperienceYear(e.target.value)}
                  placeholder={activeTab === 'veterinarian' ? 'e.g. 12' : 'e.g. 2018'}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none"
                />
              </div>

              {/* Licensing Number (Not for Brand collaboratons) */}
              {activeTab !== 'brand_partnership' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">
                    {activeTab === 'veterinarian' ? 'KVC Registration Number *' : 'Drug License / GST No. *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. KVC-MYS-8123"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none font-semibold uppercase"
                  />
                </div>
              )}
            </div>

            {/* Address Area */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-600 block">Physical Business Address in Mysore *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="No. 45/A, Contour Road, Gokulam 3rd Stage, Mysore"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none"
              />
            </div>

            {/* Custom details */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-600 block">Cover Letter / Collaboration Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce your medical specialized background, clinic equipment levels, or product catalogs..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none resize-none"
              />
            </div>

            {validationError && (
              <p className="text-xs font-semibold text-red-500 leading-relaxed">{validationError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              {isSubmitting ? 'Registering Application...' : 'Submit Partnership Application'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
