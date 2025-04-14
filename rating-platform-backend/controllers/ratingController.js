const { Rating } = require('../models');


exports.submitRating = async (req, res) => {
  try {
    const { store_id, value } = req.body;
    const user_id = req.user.userId; 

    if (!store_id || typeof value !== 'number') {
      return res.status(400).json({ error: 'store_id and numeric value are required' });
    }

    const rating = await Rating.create({ store_id, user_id, value });

    res.status(201).json({ message: 'Rating submitted successfully', rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
