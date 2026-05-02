import express from 'express';
import Card from '../models/Card.js';

const router = express.Router();

// @desc    Create a new shared card
// @route   POST /api/cards
// @access  Public (or Private depending on user context, but here we capture sender info)
router.post('/', async (req, res) => {
  try {
    const card = new Card(req.body);
    const createdCard = await card.save();
    res.status(201).json(createdCard);
  } catch (error) {

    console.error('Card Save Error:', error);
    res.status(400).json({ message: error.message });
  }
});


// @desc    Get a shared card by ID
// @route   GET /api/cards/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
