// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/v1/authRoutes.js';
import propertyRoutes from './routes/v1/propertyRoutes.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// ✅ Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000', // local frontend
  'https://emerald-chi-ashen.vercel.app', // deployed frontend
  'https://animated-kitten-fdf2cd.netlify.app', // another frontend
];

// ✅ Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS policy violation'));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
app.use(express.json()); // parse JSON body

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ Emerald Haven API is running');
});

// ✅ API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: err.message || 'Server error' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
