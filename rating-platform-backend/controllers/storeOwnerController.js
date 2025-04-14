const { Store, Rating, User } = require('../models');

// Get Store Owner Dashboard Data
exports.getDashboard = async (req, res) => {
  const storeId = req.user.userId;  // assuming store owner is logged in
  try {
    // Find the store that belongs to the logged-in owner
    const store = await Store.findOne({ where: { owner_id: storeId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found for this user' });
    }

    // Get all ratings for this store
    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: [{
        model: User,
        attributes: ['name', 'email']
      }]
    });

    // Calculate average rating
    const ratingValues = ratings.map(r => r.value);
    const averageRating = ratingValues.length 
      ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(2) 
      : 0;

    // Return the store details and ratings
    res.json({
      store,
      averageRating,
      ratings: ratings.map(rating => ({
        userName: rating.User.name,
        userEmail: rating.User.email,
        rating: rating.value,
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
