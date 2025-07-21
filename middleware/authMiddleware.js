import { prisma } from '../config/prisma.js';
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    // Get the Authorization header or token from cookies
    const authHeader = req.headers.authorization || req.cookies.token;
    console.log('Auth Header:', authHeader);

    // Extract token from "Bearer <token>" or directly from cookie
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    console.log('Extracted Token:', token);

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the JWT token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);

    const { userId, email } = decoded;

    if (!userId) {
      console.log('Token missing userId');
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Option 1: Trust email from token payload (skip DB check)
    // if (!email) {
    //   console.log('Token missing email');
    //   return res.status(401).json({ message: 'Invalid token' });
    // }
    // req.userEmail = email;

    // Option 2 (Recommended): Verify user exists in DB
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.log('User not found for id:', userId);
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user info to request for downstream middlewares/routes
    req.userId = user.id;
    req.userEmail = user.email;

    next(); // user is authenticated, continue to next middleware/handler
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

