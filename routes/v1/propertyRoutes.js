import express from 'express';
import { upload } from '../../middleware/upload.js';
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty
} from '../../controllers/propertyControllers.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/my-properties', verifyToken, getMyProperties);
router.get('/:id', verifyToken, getPropertyById);
router.post('/', verifyToken, upload.array('images'), createProperty);
router.put('/:id', verifyToken, upload.array('images'), updateProperty);
router.delete('/:id', verifyToken, deleteProperty);

export default router;

