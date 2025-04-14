const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Register new user (Normal User)
exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Validations (you can improve later)
    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: 'normal' // default role
      // role: 'store_owner' // temporary for testing store owner role
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





//store owner token
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJzdG9yZV9vd25lciIsImlhdCI6MTc0NDU0NTIzMywiZXhwIjoxNzQ0NjMxNjMzfQ.kY69eaKxVMHz2haKn8LqpSxESUA6fMhJVEdIOF9J25M

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJzdG9yZV9vd25lciIsImlhdCI6MTc0NDU0Nzk5MiwiZXhwIjoxNzQ0NjM0MzkyfQ.OIOIMwTZDl9IQKk4CMsmzeNkz2PppN-aLpe-U1yBITU

// admin token 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDU1MzI3NCwiZXhwIjoxNzQ0NjM5Njc0fQ.VJxjFNTLLnUaHTzfz--TawlXkvWZm0MDc7tqgB0LOsk