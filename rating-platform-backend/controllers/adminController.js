const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs'); // Required for hashing password

// Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List Users with Filter
exports.getUsers = async (req, res) => {
  const { name, email, address, role } = req.query;
  let where = {};

  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };
  if (role) where.role = role;

  try {
    const users = await User.findAll({ where });

    res.json(users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List Stores with Ratings
exports.getStores = async (req, res) => {
  const { name, email, address } = req.query;
  let where = {};

  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };

  try {
    const stores = await Store.findAll({
      where,
      include: [{ model: Rating }]
    });

    const result = stores.map(store => {
      const ratings = store.Ratings.map(r => r.value);
      const average = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 0;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: parseFloat(average)
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add User (Used in adminRoutes)
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already used' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, address, role });

    res.status(201).json({ message: 'User added', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Store (Used in adminRoutes)
exports.addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const store = await Store.create({ name, email, address, owner_id });
    res.status(201).json({ message: 'Store added', store });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
