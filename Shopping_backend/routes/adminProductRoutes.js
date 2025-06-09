import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

export default router;