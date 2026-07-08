/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Building, 
  CalendarDays, 
  ShoppingBag, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Edit, 
  Search, 
  Filter,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Order, Appointment, Partner, Product } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  appointments: Appointment[];
  partners: Partner[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  onUpdateAppointmentStatus: (aptId: string, status: string) => Promise<boolean>;
  onUpdatePartnerStatus: (partnerId: string, status: string) => Promise<boolean>;
}

export default function AdminDashboard({
  orders,
  appointments,
  partners,
  products,
  onUpdateOrderStatus,
  onUpdateAppointmentStatus,
  onUpdatePartnerStatus
}: AdminDashboardProps) {
  // Tabs: 'stats', 'orders', 'appointments', 'partners'
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'appointments' | 'partners'>('stats');

  // Search/Filters states
  const [orderSearch, setOrderSearch] = useState('');
  const [aptSearch, setAptSearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');

  // 1. Math Statistics
  const stats = useMemo(() => {
    const totalSales = orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.grandTotal, 0);

    const activePartnersCount = partners.filter(p => p.status === 'Approved').length;
    const pendingPartnersCount = partners.filter(p => p.status === 'Pending').length;
    
    const lowStockCount = products.filter(p => p.stockCount < 10).length;

    return {
      totalSales,
      totalOrdersCount: orders.length,
      appointmentsCount: appointments.length,
      activePartnersCount,
      pendingPartnersCount,
      lowStockCount
    };
  }, [orders, partners, appointments, products]);

  // 2. Chart data: Sales by Category
  const categoryData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        // We look up the actual product's category to maintain true taxonomy
        const prod = products.find(p => p.id === item.productId);
        const cat = prod ? prod.category : 'Supplies';
        categories[cat] = (categories[cat] || 0) + (item.price * item.quantity);
      });
    });

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [orders, products]);

  // Chart data: Weekly sales trend simulation
  const weeklySalesData = useMemo(() => {
    return [
      { name: 'Mon', Sales: Math.round(stats.totalSales * 0.12) },
      { name: 'Tue', Sales: Math.round(stats.totalSales * 0.15) },
      { name: 'Wed', Sales: Math.round(stats.totalSales * 0.18) },
      { name: 'Thu', Sales: Math.round(stats.totalSales * 0.14) },
      { name: 'Fri', Sales: Math.round(stats.totalSales * 0.22) },
      { name: 'Sat', Sales: Math.round(stats.totalSales * 0.11) },
      { name: 'Sun', Sales: Math.round(stats.totalSales * 0.08) }
    ];
  }, [stats.totalSales]);

  const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#6366f1'];

  // Handle Order State Updates
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    const success = await onUpdateOrderStatus(orderId, newStatus);
    if (success) {
      alert(`Order ${orderId} successfully marked as ${newStatus}.`);
    }
  };

  // Handle Appointment State Updates
  const handleAptStatusChange = async (aptId: string, newStatus: string) => {
    const success = await onUpdateAppointmentStatus(aptId, newStatus);
    if (success) {
      alert(`Appointment slot status successfully marked as ${newStatus}.`);
    }
  };

  // Handle Partner Approval State Updates
  const handlePartnerStatusChange = async (partnerId: string, approved: boolean) => {
    const newStatus = approved ? 'Approved' : 'Rejected';
    const success = await onUpdatePartnerStatus(partnerId, newStatus);
    if (success) {
      alert(`Partner application is now ${newStatus}.`);
    }
  };

  // Filter Tables
  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.deliveryAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orders, orderSearch]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => 
      a.doctorName.toLowerCase().includes(aptSearch.toLowerCase()) ||
      a.petName.toLowerCase().includes(aptSearch.toLowerCase()) ||
      a.userName.toLowerCase().includes(aptSearch.toLowerCase())
    );
  }, [appointments, aptSearch]);

  const filteredPartners = useMemo(() => {
    return partners.filter(p => 
      p.fullName.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.businessName.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.type.toLowerCase().includes(partnerSearch.toLowerCase())
    );
  }, [partners, partnerSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-600">Sanjeevini Mysore Control Panel</span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">Administrative Operations</h1>
        </div>
        
        {/* Navigation Triggers */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
          {[
            { id: 'stats', label: 'CRM Stats' },
            { id: 'orders', label: 'Fulfill Orders' },
            { id: 'appointments', label: 'Clinics Calendar' },
            { id: 'partners', label: 'Alliance Partners' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: EXECUTIVE ANALYTICS */}
      {activeTab === 'stats' && (
        <div className="space-y-10 animate-fade-in text-xs">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Total Sales Volume</span>
                <span className="font-display font-extrabold text-2xl text-slate-900">₹{stats.totalSales}</span>
              </div>
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Veterinary Reservations</span>
                <span className="font-display font-extrabold text-2xl text-slate-900">{stats.appointmentsCount}</span>
              </div>
              <div className="h-10 w-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Approved Partners</span>
                <span className="font-display font-extrabold text-2xl text-slate-900">{stats.activePartnersCount}</span>
              </div>
              <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Building className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Low Inventory Alerts</span>
                <span className="font-display font-extrabold text-2xl text-red-600">{stats.lowStockCount}</span>
              </div>
              <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Graphical charts visualization row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales bar trend */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-sm tracking-wide uppercase">Mysore Operations Sales Trend</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="Sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category breakdown pie */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-sm tracking-wide uppercase">Category Revenue (INR)</h3>
              <div className="h-[200px] flex justify-center items-center">
                {categoryData.length === 0 ? (
                  <p className="text-slate-400 font-medium">No sales recorded yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Labels list */}
              <div className="space-y-1.5 font-semibold text-[10px] text-slate-600 max-h-[80px] overflow-y-auto">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span> {cat.name}</span>
                    <span className="text-slate-800">₹{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISPATCH FULFILLMENT MANAGER */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 text-xs animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b border-slate-50">
            <h2 className="font-display font-bold text-slate-900 text-base">Fulfill Mysore Dispatches</h2>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Order ID or Customer name..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Customer (Phone)</th>
                  <th className="py-3">Items Selected</th>
                  <th className="py-3">PIN code</th>
                  <th className="py-3">Sales total</th>
                  <th className="py-3 text-center">Active Status</th>
                  <th className="py-3 text-right">Update Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">No matching delivery dispatches found.</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 font-bold text-slate-900">{order.id}</td>
                      <td className="py-3.5">
                        <span className="font-semibold block">{order.deliveryAddress.fullName}</span>
                        <span className="text-slate-400 text-[10px] block">{order.deliveryAddress.phone}</span>
                      </td>
                      <td className="py-3.5 font-light">
                        {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3.5 font-bold text-slate-800">{order.deliveryAddress.pinCode}</td>
                      <td className="py-3.5 font-extrabold text-emerald-800">₹{order.grandTotal}</td>
                      <td className="py-3.5 text-center">
                        <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[9px] px-2 py-0.5 rounded border border-emerald-100 uppercase">{order.orderStatus}</span>
                      </td>
                      <td className="py-3.5 text-right">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                          className="bg-white border rounded text-xs px-2.5 py-1 outline-none font-semibold text-slate-700 cursor-pointer"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CLINICS BOOKING SCHEDULER */}
      {activeTab === 'appointments' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 text-xs animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b border-slate-50">
            <h2 className="font-display font-bold text-slate-900 text-base">Clinics Scheduling Board</h2>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Doctor or Patient..."
                value={aptSearch}
                onChange={(e) => setAptSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3">Reservation Ref</th>
                  <th className="py-3">Doctor Assigned</th>
                  <th className="py-3">Pet Parent Details</th>
                  <th className="py-3">Date & Slot</th>
                  <th className="py-3">Pet profile</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-right">Update Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">No clinical bookings schedules recorded.</td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 font-bold text-slate-900">{apt.id}</td>
                      <td className="py-3.5 font-semibold text-slate-800">{apt.doctorName}</td>
                      <td className="py-3.5">
                        <span className="font-semibold block">{apt.userName}</span>
                        <span className="text-slate-400 text-[10px] block">{apt.userPhone}</span>
                      </td>
                      <td className="py-3.5 font-medium text-slate-600">{apt.date} @ {apt.timeSlot}</td>
                      <td className="py-3.5 font-semibold text-slate-800">{apt.petName} ({apt.petType})</td>
                      <td className="py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide ${
                          apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                          apt.status === 'Rescheduled' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <select
                          value={apt.status}
                          onChange={(e) => handleAptStatusChange(apt.id, e.target.value)}
                          className="bg-white border rounded text-xs px-2.5 py-1 outline-none font-semibold text-slate-700 cursor-pointer"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Rescheduled">Rescheduled</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ALLIANCE PARTNER EVALUATOR */}
      {activeTab === 'partners' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 text-xs animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b border-slate-50">
            <h2 className="font-display font-bold text-slate-900 text-base">Ecosystem Partnership Admissions</h2>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Brand or Doctor applicant..."
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3">Alliance Type</th>
                  <th className="py-3">Applicant / Business</th>
                  <th className="py-3">License Info</th>
                  <th className="py-3">Address</th>
                  <th className="py-3">Contact info</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-right">Fulfillment review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">No prospective partner proposals logged on system.</td>
                  </tr>
                ) : (
                  filteredPartners.map((part) => (
                    <tr key={part.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 font-bold text-emerald-800 capitalize">{part.type.replace('_', ' ')}</td>
                      <td className="py-3.5">
                        <span className="font-bold block text-slate-900">{part.fullName}</span>
                        <span className="text-slate-400 text-[10px] font-medium block">{part.businessName}</span>
                      </td>
                      <td className="py-3.5 font-mono text-[10px] font-bold text-slate-600">{part.licenseNumber}</td>
                      <td className="py-3.5 text-slate-500 font-light">{part.address}</td>
                      <td className="py-3.5 text-slate-500 font-light">
                        <p>{part.email}</p>
                        <p className="font-semibold text-slate-800">{part.phone}</p>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide ${
                          part.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                          part.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {part.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {part.status === 'Pending' ? (
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => handlePartnerStatusChange(part.id, true)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handlePartnerStatusChange(part.id, false)}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] rounded"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] font-medium">Evaluation Complete</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
