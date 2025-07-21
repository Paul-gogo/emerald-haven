// config/prisma.js
import pkg from '../generated/prisma/index.js'; // Adjust path if needed
const { PrismaClient } = pkg;

export const prisma = new PrismaClient(); // ✅ named export


