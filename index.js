import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/v1/authRoutes.js';
import propertyRoutes from './routes/v1/propertyRoutes.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// ✅ Allow both local and Vercel frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://emerald-chi-ashen.vercel.app',
  'https://animated-kitten-fdf2cd.netlify.app/'
];

// ✅ CORS config with credentials and preflight fix
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(cookieParser());
app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ Emerald Haven API is running');
});

// ✅ Main API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
