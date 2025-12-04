import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { v2 as cloudinary } from 'cloudinary';
// Import routes
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import categoryRoutes from './routes/categories.js';
import membershipRoutes from './routes/memberships.js';
import testimonialRoutes from './routes/testimonials.js';
import settingRoutes from './routes/settings.js';
import homepageRoutes from './routes/homepage.js';
import aboutRoutes from './routes/about.js';
import uploadRoutes from './routes/upload.js';
import articleRoutes from './routes/articles.js';
import articleCategoryRoutes from './routes/articleCategories.js';
import memberRegistrationRoutes from './routes/memberRegistrations.js';
import bookingRoutes from './routes/bookings.js';
import galleryRoutes from "./routes/gallery.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 5002;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost for development (ports 3000, 3002)
    if (origin.startsWith('http://localhost:3000') || origin.startsWith('http://localhost:3002')) return callback(null, true);

    // Allow SpaFort domain (with or without trailing slash)
    const spafortDomain = 'https://spafort.com';
    if (origin === spafortDomain || origin === spafortDomain + '/') {
      return callback(null, true);
    }

    // Allow custom frontend URL from environment
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl && (origin === frontendUrl || origin === frontendUrl + '/')) {
      return callback(null, true);
    }

    // Allow all origins for now to fix deployment issues
    return callback(null, true);
  },
  credentials: true,
}));

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// More specific rate limiting for auth endpoints - INCREASED FOR DEVELOPMENT
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 auth requests per windowMs (increased for dev)
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
});
app.use('/api/auth/', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/article-categories', articleCategoryRoutes);
app.use('/api/member-registrations', memberRegistrationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/gallery", galleryRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;