/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from "dotenv";
dotenv.config();

import { connectDatabase } from "./src/server/database/database";
// Type definitions import
import { 
  Product, 
  Clinic, 
  Doctor, 
  Appointment, 
  Order, 
  PartnerRegistration, 
  User, 
  Review 
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to JSON database
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Helper to read DB
function readDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error('Error reading database file:', error);
  }
  return {
    products: [],
    clinics: [],
    doctors: [],
    appointments: [],
    orders: [],
    partners: [],
    reviews: [],
    coupons: [],
    users: []
  };
}

// Helper to write DB
function writeDatabase(data: any) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database file:', error);
  }
}

// Ensure database file is loaded
let db = readDatabase();

// --- API ENDPOINTS ---

// 1. Products API
app.get('/api/products', (req, res) => {
  res.json(db.products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find((p: any) => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Admin add/update product
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  if (!newProduct.id) {
    newProduct.id = 'prod-' + Date.now();
  }
  
  const existingIdx = db.products.findIndex((p: any) => p.id === newProduct.id);
  if (existingIdx >= 0) {
    db.products[existingIdx] = { ...db.products[existingIdx], ...newProduct };
  } else {
    db.products.push({
      rating: 5.0,
      reviewsCount: 0,
      deliveryDaysEstimate: 1,
      specifications: {},
      ...newProduct
    });
  }
  
  writeDatabase(db);
  res.json({ success: true, product: newProduct });
});

app.delete('/api/products/:id', (req, res) => {
  db.products = db.products.filter((p: any) => p.id !== req.params.id);
  writeDatabase(db);
  res.json({ success: true });
});

// 2. Clinics & Doctors API
app.get('/api/clinics', (req, res) => {
  res.json(db.clinics);
});

app.get('/api/doctors', (req, res) => {
  res.json(db.doctors);
});

// 3. Appointments API
app.get('/api/appointments', (req, res) => {
  const userId = req.query.userId as string;
  if (userId) {
    const userAppointments = db.appointments.filter((a: any) => a.userId === userId);
    res.json(userAppointments);
  } else {
    res.json(db.appointments);
  }
});

app.post('/api/appointments', (req, res) => {
  const { 
    userId, userName, userPhone, userEmail, petName, petType,
    clinicId, clinicName, doctorId, doctorName, date, timeSlot, fees 
  } = req.body;

  if (!userName || !userPhone || !petName || !clinicId || !doctorId || !date || !timeSlot) {
    return res.status(400).json({ error: 'Missing required appointment fields' });
  }

  const newAppointment: Appointment = {
    id: 'apt-' + Math.floor(Math.random() * 1000000),
    userId: userId || 'user-demo',
    userName,
    userPhone,
    userEmail: userEmail || 'demo@mysore.com',
    petName,
    petType,
    clinicId,
    clinicName,
    doctorId,
    doctorName,
    date,
    timeSlot,
    fees: Number(fees),
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  db.appointments.push(newAppointment);
  writeDatabase(db);
  res.json({ success: true, appointment: newAppointment });
});

// Update appointment (Reschedule/Cancel)
app.put('/api/appointments/:id', (req, res) => {
  const appointmentId = req.params.id;
  const { status, date, timeSlot } = req.body;

  const aptIndex = db.appointments.findIndex((a: any) => a.id === appointmentId);
  if (aptIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  if (status) {
    db.appointments[aptIndex].status = status;
  }
  if (date) {
    db.appointments[aptIndex].date = date;
    db.appointments[aptIndex].status = 'Rescheduled';
  }
  if (timeSlot) {
    db.appointments[aptIndex].timeSlot = timeSlot;
  }

  writeDatabase(db);
  res.json({ success: true, appointment: db.appointments[aptIndex] });
});

// 4. Orders API
app.get('/api/orders', (req, res) => {
  const userId = req.query.userId as string;
  if (userId) {
    const userOrders = db.orders.filter((o: any) => o.userId === userId);
    res.json(userOrders);
  } else {
    res.json(db.orders);
  }
});

app.post('/api/orders', (req, res) => {
  const { 
    userId, items, subtotal, deliveryCharge, tax, discount, grandTotal, 
    couponCode, deliveryAddress, paymentMethod 
  } = req.body;

  if (!items || items.length === 0 || !deliveryAddress) {
    return res.status(400).json({ error: 'Empty cart or missing shipping address' });
  }

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const nowStr = new Date().toISOString().split('T')[0];

  const newOrder: Order = {
    id: orderId,
    userId: userId || 'user-demo',
    items,
    subtotal: Number(subtotal),
    deliveryCharge: Number(deliveryCharge),
    tax: Number(tax),
    discount: Number(discount),
    grandTotal: Number(grandTotal),
    couponCode,
    deliveryAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
    orderStatus: 'Order Placed',
    timeline: [
      { status: 'Order Placed', date: nowStr, description: 'Sanjeevini has received your premium pet care order' }
    ],
    createdAt: new Date().toISOString()
  };

  // Subtract stock count for products
  items.forEach((item: any) => {
    const prod = db.products.find((p: any) => p.id === item.productId);
    if (prod) {
      prod.stockCount = Math.max(0, prod.stockCount - item.quantity);
      if (prod.stockCount === 0) {
        prod.inventoryStatus = 'Out of Stock';
      } else if (prod.stockCount <= 5) {
        prod.inventoryStatus = 'Low Stock';
      }
    }
  });

  db.orders.push(newOrder);
  writeDatabase(db);
  res.json({ success: true, order: newOrder });
});

// Update Order status (Admin Workflow)
app.post('/api/orders/:id/status', (req, res) => {
  const { orderStatus, description } = req.body;
  const orderId = req.params.id;

  const orderIndex = db.orders.findIndex((o: any) => o.id === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const nowStr = new Date().toISOString().split('T')[0];
  db.orders[orderIndex].orderStatus = orderStatus;
  db.orders[orderIndex].timeline.push({
    status: orderStatus,
    date: nowStr,
    description: description || `Order is now ${orderStatus}`
  });

  writeDatabase(db);
  res.json({ success: true, order: db.orders[orderIndex] });
});

// 5. Partner Registration API
app.get('/api/partners', (req, res) => {
  res.json(db.partners);
});

app.post('/api/partners', (req, res) => {
  const { type, fullName, businessName, email, phone, address, experienceOrEstablishmentYear, licenseNumber, message } = req.body;

  if (!fullName || !email || !phone || !type) {
    return res.status(400).json({ error: 'Missing required partner fields' });
  }

  const registration: PartnerRegistration = {
    id: 'prt-' + Math.floor(Math.random() * 1000000),
    type,
    fullName,
    businessName: businessName || fullName,
    email,
    phone,
    address: address || 'Mysore, Karnataka',
    experienceOrEstablishmentYear: experienceOrEstablishmentYear || '2026',
    licenseNumber: licenseNumber || 'NOT-APPLICABLE',
    message,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.partners.push(registration);
  writeDatabase(db);
  res.json({ success: true, partner: registration });
});

// Update Partner Registration (Approval)
app.put('/api/partners/:id', (req, res) => {
  const { status } = req.body;
  const partnerId = req.params.id;

  const partnerIdx = db.partners.findIndex((p: any) => p.id === partnerId);
  if (partnerIdx === -1) {
    return res.status(404).json({ error: 'Partner registration not found' });
  }

  db.partners[partnerIdx].status = status;
  writeDatabase(db);
  res.json({ success: true, partner: db.partners[partnerIdx] });
});

// 6. Coupons API
app.get('/api/coupons', (req, res) => {
  res.json(db.coupons);
});

// 7. Users Profile API (Self management / Demo user persistence)
app.get('/api/users/:id', (req, res) => {
  const user = db.users.find((u: any) => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    // Return standard demo user if not found to ensure it never crashes
    const defaultUser = db.users[0] || {
      id: 'user-demo',
      email: 'petparent@mysore.com',
      fullName: 'Srinivas Prasad',
      phone: '+91 9845012345',
      addresses: [],
      wishlist: []
    };
    res.json(defaultUser);
  }
});

app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const updateFields = req.body;

  let userIdx = db.users.findIndex((u: any) => u.id === userId);
  if (userIdx === -1) {
    // Create if missing
    db.users.push({
      id: userId,
      email: 'petparent@mysore.com',
      fullName: 'Srinivas Prasad',
      phone: '+91 9845012345',
      addresses: [],
      wishlist: [],
      ...updateFields
    });
    userIdx = db.users.length - 1;
  } else {
    db.users[userIdx] = { ...db.users[userIdx], ...updateFields };
  }

  writeDatabase(db);
  res.json({ success: true, user: db.users[userIdx] });
});

// 8. Reviews API
app.get('/api/reviews', (req, res) => {
  const productId = req.query.productId as string;
  if (productId) {
    const prodReviews = db.reviews.filter((r: any) => r.productId === productId);
    res.json(prodReviews);
  } else {
    res.json(db.reviews);
  }
});

app.post('/api/reviews', (req, res) => {
  const { productId, userName, rating, comment } = req.body;

  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }

  const newReview: Review = {
    id: 'rev-' + Date.now(),
    productId,
    userName,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  db.reviews.push(newReview);

  // Re-calculate product ratings & reviews counts
  if (productId) {
    const product = db.products.find((p: any) => p.id === productId);
    if (product) {
      const allProdReviews = db.reviews.filter((r: any) => r.productId === productId);
      const totalRating = allProdReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
      product.reviewsCount = allProdReviews.length;
      product.rating = Number((totalRating / allProdReviews.length).toFixed(1));
    }
  }

  writeDatabase(db);
  res.json({ success: true, review: newReview });
});

// --- VITE MIDDLEWARE SETUP ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sanjeevini premium server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
