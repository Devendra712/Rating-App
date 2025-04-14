const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');

// Get all stores + optional search
exports.getStores = async (req, res) => {
  const { name, address } = req.query;
  let where = {};

  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };

  try {
    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
        }
      ]
    });

    const result = stores.map(store => {
      const ratings = store.Ratings.map(r => r.value);
      const average = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 0;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: parseFloat(average),
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit a rating for a store
exports.submitRating = async (req, res) => {
  try {
    const { store_id, value } = req.body;
    const user_id = req.user.userId;

    const rating = await Rating.create({ store_id, user_id, value });

    res.status(201).json({ message: 'Rating submitted', rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
