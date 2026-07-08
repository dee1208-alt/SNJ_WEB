/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalIcon, 
  MapPin, 
  UserCheck, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  X, 
  CalendarDays,
  Smartphone,
  Info,
  DollarSign,
  Languages,
  Award,
  Stethoscope,
  Star,
  RefreshCw,
  Search,
  MessageSquare
} from 'lucide-react';
import { Clinic, Doctor, Appointment } from '../types';

interface AppointmentViewProps {
  clinics: Clinic[];
  doctors: Doctor[];
  appointments: Appointment[];
  onBookAppointment: (appointmentData: any) => Promise<boolean>;
  onUpdateAppointment: (id: string, updateData: any) => Promise<boolean>;
  setView: (view: string) => void;
}

export default function AppointmentView({
  clinics,
  doctors,
  appointments,
  onBookAppointment,
  onUpdateAppointment,
  setView
}: AppointmentViewProps) {
  const [selectedClinicId, setSelectedClinicId] = useState<string>('All');
  const [searchDoctorName, setSearchDoctorName] = useState('');
  
  // Active Booking wizard state
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Other'>('Dog');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Filter clinics
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesClinic = selectedClinicId === 'All' || doc.clinicId === selectedClinicId;
      const matchesName = doc.name.toLowerCase().includes(searchDoctorName.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchDoctorName.toLowerCase());
      return matchesClinic && matchesName;
    });
  }, [doctors, selectedClinicId, searchDoctorName]);

  const handleOpenBooking = (doc: Doctor) => {
    setBookingDoctor(doc);
    setBookingDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // Tomorrow as default
    setBookingSlot(doc.timeSlots[0] || '10:00 AM');
    setBookingSuccess(null);
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor || !bookingDate || !bookingSlot || !petName || !ownerName || !ownerPhone) {
      alert('Please fill out all mandatory fields to book your consultation.');
      return;
    }

    const clinic = clinics.find(c => c.id === bookingDoctor.clinicId);

    const bookingData = {
      userName: ownerName,
      userPhone: ownerPhone,
      userEmail: ownerEmail || 'petparent@mysore.com',
      petName,
      petType,
      clinicId: bookingDoctor.clinicId,
      clinicName: clinic ? clinic.name : 'Sanjeevini Partner Clinic',
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      date: bookingDate,
      timeSlot: bookingSlot,
      fees: bookingDoctor.fees
    };

    const success = await onBookAppointment(bookingData);
    if (success) {
      setBookingSuccess({
        ...bookingData,
        id: 'APT-' + Math.floor(100000 + Math.random() * 900000)
      });
      setBookingDoctor(null);
      // Clear forms
      setPetName('');
      setOwnerName('');
      setOwnerPhone('');
      setOwnerEmail('');
    } else {
      alert('This slot is already booked. Please choose another time slot or date.');
    }
  };

  // Reschedule / Cancel actions
  const handleCancelApt = async (aptId: string) => {
    if (confirm('Are you sure you want to cancel this veterinary appointment?')) {
      const success = await onUpdateAppointment(aptId, { status: 'Cancelled' });
      if (success) {
        alert('Appointment has been successfully cancelled.');
      }
    }
  };

  const handleRescheduleApt = async (aptId: string) => {
    const newDate = prompt('Enter a new date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!newDate) return;
    
    // Check format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      alert('Please enter date in YYYY-MM-DD format.');
      return;
    }

    const success = await onUpdateAppointment(aptId, { date: newDate, status: 'Rescheduled' });
    if (success) {
      alert('Appointment has been successfully rescheduled to ' + newDate);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Title */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Sanjeevini Clinic Facilator</span>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">Book Veterinary Appointment</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-light">
          Currently serving Mysore exclusively. Browse verified clinic facilities, qualified surgeons, and reserve physical consultation slots with instant WhatsApp receipts.
        </p>
      </div>

      {/* Grid: Left Doctor list & filters, Right active appointments history log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left main: Browse Doctors */}
        <div className="lg:col-span-8 space-y-8">
          {/* Filtering row */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-sm">
            {/* Clinic Filter select */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 w-full sm:w-auto">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>Clinic Branch:</span>
              <select
                value={selectedClinicId}
                onChange={(e) => setSelectedClinicId(e.target.value)}
                className="bg-transparent font-bold outline-none cursor-pointer text-slate-800"
              >
                <option value="All">All Mysore Clinics</option>
                {clinics.map(c => (
                  <option key={c.id} value={c.id}>{c.area}</option>
                ))}
              </select>
            </div>

            {/* Doctor Search bar */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctor or specialty..."
                value={searchDoctorName}
                onChange={(e) => setSearchDoctorName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs outline-none transition-colors"
              />
            </div>
          </div>

          {/* Doctors Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDoctors.map((doc) => {
              const clinic = clinics.find(c => c.id === doc.clinicId);
              return (
                <div 
                  key={doc.id} 
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-emerald-100 hover:shadow-md transition-all"
                >
                  <div className="p-6 space-y-5">
                    {/* Header: Photo and general title */}
                    <div className="flex gap-4 items-start">
                      <img 
                        src={doc.image} 
                        alt={doc.name} 
                        className="h-16 w-16 object-cover rounded-xl border border-slate-100 shadow-sm"
                      />
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-800 text-sm">{doc.name}</h3>
                        <p className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                          <Stethoscope className="h-3.5 w-3.5" />
                          {doc.specialization}
                        </p>
                        <p className="text-slate-400 text-[10px] line-clamp-1">{doc.qualification}</p>
                      </div>
                    </div>

                    {/* Specific Specs */}
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-50">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 text-[9px] block">EXPERIENCE</span>
                        <span className="font-bold text-slate-800">{doc.experience} Years Vet Care</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 text-[9px] block">CONSULT FEE</span>
                        <span className="font-bold text-emerald-800">₹{doc.fees} Flat</span>
                      </div>
                      <div className="space-y-0.5 col-span-2">
                        <span className="text-slate-400 text-[9px] block flex items-center gap-1"><Languages className="h-3 w-3" /> LANGUAGES</span>
                        <span className="font-bold text-slate-800">{doc.languages.join(', ')}</span>
                      </div>
                    </div>

                    {/* Location detail */}
                    {clinic && (
                      <div className="flex gap-1.5 items-start text-xs text-slate-500 font-light">
                        <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                        <p className="leading-snug">{clinic.name} — <span className="font-semibold text-slate-700">{clinic.area}</span></p>
                      </div>
                    )}
                  </div>

                  <div className="px-6 pb-6 pt-1 border-t border-slate-50 bg-slate-50/50">
                    <button
                      onClick={() => handleOpenBooking(doc)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all text-center block"
                    >
                      Book Consultation Slot
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar: Appointments History & Logs */}
        <aside className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <CalendarDays className="h-5 w-5 text-emerald-600" />
            <h3 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">Mysore Appointments</h3>
          </div>

          {appointments.length === 0 ? (
            <div className="py-6 text-center text-xs space-y-2">
              <p className="text-slate-400 font-medium">No appointments scheduled.</p>
              <p className="text-slate-400 leading-relaxed font-light">
                Once you reserve a clinic slot, your active clinical calendar logs will appear here for reschedule or cancellation management.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3 text-xs leading-relaxed">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800">{apt.doctorName}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide ${
                      apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      apt.status === 'Rescheduled' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-600 font-light">
                    <p className="font-bold text-slate-800">{apt.clinicName}</p>
                    <p className="flex items-center gap-1"><CalIcon className="h-3.5 w-3.5 text-slate-400" /> {apt.date} • {apt.timeSlot}</p>
                    <p>Pet: <strong className="text-slate-800 font-semibold">{apt.petName} ({apt.petType})</strong></p>
                    <p>Consultation Fee: <strong className="text-emerald-800 font-bold">₹{apt.fees} (Pay at Clinic)</strong></p>
                  </div>

                  {apt.status !== 'Cancelled' && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleRescheduleApt(apt.id)}
                        className="py-1.5 bg-white hover:bg-slate-100 rounded text-slate-700 border border-slate-200 text-[10px] font-bold text-center active:scale-95 transition-all"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelApt(apt.id)}
                        className="py-1.5 bg-red-50 hover:bg-red-100 rounded text-red-700 border border-red-100 text-[10px] font-bold text-center active:scale-95 transition-all"
                      >
                        Cancel Slot
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* BOOKING WIZARD DIALOG OVERLAY (Inline modal for slot selection) */}
      {bookingDoctor && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Stethoscope className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">Clinical Slot Allocation</h3>
                  <p className="text-slate-400 text-[10px] font-light">Booking session with {bookingDoctor.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setBookingDoctor(null)}
                className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleBookSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow text-xs">
              {/* Pet Info */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Pet's Name *</label>
                  <input
                    type="text"
                    required
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="e.g. Bruno"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3 py-2.5 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Pet Category *</label>
                  <select
                    value={petType}
                    onChange={(e) => setPetType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs p-2.5 outline-none font-semibold"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Fish">Fish</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Owner Info */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Pet Parent Name *</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Srinivas Prasad"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3 py-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3 py-2.5 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="petparent@mysore.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3 py-2.5 outline-none"
                  />
                </div>
              </div>

              {/* Date selection (Custom Calendar) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Select Booking Date *</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Min is tomorrow
                  max={new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]} // Max is 2 weeks
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg text-xs px-3 py-2.5 outline-none font-semibold cursor-pointer"
                />
              </div>

              {/* Time Slots allocation */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">Select Consultation Time-Slot *</label>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {bookingDoctor.timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingSlot(slot)}
                      className={`py-2 px-1 text-center rounded-lg border text-[10px] font-bold transition-all ${
                        bookingSlot === slot 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 scale-102 font-extrabold' 
                          : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Details */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/30 flex items-center justify-between text-emerald-950 font-bold">
                <span>Standard Clinic Consulting Fee</span>
                <span className="text-emerald-800 text-sm">₹{bookingDoctor.fees}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
              >
                Reserve Slot & Sync Calendar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL WITH WHATSAPP LINK */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full p-8 text-center space-y-6 animate-fade-in relative">
            <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle className="h-9 w-9" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-bold text-slate-900 text-xl">Appointment Reserved!</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Your consultation slot has been registered. A green-tick verified WhatsApp receipt has been dispatched to <strong>{bookingSuccess.userPhone}</strong>.
              </p>
            </div>

            {/* Recipt details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 text-left text-xs space-y-2 max-w-xs mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Doctor Reference:</span>
                <span className="font-semibold text-slate-800">{bookingSuccess.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Slot:</span>
                <span className="font-semibold text-slate-800">{bookingSuccess.date} @ {bookingSuccess.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clinic Name:</span>
                <span className="font-semibold text-slate-800">{bookingSuccess.clinicName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consultation Fee:</span>
                <span className="font-bold text-emerald-800">₹{bookingSuccess.fees} (Pay at Clinic)</span>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/918212415901?text=Sanjeevini%20Appointment%20Confirmation%20-%20ID%20${bookingSuccess.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4.5 w-4.5 fill-current" />
                Simulate WhatsApp Sync
              </a>
              <button
                onClick={() => setBookingSuccess(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
