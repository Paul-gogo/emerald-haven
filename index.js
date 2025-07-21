import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/v1/authRoutes.js';
import propertyRoutes from './routes/v1/propertyRoutes.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Mount auth and property routes
app.use('/api/v1/auth', authRoutes); // e.g., /api/v1/auth/register
app.use('/api/v1/properties', propertyRoutes); // ✅ now routes start at /api/v1/properties

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


