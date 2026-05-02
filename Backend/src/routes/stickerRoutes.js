import express from 'express';
import { getStickers } from '../controllers/stickerController.js';

const router = express.Router();

// Route: GET /api/stickers
// Description: Fetch trending or searched stickers from Giphy
router.get('/', getStickers);

export default router;
